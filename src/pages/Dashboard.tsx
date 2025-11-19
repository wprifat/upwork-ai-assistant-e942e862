import { useState, useEffect } from "react";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Rocket, CreditCard, UserCircle, HelpCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching profile:', error);
          toast.error('Failed to load profile data');
        } else {
          setProfile(data);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleLaunchApp = () => {
    window.location.href = '/app';
  };

  // Format subscription end date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const userPlan = profile?.plan_type || 'free';
  const renewalDate = formatDate(profile?.subscription_end_date);
  const userName = profile?.full_name || user?.user_metadata?.full_name || "User";
  const userEmail = user?.email || "";
  const userNiche = profile?.title || "Not set";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-20 bg-muted/30">
        <div className="container-custom">
          <div className="mb-12 animate-fade-in-up">
            <h1 className="font-heading font-bold mb-2">Dashboard</h1>
            <p className="text-xl text-muted-foreground">
              Welcome back, {userName}!
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Main Tool Card */}
            <div className="animate-fade-in-up">
              <Card className="p-8 shadow-card border border-border h-full">
                <CardHeader className="p-0 mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Rocket className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">Launch UpAssistify</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    Open your AI-powered Upwork Proposal Assistant.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Button 
                    onClick={handleLaunchApp}
                    className="w-full h-12 text-lg"
                  >
                    Launch App
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Plan Card */}
            <div className="animate-fade-in-up">
              <Card className="p-8 shadow-card border border-border h-full">
                <CardHeader className="p-0 mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">Your Plan</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {userPlan === "lifetime" ? (
                    <div className="text-center py-8">
                      <p className="text-3xl font-bold text-primary mb-2">Lifetime Access</p>
                      <p className="text-muted-foreground">You have unlimited access to UpAssistify</p>
                    </div>
                  ) : userPlan === "monthly" ? (
                    <div className="text-center py-8">
                      <p className="text-xl font-semibold mb-2">Monthly Subscription</p>
                      <p className="text-muted-foreground">Your subscription renews on:</p>
                      <p className="text-2xl font-bold text-primary mt-2">{renewalDate || "Not available"}</p>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-2xl font-semibold mb-2">Free Plan</p>
                      <p className="text-muted-foreground mb-4">Upgrade to unlock all features</p>
                      <Button onClick={() => window.location.href = '/checkout'}>
                        Upgrade Now
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Profile Card */}
            <div className="animate-fade-in-up">
              <Card className="p-8 shadow-card border border-border h-full">
                <CardHeader className="p-0 mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <UserCircle className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">Your Profile</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-0 space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="text-lg font-semibold">{userName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="text-lg font-semibold">{userEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Niche</p>
                    <p className="text-lg font-semibold">{userNiche}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Support Section */}
            <div className="animate-fade-in-up">
              <Card className="p-8 shadow-card border border-border h-full">
                <CardHeader className="p-0 mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <HelpCircle className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">Support</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    We're here to help you succeed
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Button 
                    variant="outline" 
                    className="w-full h-12 text-lg"
                    onClick={() => window.location.href = '/contact'}
                  >
                    Contact Us
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
