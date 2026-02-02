import { Plus, Flame, Sparkles, Truck, Ticket } from "lucide-react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { FloatingCart } from "@/components/FloatingCart";
import { BrandStandardsGrid } from "@/components/BrandStandardsGrid";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { CouponFlags, Coupon } from "@/components/CouponFlags";

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
const ESTIMATED_DELIVERY_FEE = 5;

// 产品数据 - 6款精选咖啡 (bilingual)
const products = [
  {
    id: "hot-americano",
    nameZh: "热美式",
    nameEn: "Hot Americano",
    price: 12,
    image: coffeeAmericano,
    tagZh: "单一产地精品豆",
    tagEn: "Single Origin Beans",
    isHot: true,
  },
  {
    id: "iced-americano",
    nameZh: "冰美式",
    nameEn: "Iced Americano",
    price: 12,
    image: coffeeAmericano,
    tagZh: "清爽冰饮",
    tagEn: "Refreshing & Cool",
  },
  {
    id: "hot-latte",
    nameZh: "热拿铁",
    nameEn: "Hot Latte",
    price: 15,
    image: coffeeLatte,
    tagZh: "丝滑醇厚",
    tagEn: "Silky & Rich",
    isHot: true,
  },
  {
    id: "iced-latte",
    nameZh: "冰拿铁",
    nameEn: "Iced Latte",
    price: 15,
    image: coffeeLatte,
    tagZh: "4.0高蛋白牛奶",
    tagEn: "4.0 High-Protein Milk",
  },
  {
    id: "cappuccino",
    nameZh: "卡布奇诺",
    nameEn: "Cappuccino",
    price: 15,
    image: coffeeCappuccino,
    tagZh: "绵密奶泡",
    tagEn: "Creamy Foam",
  },
  {
    id: "flat-white",
    nameZh: "澳白",
    nameEn: "Flat White",
    price: 15,
    image: coffeeFlatWhite,
    tagZh: "浓缩精萃",
    tagEn: "Intense Espresso",
  },
];

// 计算产品的最佳优惠（自动选择最高面额的可用券）
const getBestCouponDiscount = (productId: string): number => {
  const applicableCoupons = userCoupons.filter((coupon) => {
    if (coupon.type === "universal") return true;
    if (coupon.applicableProducts?.includes(productId)) return true;
    return false;
  });

  if (applicableCoupons.length === 0) return 0;
  return Math.max(...applicableCoupons.map(c => c.value));
};

// 计算预估到手价：原价 - 券 + 配送费
const getEstimatedPrice = (originalPrice: number, productId: string): number => {
  const couponDiscount = getBestCouponDiscount(productId);
  return Math.max(0, originalPrice - couponDiscount) + ESTIMATED_DELIVERY_FEE;
};

