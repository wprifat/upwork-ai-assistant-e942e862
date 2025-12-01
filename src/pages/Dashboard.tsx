import { useState, useEffect } from "react";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Rocket, CreditCard, UserCircle, HelpCircle, Loader2, FileText, Copy } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
const Dashboard = () => {
  const {
    user
  } = useAuth();
  const [loading, setLoading] = useState(true);
  const [launching, setLaunching] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [coverLetters, setCoverLetters] = useState<any[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        
        if (profileError) {
          console.error('Error fetching profile:', profileError);
          toast.error('Failed to load profile data');
        } else {
          setProfile(profileData);
        }

        const { data: lettersData, error: lettersError } = await supabase
          .from('cover_letters')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (lettersError) {
          console.error('Error fetching cover letters:', lettersError);
        } else {
          setCoverLetters(lettersData || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);
  const handleLaunchApp = () => {
    setLaunching(true);
    setTimeout(() => {
      window.location.href = '/app';
    }, 500);
  };

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
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
    return <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>;
  }
  return <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-20 bg-muted/30">
        <div className="container-custom">
          <div className="mb-12 animate-fade-in-up">
            <h1 className="font-heading font-bold mb-2">Dashboard</h1>
            <p className="text-xl text-muted-foreground">
              Welcome back, {userName}!
            </p>
          </div>

          {/* Main Action - Launch App */}
          <div className="mb-12 animate-fade-in-up">
            <Card className="p-8 shadow-card border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Rocket className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold mb-2">Launch Proposal Assistant</h2>
                  <p className="text-muted-foreground">
                    Open your AI-powered Upwork Proposal Assistant
                  </p>
                </div>
                <Button 
                  onClick={handleLaunchApp} 
                  size="lg"
                  className="h-14 px-8 text-lg min-w-[200px]" 
                  disabled={launching}
                >
                  {launching ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Launching...
                    </>
                  ) : (
                    'Launch App'
                  )}
                </Button>
              </div>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Your Profile */}
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
                </CardContent>
              </Card>
            </div>

            {/* Your Plan */}
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
                    <div className="text-center py-4">
                      <p className="text-2xl font-bold text-primary mb-2">Lifetime Access</p>
                      <p className="text-muted-foreground">Unlimited access to UpAssistify</p>
                    </div>
                  ) : userPlan === "monthly" ? (
                    <div className="text-center py-4">
                      <p className="text-xl font-semibold mb-2">Monthly Subscription</p>
                      <p className="text-sm text-muted-foreground mb-1">Renews on:</p>
                      <p className="text-xl font-bold text-primary">{renewalDate || "Not available"}</p>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-xl font-semibold mb-2">Free Plan</p>
                      <p className="text-sm text-muted-foreground mb-4">Upgrade to unlock all features</p>
                      <Button onClick={() => window.location.href = '/checkout'}>
                        Upgrade Now
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Support */}
            <div className="animate-fade-in-up">
              <Card className="p-8 shadow-card border border-border h-full">
                <CardHeader className="p-0 mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <HelpCircle className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">Support</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Button 
                    variant="outline" 
                    className="w-full h-12" 
                    onClick={() => window.location.href = '/contact'}
                  >
                    Contact Us
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Your Saved Data - Full Width */}
            <div className="animate-fade-in-up lg:col-span-3">
              <Card className="p-8 shadow-card border border-border">
                <CardHeader className="p-0 mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">Your Saved Data</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    Manage your saved Upwork profile and cover letter templates
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Saved Upwork Profile */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <UserCircle className="w-4 h-4 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold">Upwork Profile</h3>
                      </div>
                      {profile?.profile_text ? (
                        <>
                          <div className="bg-muted/50 p-4 rounded-lg mb-3 min-h-[120px]">
                            <p className="text-sm text-muted-foreground line-clamp-4">
                              {profile.profile_text}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              className="flex-1"
                              onClick={() => handleCopyText(profile.profile_text, 'Profile')}
                            >
                              <Copy className="w-4 h-4 mr-2" />
                              Copy
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => window.location.href = '/profile-sync'}
                            >
                              Edit
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                          <p className="text-muted-foreground mb-4">No profile saved yet</p>
                          <Button 
                            onClick={() => window.location.href = '/profile-sync'}
                          >
                            Save Your Profile
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Draft Cover Letters */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <FileText className="w-4 h-4 text-primary" />
                          </div>
                          <h3 className="text-lg font-semibold">Cover Letters</h3>
                        </div>
                        <span className="text-sm text-muted-foreground">{coverLetters.length}/2</span>
                      </div>
                      {coverLetters.length > 0 ? (
                        <>
                          <div className="space-y-3 mb-3">
                            {coverLetters.map((letter) => (
                              <div key={letter.id} className="bg-muted/50 p-4 rounded-lg">
                                <div className="flex items-start justify-between mb-2">
                                  <p className="font-semibold text-sm">{letter.title}</p>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleCopyText(letter.content, 'Cover letter')}
                                  >
                                    <Copy className="w-4 h-4" />
                                  </Button>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {letter.content}
                                </p>
                              </div>
                            ))}
                          </div>
                          <Button 
                            variant="outline"
                            className="w-full" 
                            onClick={() => window.location.href = '/cover-letters'}
                            disabled={coverLetters.length >= 2}
                          >
                            {coverLetters.length >= 2 ? 'Maximum Reached (2/2)' : 'Add Cover Letter'}
                          </Button>
                        </>
                      ) : (
                        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                          <p className="text-muted-foreground mb-4">No cover letters saved</p>
                          <Button 
                            onClick={() => window.location.href = '/cover-letters'}
                          >
                            Add Cover Letter
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>;
};
export default Dashboard;