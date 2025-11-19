-- Create website settings table (singleton pattern)
CREATE TABLE public.website_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_title TEXT DEFAULT 'UpAssistify',
  favicon_url TEXT,
  meta_description TEXT,
  header_tracking_code TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;

-- Everyone can read settings
CREATE POLICY "Anyone can view website settings"
  ON public.website_settings
  FOR SELECT
  USING (true);

-- Only admins can update settings
CREATE POLICY "Admins can update website settings"
  ON public.website_settings
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can insert settings
CREATE POLICY "Admins can insert website settings"
  ON public.website_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_website_settings_updated_at
  BEFORE UPDATE ON public.website_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default settings (only one row should exist)
INSERT INTO public.website_settings (site_title, meta_description)
VALUES (
  'UpAssistify - AI-Powered Upwork Assistant',
  'UpAssistify helps freelancers succeed on Upwork with AI-powered proposal writing, profile optimization, and job matching tools.'
);

-- Create constraint to ensure only one row exists
CREATE UNIQUE INDEX website_settings_singleton ON public.website_settings ((true));