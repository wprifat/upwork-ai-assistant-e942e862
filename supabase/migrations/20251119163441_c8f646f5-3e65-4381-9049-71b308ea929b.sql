-- Create enum for plan types
CREATE TYPE public.plan_type AS ENUM ('free', 'lifetime', 'monthly');

-- Add plan columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN plan_type public.plan_type DEFAULT 'free' NOT NULL,
ADD COLUMN subscription_end_date TIMESTAMP WITH TIME ZONE;

-- Add comment for clarity
COMMENT ON COLUMN public.profiles.plan_type IS 'User subscription plan type';
COMMENT ON COLUMN public.profiles.subscription_end_date IS 'End date for monthly subscriptions';