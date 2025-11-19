import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface PricingSetting {
  id: string;
  product_name: string;
  base_price: number;
  current_price: number;
  discount_percentage: number;
  currency: string;
}

interface Coupon {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  is_active: boolean;
  max_uses: number | null;
  current_uses: number;
  valid_until: string | null;
}

export const PricingManagement = () => {
  const [pricing, setPricing] = useState<PricingSetting[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discount_type: "percentage",
    discount_value: 0,
    max_uses: "",
    valid_until: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: pricingData } = await supabase
      .from("pricing_settings")
      .select("*")
      .order("product_name");
    
    const { data: couponsData } = await supabase
      .from("coupons")
      .select("*")
      .order("created_at", { ascending: false });

    if (pricingData) setPricing(pricingData);
    if (couponsData) setCoupons(couponsData);
  };

  const updatePricing = async (productName: string, basePrice: number, newPrice: number, discount: number) => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { error } = await supabase.functions.invoke("update-pricing", {
        body: {
          product_name: productName,
          base_price: basePrice,
          current_price: newPrice,
          discount_percentage: discount,
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Pricing updated successfully",
      });
      
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update pricing",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createCoupon = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { error } = await supabase.functions.invoke("create-coupon", {
        body: {
          code: newCoupon.code,
          discount_type: newCoupon.discount_type,
          discount_value: parseFloat(newCoupon.discount_value.toString()),
          max_uses: newCoupon.max_uses ? parseInt(newCoupon.max_uses) : null,
          valid_until: newCoupon.valid_until || null,
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Coupon created successfully",
      });
      
      setNewCoupon({
        code: "",
        discount_type: "percentage",
        discount_value: 0,
        max_uses: "",
        valid_until: "",
      });
      
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create coupon",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleCoupon = async (id: string, isActive: boolean) => {
    const { error } = await supabase
      .from("coupons")
      .update({ is_active: !isActive })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update coupon",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: `Coupon ${!isActive ? "activated" : "deactivated"}`,
      });
      fetchData();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Product Pricing</CardTitle>
          <CardDescription>Manage your product prices and discounts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {pricing.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 space-y-3">
              <h3 className="font-semibold capitalize">{item.product_name} Plan</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Base Price (${item.currency.toUpperCase()})</Label>
                  <Input
                    type="number"
                    value={item.base_price}
                    onChange={(e) => {
                      const newBasePrice = parseFloat(e.target.value || "0");
                      setPricing((prev) =>
                        prev.map((p) =>
                          p.id === item.id ? { ...p, base_price: newBasePrice } : p
                        )
                      );
                    }}
                    onBlur={(e) => {
                      const newBasePrice = parseFloat(e.target.value || "0");
                      if (newBasePrice !== item.base_price) {
                        updatePricing(item.product_name, newBasePrice, item.current_price, item.discount_percentage);
                      }
                    }}
                  />
                </div>
                <div>
                  <Label>Current Price</Label>
                  <Input
                    type="number"
                    value={item.current_price}
                    onChange={(e) => {
                      const newPrice = parseFloat(e.target.value || "0");
                      setPricing((prev) =>
                        prev.map((p) =>
                          p.id === item.id ? { ...p, current_price: newPrice } : p
                        )
                      );
                    }}
                    onBlur={(e) => {
                      const newPrice = parseFloat(e.target.value || "0");
                      if (newPrice !== item.current_price) {
                        updatePricing(item.product_name, item.base_price, newPrice, item.discount_percentage);
                      }
                    }}
                  />
                </div>
                <div>
                  <Label>Discount %</Label>
                  <Input
                    type="number"
                    value={item.discount_percentage}
                    onChange={(e) => {
                      const newDiscount = parseFloat(e.target.value || "0");
                      setPricing((prev) =>
                        prev.map((p) =>
                          p.id === item.id ? { ...p, discount_percentage: newDiscount } : p
                        )
                      );
                    }}
                    onBlur={(e) => {
                      const newDiscount = parseFloat(e.target.value || "0");
                      if (newDiscount !== item.discount_percentage) {
                        updatePricing(item.product_name, item.base_price, item.current_price, newDiscount);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Create Coupon</CardTitle>
          <CardDescription>Add new discount coupons</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Coupon Code</Label>
              <Input
                value={newCoupon.code}
                onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                placeholder="SAVE20"
              />
            </div>
            <div>
              <Label>Discount Type</Label>
              <select
                className="w-full border rounded-md p-2"
                value={newCoupon.discount_type}
                onChange={(e) => setNewCoupon({ ...newCoupon, discount_type: e.target.value })}
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
            <div>
              <Label>Discount Value</Label>
              <Input
                type="number"
                value={newCoupon.discount_value}
                onChange={(e) => setNewCoupon({ ...newCoupon, discount_value: parseFloat(e.target.value) })}
                placeholder={newCoupon.discount_type === "percentage" ? "20" : "50"}
              />
            </div>
            <div>
              <Label>Max Uses (optional)</Label>
              <Input
                type="number"
                value={newCoupon.max_uses}
                onChange={(e) => setNewCoupon({ ...newCoupon, max_uses: e.target.value })}
                placeholder="100"
              />
            </div>
            <div>
              <Label>Valid Until (optional)</Label>
              <Input
                type="datetime-local"
                value={newCoupon.valid_until}
                onChange={(e) => setNewCoupon({ ...newCoupon, valid_until: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={createCoupon} disabled={loading || !newCoupon.code}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Coupon
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Coupons</CardTitle>
          <CardDescription>Manage existing coupon codes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {coupons.map((coupon) => (
              <div key={coupon.id} className="flex items-center justify-between border rounded-lg p-3">
                <div>
                  <p className="font-semibold">{coupon.code}</p>
                  <p className="text-sm text-muted-foreground">
                    {coupon.discount_type === "percentage" ? `${coupon.discount_value}%` : `$${coupon.discount_value}`} off
                    {coupon.max_uses && ` • ${coupon.current_uses}/${coupon.max_uses} uses`}
                  </p>
                </div>
                <Button
                  variant={coupon.is_active ? "destructive" : "default"}
                  onClick={() => toggleCoupon(coupon.id, coupon.is_active)}
                >
                  {coupon.is_active ? "Deactivate" : "Activate"}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
