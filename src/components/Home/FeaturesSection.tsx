import { Brain, Code, Lightbulb, TrendingUp } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Job Match Analyzer",
      description: "Get instant compatibility scores for any Upwork job posting based on your unique profile and experience.",
      gradient: "from-primary/20 to-primary/5"
    },
    {
      icon: Code,
      title: "Skill Extraction & Profile Insights",
      description: "Automatically extract and organize your skills from your Upwork profile to understand your strengths.",
      gradient: "from-accent/20 to-accent/5"
    },
    {
      icon: Lightbulb,
      title: "Smart Cover Letter Optimizer",
      description: "AI-driven suggestions to improve your proposals and make them stand out to potential clients.",
      gradient: "from-brand-orange/20 to-brand-orange/5"
    },
    {
      icon: TrendingUp,
      title: "Upwork Proposal Enhancements",
      description: "Data-driven insights to help you craft winning proposals and increase your response rates.",
      gradient: "from-dark-green/20 to-dark-green/5"
    }
  ];

  return (
    <section id="features" className="py-20 md:py-32">
      <div className="container-custom">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="font-heading font-bold mb-4">
            Powerful Features for Freelancers
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-2">
            Data-driven insights to help you stand out.
          </p>
          <p className="text-lg text-primary font-semibold">
            Everything you need to win more Upwork projects
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
        <div className="mt-16 text-center p-8 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl border border-primary/20 animate-fade-in">
          <h3 className="font-heading font-bold text-2xl mb-3">
            Ready to Transform Your Upwork Success?
          </h3>
          <p className="text-muted-foreground mb-6">
            Join thousands of freelancers already winning more projects
          </p>
          <a href="#pricing">
            <button className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold shadow-card-hover hover:bg-primary-hover hover:shadow-card-active transition-all">
              View Pricing Plans
            </button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
