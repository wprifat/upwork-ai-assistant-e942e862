import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Loader2, FileText } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ProfileSync = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profileText, setProfileText] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const { data } = await supabase
          .from('profiles')
          .select('profile_text')
          .eq('id', user.id)
          .maybeSingle();
        
        if (data?.profile_text) {
          setProfileText(data.profile_text);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    if (!profileText.trim()) {
      toast.error('Please paste your Upwork profile text');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ profile_text: profileText })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Profile synced successfully!');
      setTimeout(() => navigate('/dashboard'), 500);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to sync profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-20 bg-muted/30">
        <div className="container-custom max-w-3xl">
          <div className="mb-12 animate-fade-in-up">
            <h1 className="font-heading font-bold mb-2">Sync Upwork Profile</h1>
            <p className="text-xl text-muted-foreground">
              Copy and paste your Upwork profile to save important data
            </p>
          </div>

          <Card className="p-8 shadow-card border border-border animate-fade-in-up">
            <CardHeader className="p-0 mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Your Upwork Profile</CardTitle>
              </div>
              <CardDescription className="text-base">
                Paste your entire Upwork profile text below. This will be stored securely and used to enhance your proposals.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 space-y-6">
              <div>
                <Label htmlFor="profile-text">Profile Text</Label>
                <Textarea
                  id="profile-text"
                  value={profileText}
                  onChange={(e) => setProfileText(e.target.value)}
                  placeholder="Paste your complete Upwork profile here..."
                  className="min-h-[400px] mt-2"
                />
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={handleSave} 
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Profile'
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/dashboard')}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfileSync;
