
ALTER TABLE public.merchant_applications
  ADD COLUMN IF NOT EXISTS grinder_model text,
  ADD COLUMN IF NOT EXISTS storefront_photo_url text;
