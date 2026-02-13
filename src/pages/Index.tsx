import { Coffee, Leaf, Award } from "lucide-react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { BrandBanner } from "@/components/BrandBanner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { Coupon } from "@/components/CouponFlags";
import { MiniCartBar } from "@/components/MiniCartBar";
import { CompactProductCard } from "@/components/CompactProductCard";
import { CreativeProductCard } from "@/components/CreativeProductCard";
import { toast } from "sonner";

// Import coffee images
import coffeeLatte from "@/assets/coffee-latte.jpg";
import coffeeAmericano from "@/assets/coffee-americano.jpg";
import coffeeCappuccino from "@/assets/coffee-cappuccino.jpg";
import coffeeFlatWhite from "@/assets/coffee-flatwhite.jpg";
import coffeeDirty from "@/assets/coffee-dirty.jpg";
import coffeeMatcha from "@/assets/coffee-matcha.jpg";
import coffeeCoconut from "@/assets/coffee-coconut.jpg";
import coffeeRose from "@/assets/coffee-rose.jpg";

// 用户可用优惠券（测试数据）
const userCoupons: Coupon[] = [
  { id: "c1", type: "universal", value: 3 },
  { id: "c2", type: "latte", value: 2, applicableProducts: ["hot-latte", "iced-latte"] },
  { id: "c3", type: "americano", value: 2, applicableProducts: ["hot-americano", "iced-americano"] },
];

const ESTIMATED_DELIVERY_FEE = 2;

// 经典咖啡 - 紧凑卡片
const classicProducts = [
  {
    id: "hot-americano",
    nameZh: "热美式",
    nameEn: "Hot Americano",
    price: 12,
    image: coffeeAmericano,
    tagLine1Negative: ["烟蒂味", "刷锅水", "纸杯味"],
    tagLine2: "油脂完整 醇厚回甘",
    tagLine2En: "Rich crema, smooth finish",
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
  },
];

// 创意特调 - 大图卡片
const creativeProducts = [
  {
    id: "dirty-coffee",
    nameZh: "脏脏咖啡",
    nameEn: "Dirty Coffee",
    price: 18,
    image: coffeeDirty,
    descZh: "巧克力瀑布 · 浓缩碰撞冰牛乳",
    descEn: "Chocolate cascade · espresso meets iced milk",
  },
  {
    id: "matcha-latte",
    nameZh: "抹茶拿铁",
    nameEn: "Matcha Latte",
    price: 18,
    image: coffeeMatcha,
    descZh: "宇治抹茶 · 丝滑牛乳交融",
    descEn: "Uji matcha · silky milk fusion",
  },
  {
    id: "coconut-latte",
    nameZh: "生椰拿铁",
    nameEn: "Coconut Latte",
    price: 16,
    image: coffeeCoconut,
    descZh: "鲜榨椰浆 · 热带风味咖啡",
    descEn: "Fresh coconut milk · tropical coffee",
  },
  {
    id: "rose-latte",
    nameZh: "玫瑰拿铁",
    nameEn: "Rose Latte",
    price: 18,
    image: coffeeRose,
    descZh: "重瓣玫瑰 · 花香萦绕奶咖",
    descEn: "Damask rose · floral milk coffee",
  },
];

// All products combined for cart logic
const allProducts = [
  ...classicProducts.map(p => ({ id: p.id, nameZh: p.nameZh, nameEn: p.nameEn, price: p.price, image: p.image })),
  ...creativeProducts.map(p => ({ id: p.id, nameZh: p.nameZh, nameEn: p.nameEn, price: p.price, image: p.image })),
];

const getBestCouponDiscount = (productId: string): number => {
  const applicableCoupons = userCoupons.filter((coupon) => {
    if (coupon.type === "universal") return true;
    if (coupon.applicableProducts?.includes(productId)) return true;
    return false;
  });
  if (applicableCoupons.length === 0) return 0;
  return Math.max(...applicableCoupons.map(c => c.value));
};

const getEstimatedPrice = (originalPrice: number, productId: string): number => {
  const couponDiscount = getBestCouponDiscount(productId);
  return Math.max(0, originalPrice - couponDiscount) + ESTIMATED_DELIVERY_FEE;
};

const Index = () => {
  const { t } = useLanguage();
  const { items, addItem } = useCart();

  const handleAddToCart = (product: { id: string; nameZh: string; nameEn: string; price: number; image: string }, e: React.MouseEvent) => {
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
        {/* Classic Product Grid - 紧凑卡片 */}
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
            {classicProducts.map((product) => (
              <CompactProductCard
                key={product.id}
                product={product}
                estimatedPrice={getEstimatedPrice(product.price, product.id)}
                quantityInCart={getQuantityInCart(product.id)}
                onAddToCart={(e) => handleAddToCart(product, e)}
              />
            ))}
          </div>
        </section>

        {/* Creative Products - 大图卡片 */}
        <section className="px-4 pt-1 pb-2">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-white/60">
              {t("创意特调", "Creative Specials")}
            </h2>
            <span className="text-[11px] text-white/30">
              {t("灵感碰撞", "Inspired Blends")}
            </span>
          </div>

          {/* Masonry-like layout: 1 large + 1 medium, then 2 small */}
          <div className="grid grid-cols-5 gap-1.5">
            {/* Row 1: Large card (3/5) + Medium card (2/5) */}
            <div className="col-span-3">
              <CreativeProductCard
                product={creativeProducts[0]}
                estimatedPrice={getEstimatedPrice(creativeProducts[0].price, creativeProducts[0].id)}
                quantityInCart={getQuantityInCart(creativeProducts[0].id)}
                onAddToCart={(e) => handleAddToCart(creativeProducts[0], e)}
                size="large"
              />
            </div>
            <div className="col-span-2">
              <CreativeProductCard
                product={creativeProducts[1]}
                estimatedPrice={getEstimatedPrice(creativeProducts[1].price, creativeProducts[1].id)}
                quantityInCart={getQuantityInCart(creativeProducts[1].id)}
                onAddToCart={(e) => handleAddToCart(creativeProducts[1], e)}
                size="large"
              />
            </div>

            {/* Row 2: Two equal cards */}
            <div className="col-span-2">
              <CreativeProductCard
                product={creativeProducts[2]}
                estimatedPrice={getEstimatedPrice(creativeProducts[2].price, creativeProducts[2].id)}
                quantityInCart={getQuantityInCart(creativeProducts[2].id)}
                onAddToCart={(e) => handleAddToCart(creativeProducts[2], e)}
                size="medium"
              />
            </div>
            <div className="col-span-3">
              <CreativeProductCard
                product={creativeProducts[3]}
                estimatedPrice={getEstimatedPrice(creativeProducts[3].price, creativeProducts[3].id)}
                quantityInCart={getQuantityInCart(creativeProducts[3].id)}
                onAddToCart={(e) => handleAddToCart(creativeProducts[3], e)}
                size="medium"
              />
            </div>
          </div>
        </section>

        {/* Certification Footer */}
        <section className="px-4 pt-2 pb-4">
          <div className="flex items-center justify-between gap-2">
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
