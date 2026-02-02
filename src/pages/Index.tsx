import { Plus, Flame, Sparkles, Truck, Ticket } from "lucide-react";
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

  const getCartEstimatedTotal = () => {
    if (items.length === 0) return 0;
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const maxDiscount = userCoupons.length > 0 
      ? Math.max(...userCoupons.map(c => c.value)) 
      : 0;
    return Math.max(0, subtotal - maxDiscount) + ESTIMATED_DELIVERY_FEE;
  };

  const totalCoupons = userCoupons.length;

  return (
    <div className="min-h-screen pb-16 page-enter">
      <Header />

      {/* Brand Header */}
      <section className="px-4 pt-5 pb-4 hero-reveal">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">KAKAGO</h1>
              <Sparkles className="w-4 h-4 text-primary/60 float-subtle" />
            </div>
            <p className="text-sm text-white/45 mt-1 font-light">
              {t("可负担的精品咖啡", "Affordable Specialty Coffee")}
            </p>
          </div>
          {totalCoupons > 0 && <CouponFlags coupons={userCoupons} />}
        </div>
      </section>

      <div className="fog-divider mx-4" />

      {/* Product Grid */}
      <section className="px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-white/60">
            {t("每天都要喝", "Daily Must-Have")}
          </h2>
          <span className="text-[11px] text-white/30">
            {t("专业咖啡师出品", "Pro Baristas")}
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
                className="group card-md text-left relative flex flex-col justify-between min-h-[90px]"
              >
                {/* 顶部：商品名 + 价格 - 基线对齐 */}
                <div className="flex items-baseline justify-between gap-2">
                  <div className="flex items-baseline gap-1 flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-sm leading-tight">
                      {t(product.nameZh, product.nameEn)}
                    </h3>
                    {product.isHot && (
                      <Flame className="w-3 h-3 text-orange-400 flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-baseline gap-1.5 flex-shrink-0">
                    <span className="text-white/30 text-[11px] line-through">
                      ¥{product.price}
                    </span>
                    <span className="text-primary font-bold text-lg">
                      ¥{estimatedPrice}
                    </span>
                  </div>
                </div>
                
                {/* 中间：标签 */}
                <p className="text-[10px] text-white/40 truncate mt-1">
                  {t(product.tagZh, product.tagEn)}
                </p>
                
                {/* 底部：交易明细 + 按钮 */}
                <div className="flex items-center justify-between mt-auto pt-2">
                  {/* 交易明细 - 白色可见 */}
                  <div className="flex items-center gap-2 text-[11px] text-white/60">
                    {hasCoupon && (
                      <span className="flex items-center gap-0.5">
                        <Ticket className="w-3 h-3" />-{couponDiscount}
                      </span>
                    )}
                    <span className="flex items-center gap-0.5">
                      <Truck className="w-3 h-3" />+{ESTIMATED_DELIVERY_FEE}
                    </span>
                  </div>
                  
                  {/* 加号按钮 */}
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 ${
                      quantityInCart > 0 
                        ? "bg-gradient-to-br from-primary to-violet-600 text-white shadow-purple" 
                        : "bg-white/8 text-white/60 hover:bg-primary hover:text-white border border-white/10"
                    }`}
                  >
                    {quantityInCart > 0 ? (
                      <span className="text-sm font-bold">{quantityInCart}</span>
                    ) : (
                      <Plus className="w-5 h-5" strokeWidth={1.5} />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <section className="px-4 pt-2 pb-20">
        <p className="text-center text-[10px] text-white/20">
          {t("☕ KAKA认证精品咖啡馆", "☕ KAKA Certified Cafés")}
        </p>
      </section>

      <MiniCartBar estimatedTotal={getCartEstimatedTotal()} />
      <BottomNav />
    </div>
  );
};

export default Index;
