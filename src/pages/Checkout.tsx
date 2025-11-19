import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Loader2, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";

const plans = {
  lifetime: {
    name: "Lifetime Deal",
    price: "$15",
    originalPrice: "$30",
    description: "One-time payment, lifetime access • 50% off",
    features: [
      "Unlimited job analyses",
      "AI cover letter optimization",
      "Profile insights",
      "Priority support",
      "All future updates"
    ],
    functionName: "create-lifetime-checkout"
  },
  monthly: {
    name: "Monthly Plan",
    price: "$5",
    originalPrice: undefined,
    description: "Flexible monthly subscription",
    features: [
      "50 analyses/month",
      "AI cover letter optimization",
      "Profile insights",
      "Email support"
    ],
    functionName: "create-monthly-checkout"
  }
};

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const planType = searchParams.get("plan") as keyof typeof plans;
  const plan = plans[planType];

  useEffect(() => {
    if (!plan) {
      navigate("/#pricing");
    }
  }, [plan, navigate]);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke(plan.functionName);
      
      if (error) throw error;
      
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Error",
        description: "Failed to create checkout session. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  if (!plan) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12 md:py-16">
        <div className="container-custom max-w-2xl">
          <Button
            variant="ghost"
            onClick={() => navigate("/#pricing")}
            className="mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Pricing
          </Button>

          <Card className="p-8">
            <h1 className="font-heading font-bold text-3xl mb-2">Checkout</h1>
            <p className="text-muted-foreground mb-8">Review your purchase</p>

            <div className="border-b border-border pb-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="font-heading font-bold text-2xl">{plan.name}</h2>
                  <p className="text-muted-foreground mt-1">{plan.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">{plan.price}</div>
                  {plan.originalPrice && (
                    <div className="text-muted-foreground line-through">{plan.originalPrice}</div>
                  )}
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-4 mt-4">
                <h3 className="font-semibold mb-3">Included features:</h3>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Complete Purchase"
                )}
              </Button>
              
              <p className="text-sm text-muted-foreground text-center">
                You will be redirected to Stripe to complete your payment securely
              </p>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
