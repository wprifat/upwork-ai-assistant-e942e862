-- Add featured_image_url column to website_settings table
ALTER TABLE public.website_settings
ADD COLUMN featured_image_url text;