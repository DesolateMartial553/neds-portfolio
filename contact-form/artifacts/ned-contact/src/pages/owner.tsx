import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useLocation } from "wouter";
import { format } from "date-fns";
import { 
  ArrowLeft, 
  Briefcase, 
  Building2, 
  Calendar, 
  ChevronRight, 
  Inbox,
  Loader2, 
  LogOut, 
  Mail, 
  MessageSquare, 
  Phone,
  Trash2
} from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  useOwnerLogin, 
  useGetOwnerSession, 
  useOwnerLogout, 
  useListLeads,
  useDeleteLead,
  getGetOwnerSessionQueryKey,
  getListLeadsQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

const loginSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function Dashboard() {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const logout = useOwnerLogout();
  const deleteLead = useDeleteLead();
  
  const { data: leads, isLoading, isError, refetch } = useListLeads({
    query: {
      queryKey: getListLeadsQueryKey(),
      retry: 1,
    }
  });

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        queryClient.setQueryData(getGetOwnerSessionQueryKey(), { authenticated: false });
        setLocation("/");
      }
    });
  };

  return (
    <div className="min-h-[100dvh] w-full bg-background flex flex-col">
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="font-serif text-2xl font-semibold">Ned.</div>
            <div className="h-6 w-px bg-border hidden sm:block"></div>
            <h1 className="text-lg font-medium text-muted-foreground hidden sm:block">Inbox</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
              <Link href="/">View Site</Link>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              disabled={logout.isPending}
            >
              {logout.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <LogOut className="h-4 w-4 mr-2" />}
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-serif text-4xl mb-2">Your Leads</h2>
            <p className="text-muted-foreground">Manage project inquiries from potential clients.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-in fade-in duration-500 rounded-[1.5rem]">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-6 w-24 rounded-full" />
                      </div>
                      <Skeleton className="h-4 w-64" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : isError ? (
          <div className="bg-destructive/5 border border-destructive/20 rounded-[2rem] p-10 text-center">
            <h3 className="text-lg font-medium text-destructive mb-2">Failed to load leads</h3>
            <p className="text-muted-foreground mb-6">There was an error communicating with the server.</p>
            <Button variant="outline" onClick={() => refetch()}>Try Again</Button>
          </div>
        ) : !leads || leads.length === 0 ? (
          <div className="bg-card border border-card-border rounded-[2.5rem] p-16 text-center shadow-sm">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Inbox className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="font-serif text-2xl mb-3">No leads yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              When potential clients fill out the contact form on your website, they'll appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {leads.map((lead, index) => (
              <Card 
                key={lead.id} 
                className="group rounded-[1.5rem] overflow-hidden border-card-border hover:border-primary/20 transition-colors animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: "both" }}
              >
                <CardContent className="p-0">
                  <div className="p-6 sm:p-8 flex flex-col lg:flex-row gap-8">
                    {/* Left Column: Contact Info */}
                    <div className="w-full lg:w-[320px] shrink-0 space-y-6">
                      <div>
                        <h3 className="text-2xl font-medium text-foreground mb-1">{lead.name}</h3>
                        {lead.businessName && (
                          <div className="flex items-center text-muted-foreground text-sm">
                            <Building2 className="h-4 w-4 mr-2 shrink-0" />
                            {lead.businessName}
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <a href={`mailto:${lead.email}`} className="flex items-center text-sm text-foreground hover:text-primary transition-colors">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-3 shrink-0">
                            <Mail className="h-4 w-4" />
                          </div>
                          <span className="truncate">{lead.email}</span>
                        </a>
                        
                        {lead.phone && (
                          <a href={`tel:${lead.phone}`} className="flex items-center text-sm text-foreground hover:text-primary transition-colors">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-3 shrink-0">
                              <Phone className="h-4 w-4" />
                            </div>
                            <span>{lead.phone}</span>
                          </a>
                        )}
                      </div>

                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 mr-2" />
                        {format(new Date(lead.createdAt), "MMMM d, yyyy 'at' h:mm a")}
                      </div>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            disabled={deleteLead.isPending}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-[1.5rem]">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete this lead?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently remove the enquiry from {lead.name}.
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Keep lead</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() =>
                                deleteLead.mutate(
                                  { id: lead.id },
                                  {
                                    onSuccess: () => {
                                      queryClient.invalidateQueries({
                                        queryKey: getListLeadsQueryKey(),
                                      });
                                    },
                                  },
                                )
                              }
                            >
                              Delete permanently
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                    
                    {/* Right Column: Message */}
                    <div className="flex-1 bg-secondary/50 rounded-2xl p-6 sm:p-8">
                      <div className="flex items-center gap-2 mb-4 text-sm font-medium text-muted-foreground">
                        <MessageSquare className="h-4 w-4" />
                        Project Message
                      </div>
                      <p className="text-foreground whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
                        {lead.message}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function Owner() {
  const queryClient = useQueryClient();
  const { data: session, isLoading: sessionLoading } = useGetOwnerSession({
    query: {
      queryKey: getGetOwnerSessionQueryKey(),
      retry: false,
    }
  });

  const login = useOwnerLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    login.mutate(
      { data },
      {
        onSuccess: (sessionData) => {
          queryClient.setQueryData(getGetOwnerSessionQueryKey(), sessionData);
        },
        onError: () => {
          form.setError("password", { type: "manual", message: "Invalid password" });
        }
      }
    );
  };

  if (sessionLoading) {
    return (
      <div className="min-h-[100dvh] w-full flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (session?.authenticated) {
    return <Dashboard />;
  }

  return (
    <div className="min-h-[100dvh] w-full flex flex-col bg-background">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to website
          </Link>
          
          <Card className="rounded-[2.5rem] border-card-border shadow-xl shadow-black/[0.02]">
            <CardHeader className="text-center pb-2 pt-12">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-3xl">Owner Login</CardTitle>
              <CardDescription className="text-base mt-2">
                Sign in to view your project inquiries.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-10 pb-12 pt-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <input
                    type="text"
                    name="username"
                    autoComplete="username"
                    value="owner"
                    readOnly
                    className="sr-only"
                    tabIndex={-1}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            autoComplete="current-password"
                            placeholder="••••••••"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full text-base" 
                    size="lg"
                    disabled={login.isPending}
                  >
                    {login.isPending ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
