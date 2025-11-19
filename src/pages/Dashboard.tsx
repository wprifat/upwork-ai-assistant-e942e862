import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Target, FileText, UserCircle, TrendingUp, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const handleAnalyze = () => {
    toast.success("Analysis complete! Check your results below.");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-20 bg-muted/30">
        <div className="container-custom">
          <div className="mb-12 animate-fade-in-up">
            <h1 className="font-heading font-bold mb-2">Dashboard</h1>
            <p className="text-xl text-muted-foreground">
              Analyze jobs and optimize proposals
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-12 animate-fade-in-up">
            <Card className="p-6 shadow-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground text-sm">Jobs Analyzed</span>
                <Target className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl font-bold text-foreground">127</p>
              <p className="text-xs text-muted-foreground mt-1">+12 this week</p>
            </Card>

            <Card className="p-6 shadow-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground text-sm">Avg Match Score</span>
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl font-bold text-primary">84%</p>
              <p className="text-xs text-muted-foreground mt-1">+5% from last month</p>
            </Card>

            <Card className="p-6 shadow-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground text-sm">Proposals Sent</span>
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl font-bold text-foreground">43</p>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
            </Card>

            <Card className="p-6 shadow-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground text-sm">Success Rate</span>
                <UserCircle className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl font-bold text-primary">31%</p>
              <p className="text-xs text-muted-foreground mt-1">Above average!</p>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Job Analyzer */}
            <div className="animate-fade-in-up">
              <Card className="p-8 shadow-card border border-border h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-heading font-semibold text-2xl">Analyze Job Match</h2>
                    <p className="text-sm text-muted-foreground">Paste a job URL to get instant insights</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="job-url">Job Posting URL or Description</Label>
                    <Textarea 
                      id="job-url"
                      placeholder="Paste Upwork job URL or full job description here..."
                      className="mt-2 min-h-[150px]"
                    />
                  </div>
                  <Button onClick={handleAnalyze} variant="hero" className="w-full">
                    Analyze Job Match
                  </Button>
                </div>

                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Tip:</strong> Paste the complete job description for best results.
                  </p>
                </div>
              </Card>
            </div>

            {/* Profile Management */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <Card className="p-8 shadow-card border border-border h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <UserCircle className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h2 className="font-heading font-semibold text-2xl">Your Profile</h2>
                    <p className="text-sm text-muted-foreground">Manage your Upwork profile data</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Profile Status</span>
                      <span className="text-primary text-sm font-semibold">Active</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Skills Extracted</span>
                      <span className="text-foreground text-sm font-semibold">18 skills</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Last Updated</span>
                      <span className="text-muted-foreground text-sm">2 days ago</span>
                    </div>
                  </div>

                  <Link to="/profile-create">
                    <Button variant="outline" className="w-full">
                      Update Profile Data
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>

                  <Button variant="hero-secondary" className="w-full">
                    View Skill Analysis
                  </Button>
                </div>

                <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="text-sm text-foreground">
                    <strong>Pro Tip:</strong> Keep your profile updated to get more accurate job match scores.
                  </p>
                </div>
              </Card>
            </div>
          </div>

          {/* Recent Analyses */}
          <div className="mt-12 animate-fade-in">
            <h2 className="font-heading font-semibold text-2xl mb-6">Recent Job Analyses</h2>
            <div className="space-y-4">
              {[
                { title: "Full Stack Developer - React & Node.js", score: 92, date: "2 hours ago" },
                { title: "Senior Frontend Developer", score: 88, date: "1 day ago" },
                { title: "UI/UX Designer for SaaS Platform", score: 76, date: "2 days ago" }
              ].map((job, index) => (
                <Card key={index} className="p-6 shadow-card hover:shadow-card-hover transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-heading font-semibold text-lg mb-1">{job.title}</h3>
                      <p className="text-sm text-muted-foreground">{job.date}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Match Score</p>
                        <p className={`text-2xl font-bold ${job.score >= 85 ? 'text-primary' : 'text-foreground'}`}>
                          {job.score}%
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
