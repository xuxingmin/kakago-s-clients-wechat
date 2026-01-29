import { Plus, Flame, Ticket } from "lucide-react";
import kakagoLogo from "@/assets/kakago-logo.png";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { FloatingCart } from "@/components/FloatingCart";
import { BrandStandardsGrid } from "@/components/BrandStandardsGrid";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

// Import coffee images
import coffeeLatte from "@/assets/coffee-latte.jpg";
import coffeeAmericano from "@/assets/coffee-americano.jpg";
import coffeeCappuccino from "@/assets/coffee-cappuccino.jpg";
import coffeeFlatWhite from "@/assets/coffee-flatwhite.jpg";

// 优惠券类型
interface Coupon {
  id: string;
  type: "universal" | "americano" | "latte" | "cappuccino";
  value: number;
  applicableProducts?: string[];
}

// 用户可用优惠券（测试：空数组模拟无优惠券场景）
const userCoupons: Coupon[] = [];

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

// 精准计算产品的最佳优惠价（选择最高折扣的优惠券）
const getBestDiscount = (productId: string, originalPrice: number): number | null => {
  const applicableCoupons = userCoupons.filter((coupon) => {
    if (coupon.type === "universal") return true;
    if (coupon.applicableProducts?.includes(productId)) return true;
    return false;
  });

  if (applicableCoupons.length === 0) return null;

  const maxDiscount = Math.max(...applicableCoupons.map(c => c.value));
  const finalPrice = Math.max(0, originalPrice - maxDiscount);
  
  return finalPrice < originalPrice ? finalPrice : null;
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
            <img 
              src={kakagoLogo} 
              alt="KAKAGO" 
              className="h-7 w-auto object-contain"
            />
            <p className="text-sm text-white/45 mt-1.5 font-light tracking-wide">
              {t("可负担的精品咖啡", "Affordable Specialty Coffee")}
            </p>
          </div>
          {/* Coupon Badge */}
          {totalCoupons > 0 && (
            <div className="flex items-center gap-1.5 bg-primary/15 border border-primary/20 px-3.5 py-2 rounded-full backdrop-blur-sm">
              <Ticket className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs text-primary font-medium">
                {totalCoupons}{t("张券", " Coupons")}
              </span>
            </div>
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
            const discountedPrice = getBestDiscount(product.id, product.price);
            const hasDiscount = discountedPrice !== null;
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
                  
                  {/* Price */}
                  <div className="flex flex-col items-end">
                    <div className="flex items-baseline gap-1.5">
                      {hasDiscount && (
                        <span className="text-white/30 text-xs line-through">
                          ¥{product.price}
                        </span>
                      )}
                      <span className="text-primary font-bold text-base">
                        ¥{hasDiscount ? discountedPrice : product.price}
                      </span>
                    </div>
                    {hasDiscount && (
                      <span className="text-primary/60 text-[10px] mt-0.5 font-light">
                        {t("券后到手", "After coupon")}
                      </span>
                    )}
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
