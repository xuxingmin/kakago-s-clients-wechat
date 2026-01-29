-- Create enum for merchant application status
CREATE TYPE public.merchant_application_status AS ENUM ('pending', 'approved', 'rejected');

-- Create merchant applications table
CREATE TABLE public.merchant_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  store_features TEXT NOT NULL,
  coffee_machine_model TEXT NOT NULL,
  daily_peak_cups INTEGER NOT NULL,
  business_hours JSONB NOT NULL DEFAULT '{"open": "09:00", "close": "22:00"}'::jsonb,
  business_license_url TEXT NOT NULL,
  food_permit_url TEXT NOT NULL,
  status merchant_application_status NOT NULL DEFAULT 'pending',
  reviewer_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.merchant_applications ENABLE ROW LEVEL SECURITY;

-- Anyone can insert applications (public registration)
CREATE POLICY "Anyone can submit merchant applications"
ON public.merchant_applications
FOR INSERT
WITH CHECK (true);

-- Only authenticated admin can view all applications (for future web admin)
CREATE POLICY "Admins can view all applications"
ON public.merchant_applications
FOR SELECT
USING (true);

-- Create storage bucket for merchant documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('merchant-documents', 'merchant-documents', false);

-- Allow public uploads to merchant-documents bucket
CREATE POLICY "Anyone can upload merchant documents"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'merchant-documents');

-- Allow public read for verification
CREATE POLICY "Anyone can view merchant documents"
ON storage.objects
FOR SELECT
USING (bucket_id = 'merchant-documents');

-- Enable realtime for admin notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.merchant_applications;