-- 先创建通用的 updated_at 更新函数
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 创建商户角色枚举
CREATE TYPE public.merchant_role AS ENUM ('owner', 'manager', 'staff');

-- 创建用户 profiles 表
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  is_merchant BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 创建商户员工关联表 (支持一个商户有多个员工)
CREATE TABLE public.merchant_staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID REFERENCES public.merchants(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role merchant_role NOT NULL DEFAULT 'staff',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(merchant_id, user_id)
);

-- 启用 RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchant_staff ENABLE ROW LEVEL SECURITY;

-- Profiles RLS 策略
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Merchant Staff RLS 策略
CREATE POLICY "Staff can view their merchant associations"
  ON public.merchant_staff FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Owners can view all staff in their store"
  ON public.merchant_staff FOR SELECT
  USING (
    merchant_id IN (
      SELECT ms.merchant_id FROM public.merchant_staff ms
      WHERE ms.user_id = auth.uid() AND ms.role = 'owner'
    )
  );

CREATE POLICY "Owners can insert staff"
  ON public.merchant_staff FOR INSERT
  WITH CHECK (
    merchant_id IN (
      SELECT ms.merchant_id FROM public.merchant_staff ms
      WHERE ms.user_id = auth.uid() AND ms.role = 'owner'
    )
  );

CREATE POLICY "Owners can update staff"
  ON public.merchant_staff FOR UPDATE
  USING (
    merchant_id IN (
      SELECT ms.merchant_id FROM public.merchant_staff ms
      WHERE ms.user_id = auth.uid() AND ms.role = 'owner'
    )
  );

CREATE POLICY "Owners can delete staff"
  ON public.merchant_staff FOR DELETE
  USING (
    merchant_id IN (
      SELECT ms.merchant_id FROM public.merchant_staff ms
      WHERE ms.user_id = auth.uid() AND ms.role = 'owner'
    )
  );

-- 更新 profiles 的 updated_at 触发器
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 更新 merchant_staff 的 updated_at 触发器  
CREATE TRIGGER update_merchant_staff_updated_at
  BEFORE UPDATE ON public.merchant_staff
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 创建自动创建 profile 的函数
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 创建触发器：新用户注册时自动创建 profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 创建获取当前用户商户信息的函数
CREATE OR REPLACE FUNCTION public.get_user_merchant()
RETURNS TABLE (
  merchant_id UUID,
  merchant_name TEXT,
  merchant_name_en TEXT,
  is_online BOOLEAN,
  role merchant_role,
  rating NUMERIC
) AS $$
  SELECT 
    m.id AS merchant_id,
    m.name AS merchant_name,
    m.name_en AS merchant_name_en,
    m.is_online,
    ms.role,
    m.rating
  FROM public.merchant_staff ms
  JOIN public.merchants m ON m.id = ms.merchant_id
  WHERE ms.user_id = auth.uid()
    AND ms.is_active = true;
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public;

-- 创建商户注册函数
CREATE OR REPLACE FUNCTION public.register_merchant(
  p_name TEXT,
  p_address TEXT,
  p_latitude DOUBLE PRECISION,
  p_longitude DOUBLE PRECISION,
  p_phone TEXT DEFAULT NULL,
  p_name_en TEXT DEFAULT NULL,
  p_description TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  v_merchant_id UUID;
  v_user_id UUID;
BEGIN
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', '请先登录');
  END IF;
  
  -- 检查用户是否已经是商户
  IF EXISTS (SELECT 1 FROM public.merchant_staff WHERE user_id = v_user_id) THEN
    RETURN json_build_object('success', false, 'error', '您已经是商户');
  END IF;
  
  -- 创建商户
  INSERT INTO public.merchants (
    name, 
    name_en, 
    address, 
    latitude, 
    longitude, 
    location,
    phone, 
    description,
    user_id
  ) VALUES (
    p_name,
    p_name_en,
    p_address,
    p_latitude,
    p_longitude,
    ST_SetSRID(ST_MakePoint(p_longitude, p_latitude), 4326)::geography,
    p_phone,
    p_description,
    v_user_id
  )
  RETURNING id INTO v_merchant_id;
  
  -- 创建商户员工关联 (owner)
  INSERT INTO public.merchant_staff (merchant_id, user_id, role)
  VALUES (v_merchant_id, v_user_id, 'owner');
  
  -- 更新用户 profile
  UPDATE public.profiles SET is_merchant = true WHERE user_id = v_user_id;
  
  RETURN json_build_object(
    'success', true, 
    'merchant_id', v_merchant_id,
    'message', '商户注册成功'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;