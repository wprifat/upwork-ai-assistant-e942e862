import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, Lock, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { z } from "zod";

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

const plans = {
  lifetime: {
    name: "Lifetime Deal",
    price: 15,
    originalPrice: 30,
    description: "One-time payment, lifetime access • 50% off",
  },
  monthly: {
    name: "Monthly Plan",
    price: 5,
    originalPrice: undefined,
    description: "Flexible monthly subscription",
  }
};

const profileSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
  title: z.string().trim().max(100).optional(),
});

const CheckoutForm = ({ plan, planType }: { plan: typeof plans.lifetime, planType: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    title: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) return;

    try {
      setLoading(true);
      setErrors({});

      // Validate form
      const validation = profileSchema.safeParse(formData);
      if (!validation.success) {
        const newErrors: Record<string, string> = {};
        validation.error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
        setLoading(false);
        return;
      }

      // Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Failed to create account");

      // Update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: formData.fullName,
          title: formData.title || null,
        })
        .eq("id", authData.user.id);

      if (profileError) throw profileError;

      // Process payment
      const { error: paymentError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success?plan=${planType}`,
        },
      });

      if (paymentError) {
        throw paymentError;
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to complete purchase. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Account Creation Section */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <User className="w-5 h-5 text-primary" />
          <h2 className="font-heading font-bold text-xl">Create Your Account</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="John Doe"
              className={errors.fullName ? "border-destructive" : ""}
            />
            {errors.fullName && <p className="text-sm text-destructive mt-1">{errors.fullName}</p>}
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@example.com"
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
          </div>

          <div>
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              className={errors.password ? "border-destructive" : ""}
            />
            {errors.password && <p className="text-sm text-destructive mt-1">{errors.password}</p>}
          </div>

          <div>
            <Label htmlFor="title">Job Title (Optional)</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Software Engineer"
            />
          </div>
        </div>
      </Card>

      {/* Payment Section */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Lock className="w-5 h-5 text-primary" />
          <h2 className="font-heading font-bold text-xl">Payment Information</h2>
        </div>

        <div className="mb-6 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">{plan.name}</span>
            <div className="text-right">
              <span className="text-2xl font-bold text-primary">${plan.price}</span>
              {plan.originalPrice && (
                <span className="text-sm text-muted-foreground line-through ml-2">
                  ${plan.originalPrice}
                </span>
              )}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{plan.description}</p>
        </div>

        <PaymentElement />
      </Card>

      <Button
        type="submit"
        disabled={!stripe || loading}
        className="w-full"
        size="lg"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          `Complete Purchase - $${plan.price}`
        )}
      </Button>

      <p className="text-sm text-muted-foreground text-center">
        By completing this purchase, you agree to our terms of service and privacy policy.
        Your payment is secured by Stripe.
      </p>
    </form>
  );
};

const CheckoutComplete = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  
  const planType = searchParams.get("plan") as keyof typeof plans;
  const plan = plans[planType];

  useState(() => {
    if (!plan) {
      navigate("/#pricing");
      return;
    }

    // Create payment intent
    const createPaymentIntent = async () => {
      try {
        console.log("Creating payment intent for:", { amount: plan.price, plan: planType });
        
        const { data, error } = await supabase.functions.invoke("create-payment-intent", {
          body: { amount: plan.price, plan: planType }
        });

        console.log("Payment intent response:", { data, error });

        if (error) {
          console.error("Supabase function error:", error);
          throw error;
        }
        
        if (data?.clientSecret) {
          console.log("Setting client secret");
          setClientSecret(data.clientSecret);
        } else {
          console.error("No client secret in response:", data);
          throw new Error("No client secret received");
        }
      } catch (error) {
        console.error("Error creating payment intent:", error);
        toast({
          title: "Error",
          description: "Failed to initialize payment. Please try again.",
          variant: "destructive",
        });
      }
    };

    createPaymentIntent();
  });

  if (!plan) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12 md:py-16 bg-muted/30">
        <div className="container-custom max-w-3xl">
          <Button
            variant="ghost"
            onClick={() => navigate(`/checkout?plan=${planType}`)}
            className="mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="mb-8">
            <h1 className="font-heading font-bold text-3xl mb-2">Complete Your Purchase</h1>
            <p className="text-muted-foreground">Create your account and complete payment in one step</p>
          </div>

          {!stripePublishableKey ? (
            <Card className="p-8 text-center">
              <p className="text-destructive mb-4">Stripe is not configured. Please add your Stripe publishable key.</p>
              <p className="text-sm text-muted-foreground">Contact support for assistance.</p>
            </Card>
          ) : clientSecret && stripePromise ? (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm plan={plan} planType={planType} />
            </Elements>
          ) : (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutComplete;
