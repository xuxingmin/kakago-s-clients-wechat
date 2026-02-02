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
    tagLine1Negative: ["烟蒂味", "刷锅水", "纸杯味"],
    tagLine2: "油脂完整 醇厚回甘",
    tagLine2En: "Rich crema smooth finish",
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
    tagLine2En: "Bright acidity crisp fresh",
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
    tagLine2En: "Silky foam perfectly balanced",
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
    tagLine2En: "Nutty notes crystal clear",
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
    tagLine2En: "Fluffy structure bold flavor",
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
    tagLine2En: "Thin microfoam rich dense",
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

      {/* Brand Header */}
      <section className="px-4 pt-3 pb-3 hero-reveal">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground tracking-tight">KAKAGO</h1>
              <Sparkles className="w-4 h-4 text-primary/60 float-subtle" />
            </div>
            <p className="text-sm text-muted-foreground mt-0.5 font-light">
              {t("不贵精品，即刻上瘾！", "Premium taste, instant addiction!")}
            </p>
          </div>
          {totalCoupons > 0 && <CouponFlags coupons={userCoupons} />}
        </div>
      </section>

      <div className="fog-divider mx-4" />

      {/* Product Grid */}
      <section className="px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-muted-foreground">
            {t("灵感燃料库", "Inspiration Fuel")}
          </h2>
          <span className="text-[11px] text-muted-foreground/50">
            {t("硬核咖啡因", "Hardcore Caffeine")}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 stagger-fade-in">
          {products.map((product) => {
            const couponDiscount = getBestCouponDiscount(product.id);
            const hasCoupon = couponDiscount > 0;
            const estimatedPrice = getEstimatedPrice(product.price, product.id);
            const quantityInCart = getQuantityInCart(product.id);
            
            return (
              <div
                key={product.id}
                className="group card-md text-left relative flex flex-col justify-between min-h-[100px] py-2.5 px-3"
              >
                {/* 第一行：商品名 + 价格区 */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-sm leading-tight">
                      {t(product.nameZh, product.nameEn)}
                    </h3>
                    {product.isHot && (
                      <Flame className="w-3 h-3 text-primary/60 flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex flex-col items-end flex-shrink-0">
                    <span className="text-muted-foreground/40 text-[10px] line-through">
                      ¥{product.price}
                    </span>
                    <span className="text-primary font-bold text-xl leading-tight">
                      ¥{estimatedPrice}
                    </span>
                  </div>
                </div>
                
                {/* 第二行：完整价格公式 */}
                <div className="flex items-center gap-1 text-[9px] mt-1">
                  <span className="text-muted-foreground/40">原价¥{product.price}</span>
                  <span className="text-muted-foreground/30">-</span>
                  {hasCoupon && (
                    <>
                      <span className="flex items-center gap-0.5 text-primary/80">
                        <Ticket className="w-2.5 h-2.5" />¥{couponDiscount}
                      </span>
                      <span className="text-muted-foreground/30">+</span>
                    </>
                  )}
                  <span className="flex items-center gap-0.5 text-muted-foreground/40">
                    <Truck className="w-2.5 h-2.5" />¥{ESTIMATED_DELIVERY_FEE}
                  </span>
                  <span className="text-muted-foreground/30">=</span>
                  <span className="text-muted-foreground/50">{t("到手价", "Final")}</span>
                </div>
                
                {/* 第三行：负面标签 */}
                <div className="flex items-center gap-2 text-[10px] mt-1.5">
                  {(product as any).tagLine1Negative?.map((tag: string, idx: number) => (
                    <span key={idx} className="flex items-center gap-0.5">
                      <span className="text-destructive/70 text-[9px] font-medium">✕</span>
                      <span className="text-muted-foreground/40">{tag}</span>
                    </span>
                  ))}
                </div>
                
                {/* 第四行：正面标签 */}
                {(product as any).tagLine2 && (
                  <div className="flex items-center gap-1 text-[10px] mt-0.5">
                    <Check className="w-3 h-3 text-primary/70" />
                    <span className="text-muted-foreground/50">{t((product as any).tagLine2, (product as any).tagLine2En)}</span>
                  </div>
                )}
                
                {/* 第五行：容量 + 加号按钮 */}
                <div className="flex items-center justify-between mt-auto pt-1">
                  <span className="flex items-center gap-0.5 text-[9px] text-muted-foreground/40">
                    <CupSoda className="w-2.5 h-2.5" />360ml
                  </span>
                  
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    style={{ width: '32px', height: '32px', minWidth: '32px', minHeight: '32px' }}
                    className={`rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 shrink-0 ${
                      quantityInCart > 0 
                        ? "bg-gradient-to-br from-primary to-purple-600 text-primary-foreground shadow-purple" 
                        : "bg-secondary text-muted-foreground hover:bg-primary hover:text-primary-foreground border border-border"
                    }`}
                  >
                    {quantityInCart > 0 ? (
                      <span className="text-xs font-bold">{quantityInCart}</span>
                    ) : (
                      <Plus className="w-4 h-4" strokeWidth={1.5} />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Certification Footer */}
      <section className="px-4 pt-3 pb-16">
        <div className="flex items-center justify-between gap-2">
          {/* 左侧认证图标 */}
          <div className="flex items-center gap-2.5 text-muted-foreground/40">
            <div className="flex items-center gap-0.5" title="La Marzocco">
              <Coffee className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center gap-0.5" title="SCA Certified">
              <Award className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center gap-0.5" title="4.0 Milk">
              <div className="flex items-center justify-center w-3.5 h-3.5 border border-muted-foreground/30 rounded-sm text-[6px] font-bold">
                4.0
              </div>
            </div>
            <div className="flex items-center gap-0.5" title="Eco-Friendly">
              <Leaf className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center gap-0.5" title="Organic">
              <span className="text-[9px]">🌱</span>
            </div>
          </div>
          
          {/* 右侧服务状态 */}
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] text-muted-foreground/40">
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
