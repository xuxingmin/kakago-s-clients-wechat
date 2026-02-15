import { Coffee, Award, Flame, Snowflake, CloudRain, Sun, TreePine, Wheat, Mountain, Droplets, CupSoda } from "lucide-react";
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
  { id: "palo-santo-latte", nameZh: "圣木拿铁", nameEn: "Palo Santo Latte", price: 22, image: coffeeDirty, icon: TreePine, iconColor: "text-amber-600", iconBg: "bg-amber-600/15", descZh: "秘鲁圣木 · 雪松檀香黑巧克力", descEn: "Sacred wood · cedar sandalwood dark chocolate" },
  { id: "koji-latte", nameZh: "米曲\"鲜\"咖", nameEn: "Koji Fresh Coffee", price: 20, image: coffeeMatcha, icon: Wheat, iconColor: "text-yellow-500", iconBg: "bg-yellow-500/15", descZh: "第五味觉 · 发酵糯米味噌麦芽", descEn: "Umami · fermented rice miso malt" },
  { id: "rock-salt-fermented", nameZh: "岩盐酵咖", nameEn: "Rock Salt Fermented", price: 20, image: coffeeCoconut, icon: Mountain, iconColor: "text-slate-400", iconBg: "bg-slate-400/15", descZh: "发酵反叛 · 希腊酸奶海盐芝士", descEn: "Fermented rebellion · yogurt sea salt cheese" },
  { id: "glass-latte", nameZh: "玻璃拿铁", nameEn: "Glass Latte", price: 22, image: coffeeRose, icon: Droplets, iconColor: "text-sky-300", iconBg: "bg-sky-300/15", descZh: "奶洗澄清 · 丝滑橙花熟成菠萝", descEn: "Milk-washed · silky orange blossom pineapple" },
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

          <div className="grid grid-cols-2 gap-1.5 stagger-fade-in auto-rows-fr">
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
              <Coffee className="w-3 h-3" />
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
