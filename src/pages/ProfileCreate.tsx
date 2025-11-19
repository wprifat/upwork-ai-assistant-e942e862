import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { UserCircle, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

const ProfileCreate = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const user = (await supabase.auth.getUser()).data.user;
      
      if (!user) {
        toast.error("Please sign in to update your profile");
        return;
      }

      // Update profile in database
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.get('name') as string,
          upwork_url: formData.get('upwork-url') as string,
          title: formData.get('title') as string,
          bio: formData.get('bio') as string,
          skills: (formData.get('skills') as string)?.split(',').map(s => s.trim()) || [],
          experience: formData.get('experience') as string,
          hourly_rate: formData.get('hourly-rate') ? parseFloat(formData.get('hourly-rate') as string) : null,
          portfolio: formData.get('portfolio') as string,
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Send welcome email
      const { error: emailError } = await supabase.functions.invoke('send-profile-welcome', {
        body: {
          email: user.email,
          name: formData.get('name') || user.email?.split('@')[0] || 'there',
        }
      });

      if (emailError) {
        console.error('Email error:', emailError);
        // Don't fail the whole operation if email fails
      }

      toast.success("Profile updated successfully! Check your email for tips.");
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-20 bg-muted/30">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className="mb-12 animate-fade-in-up">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center">
                  <UserCircle className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h1 className="font-heading font-bold text-4xl">Update Profile</h1>
                  <p className="text-lg text-muted-foreground">
                    Keep your info current
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg shadow-card p-8 border border-border animate-fade-in-up">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="upwork-url">Upwork Profile URL</Label>
                  <Input 
                    name="upwork-url"
                    id="upwork-url" 
                    placeholder="https://www.upwork.com/freelancers/~..." 
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    We'll extract your skills automatically
                  </p>
                </div>

                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    name="name"
                    id="name" 
                    placeholder="John Doe" 
                    className="mt-2"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="title">Professional Title</Label>
                  <Input 
                    name="title"
                    id="title" 
                    placeholder="Full Stack Developer" 
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea 
                    name="bio"
                    id="bio" 
                    placeholder="Tell us about your experience and expertise..." 
                    className="mt-2 min-h-[120px]"
                  />
                </div>

                <div>
                  <Label htmlFor="skills">Primary Skills (comma-separated)</Label>
                  <Textarea 
                    name="skills"
                    id="skills" 
                    placeholder="React, Node.js, TypeScript, MongoDB, AWS..." 
                    className="mt-2 min-h-[100px]"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Used for job match scoring
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input 
                      name="experience"
                      id="experience" 
                      type="number" 
                      placeholder="5" 
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="hourly-rate">Hourly Rate ($)</Label>
                    <Input 
                      name="hourly-rate"
                      id="hourly-rate" 
                      type="number" 
                      placeholder="75" 
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="portfolio">Portfolio/Website URL</Label>
                  <Input 
                    name="portfolio"
                    id="portfolio" 
                    type="url" 
                    placeholder="https://yourportfolio.com" 
                    className="mt-2"
                  />
                </div>

                <div className="flex gap-4 pt-6">
                  <Button type="submit" variant="hero" className="flex-1" disabled={loading}>
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? "Saving..." : "Save Profile"}
                  </Button>
                  <Button type="button" variant="outline" className="flex-1" disabled={loading}>
                    Cancel
                  </Button>
                </div>
              </form>

              <div className="mt-8 p-6 bg-primary/5 rounded-lg border border-primary/20">
                <h3 className="font-heading font-semibold text-lg mb-2">Why update?</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Better job match scores</li>
                  <li>• Improved AI suggestions</li>
                  <li>• Track your progress</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfileCreate;
