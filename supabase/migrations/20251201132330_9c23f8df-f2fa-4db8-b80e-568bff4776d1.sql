-- Create cover_letters table
CREATE TABLE public.cover_letters (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cover_letters ENABLE ROW LEVEL SECURITY;

-- Create policies for cover_letters
CREATE POLICY "Users can view their own cover letters"
ON public.cover_letters
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own cover letters"
ON public.cover_letters
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cover letters"
ON public.cover_letters
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cover letters"
ON public.cover_letters
FOR DELETE
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_cover_letters_updated_at
BEFORE UPDATE ON public.cover_letters
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add profile_text field to profiles table to store raw Upwork profile
ALTER TABLE public.profiles
ADD COLUMN profile_text text;