-- Enable PostGIS extension for geographic calculations
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create merchants table for storing merchant info and location
CREATE TABLE public.merchants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT,
  address TEXT NOT NULL,
  address_en TEXT,
  phone TEXT,
  -- Geographic location stored as PostGIS geography point
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  -- Latitude and longitude for easy access
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  -- Online/availability status
  is_online BOOLEAN NOT NULL DEFAULT false,
  -- Business hours (stored as JSONB for flexibility)
  -- Format: { "mon": {"open": "09:00", "close": "22:00"}, ... }
  business_hours JSONB,
  -- Merchant metadata
  logo_url TEXT,
  description TEXT,
  description_en TEXT,
  rating DECIMAL(2,1) DEFAULT 5.0,
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index on location for faster geographic queries
CREATE INDEX idx_merchants_location ON public.merchants USING GIST (location);

-- Create index on is_online for filtering
CREATE INDEX idx_merchants_is_online ON public.merchants (is_online);

-- Enable Row Level Security
ALTER TABLE public.merchants ENABLE ROW LEVEL SECURITY;

-- Public read policy - anyone can view merchants
CREATE POLICY "Merchants are publicly viewable" 
ON public.merchants 
FOR SELECT 
USING (true);

-- Create function to check if any merchant is online within radius
CREATE OR REPLACE FUNCTION public.check_service_availability(
  user_lat DOUBLE PRECISION,
  user_lng DOUBLE PRECISION,
  radius_meters INTEGER DEFAULT 2000
)
RETURNS TABLE (
  is_available BOOLEAN,
  nearby_merchant_count INTEGER,
  nearest_merchant_id UUID,
  nearest_merchant_name TEXT,
  nearest_distance_meters DOUBLE PRECISION
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH nearby AS (
    SELECT 
      m.id,
      m.name,
      m.is_online,
      ST_Distance(
        m.location::geography,
        ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography
      ) as distance
    FROM merchants m
    WHERE ST_DWithin(
      m.location::geography,
      ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography,
      radius_meters
    )
    ORDER BY distance
  ),
  online_nearby AS (
    SELECT * FROM nearby WHERE is_online = true
  )
  SELECT 
    EXISTS(SELECT 1 FROM online_nearby) as is_available,
    (SELECT COUNT(*)::INTEGER FROM online_nearby) as nearby_merchant_count,
    (SELECT id FROM online_nearby LIMIT 1) as nearest_merchant_id,
    (SELECT name FROM online_nearby LIMIT 1) as nearest_merchant_name,
    (SELECT distance FROM online_nearby LIMIT 1) as nearest_distance_meters;
END;
$$;

-- Create function to update merchant online status (for merchant app)
CREATE OR REPLACE FUNCTION public.update_merchant_status(
  merchant_id UUID,
  new_status BOOLEAN
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE merchants 
  SET is_online = new_status, updated_at = now()
  WHERE id = merchant_id;
  
  RETURN FOUND;
END;
$$;

-- Create trigger for automatic timestamp updates
CREATE OR REPLACE FUNCTION public.update_merchants_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_merchants_updated_at
BEFORE UPDATE ON public.merchants
FOR EACH ROW
EXECUTE FUNCTION public.update_merchants_updated_at();

-- Insert sample merchant data for testing (Swan Lake CBD area - Hefei)
INSERT INTO public.merchants (name, name_en, address, address_en, latitude, longitude, location, is_online, business_hours, rating) VALUES
('星巴克天鹅湖店', 'Starbucks Swan Lake', '合肥市蜀山区天鹅湖CBD万达广场1层', 'Wanda Plaza L1, Swan Lake CBD, Hefei', 31.8206, 117.2272, ST_SetSRID(ST_MakePoint(117.2272, 31.8206), 4326)::geography, true, '{"mon":{"open":"08:00","close":"22:00"},"tue":{"open":"08:00","close":"22:00"},"wed":{"open":"08:00","close":"22:00"},"thu":{"open":"08:00","close":"22:00"},"fri":{"open":"08:00","close":"23:00"},"sat":{"open":"09:00","close":"23:00"},"sun":{"open":"09:00","close":"22:00"}}', 4.8),
('瑞幸咖啡政务中心店', 'Luckin Coffee Gov Center', '合肥市蜀山区政务区潜山路888号', '888 Qianshan Rd, Gov District, Hefei', 31.8185, 117.2295, ST_SetSRID(ST_MakePoint(117.2295, 31.8185), 4326)::geography, true, '{"mon":{"open":"07:30","close":"21:00"},"tue":{"open":"07:30","close":"21:00"},"wed":{"open":"07:30","close":"21:00"},"thu":{"open":"07:30","close":"21:00"},"fri":{"open":"07:30","close":"21:00"},"sat":{"open":"08:00","close":"20:00"},"sun":{"open":"08:00","close":"20:00"}}', 4.5),
('% Arabica', '% Arabica', '合肥市蜀山区天鹅湖银泰城B1层', 'Intime City B1, Swan Lake, Hefei', 31.8198, 117.2248, ST_SetSRID(ST_MakePoint(117.2248, 31.8198), 4326)::geography, false, '{"mon":{"open":"10:00","close":"22:00"},"tue":{"open":"10:00","close":"22:00"},"wed":{"open":"10:00","close":"22:00"},"thu":{"open":"10:00","close":"22:00"},"fri":{"open":"10:00","close":"22:30"},"sat":{"open":"10:00","close":"22:30"},"sun":{"open":"10:00","close":"22:00"}}', 4.9);