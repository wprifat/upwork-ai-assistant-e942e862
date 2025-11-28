-- Add explicit policy to deny anonymous access to profiles table
CREATE POLICY "deny_public_access" 
ON public.profiles 
FOR SELECT 
TO anon 
USING (false);