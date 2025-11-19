-- Create blog posts table
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  body TEXT NOT NULL,
  excerpt TEXT,
  feature_image TEXT,
  seo_title TEXT,
  meta_description TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Allow public to read published posts
CREATE POLICY "Published posts are viewable by everyone"
  ON public.blog_posts
  FOR SELECT
  USING (published = true);

-- Admins can do everything
CREATE POLICY "Admins can manage all posts"
  ON public.blog_posts
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create storage bucket for blog images
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true);

-- Storage policies for blog images
CREATE POLICY "Anyone can view blog images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'blog-images');

CREATE POLICY "Admins can upload blog images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'blog-images' AND
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can update blog images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'blog-images' AND
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can delete blog images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'blog-images' AND
    public.has_role(auth.uid(), 'admin')
  );

-- Create trigger for updated_at
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();