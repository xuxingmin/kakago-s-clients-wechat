-- 创建订单状态枚举
CREATE TYPE public.order_status AS ENUM (
  'pending',        -- 待接单
  'accepted',       -- 咖啡馆已接单/开始制作
  'rider_assigned', -- 骑手已接单
  'picked_up',      -- 骑手已取货/配送中
  'delivered',      -- 已送达
  'rated',          -- 已评价
  'cancelled'       -- 已取消
);

-- 创建订单表
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  merchant_id UUID REFERENCES public.merchants(id) NOT NULL,
  product_name TEXT NOT NULL,
  product_image TEXT,
  price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  total_amount DECIMAL(10, 2) NOT NULL,
  status order_status NOT NULL DEFAULT 'pending',
  
  -- 配送信息
  delivery_address TEXT NOT NULL,
  delivery_lat DOUBLE PRECISION,
  delivery_lng DOUBLE PRECISION,
  delivery_contact_name TEXT NOT NULL,
  delivery_contact_phone TEXT NOT NULL,
  
  -- 骑手信息 (来自聚合平台)
  rider_name TEXT,
  rider_phone TEXT,
  rider_lat DOUBLE PRECISION,
  rider_lng DOUBLE PRECISION,
  rider_avatar TEXT,
  delivery_platform TEXT, -- 配送平台名称
  delivery_order_id TEXT, -- 平台订单号
  
  -- 时间戳
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  accepted_at TIMESTAMPTZ,
  rider_assigned_at TIMESTAMPTZ,
  picked_up_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 创建订单状态历史表
CREATE TABLE public.order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  status order_status NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 创建订单评分表 (多维度评分)
CREATE TABLE public.order_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL UNIQUE,
  user_id UUID NOT NULL,
  merchant_id UUID REFERENCES public.merchants(id) NOT NULL,
  
  -- 三个维度评分 (1-5)
  taste_rating INTEGER NOT NULL CHECK (taste_rating >= 1 AND taste_rating <= 5),
  packaging_rating INTEGER NOT NULL CHECK (packaging_rating >= 1 AND packaging_rating <= 5),
  timeliness_rating INTEGER NOT NULL CHECK (timeliness_rating >= 1 AND timeliness_rating <= 5),
  
  -- 综合评分 (自动计算)
  overall_rating DECIMAL(2, 1) GENERATED ALWAYS AS (
    (taste_rating + packaging_rating + timeliness_rating)::DECIMAL / 3
  ) STORED,
  
  -- 用户评价
  comment TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 创建商户评分统计表
CREATE TABLE public.merchant_rating_stats (
  merchant_id UUID REFERENCES public.merchants(id) ON DELETE CASCADE PRIMARY KEY,
  total_orders INTEGER NOT NULL DEFAULT 0,
  total_ratings INTEGER NOT NULL DEFAULT 0,
  avg_taste_rating DECIMAL(3, 2) DEFAULT 0,
  avg_packaging_rating DECIMAL(3, 2) DEFAULT 0,
  avg_timeliness_rating DECIMAL(3, 2) DEFAULT 0,
  avg_overall_rating DECIMAL(3, 2) DEFAULT 0,
  -- 用于派单权重计算 (口味+包装为主)
  dispatch_score DECIMAL(3, 2) GENERATED ALWAYS AS (
    (COALESCE(avg_taste_rating, 0) * 0.5 + COALESCE(avg_packaging_rating, 0) * 0.5)
  ) STORED,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 启用 RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchant_rating_stats ENABLE ROW LEVEL SECURITY;

-- 订单表 RLS 策略
CREATE POLICY "Users can view their own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Merchants can view orders for their store"
  ON public.orders FOR SELECT
  USING (merchant_id IN (
    SELECT id FROM public.merchants WHERE user_id = auth.uid()
  ));

CREATE POLICY "Merchants can update orders for their store"
  ON public.orders FOR UPDATE
  USING (merchant_id IN (
    SELECT id FROM public.merchants WHERE user_id = auth.uid()
  ));

-- 订单状态历史 RLS
CREATE POLICY "Users can view their order history"
  ON public.order_status_history FOR SELECT
  USING (order_id IN (
    SELECT id FROM public.orders WHERE user_id = auth.uid()
  ));

-- 评分表 RLS
CREATE POLICY "Users can view all ratings"
  ON public.order_ratings FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own ratings"
  ON public.order_ratings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings"
  ON public.order_ratings FOR UPDATE
  USING (auth.uid() = user_id);

-- 商户评分统计 RLS (公开可读)
CREATE POLICY "Anyone can view merchant stats"
  ON public.merchant_rating_stats FOR SELECT
  USING (true);

-- 创建更新评分统计的函数
CREATE OR REPLACE FUNCTION public.update_merchant_rating_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.merchant_rating_stats (merchant_id, total_ratings, avg_taste_rating, avg_packaging_rating, avg_timeliness_rating, avg_overall_rating)
  SELECT 
    NEW.merchant_id,
    COUNT(*),
    AVG(taste_rating),
    AVG(packaging_rating),
    AVG(timeliness_rating),
    AVG(overall_rating)
  FROM public.order_ratings
  WHERE merchant_id = NEW.merchant_id
  ON CONFLICT (merchant_id) DO UPDATE SET
    total_ratings = EXCLUDED.total_ratings,
    avg_taste_rating = EXCLUDED.avg_taste_rating,
    avg_packaging_rating = EXCLUDED.avg_packaging_rating,
    avg_timeliness_rating = EXCLUDED.avg_timeliness_rating,
    avg_overall_rating = EXCLUDED.avg_overall_rating,
    updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 创建触发器
CREATE TRIGGER on_rating_created
  AFTER INSERT ON public.order_ratings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_merchant_rating_stats();

-- 创建更新订单时间戳的触发器
CREATE OR REPLACE FUNCTION public.update_order_timestamps()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  
  -- 根据状态更新对应时间戳
  IF NEW.status = 'accepted' AND OLD.status = 'pending' THEN
    NEW.accepted_at = now();
  ELSIF NEW.status = 'rider_assigned' AND OLD.status != 'rider_assigned' THEN
    NEW.rider_assigned_at = now();
  ELSIF NEW.status = 'picked_up' AND OLD.status != 'picked_up' THEN
    NEW.picked_up_at = now();
  ELSIF NEW.status = 'delivered' AND OLD.status != 'delivered' THEN
    NEW.delivered_at = now();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER on_order_update
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_order_timestamps();

-- 自动记录状态历史
CREATE OR REPLACE FUNCTION public.record_order_status_history()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.order_status_history (order_id, status, message)
    VALUES (NEW.id, NEW.status, 
      CASE NEW.status
        WHEN 'accepted' THEN '咖啡馆已接单，开始制作'
        WHEN 'rider_assigned' THEN '骑手已接单'
        WHEN 'picked_up' THEN '骑手已取货，配送中'
        WHEN 'delivered' THEN '已送达'
        WHEN 'rated' THEN '已完成评价'
        WHEN 'cancelled' THEN '订单已取消'
        ELSE NULL
      END
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_order_status_change
  AFTER UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.record_order_status_history();

-- 启用实时订阅
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.order_status_history;