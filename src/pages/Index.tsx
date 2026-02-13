import { Coffee, Leaf, Award } from "lucide-react";
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

// ═══════ ALL 10 PRODUCTS ═══════
const allProducts: ProductTileData[] = [
  { id: "hot-americano", nameZh: "热美式", nameEn: "Hot Americano", price: 12, image: coffeeAmericano, tagZh: "油脂完整 醇厚回甘", tagEn: "Rich crema, smooth finish" },
  { id: "iced-americano", nameZh: "冰美式", nameEn: "Iced Americano", price: 12, image: coffeeAmericano, tagZh: "酸质明亮 清脆鲜爽", tagEn: "Bright acidity, crisp & fresh" },
  { id: "hot-latte", nameZh: "热拿铁", nameEn: "Hot Latte", price: 15, image: coffeeLatte, tagZh: "奶泡绵密 丝滑平衡", tagEn: "Silky foam, perfectly balanced" },
  { id: "iced-latte", nameZh: "冰拿铁", nameEn: "Iced Latte", price: 15, image: coffeeLatte, tagZh: "坚果韵律 清晰透亮", tagEn: "Nutty notes, crystal clear" },
  { id: "cappuccino", nameZh: "卡布奇诺", nameEn: "Cappuccino", price: 15, image: coffeeCappuccino, tagZh: "结构蓬松 啡味穿透", tagEn: "Fluffy structure, bold flavor" },
  { id: "flat-white", nameZh: "澳白", nameEn: "Flat White", price: 15, image: coffeeFlatWhite, tagZh: "极薄奶沫 致密醇厚", tagEn: "Thin microfoam, rich & dense" },
  { id: "dirty-coffee", nameZh: "脏脏咖啡", nameEn: "Dirty Coffee", price: 18, image: coffeeDirty, descZh: "巧克力瀑布 · 浓缩碰撞冰牛乳", descEn: "Chocolate cascade meets iced milk" },
  { id: "matcha-latte", nameZh: "抹茶拿铁", nameEn: "Matcha Latte", price: 18, image: coffeeMatcha, descZh: "宇治抹茶 · 丝滑牛乳交融", descEn: "Uji matcha · silky milk fusion" },
  { id: "coconut-latte", nameZh: "生椰拿铁", nameEn: "Coconut Latte", price: 16, image: coffeeCoconut, descZh: "鲜榨椰浆 · 热带风味咖啡", descEn: "Fresh coconut · tropical coffee" },
  { id: "rose-latte", nameZh: "玫瑰拿铁", nameEn: "Rose Latte", price: 18, image: coffeeRose, descZh: "重瓣玫瑰 · 花香萦绕奶咖", descEn: "Damask rose · floral milk coffee" },
];

const getBestCouponDiscount = (productId: string): number => {
  const applicableCoupons = userCoupons.filter((c) => c.type === "universal" || c.applicableProducts?.includes(productId));
  return applicableCoupons.length === 0 ? 0 : Math.max(...applicableCoupons.map(c => c.value));
};

const getEstimatedPrice = (price: number, id: string): number =>
  Math.max(0, price - getBestCouponDiscount(id)) + ESTIMATED_DELIVERY_FEE;

const p = (id: string) => allProducts.find(x => x.id === id)!;

const Index = () => {
  const { t } = useLanguage();
  const { items, addItem } = useCart();

  const add = (product: ProductTileData, e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({ id: product.id, nameZh: product.nameZh, nameEn: product.nameEn, price: product.price, image: product.image });
    toast.success(t(`+1 ${product.nameZh}`, `+1 ${product.nameEn}`), { duration: 800 });
  };

  const qty = (id: string) => items.find(i => i.id === id)?.quantity || 0;
  const est = (product: ProductTileData) => getEstimatedPrice(product.price, product.id);

  const cartSubtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const cartDiscount = items.length === 0 ? 0 : (userCoupons.length > 0 ? Math.max(...userCoupons.map(c => c.value)) : 0);
  const cartTotal = items.length === 0 ? 0 : Math.max(0, cartSubtotal - cartDiscount) + ESTIMATED_DELIVERY_FEE;

  // Helper to render a tile
  const tile = (id: string, variant: "image-tall" | "image-wide" | "image-square" | "compact" | "compact-highlight") => {
    const product = p(id);
    return (
      <ProductTile
        product={product}
        estimatedPrice={est(product)}
        quantityInCart={qty(id)}
        onAddToCart={(e) => add(product, e)}
        variant={variant}
      />
    );
  };

  return (
    <div className="h-screen flex flex-col page-enter overflow-hidden">
      <div className="flex-shrink-0">
        <Header />
        <BrandBanner />
        <div className="fog-divider mx-4" />
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <section className="px-3 py-2">
          <div className="flex items-center justify-between mb-2 px-1">
            <h2 className="text-sm font-medium text-white/60">
              {t("灵感燃料库", "Inspiration Fuel")}
            </h2>
            <span className="text-[11px] text-white/30">
              {t("10款精选", "10 Picks")}
            </span>
          </div>

          {/* ═══════ DYNAMIC MIXED GRID ═══════
              A rhythm of image + compact tiles that feels alive.
              Grid: 6 columns for maximum flexibility
          */}
          <div className="grid grid-cols-6 gap-1.5 stagger-fade-in">

            {/* Row 1: Hot Americano (compact 3col) + Dirty Coffee image (3col tall) */}
            <div className="col-span-3">
              {tile("hot-americano", "compact-highlight")}
            </div>
            <div className="col-span-3 row-span-2">
              {tile("dirty-coffee", "image-tall")}
            </div>

            {/* Row 2: Iced Americano (compact 3col, beside dirty-coffee) */}
            <div className="col-span-3">
              {tile("iced-americano", "compact")}
            </div>

            {/* Row 3: Matcha wide image (4col) + Hot Latte compact (2col) */}
            <div className="col-span-4">
              {tile("matcha-latte", "image-wide")}
            </div>
            <div className="col-span-2">
              {tile("hot-latte", "compact")}
            </div>

            {/* Row 4: Iced Latte compact (2col) + Coconut image (4col) */}
            <div className="col-span-2">
              {tile("iced-latte", "compact")}
            </div>
            <div className="col-span-4">
              {tile("coconut-latte", "image-wide")}
            </div>

            {/* Row 5: Rose image (3col) + Cappuccino image (3col) */}
            <div className="col-span-3">
              {tile("rose-latte", "image-square")}
            </div>
            <div className="col-span-3">
              {tile("cappuccino", "image-square")}
            </div>

            {/* Row 6: Flat White wide image (full width) */}
            <div className="col-span-6">
              {tile("flat-white", "image-wide")}
            </div>

          </div>
        </section>

        {/* Certification Footer */}
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
