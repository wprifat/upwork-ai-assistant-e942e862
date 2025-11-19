import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { UserCircle, Save } from "lucide-react";
import { toast } from "sonner";

const ProfileCreate = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile updated successfully!");
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
                  <h1 className="font-heading font-bold text-4xl">Update Your Profile</h1>
                  <p className="text-lg text-muted-foreground">
                    Keep your information current for better job matches
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg shadow-card p-8 border border-border animate-fade-in-up">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="upwork-url">Upwork Profile URL</Label>
                  <Input 
                    id="upwork-url" 
                    placeholder="https://www.upwork.com/freelancers/~..." 
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    We'll extract your skills and experience automatically
                  </p>
                </div>

                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    placeholder="John Doe" 
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="title">Professional Title</Label>
                  <Input 
                    id="title" 
                    placeholder="Full Stack Developer" 
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea 
                    id="bio" 
                    placeholder="Tell us about your experience and expertise..." 
                    className="mt-2 min-h-[120px]"
                  />
                </div>

                <div>
                  <Label htmlFor="skills">Primary Skills (comma-separated)</Label>
                  <Textarea 
                    id="skills" 
                    placeholder="React, Node.js, TypeScript, MongoDB, AWS..." 
                    className="mt-2 min-h-[100px]"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    These will be used to calculate job match scores
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input 
                      id="experience" 
                      type="number" 
                      placeholder="5" 
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="hourly-rate">Hourly Rate ($)</Label>
                    <Input 
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
                    id="portfolio" 
                    type="url" 
                    placeholder="https://yourportfolio.com" 
                    className="mt-2"
                  />
                </div>

                <div className="flex gap-4 pt-6">
                  <Button type="submit" variant="hero" className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    Save Profile
                  </Button>
                  <Button type="button" variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </div>
              </form>

              <div className="mt-8 p-6 bg-primary/5 rounded-lg border border-primary/20">
                <h3 className="font-heading font-semibold text-lg mb-2">Why update your profile?</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• More accurate job match scores based on your real skills</li>
                  <li>• Better AI-powered proposal suggestions</li>
                  <li>• Personalized insights into your freelancing performance</li>
                  <li>• Track your growth and success over time</li>
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
