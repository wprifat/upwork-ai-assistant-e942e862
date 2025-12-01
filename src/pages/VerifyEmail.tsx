import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, CheckCircle2 } from "lucide-react";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";

const VerifyEmail = () => {
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setEmail(session.user.email || "");
        
        // Check if email is already verified
        if (session.user.email_confirmed_at) {
          setVerified(true);
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        }
      } else {
        // If no session, redirect to auth page
        navigate("/auth");
      }
    };

    checkSession();

    // Listen for auth state changes (email confirmation)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user.email_confirmed_at) {
        setVerified(true);
        toast({
          title: "Email verified!",
          description: "Redirecting to dashboard...",
        });
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const handleResendVerification = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "No email address found. Please sign up again.",
        variant: "destructive",
      });
      return;
    }

    setResendLoading(true);

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        }
      });

      if (error) {
        toast({
          title: "Resend failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Verification email sent!",
          description: "Please check your inbox and spam folder.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            {verified ? (
              <>
                <div className="mx-auto mb-4 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Email Verified!</CardTitle>
                <CardDescription>
                  Your email has been successfully verified. Redirecting to dashboard...
                </CardDescription>
              </>
            ) : (
              <>
                <div className="mx-auto mb-4 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Verify Your Email</CardTitle>
                <CardDescription>
                  We've sent a verification link to <strong>{email}</strong>
                </CardDescription>
              </>
            )}
          </CardHeader>
          
          {!verified && (
            <CardContent className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
                <p className="mb-2">To complete your registration:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Check your email inbox</li>
                  <li>Click the verification link in the email</li>
                  <li>You'll be automatically redirected to the dashboard</li>
                </ol>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                Didn't receive the email? Check your spam folder or
              </div>

              <Button
                onClick={handleResendVerification}
                disabled={resendLoading}
                variant="outline"
                className="w-full"
              >
                {resendLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Resend Verification Email"
                )}
              </Button>

              <div className="text-center">
                <Button
                  variant="ghost"
                  onClick={() => {
                    supabase.auth.signOut();
                    navigate("/auth");
                  }}
                  className="text-sm"
                >
                  Sign in with a different account
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default VerifyEmail;
