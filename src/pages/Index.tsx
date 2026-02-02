import { Plus, Flame, Sparkles, Truck, Ticket, Coffee, Leaf, Award, Check, CupSoda } from "lucide-react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { CouponFlags, Coupon } from "@/components/CouponFlags";
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
    tagLine1Negative: ["烟蒂味", "刷锅水", "纸杯味"], // 红色叉号
    tagLine2: "油脂完整，醇厚回甘",
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
    tagLine1Negative: ["氧化宿味", "淡如寡水"], // 红色叉号
    tagLine2: "酸质明亮，清脆鲜爽",
    tagLine2En: "Bright acidity, crisp & fresh",
    tagType: "positive", // 绿色对号
  },
  {
    id: "hot-latte",
    nameZh: "热拿铁",
    nameEn: "Hot Latte",
    price: 15,
    image: coffeeLatte,
    tagLine1Negative: ["粗糙奶泡", "焦苦杂味"],
    tagLine2: "奶泡绵密，丝滑平衡",
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
    tagLine2: "坚果韵律，清晰透亮",
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
    tagLine2: "结构蓬松，啡味穿透",
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
    tagLine2: "极薄奶沫，致密醇厚",
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

  const totalCoupons = userCoupons.length;

  return (
    <div className="min-h-screen pb-16 page-enter bg-background">
      <Header />

      {/* Brand Header - Enhanced hierarchy */}
      <section className="px-4 pt-4 pb-3 hero-reveal">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-foreground tracking-tight">KAKAGO</h1>
              <Sparkles className="w-4 h-4 text-primary float-subtle" />
            </div>
            <p className="text-xs text-muted-foreground mt-1 font-medium tracking-wide">
              {t("不贵精品，即刻上瘾！", "Premium taste, instant addiction!")}
            </p>
          </div>
          {totalCoupons > 0 && <CouponFlags coupons={userCoupons} />}
        </div>
      </section>

      <div className="fog-divider mx-4 opacity-50" />

      {/* Section Header - Clear hierarchy */}
      <section className="px-4 pt-3 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-primary rounded-full" />
            <h2 className="text-sm font-semibold text-foreground tracking-tight">
              {t("灵感燃料库", "Inspiration Fuel")}
            </h2>
          </div>
          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
            {t("硬核咖啡因", "Hardcore Caffeine")}
          </span>
        </div>
      </section>

      {/* Product Grid - Enhanced cards */}
      <section className="px-4 py-1">
        <div className="grid grid-cols-2 gap-2 stagger-fade-in">
          {products.map((product) => {
            const couponDiscount = getBestCouponDiscount(product.id);
            const hasCoupon = couponDiscount > 0;
            const estimatedPrice = getEstimatedPrice(product.price, product.id);
            const quantityInCart = getQuantityInCart(product.id);
            
            return (
              <div
                key={product.id}
                className="group relative flex flex-col justify-between min-h-[88px] p-3 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300"
              >
                {/* Primary Row: Name + Price - Strong hierarchy */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    <h3 className="font-bold text-foreground text-sm leading-tight tracking-tight">
                      {t(product.nameZh, product.nameEn)}
                    </h3>
                    {product.isHot && (
                      <Flame className="w-3 h-3 text-primary flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex flex-col items-end flex-shrink-0">
                    <span className="text-primary font-black text-lg leading-none">
                      ¥{estimatedPrice}
                    </span>
                    <span className="text-muted-foreground text-[10px] line-through opacity-60">
                      ¥{product.price}
                    </span>
                  </div>
                </div>
                
                {/* Secondary Row: Tags - Clear visual distinction */}
                <div className="mt-2 space-y-1">
                  {/* Negative tags */}
                  <div className="flex items-center gap-2 text-[10px]">
                    {(product as any).tagLine1Negative?.map((tag: string, idx: number) => (
                      <span key={idx} className="flex items-center gap-0.5 text-destructive/70 font-medium">
                        <span className="text-[8px]">✕</span>{tag}
                      </span>
                    ))}
                  </div>
                  {/* Positive tag */}
                  {(product as any).tagLine2 && (
                    <div className="flex items-center gap-1 text-[10px]">
                      <span className="text-muted-foreground font-medium">
                        {t((product as any).tagLine2, (product as any).tagLine2En)}
                      </span>
                      <Check className="w-3 h-3 text-emerald-500" />
                    </div>
                  )}
                </div>
                
                {/* Tertiary Row: Details + Action - Subdued support info */}
                <div className="flex items-center justify-between mt-auto pt-2 gap-2">
                  <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground/70 flex-1 min-w-0">
                    <span className="flex items-center gap-0.5">
                      <CupSoda className="w-2.5 h-2.5" />360ml
                    </span>
                    {hasCoupon && (
                      <span className="flex items-center gap-0.5 text-primary/80">
                        <Ticket className="w-2.5 h-2.5" />-¥{couponDiscount}
                      </span>
                    )}
                    <span className="flex items-center gap-0.5">
                      <Truck className="w-2.5 h-2.5" />+¥{ESTIMATED_DELIVERY_FEE}
                    </span>
                  </div>
                  
                  {/* CTA Button - Highest interaction priority */}
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 shrink-0 ${
                      quantityInCart > 0 
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" 
                        : "bg-secondary/80 text-muted-foreground hover:bg-primary hover:text-primary-foreground border border-border/50"
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

      {/* Certification Footer - Subtle trust signals */}
      <section className="px-4 pt-4 pb-16">
        <div className="flex items-center justify-between gap-2 py-2 border-t border-border/30">
          {/* Trust badges */}
          <div className="flex items-center gap-3 text-muted-foreground/40">
            <Coffee className="w-3.5 h-3.5" />
            <Award className="w-3.5 h-3.5" />
            <div className="flex items-center justify-center w-3.5 h-3.5 border border-muted-foreground/30 rounded text-[6px] font-bold">
              4.0
            </div>
            <Leaf className="w-3.5 h-3.5" />
            <span className="text-[9px]">🌱</span>
          </div>
          
          {/* Service status */}
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] text-muted-foreground/50 font-medium">
              {t("霸都精品店，全听你调遣！", "Elite cafés at your command!")}
            </span>
          </div>
        </div>
      </section>

      <MiniCartBar 
        estimatedTotal={getCartEstimatedTotal()} 
        couponDiscount={getCartCouponDiscount()}
        deliveryFee={ESTIMATED_DELIVERY_FEE}
      />
      <BottomNav />
    </div>
  );
};

export default Index;
