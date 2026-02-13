import { Coffee, Leaf, Award, Flame, Snowflake, CloudRain, Sun, Sparkles, TreePalm, Flower2, CupSoda } from "lucide-react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { BrandBanner } from "@/components/BrandBanner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { Coupon } from "@/components/CouponFlags";
import { MiniCartBar } from "@/components/MiniCartBar";
import { ProductTile, ProductTileData } from "@/components/ProductTile";
import { toast } from "sonner";

import coffeeLatte from "@/assets/coffee-latte.jpg";
import coffeeAmericano from "@/assets/coffee-americano.jpg";
import coffeeCappuccino from "@/assets/coffee-cappuccino.jpg";
import coffeeFlatWhite from "@/assets/coffee-flatwhite.jpg";
import coffeeDirty from "@/assets/coffee-dirty.jpg";
import coffeeMatcha from "@/assets/coffee-matcha.jpg";
import coffeeCoconut from "@/assets/coffee-coconut.jpg";
import coffeeRose from "@/assets/coffee-rose.jpg";

const userCoupons: Coupon[] = [
  { id: "c1", type: "universal", value: 3 },
  { id: "c2", type: "latte", value: 2, applicableProducts: ["hot-latte", "iced-latte"] },
  { id: "c3", type: "americano", value: 2, applicableProducts: ["hot-americano", "iced-americano"] },
];

const ESTIMATED_DELIVERY_FEE = 2;

const allProducts: ProductTileData[] = [
  { id: "hot-americano", nameZh: "热美式", nameEn: "Hot Americano", price: 12, image: coffeeAmericano, icon: Flame, iconColor: "text-orange-400", iconBg: "bg-orange-400/15", tagZh: "油脂完整 醇厚回甘", tagEn: "Rich crema, smooth finish" },
  { id: "iced-americano", nameZh: "冰美式", nameEn: "Iced Americano", price: 12, image: coffeeAmericano, icon: Snowflake, iconColor: "text-sky-400", iconBg: "bg-sky-400/15", tagZh: "酸质明亮 清脆鲜爽", tagEn: "Bright acidity, crisp & fresh" },
  { id: "hot-latte", nameZh: "热拿铁", nameEn: "Hot Latte", price: 15, image: coffeeLatte, icon: Coffee, iconColor: "text-amber-400", iconBg: "bg-amber-400/15", tagZh: "奶泡绵密 丝滑平衡", tagEn: "Silky foam, perfectly balanced" },
  { id: "iced-latte", nameZh: "冰拿铁", nameEn: "Iced Latte", price: 15, image: coffeeLatte, icon: CloudRain, iconColor: "text-cyan-400", iconBg: "bg-cyan-400/15", tagZh: "坚果韵律 清晰透亮", tagEn: "Nutty notes, crystal clear" },
  { id: "cappuccino", nameZh: "卡布奇诺", nameEn: "Cappuccino", price: 15, image: coffeeCappuccino, icon: Sun, iconColor: "text-yellow-400", iconBg: "bg-yellow-400/15", tagZh: "结构蓬松 啡味穿透", tagEn: "Fluffy structure, bold flavor" },
  { id: "flat-white", nameZh: "澳白", nameEn: "Flat White", price: 15, image: coffeeFlatWhite, icon: CupSoda, iconColor: "text-stone-300", iconBg: "bg-stone-300/15", tagZh: "极薄奶沫 致密醇厚", tagEn: "Thin microfoam, rich & dense" },
  { id: "dirty-coffee", nameZh: "脏脏咖啡", nameEn: "Dirty Coffee", price: 18, image: coffeeDirty, icon: Sparkles, iconColor: "text-violet-400", iconBg: "bg-violet-400/15", descZh: "巧克力瀑布 · 浓缩碰撞冰牛乳", descEn: "Chocolate cascade meets iced milk" },
  { id: "matcha-latte", nameZh: "抹茶拿铁", nameEn: "Matcha Latte", price: 18, image: coffeeMatcha, icon: Leaf, iconColor: "text-emerald-400", iconBg: "bg-emerald-400/15", descZh: "宇治抹茶 · 丝滑牛乳交融", descEn: "Uji matcha · silky milk fusion" },
  { id: "coconut-latte", nameZh: "生椰拿铁", nameEn: "Coconut Latte", price: 16, image: coffeeCoconut, icon: TreePalm, iconColor: "text-lime-400", iconBg: "bg-lime-400/15", descZh: "鲜榨椰浆 · 热带风味咖啡", descEn: "Fresh coconut · tropical coffee" },
  { id: "rose-latte", nameZh: "玫瑰拿铁", nameEn: "Rose Latte", price: 18, image: coffeeRose, icon: Flower2, iconColor: "text-pink-400", iconBg: "bg-pink-400/15", descZh: "重瓣玫瑰 · 花香萦绕奶咖", descEn: "Damask rose · floral milk coffee" },
];

const getBestCouponDiscount = (productId: string): number => {
  const applicable = userCoupons.filter((c) => c.type === "universal" || c.applicableProducts?.includes(productId));
  return applicable.length === 0 ? 0 : Math.max(...applicable.map(c => c.value));
};

const getEstimatedPrice = (price: number, id: string): number =>
  Math.max(0, price - getBestCouponDiscount(id)) + ESTIMATED_DELIVERY_FEE;

const Index = () => {
  const { t } = useLanguage();
  const { items, addItem } = useCart();

  const add = (product: ProductTileData, e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({ id: product.id, nameZh: product.nameZh, nameEn: product.nameEn, price: product.price, image: product.image });
    toast.success(t(`+1 ${product.nameZh}`, `+1 ${product.nameEn}`), { duration: 800 });
  };

  const qty = (id: string) => items.find(i => i.id === id)?.quantity || 0;

  const cartSubtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const cartDiscount = items.length === 0 ? 0 : (userCoupons.length > 0 ? Math.max(...userCoupons.map(c => c.value)) : 0);
  const cartTotal = items.length === 0 ? 0 : Math.max(0, cartSubtotal - cartDiscount) + ESTIMATED_DELIVERY_FEE;

  return (
    <div className="h-screen flex flex-col page-enter overflow-hidden">
      <div className="flex-shrink-0">
        <Header />
        <BrandBanner />
        <div className="fog-divider mx-4" />
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <section className="px-4 py-2">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-white/60">
              {t("灵感燃料库", "Inspiration Fuel")}
            </h2>
            <span className="text-[11px] text-white/30">
              {t("10款精选", "10 Picks")}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 stagger-fade-in">
            {allProducts.map((product) => (
              <ProductTile
                key={product.id}
                product={product}
                estimatedPrice={getEstimatedPrice(product.price, product.id)}
                quantityInCart={qty(product.id)}
                onAddToCart={(e) => add(product, e)}
              />
            ))}
          </div>
        </section>

        <section className="px-4 pt-2 pb-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-white/25">
              <Coffee className="w-3 h-3" />
              <Award className="w-3 h-3" />
              <div className="flex items-center justify-center w-3 h-3 border border-white/20 rounded-sm text-[5px] font-bold">4.0</div>
              <Leaf className="w-3 h-3" />
              <span className="text-[8px]">🌱</span>
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

      <div className="flex-shrink-0">
        <MiniCartBar estimatedTotal={cartTotal} couponDiscount={cartDiscount} deliveryFee={ESTIMATED_DELIVERY_FEE} />
        <BottomNav />
      </div>
    </div>
  );
};

export default Index;