const Index = () => {
  const { t } = useLanguage();
  const { addItem, items } = useCart();

  const handleProductSelect = (product: typeof products[0]) => {
    addItem({
      id: product.id,
      nameZh: product.nameZh,
      nameEn: product.nameEn,
      price: product.price,
      image: product.image,
    });
    toast.success(t(`已添加 ${product.nameZh}`, `Added ${product.nameEn}`), {
      duration: 1500,
    });
  };

  const getQuantityInCart = (productId: string) => {
    const item = items.find((i) => i.id === productId);
    return item?.quantity || 0;
  };

  const totalCoupons = userCoupons.length;

  return (
    <div className="min-h-screen pb-20 page-enter">
      <Header />

      {/* Minimal Brand Header - Hero Reveal */}
      <section className="px-4 pt-6 pb-5 hero-reveal">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">KAKAGO</h1>
              <Sparkles className="w-4 h-4 text-primary/60 float-subtle" />
            </div>
            <p className="text-sm text-white/45 mt-1 font-light tracking-wide">
              {t("可负担的精品咖啡", "Affordable Specialty Coffee")}
            </p>
          </div>
          {/* Coupon Flags - 旗帜式优惠券展示 */}
          {totalCoupons > 0 && (
            <CouponFlags coupons={userCoupons} />
          )}
        </div>
      </section>

      {/* Elegant Divider */}
      <div className="fog-divider mx-4" />

      {/* Product List with Stagger Animation */}
      <section className="px-4 py-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-white/60 tracking-wide">
            {t("每天都要喝", "Daily Must-Have")}
          </h2>
          <span className="text-xs text-white/35 font-light">
            {t("专业咖啡师出品", "Crafted by Pro Baristas")}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-2.5 stagger-fade-in">
          {products.map((product) => {
            const couponDiscount = getBestCouponDiscount(product.id);
            const hasCoupon = couponDiscount > 0;
            const estimatedPrice = getEstimatedPrice(product.price, product.id);
            const quantityInCart = getQuantityInCart(product.id);
            
            return (
              <button
                key={product.id}
                onClick={() => handleProductSelect(product)}
                className="group card-md text-left relative ripple"
              >
                <div className="flex items-start justify-between relative z-10">
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-semibold text-white text-sm group-hover:text-primary transition-colors duration-300">
                        {t(product.nameZh, product.nameEn)}
                      </h3>
                      {product.isHot && (
                        <Flame className="w-3 h-3 text-orange-400/80" />
                      )}
                    </div>
                    <p className="text-[11px] text-white/35 mt-1 truncate font-light">
                      {t(product.tagZh, product.tagEn)}
                    </p>
                  </div>
                  
                  {/* Price - 原价(灰色划线靠左) + 预估到手价(紫色靠右) */}
                  <div className="flex items-end gap-3">
                    {/* 原价 - 灰色划线 */}
                    <div className="flex flex-col items-center">
                      <span className="text-[9px] text-white/30 mb-0.5">原价</span>
                      <span className="text-white/35 text-xs line-through">
                        ¥{product.price}
                      </span>
                    </div>
                    {/* 预估到手价 = 原价 - 券 + 配送 */}
                    <div className="flex flex-col items-center">
                      <span className="text-[9px] text-primary/60 mb-0.5">预估到手</span>
                      <span className="text-primary font-bold text-base">
                        ¥{estimatedPrice}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* 价格明细 - 券减免 + 配送费 */}
                <div className="flex items-center justify-end gap-1.5 mt-1.5 text-[9px] text-white/40">
                  {hasCoupon && (
                    <div className="flex items-center gap-0.5">
                      <Ticket className="w-2.5 h-2.5 text-primary/70" />
                      <span className="text-primary/70">-{couponDiscount}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-0.5">
                    <Truck className="w-2.5 h-2.5 opacity-60" />
                    <span>+{ESTIMATED_DELIVERY_FEE}元</span>
                  </div>
                </div>
                
                {/* Add Button - Always visible but subtle */}
                <div className={`absolute bottom-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                  quantityInCart > 0 
                    ? "bg-primary text-white shadow-purple scale-100" 
                    : "bg-white/10 text-white/50 group-hover:bg-primary group-hover:text-white group-hover:shadow-purple"
                }`}>
                  <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                  {quantityInCart > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-white text-primary text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
                      {quantityInCart}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Elegant Divider */}
      <div className="fog-divider mx-4" />

      {/* Brand Standards Grid */}
      <BrandStandardsGrid onCartClick={() => (window as any).__openCart?.()} />

      {/* Footer Info */}
      <section className="px-4 py-5">
        <div className="flex items-center justify-between text-[11px] text-white/25 font-light">
          <span>{t("☕ KAKA认证精品咖啡馆出品", "☕ KAKA Certified Specialty Cafés")}</span>
          <span>{t("配送约15-30分钟", "Delivery 15-30 min")}</span>
        </div>
      </section>

      <FloatingCart />
      <BottomNav />
    </div>
  );
};

export default Index;
