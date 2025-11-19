import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet";

interface WebsiteSettings {
  site_title: string;
  favicon_url: string | null;
  meta_description: string | null;
  header_tracking_code: string | null;
}

export const useWebsiteSettings = () => {
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("website_settings")
        .select("site_title, favicon_url, meta_description, header_tracking_code")
        .single();

      if (error) throw error;
      setSettings(data);
    } catch (error) {
      console.error("Error fetching website settings:", error);
    } finally {
      setLoading(false);
    }
  };

  return { settings, loading };
};

export const WebsiteMetaTags = () => {
  const { settings } = useWebsiteSettings();

  if (!settings) return null;

  return (
    <Helmet>
      {settings.site_title && <title>{settings.site_title}</title>}
      {settings.meta_description && (
        <meta name="description" content={settings.meta_description} />
      )}
      {settings.favicon_url && (
        <link rel="icon" href={settings.favicon_url} type="image/png" />
      )}
      {settings.header_tracking_code && (
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{ __html: settings.header_tracking_code }}
        />
      )}
    </Helmet>
  );
};
