-- Create scheduled newsletters table
CREATE TABLE IF NOT EXISTS public.scheduled_newsletters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  sent_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT
);

-- Enable RLS
ALTER TABLE public.scheduled_newsletters ENABLE ROW LEVEL SECURITY;

-- Admins can manage scheduled newsletters
CREATE POLICY "Admins can manage scheduled newsletters"
  ON public.scheduled_newsletters
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create index for efficient queries
CREATE INDEX idx_scheduled_newsletters_status_time 
  ON public.scheduled_newsletters(status, scheduled_for) 
  WHERE status = 'pending';