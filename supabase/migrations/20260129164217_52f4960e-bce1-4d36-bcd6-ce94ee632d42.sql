-- Add user_id to merchants table to link merchants with auth users
ALTER TABLE public.merchants 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create index on user_id for faster lookups
CREATE INDEX idx_merchants_user_id ON public.merchants (user_id);

-- Add policy for merchants to update their own store
CREATE POLICY "Merchants can update their own store" 
ON public.merchants 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add policy for merchants to view their own store details
CREATE POLICY "Merchants can view their own store" 
ON public.merchants 
FOR SELECT 
USING (auth.uid() = user_id OR true);  -- Public can view all, but merchants have special access

-- Create a function to get merchant by user_id
CREATE OR REPLACE FUNCTION public.get_my_merchant()
RETURNS TABLE (
  id UUID,
  name TEXT,
  name_en TEXT,
  address TEXT,
  is_online BOOLEAN,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  rating DECIMAL(2,1),
  business_hours JSONB,
  updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.id,
    m.name,
    m.name_en,
    m.address,
    m.is_online,
    m.latitude,
    m.longitude,
    m.rating,
    m.business_hours,
    m.updated_at
  FROM merchants m
  WHERE m.user_id = auth.uid();
END;
$$;

-- Create a function for merchants to toggle their own status
CREATE OR REPLACE FUNCTION public.toggle_my_merchant_status(new_status BOOLEAN)
RETURNS TABLE (
  success BOOLEAN,
  merchant_id UUID,
  is_online BOOLEAN,
  message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_merchant_id UUID;
  v_is_online BOOLEAN;
BEGIN
  -- Get the merchant ID for current user
  SELECT m.id INTO v_merchant_id
  FROM merchants m
  WHERE m.user_id = auth.uid();
  
  IF v_merchant_id IS NULL THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::BOOLEAN, '未找到关联的商户账号'::TEXT;
    RETURN;
  END IF;
  
  -- Update the status
  UPDATE merchants
  SET is_online = new_status, updated_at = now()
  WHERE id = v_merchant_id
  RETURNING merchants.is_online INTO v_is_online;
  
  RETURN QUERY SELECT 
    true, 
    v_merchant_id, 
    v_is_online, 
    CASE WHEN v_is_online THEN '商户已上线' ELSE '商户已下线' END;
END;
$$;