import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, originalPrice } = await req.json();
    console.log("Validating coupon:", { code, originalPrice });

    if (!code || typeof code !== "string") {
      return new Response(
        JSON.stringify({ error: "Coupon code is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    if (!originalPrice || typeof originalPrice !== "number" || originalPrice <= 0) {
      return new Response(
        JSON.stringify({ error: "Valid original price is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Find the coupon by code (case-insensitive)
    const { data: coupon, error: couponError } = await supabase
      .from("coupons")
      .select("*")
      .ilike("code", code.trim())
      .eq("is_active", true)
      .single();

    if (couponError || !coupon) {
      console.log("Coupon not found or inactive:", couponError);
      return new Response(
        JSON.stringify({ error: "Invalid or expired coupon code" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Check if coupon is within valid date range
    const now = new Date();
    if (coupon.valid_from && new Date(coupon.valid_from) > now) {
      return new Response(
        JSON.stringify({ error: "This coupon is not yet valid" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    if (coupon.valid_until && new Date(coupon.valid_until) < now) {
      return new Response(
        JSON.stringify({ error: "This coupon has expired" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Check max uses
    if (coupon.max_uses && coupon.current_uses >= coupon.max_uses) {
      return new Response(
        JSON.stringify({ error: "This coupon has reached its maximum usage limit" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Calculate discount
    let discountAmount = 0;
    let finalPrice = originalPrice;

    if (coupon.discount_type === "percentage") {
      discountAmount = (originalPrice * coupon.discount_value) / 100;
      finalPrice = originalPrice - discountAmount;
    } else if (coupon.discount_type === "fixed") {
      discountAmount = coupon.discount_value;
      finalPrice = Math.max(0, originalPrice - discountAmount);
    }

    // Round to 2 decimal places
    finalPrice = Math.round(finalPrice * 100) / 100;
    discountAmount = Math.round(discountAmount * 100) / 100;

    console.log("Coupon validated successfully:", {
      code: coupon.code,
      discountType: coupon.discount_type,
      discountValue: coupon.discount_value,
      discountAmount,
      finalPrice,
    });

    return new Response(
      JSON.stringify({
        valid: true,
        couponId: coupon.id,
        code: coupon.code,
        discountType: coupon.discount_type,
        discountValue: coupon.discount_value,
        discountAmount,
        finalPrice,
        stripeCouponId: coupon.stripe_coupon_id,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Error validating coupon:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
