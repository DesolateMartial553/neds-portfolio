import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2, Loader2, Send } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCreateLead } from "@workspace/api-client-react";

const leadSchema = z.object({
  name: z.string().min(2, "Please enter your name").max(120),
  businessName: z.string().max(160).optional(),
  email: z.string().email("Please enter a valid email address").max(254),
  phone: z.string().max(40).optional(),
  message: z.string().min(10, "Tell me a bit more about your project (at least 10 characters)").max(5000),
});

type LeadFormValues = z.infer<typeof leadSchema>;

export default function Home() {
  const [submitted, setSubmitted] = useState(false);
  const createLead = useCreateLead();

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: "",
      businessName: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = (data: LeadFormValues) => {
    createLead.mutate(
      {
        data: {
          name: data.name,
          businessName: data.businessName || undefined,
          email: data.email,
          phone: data.phone || undefined,
          message: data.message,
        },
      },
      {
        onSuccess: () => {
          setSubmitted(true);
        },
      }
    );
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center bg-background py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background blurs */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px]" />

      <header className="w-full max-w-2xl mb-12 sm:mb-20 flex justify-between items-center z-10">
        <div className="font-serif text-3xl text-foreground font-semibold">Ned.</div>
        <Link href="/owner" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          Owner Login
        </Link>
      </header>

      <main className="w-full max-w-2xl z-10">
        {!submitted ? (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h1 className="font-serif text-5xl sm:text-6xl text-foreground mb-6 leading-tight">
              Let's build something <span className="text-primary italic">brilliant.</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-12 max-w-xl leading-relaxed">
              I’m a freelance web designer and developer based in Birmingham, UK. 
              Fill out the form below, and I’ll get back to you within 24 hours to chat about your project.
            </p>

            <div className="bg-card p-6 sm:p-10 rounded-[2.5rem] shadow-xl shadow-black/[0.03] border border-card-border">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Jane Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input placeholder="jane@example.com" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="businessName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Jane's Bakery" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="07123 456789" type="tel" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Details *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell me about your business, what you're looking for, and your timeline..."
                            className="min-h-[160px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {createLead.isError && (
                    <div className="text-sm font-medium text-destructive bg-destructive/10 p-4 rounded-xl">
                      Something went wrong submitting your request. Please try again.
                    </div>
                  )}

                  <div className="pt-2">
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full sm:w-auto min-w-[200px] text-base group"
                      disabled={createLead.isPending}
                    >
                      {createLead.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        ) : (
          <div className="animate-in zoom-in-95 fade-in duration-500 bg-card p-10 sm:p-14 rounded-[3rem] shadow-2xl shadow-black/[0.04] border border-card-border text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>
            <h2 className="font-serif text-4xl text-foreground mb-4">Thanks for reaching out!</h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-md mx-auto leading-relaxed">
              I’ve received your message. Keep an eye on your inbox—I'll be in touch within the next 24 hours.
            </p>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => {
                setSubmitted(false);
                form.reset();
              }}
            >
              Send another message
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
