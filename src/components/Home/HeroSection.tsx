import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, CheckCircle } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative py-16 md:py-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5"></div>
      
      <div className="container-custom relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in-up">
            <h1 className="font-heading font-bold leading-tight">
              AI-Powered Upwork Proposal Assistant
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              Win more Upwork jobs with intelligent AI analysis.
            </p>

            <div className="flex flex-wrap gap-4 md:gap-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-foreground">Job match scoring</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-foreground">AI cover letters</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-foreground">Profile insights</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#pricing">
                <Button variant="hero" className="w-full sm:w-auto">
                  Get Started
                </Button>
              </a>
              <a href="#how-it-works">
                <Button variant="hero-secondary" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </a>
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
                    <span className="font-semibold">AI Insight:</span> Strong alignment detected. Highlight React and TypeScript expertise.
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
