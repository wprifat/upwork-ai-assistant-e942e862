import { useState, useEffect } from "react";
import { Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const PricingSection = () => {
  const navigate = useNavigate();
  const [pricing, setPricing] = useState<{
    lifetime: { current_price: number; base_price: number; discount_percentage: number } | null;
    monthly: { current_price: number; base_price: number; discount_percentage: number } | null;
  }>({ lifetime: null, monthly: null });

  useEffect(() => {
    const fetchPricing = async () => {
      const { data } = await supabase
        .from("pricing_settings")
        .select("product_name, current_price, base_price, discount_percentage")
        .in("product_name", ["lifetime", "monthly"]);

      if (data) {
        const pricingMap = {
          lifetime: data.find((p) => p.product_name === "lifetime") || null,
          monthly: data.find((p) => p.product_name === "monthly") || null,
        };
        setPricing(pricingMap);
      }
    };

    fetchPricing();

    // Set up real-time subscription for pricing updates
    const channel = supabase
      .channel("pricing-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "pricing_settings",
        },
        () => {
          fetchPricing();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <section id="pricing" className="py-12 md:py-16 bg-muted/30">
      <div className="container-custom">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="font-heading font-bold mb-4">
            Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose your plan
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {/* Lifetime Deal */}
          <div className="relative bg-card rounded-2xl p-8 shadow-card-active border-2 border-primary animate-fade-in-up">
            <div className="absolute -top-4 right-8 flex gap-2">
              {pricing.lifetime?.discount_percentage ? (
                <Badge className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  {pricing.lifetime.discount_percentage}% OFF
                </Badge>
              ) : null}
              <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                <Zap className="w-4 h-4" />
                Recommended
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-heading font-bold text-2xl mb-2">Lifetime Deal</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-primary">
                  ${pricing.lifetime?.current_price || 997}
                </span>
                {pricing.lifetime?.discount_percentage ? (
                  <span className="text-muted-foreground line-through">
                    ${pricing.lifetime?.base_price}
                  </span>
                ) : null}
              </div>
              <p className="text-muted-foreground mt-2">
                One-time payment, lifetime access
                {pricing.lifetime?.discount_percentage ? ` • ${pricing.lifetime.discount_percentage}% off` : ""}
              </p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Unlimited job analyses</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>AI cover letter optimization</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Profile insights</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Priority support</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>All future updates</span>
              </li>
            </ul>

            <Button 
              variant="hero" 
              className="w-full" 
              size="xl"
              onClick={() => navigate("/checkout?plan=lifetime")}
            >
              Get Started
            </Button>
          </div>

          {/* Monthly Plan */}
          <div className="relative bg-card rounded-2xl p-8 shadow-card border border-border animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {pricing.monthly?.discount_percentage ? (
              <div className="absolute -top-4 right-8">
                <Badge className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  {pricing.monthly.discount_percentage}% OFF
                </Badge>
              </div>
            ) : null}
            <div className="mb-6">
              <h3 className="font-heading font-bold text-2xl mb-2">Monthly Plan</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-foreground">
                  ${pricing.monthly?.current_price || 97}
                </span>
                <span className="text-muted-foreground">/month</span>
                {pricing.monthly?.discount_percentage ? (
                  <span className="text-muted-foreground line-through text-2xl">
                    ${pricing.monthly?.base_price}
                  </span>
                ) : null}
              </div>
              <p className="text-muted-foreground mt-2">
                Flexible monthly subscription
                {pricing.monthly?.discount_percentage ? ` • ${pricing.monthly.discount_percentage}% off` : ""}
                {pricing.monthly?.discount_percentage ? ` • ${pricing.monthly.discount_percentage}% off` : ""}
              </p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>50 analyses/month</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>AI cover letter optimization</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Profile insights</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Email support</span>
              </li>
            </ul>

            <Button 
              variant="outline" 
              className="w-full hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors" 
              size="xl"
              onClick={() => navigate("/checkout?plan=monthly")}
            >
              Start Monthly
            </Button>
          </div>
        </div>

        {/* Feature Comparison */}
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h3 className="font-heading font-bold text-2xl text-center mb-8">
            Compare Plans
          </h3>
          <div className="bg-card rounded-lg shadow-card overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-4 font-heading font-semibold">Feature</th>
                  <th className="text-center p-4 font-heading font-semibold">Lifetime</th>
                  <th className="text-center p-4 font-heading font-semibold">Monthly</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="p-4">Job Match Analyses</td>
                  <td className="text-center p-4 text-primary font-semibold">Unlimited</td>
                  <td className="text-center p-4">50/month</td>
                </tr>
                <tr>
                  <td className="p-4">Cover Letter Optimization</td>
                  <td className="text-center p-4"><Check className="w-5 h-5 text-primary mx-auto" /></td>
                  <td className="text-center p-4"><Check className="w-5 h-5 text-primary mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4">Profile Insights</td>
                  <td className="text-center p-4"><Check className="w-5 h-5 text-primary mx-auto" /></td>
                  <td className="text-center p-4"><Check className="w-5 h-5 text-primary mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4">Priority Support</td>
                  <td className="text-center p-4"><Check className="w-5 h-5 text-primary mx-auto" /></td>
                  <td className="text-center p-4">-</td>
                </tr>
                <tr>
                  <td className="p-4">Future Updates</td>
                  <td className="text-center p-4 text-primary font-semibold">Free Forever</td>
                  <td className="text-center p-4">Included</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
