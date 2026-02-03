import { Plus, Flame, Coffee, Leaf, Award, Check, CupSoda } from "lucide-react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { BrandBanner } from "@/components/BrandBanner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { Coupon } from "@/components/CouponFlags";
import { MiniCartBar } from "@/components/MiniCartBar";
import { toast } from "sonner";

// Import coffee images
import coffeeLatte from "@/assets/coffee-latte.jpg";
import coffeeAmericano from "@/assets/coffee-americano.jpg";
import coffeeCappuccino from "@/assets/coffee-cappuccino.jpg";
import coffeeFlatWhite from "@/assets/coffee-flatwhite.jpg";

// 用户可用优惠券（测试数据）
const userCoupons: Coupon[] = [
  { id: "c1", type: "universal", value: 3 },
  { id: "c2", type: "latte", value: 2, applicableProducts: ["hot-latte", "iced-latte"] },
  { id: "c3", type: "americano", value: 2, applicableProducts: ["hot-americano", "iced-americano"] },
];

// 预估配送费（基于LBS）
const ESTIMATED_DELIVERY_FEE = 2;

// 产品数据 - 6款精选咖啡 (bilingual)
const products = [
  {
    id: "hot-americano",
    nameZh: "热美式",
    nameEn: "Hot Americano",
    price: 12,
    image: coffeeAmericano,
    tagLine1Negative: ["烟蒂味", "刷锅水", "纸杯味"],
    tagLine2: "油脂完整 醇厚回甘",
    tagLine2En: "Rich crema, smooth finish",
    tagType: "positive",
    isHot: true,
  },
  {
    id: "iced-americano",
    nameZh: "冰美式",
    nameEn: "Iced Americano",
    price: 12,
    image: coffeeAmericano,
    tagLine1Negative: ["氧化宿味", "淡如寡水"],
    tagLine2: "酸质明亮 清脆鲜爽",
    tagLine2En: "Bright acidity, crisp & fresh",
    tagType: "positive",
  },
  {
    id: "hot-latte",
    nameZh: "热拿铁",
    nameEn: "Hot Latte",
    price: 15,
    image: coffeeLatte,
    tagLine1Negative: ["粗糙奶泡", "焦苦杂味"],
    tagLine2: "奶泡绵密 丝滑平衡",
    tagLine2En: "Silky foam, perfectly balanced",
    tagType: "positive",
    isHot: true,
  },
  {
    id: "iced-latte",
    nameZh: "冰拿铁",
    nameEn: "Iced Latte",
    price: 15,
    image: coffeeLatte,
    tagLine1Negative: ["奶腻齁甜", "水乳分离"],
    tagLine2: "坚果韵律 清晰透亮",
    tagLine2En: "Nutty notes, crystal clear",
    tagType: "positive",
  },
  {
    id: "cappuccino",
    nameZh: "卡布奇诺",
    nameEn: "Cappuccino",
    price: 15,
    image: coffeeCappuccino,
    tagLine1Negative: ["空气口感", "咖味寡淡"],
    tagLine2: "结构蓬松 啡味穿透",
    tagLine2En: "Fluffy structure, bold flavor",
    tagType: "positive",
  },
  {
    id: "flat-white",
    nameZh: "澳白",
    nameEn: "Flat White",
    price: 15,
    image: coffeeFlatWhite,
    tagLine1Negative: ["非拿铁", "厚奶盖", "单浓缩"],
    tagLine2: "极薄奶沫 致密醇厚",
    tagLine2En: "Thin microfoam, rich & dense",
    tagType: "positive",
  },
];

// 计算产品的最佳优惠
const getBestCouponDiscount = (productId: string): number => {
  const applicableCoupons = userCoupons.filter((coupon) => {
    if (coupon.type === "universal") return true;
    if (coupon.applicableProducts?.includes(productId)) return true;
    return false;
  });
  if (applicableCoupons.length === 0) return 0;
  return Math.max(...applicableCoupons.map(c => c.value));
};

// 计算预估到手价
const getEstimatedPrice = (originalPrice: number, productId: string): number => {
  const couponDiscount = getBestCouponDiscount(productId);
  return Math.max(0, originalPrice - couponDiscount) + ESTIMATED_DELIVERY_FEE;
};

