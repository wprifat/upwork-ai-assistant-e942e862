import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Users, Mail, Activity, BookOpen, Globe, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import UserDataTable from "@/components/Admin/UserDataTable";
import EmailNewsletter from "@/components/Admin/EmailNewsletter";
import UsageTracking from "@/components/Admin/UsageTracking";
import BlogManagement from "@/components/Admin/BlogManagement";
import WebsiteSettings from "@/components/Admin/WebsiteSettings";
import { PricingManagement } from "@/components/Admin/PricingManagement";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    navigate("/admin-login");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Portal</h1>
            <p className="text-sm text-muted-foreground">UpAssistify Management Dashboard</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full max-w-4xl grid-cols-6">
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="blog" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Blog
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Globe className="h-4 w-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="newsletter" className="gap-2">
              <Mail className="h-4 w-4" />
              Newsletter
            </TabsTrigger>
            <TabsTrigger value="usage" className="gap-2">
              <Activity className="h-4 w-4" />
              Usage
            </TabsTrigger>
            <TabsTrigger value="pricing" className="gap-2">
              <DollarSign className="h-4 w-4" />
              Pricing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <UserDataTable />
          </TabsContent>

          <TabsContent value="blog" className="space-y-4">
            <BlogManagement />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <WebsiteSettings />
          </TabsContent>

          <TabsContent value="newsletter" className="space-y-4">
            <EmailNewsletter />
          </TabsContent>

          <TabsContent value="usage" className="space-y-4">
            <UsageTracking />
          </TabsContent>

          <TabsContent value="pricing" className="space-y-4">
            <PricingManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
