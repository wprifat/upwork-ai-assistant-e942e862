import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, CheckCircle } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5"></div>
      
      <div className="container-custom relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Platform</span>
            </div>
            
            <h1 className="font-heading font-bold leading-tight">
              AI-Powered Upwork Proposal Assistant
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              Boost your chances of winning more Upwork jobs with intelligent profile, job, and cover letter analysis.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-foreground">Instant job match scoring</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-foreground">AI-optimized cover letters</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-foreground">Profile skill extraction</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#pricing">
                <Button variant="hero" className="w-full sm:w-auto">
                  Get Lifetime Access
                </Button>
              </a>
              <a href="#how-it-works">
                <Button variant="hero-secondary" className="w-full sm:w-auto">
                  See How It Works
                </Button>
              </a>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-6 border-t border-border">
              <div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span className="text-2xl font-bold text-foreground">3.5x</span>
                </div>
                <span className="text-sm text-muted-foreground">Better Match Rate</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-foreground">87%</span>
                </div>
                <span className="text-sm text-muted-foreground">Success Rate</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-foreground">5k+</span>
                </div>
                <span className="text-sm text-muted-foreground">Active Users</span>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative animate-fade-in">
            <div className="relative bg-card rounded-2xl shadow-card-active p-8 border border-border">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Job Match Score</span>
                  <span className="text-2xl font-bold text-primary">92%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '92%' }}></div>
                </div>
                
                <div className="space-y-2 pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Skills Match</span>
                    <span className="font-semibold text-primary">Excellent</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Experience Level</span>
                    <span className="font-semibold text-primary">Perfect</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Portfolio Relevance</span>
                    <span className="font-semibold text-primary">High</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">AI Insight:</span> Your profile shows strong alignment with this project. Consider highlighting your React and TypeScript expertise in your proposal.
                  </p>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