const Index = () => {
  const { t } = useLanguage();
  const { items, addItem } = useCart();

  const handleAddToCart = (product: typeof products[0], e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: product.id,
      nameZh: product.nameZh,
      nameEn: product.nameEn,
      price: product.price,
      image: product.image,
    });
    toast.success(t(`+1 ${product.nameZh}`, `+1 ${product.nameEn}`), {
      duration: 800,
    });
  };

  const getQuantityInCart = (productId: string) => {
    const item = items.find((i) => i.id === productId);
    return item?.quantity || 0;
  };

  const getCartSubtotal = () => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getCartCouponDiscount = () => {
    if (items.length === 0) return 0;
    return userCoupons.length > 0 ? Math.max(...userCoupons.map(c => c.value)) : 0;
  };

  const getCartEstimatedTotal = () => {
    if (items.length === 0) return 0;
    const subtotal = getCartSubtotal();
    const discount = getCartCouponDiscount();
    return Math.max(0, subtotal - discount) + ESTIMATED_DELIVERY_FEE;
  };

  return (
    <div className="h-screen flex flex-col page-enter overflow-hidden">
      {/* 固定顶部区域 */}
      <div className="flex-shrink-0">
        <Header />
        <BrandBanner />
        <div className="fog-divider mx-4" />
      </div>

      {/* 可滚动中间区域 */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* Product Grid */}
        <section className="px-4 py-2">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-white/60">
              {t("灵感燃料库", "Inspiration Fuel")}
            </h2>
            <span className="text-[11px] text-white/30">
              {t("硬核咖啡因", "Hardcore Caffeine")}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-1.5 stagger-fade-in">
            {products.map((product) => {
              const couponDiscount = getBestCouponDiscount(product.id);
              const hasCoupon = couponDiscount > 0;
              const estimatedPrice = getEstimatedPrice(product.price, product.id);
              const quantityInCart = getQuantityInCart(product.id);
              
              return (
                <div
                  key={product.id}
                  className="group card-md text-left relative flex flex-col justify-between min-h-[72px] py-1.5 px-2.5"
                >
                  {/* 顶部：商品名 + 价格 */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-baseline gap-1 flex-1 min-w-0">
                      <h3 className="font-semibold text-white text-sm leading-tight">
                        {t(product.nameZh, product.nameEn)}
                      </h3>
                      {product.isHot && (
                        <Flame className="w-3 h-3 text-primary/60 flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex items-start gap-1 flex-shrink-0">
                      <span className="text-white/60 text-[9px] mt-[5px] font-medium">
                        预估到手
                      </span>
                      <span className="text-white font-bold text-lg drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
                        ¥{estimatedPrice}
                      </span>
                    </div>
                  </div>
                  
                  {/* 中间：标签 */}
                  <div className="space-y-0">
                    {/* 第一行标签 - 雾灰色 */}
                    <div className="flex items-center gap-1.5 text-[10px]">
                      {(product as any).tagLine1Negative ? (
                        (product as any).tagLine1Negative.map((tag: string, idx: number) => (
                          <span key={idx} className="flex items-center gap-0.5 text-muted-foreground/70">
                            <span className="text-[8px]">✕</span>{tag}
                          </span>
                        ))
                      ) : (product as any).tagLine1 ? (
                        (product as any).tagLine1.map((tag: string, idx: number) => (
                          <span key={idx} className="text-muted-foreground/70">{tag}</span>
                        ))
                      ) : null}
                    </div>
                    {/* 第二行标签 - 白色文字 */}
                    {(product as any).tagLine2 && (
                      <div className="flex items-center gap-1 text-[10px] text-white/80">
                        <span>{t((product as any).tagLine2, (product as any).tagLine2En)}</span>
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                    )}
                  </div>
                  
                  {/* 底部：交易明细 + 按钮 */}
                  <div className="flex items-center justify-between gap-2">
                    {/* 交易明细 - 容量 + 原价划线 */}
                    <div className="flex items-center gap-1.5 text-[9px] text-white/40 flex-1 min-w-0">
                      <span className="flex items-center gap-0.5 whitespace-nowrap">
                        <CupSoda className="w-2.5 h-2.5" />360ml
                      </span>
                      <span className="whitespace-nowrap">
                        原价 <span className="line-through">¥</span>{product.price}
                      </span>
                    </div>
                    
                    {/* 加号按钮 - 紫色渐变圆形 */}
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      style={{ width: '28px', height: '28px', minWidth: '28px', minHeight: '28px' }}
                      className={`rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 shrink-0 ${
                        quantityInCart > 0 
                          ? "bg-gradient-to-br from-primary via-purple-500 to-violet-600 text-white shadow-[0_0_20px_rgba(127,0,255,0.5)] ring-2 ring-primary/30" 
                          : "bg-gradient-to-br from-primary/80 to-violet-600 text-white hover:shadow-[0_0_15px_rgba(127,0,255,0.4)] hover:scale-105"
                      }`}
                    >
                      {quantityInCart > 0 ? (
                        <span className="text-xs font-bold">{quantityInCart}</span>
                      ) : (
                        <Plus className="w-4 h-4" strokeWidth={2} />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Certification Footer */}
        <section className="px-4 pt-2 pb-4">
          <div className="flex items-center justify-between gap-2">
            {/* 左侧认证图标 */}
            <div className="flex items-center gap-2 text-white/25">
              <div className="flex items-center gap-0.5" title="La Marzocco">
                <Coffee className="w-3 h-3" />
              </div>
              <div className="flex items-center gap-0.5" title="SCA Certified">
                <Award className="w-3 h-3" />
              </div>
              <div className="flex items-center gap-0.5" title="4.0 Milk">
                <div className="flex items-center justify-center w-3 h-3 border border-white/20 rounded-sm text-[5px] font-bold">
                  4.0
                </div>
              </div>
              <div className="flex items-center gap-0.5" title="Eco-Friendly">
                <Leaf className="w-3 h-3" />
              </div>
              <div className="flex items-center gap-0.5" title="Organic">
                <span className="text-[8px]">🌱</span>
              </div>
            </div>
            
            {/* 右侧服务状态 */}
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] text-white/25">
                {t("霸都精品店，全听你调遣！", "Elite cafés at your command!")}
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* 固定底部区域 */}
      <div className="flex-shrink-0">
        <MiniCartBar 
          estimatedTotal={getCartEstimatedTotal()} 
          couponDiscount={getCartCouponDiscount()}
          deliveryFee={ESTIMATED_DELIVERY_FEE}
        />
        <BottomNav />
      </div>
    </div>
  );
};

export default Index;
