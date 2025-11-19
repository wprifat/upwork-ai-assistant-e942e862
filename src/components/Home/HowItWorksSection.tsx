import { UserCircle, Target, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      icon: UserCircle,
      title: "Analyze Your Profile",
      description: "Upload your profile and let AI extract your skills automatically."
    },
    {
      number: "02",
      icon: Target,
      title: "Check Job Match",
      description: "Get instant compatibility scores for any job posting."
    },
    {
      number: "03",
      icon: FileText,
      title: "Optimize Cover Letter",
      description: "Generate AI-powered suggestions to boost your proposals."
    }
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-muted/30">
      <div className="container-custom">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="font-heading font-bold mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to success
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="relative bg-card rounded-lg p-8 shadow-card hover:shadow-card-hover transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-card-hover">
                <span className="text-2xl font-bold text-primary-foreground">{step.number}</span>
              </div>

              {/* Icon */}
              <div className="mb-6 mt-8">
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>
              </div>

              {/* Content */}
              <h3 className="font-heading font-semibold text-xl mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>

              {/* Connector line (except for last item) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border"></div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center animate-fade-in">
          <a href="#pricing">
            <Button variant="hero" size="xl">
              Get Started Today
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
