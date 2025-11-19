import { Brain, Code, Lightbulb, TrendingUp } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Brain,
      title: "Job Match Analyzer",
      description: "Instant compatibility scores for any Upwork job based on your profile.",
      gradient: "from-primary/20 to-primary/5"
    },
    {
      icon: Code,
      title: "Skill Insights",
      description: "Auto-extract and organize your skills to understand your strengths.",
      gradient: "from-accent/20 to-accent/5"
    },
    {
      icon: Lightbulb,
      title: "Cover Letter Optimizer",
      description: "AI suggestions to make your proposals stand out.",
      gradient: "from-brand-orange/20 to-brand-orange/5"
    },
    {
      icon: TrendingUp,
      title: "Proposal Enhancement",
      description: "Data-driven insights to increase response rates.",
      gradient: "from-dark-green/20 to-dark-green/5"
    }
  ];

  return (
    <section id="features" className="py-12 md:py-16">
      <div className="container-custom">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="font-heading font-bold mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to win more projects
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-card rounded-lg p-8 shadow-card hover:shadow-card-hover transition-all duration-300 animate-fade-in-up border border-border"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-8 h-8 text-primary" />
              </div>

              <h3 className="font-heading font-semibold text-2xl mb-3">
                {feature.title}
              </h3>

              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center p-8 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl border border-primary/20 animate-fade-in">
          <h3 className="font-heading font-bold text-2xl mb-3">
            Ready to Win More Projects?
          </h3>
          <a href="#pricing">
            <button className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold shadow-card-hover hover:bg-primary-hover hover:shadow-card-active transition-all">
              View Pricing
            </button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
