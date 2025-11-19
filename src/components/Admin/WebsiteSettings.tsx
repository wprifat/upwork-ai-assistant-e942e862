import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Upload, Globe } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface WebsiteSettings {
  id: string;
  site_title: string;
  favicon_url: string | null;
  meta_description: string | null;
  header_tracking_code: string | null;
}

const WebsiteSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("website_settings")
        .select("*")
        .single();

      if (error) throw error;
      setSettings(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch website settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `favicon.${fileExt}`;
      const filePath = fileName;

      // Delete old favicon if exists
      if (settings?.favicon_url) {
        const oldPath = settings.favicon_url.split("/").pop();
        if (oldPath) {
          await supabase.storage.from("blog-images").remove([oldPath]);
        }
      }

      const { error: uploadError } = await supabase.storage
        .from("blog-images")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("blog-images").getPublicUrl(filePath);

      setSettings((prev) => prev ? ({ ...prev, favicon_url: publicUrl }) : null);

      toast({
        title: "Favicon uploaded",
        description: "Favicon has been uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload favicon",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("website_settings")
        .update({
          site_title: settings.site_title,
          favicon_url: settings.favicon_url,
          meta_description: settings.meta_description,
          header_tracking_code: settings.header_tracking_code,
          updated_by: user?.id,
        })
        .eq("id", settings.id);

      if (error) throw error;

      toast({
        title: "Settings saved",
        description: "Website settings have been updated successfully. Refresh the page to see changes.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!settings) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-muted-foreground">No settings found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          <CardTitle>Website Details</CardTitle>
        </div>
        <CardDescription>
          Manage your website's SEO settings, favicon, and tracking codes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Site Title */}
        <div className="space-y-2">
          <Label htmlFor="site-title">Website Title</Label>
          <Input
            id="site-title"
            value={settings.site_title}
            onChange={(e) =>
              setSettings({ ...settings, site_title: e.target.value })
            }
            placeholder="UpAssistify - AI-Powered Upwork Assistant"
          />
          <p className="text-xs text-muted-foreground">
            Appears in browser tabs and search engine results
          </p>
        </div>

        {/* Favicon */}
        <div className="space-y-2">
          <Label htmlFor="favicon">Favicon</Label>
          <div className="flex gap-4 items-start">
            <div className="flex-1">
              <Input
                id="favicon"
                type="file"
                accept="image/*"
                onChange={handleFaviconUpload}
                disabled={uploading}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Recommended: 32x32px or 64x64px PNG/ICO file
              </p>
            </div>
            {settings.favicon_url && (
              <div className="flex flex-col items-center gap-2">
                <img
                  src={settings.favicon_url}
                  alt="Favicon preview"
                  className="w-8 h-8 object-contain border border-border rounded"
                />
                <span className="text-xs text-muted-foreground">Current</span>
              </div>
            )}
          </div>
          {uploading && (
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Upload className="h-4 w-4 animate-pulse" />
              Uploading...
            </p>
          )}
        </div>

        {/* Meta Description */}
        <div className="space-y-2">
          <Label htmlFor="meta-description">Website Meta Description</Label>
          <Textarea
            id="meta-description"
            value={settings.meta_description || ""}
            onChange={(e) =>
              setSettings({ ...settings, meta_description: e.target.value })
            }
            placeholder="Brief description of your website for search engines..."
            rows={3}
            maxLength={160}
          />
          <p className="text-xs text-muted-foreground">
            {(settings.meta_description || "").length}/160 characters - Appears in search results
          </p>
        </div>

        {/* Header Tracking Code */}
        <div className="space-y-2">
          <Label htmlFor="tracking-code">Header Tracking Code</Label>
          <Textarea
            id="tracking-code"
            value={settings.header_tracking_code || ""}
            onChange={(e) =>
              setSettings({ ...settings, header_tracking_code: e.target.value })
            }
            placeholder="<!-- Google Analytics, Meta Pixel, Search Console verification, etc. -->"
            rows={6}
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            Add verification codes, analytics scripts, or tracking pixels. Code will be inserted in the {`<head>`} section.
          </p>
        </div>

        {/* Save Button */}
        <div className="pt-4">
          <Button onClick={handleSave} disabled={saving} size="lg">
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebsiteSettings;
