import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw userError;

    const { data: roleData } = await supabaseClient
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "admin")
      .single();

    if (!roleData) throw new Error("Unauthorized: Admin access required");

    const { code, discount_type, discount_value, max_uses, valid_until } = await req.json();

    if (!code || !discount_type || !discount_value) {
      throw new Error("Missing required fields");
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    let stripeCoupon;
    if (discount_type === "percentage") {
      stripeCoupon = await stripe.coupons.create({
        percent_off: discount_value,
        name: code,
        duration: "once",
      });
    } else {
      stripeCoupon = await stripe.coupons.create({
        amount_off: Math.round(discount_value * 100),
        currency: "usd",
        name: code,
        duration: "once",
      });
    }

    const { data, error } = await supabaseClient
      .from("coupons")
      .insert({
        code: code.toUpperCase(),
        discount_type,
        discount_value,
        stripe_coupon_id: stripeCoupon.id,
        max_uses: max_uses || null,
        valid_until: valid_until || null,
        created_by: userData.user.id,
      })
      .select()
      .single();

    if (error) throw error;

    console.log("Coupon created:", data);

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error creating coupon:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
