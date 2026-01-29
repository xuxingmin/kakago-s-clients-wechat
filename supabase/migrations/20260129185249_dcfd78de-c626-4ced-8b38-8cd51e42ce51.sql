-- 为商户表添加店家寄语字段
ALTER TABLE public.merchants 
ADD COLUMN IF NOT EXISTS greeting_message text;

-- 添加字段注释
COMMENT ON COLUMN public.merchants.greeting_message IS '店家寄语，显示在订单追踪页面';