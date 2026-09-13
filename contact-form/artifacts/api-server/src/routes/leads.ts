import { createHmac, timingSafeEqual } from "node:crypto";
import { Router, type IRouter, type Request, type Response } from "express";
import { desc, eq } from "drizzle-orm";
import { db, leadsTable } from "@workspace/db";
import {
  CreateLeadBody,
  CreateLeadResponse,
  DeleteLeadParams,
  DeleteLeadResponse,
  GetOwnerSessionResponse,
  ListLeadsResponse,
  OwnerLoginBody,
  OwnerLoginResponse,
  OwnerLogoutResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();
const COOKIE_NAME = "ned_owner_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12;

function requiredSecret(name: "OWNER_PASSWORD" | "SESSION_SECRET"): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} must be configured`);
  return value;
}

function safeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

function sessionToken(): string {
  return createHmac("sha256", requiredSecret("SESSION_SECRET"))
    .update("ned-owner-session-v1")
    .digest("hex");
}

function isOwner(req: Request): boolean {
  const cookie = req.cookies?.[COOKIE_NAME];
  return typeof cookie === "string" && safeEqual(cookie, sessionToken());
}

function requireOwner(req: Request, res: Response): boolean {
  if (isOwner(req)) return true;
  res.status(401).json({ error: "Owner authentication required" });
  return false;
}

router.post("/leads", async (req, res): Promise<void> => {
  const parsed = CreateLeadBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ issues: parsed.error.issues }, "Invalid lead submission");
    res.status(400).json({ error: "Please check the form and try again." });
    return;
  }

  const data = parsed.data;
  await db.insert(leadsTable).values({
    name: data.name.trim(),
    businessName: data.businessName?.trim() || null,
    email: data.email.trim().toLowerCase(),
    phone: data.phone?.trim() || null,
    message: data.message.trim(),
  });

  res.status(201).json(
    CreateLeadResponse.parse({
      success: true,
      message: "Thanks — your project details have been sent to Ned.",
    }),
  );
});

router.post("/owner/login", async (req, res): Promise<void> => {
  const parsed = OwnerLoginBody.safeParse(req.body);
  if (!parsed.success || !safeEqual(parsed.data.password, requiredSecret("OWNER_PASSWORD"))) {
    res.status(401).json({ error: "Incorrect password" });
    return;
  }

  res.cookie(COOKIE_NAME, sessionToken(), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_TTL_MS,
    path: "/",
  });
  res.json(OwnerLoginResponse.parse({ authenticated: true }));
});

router.get("/owner/session", (req, res): void => {
  res.json(GetOwnerSessionResponse.parse({ authenticated: isOwner(req) }));
});

router.post("/owner/logout", (_req, res): void => {
  res.clearCookie(COOKIE_NAME, { path: "/" });
  res.json(OwnerLogoutResponse.parse({ authenticated: false }));
});

router.get("/owner/leads", async (req, res): Promise<void> => {
  if (!requireOwner(req, res)) return;
  const leads = await db
    .select()
    .from(leadsTable)
    .orderBy(desc(leadsTable.createdAt));
  res.json(ListLeadsResponse.parse(leads));
});

router.delete("/owner/leads/:id", async (req, res): Promise<void> => {
  if (!requireOwner(req, res)) return;

  const params = DeleteLeadParams.safeParse(req.params);
  if (!params.success) {
    res.status(404).json({ error: "Lead not found" });
    return;
  }

  const [deleted] = await db
    .delete(leadsTable)
    .where(eq(leadsTable.id, params.data.id))
    .returning({ id: leadsTable.id });

  if (!deleted) {
    res.status(404).json({ error: "Lead not found" });
    return;
  }

  res.json(DeleteLeadResponse.parse({ success: true, id: deleted.id }));
});

export default router;