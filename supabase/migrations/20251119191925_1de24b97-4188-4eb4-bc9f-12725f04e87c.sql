-- Enable realtime for pricing_settings table
ALTER TABLE public.pricing_settings REPLICA IDENTITY FULL;

-- Add pricing_settings to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.pricing_settings;