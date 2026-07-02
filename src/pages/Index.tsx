import { useState } from "react";
import { Coffee, Award, Snowflake, GlassWater, CupSoda, Flame, Wheat, FlaskConical, Beaker } from "lucide-react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { BrandBanner } from "@/components/BrandBanner";
import { ServiceNodeBar } from "@/components/ServiceNodeBar";
import { CategoryTabs } from "@/components/CategoryTabs";
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

const ICON_COLOR = "text-primary";
const ICON_BG = "bg-primary/10";
const ICON_BG_LAB = "bg-purple-400/15";

const allProducts: ProductTileData[] = [
  { id: "hot-americano", sku: "TRV-ESP-01", nameZh: "热美式", nameEn: "Hot Americano", price: 12, image: coffeeAmericano, icon: Coffee, iconColor: ICON_COLOR, iconBg: ICON_BG, tagZh: "油脂完整 醇厚回甘", tagEn: "Rich crema, smooth finish", specZh: "360ml 热 中深烘焙", specEn: "360ml Hot Medium-Dark" },
  { id: "iced-americano", sku: "TRV-ESP-02", nameZh: "冰美式", nameEn: "Iced Americano", price: 12, image: coffeeAmericano, icon: Snowflake, iconColor: ICON_COLOR, iconBg: ICON_BG, tagZh: "酸质明亮 清脆鲜爽", tagEn: "Bright acidity, crisp & fresh", specZh: "360ml 冰 中深烘焙", specEn: "360ml Iced Medium-Dark" },
  { id: "hot-latte", sku: "TRV-MILK-01", nameZh: "热拿铁", nameEn: "Hot Latte", price: 15, image: coffeeLatte, icon: Coffee, iconColor: ICON_COLOR, iconBg: ICON_BG, tagZh: "奶泡绵密 丝滑平衡", tagEn: "Silky foam, perfectly balanced", specZh: "360ml 热 中深烘焙", specEn: "360ml Hot Medium-Dark" },
  { id: "iced-latte", sku: "TRV-MILK-02", nameZh: "冰拿铁", nameEn: "Iced Latte", price: 15, image: coffeeLatte, icon: GlassWater, iconColor: ICON_COLOR, iconBg: ICON_BG, tagZh: "坚果韵律 清晰透亮", tagEn: "Nutty notes, crystal clear", specZh: "360ml 冰 中深烘焙", specEn: "360ml Iced Medium-Dark" },
  { id: "cappuccino", sku: "TRV-MILK-03", nameZh: "卡布奇诺", nameEn: "Cappuccino", price: 15, image: coffeeCappuccino, icon: CupSoda, iconColor: ICON_COLOR, iconBg: ICON_BG, tagZh: "结构蓬松 啡味穿透", tagEn: "Fluffy structure, bold flavor", specZh: "240ml 热 中深烘焙", specEn: "240ml Hot Medium-Dark" },
  { id: "flat-white", sku: "TRV-MILK-04", nameZh: "澳白", nameEn: "Flat White", price: 15, image: coffeeFlatWhite, icon: Coffee, iconColor: ICON_COLOR, iconBg: ICON_BG, tagZh: "极薄奶沫 致密醇厚", tagEn: "Thin microfoam, rich & dense", specZh: "240ml 热 中深烘焙", specEn: "240ml Hot Medium-Dark" },
  { id: "palo-santo-latte", sku: "TRV-LAB-07", nameZh: "圣木拿铁", nameEn: "Palo Santo Latte", price: 22, image: coffeeDirty, icon: Flame, iconColor: ICON_COLOR, iconBg: ICON_BG_LAB, descZh: "秘鲁圣木 · 雪松檀香黑巧克力", descEn: "Sacred wood · cedar sandalwood dark chocolate", specTags: [{ icon: "cup", labelZh: "360ml", labelEn: "360ml" }, { icon: "snowflake", labelZh: "冰", labelEn: "Iced" }, { icon: "flask", labelZh: "真空慢煮", labelEn: "Sous-vide" }], isCreative: true },
  { id: "koji-latte", sku: "TRV-LAB-08", nameZh: "米曲鲜咖", nameEn: "Koji Fresh Coffee", price: 20, image: coffeeMatcha, icon: Wheat, iconColor: ICON_COLOR, iconBg: ICON_BG_LAB, descZh: "第五味觉 · 发酵糯米味噌麦芽", descEn: "Umami · fermented rice miso malt", specTags: [{ icon: "cup", labelZh: "360ml", labelEn: "360ml" }, { icon: "snowflake", labelZh: "冰", labelEn: "Iced" }, { icon: "flask", labelZh: "恒温发酵", labelEn: "Koji Ferm." }], isCreative: true },
  { id: "rock-salt-fermented", sku: "TRV-LAB-09", nameZh: "岩盐酵咖", nameEn: "Rock Salt Fermented", price: 20, image: coffeeCoconut, icon: FlaskConical, iconColor: ICON_COLOR, iconBg: ICON_BG_LAB, descZh: "发酵反叛 · 希腊酸奶海盐芝士", descEn: "Fermented rebellion · yogurt sea salt cheese", specTags: [{ icon: "cup", labelZh: "360ml", labelEn: "360ml" }, { icon: "snowflake", labelZh: "冰", labelEn: "Iced" }, { icon: "flask", labelZh: "乳酸发酵", labelEn: "Lacto Ferm." }], isCreative: true },
  { id: "glass-latte", sku: "TRV-LAB-10", nameZh: "玻璃拿铁", nameEn: "Glass Latte", price: 22, image: coffeeRose, icon: Beaker, iconColor: ICON_COLOR, iconBg: ICON_BG_LAB, descZh: "奶洗澄清 · 丝滑橙花熟成菠萝", descEn: "Milk-washed · silky orange blossom pineapple", specTags: [{ icon: "cup", labelZh: "360ml", labelEn: "360ml" }, { icon: "snowflake", labelZh: "冰", labelEn: "Iced" }, { icon: "droplets", labelZh: "奶洗澄清", labelEn: "Milk Wash" }], isCreative: true },
];

const categories = [
  { id: "all", nameZh: "全部", nameEn: "All" },
  { id: "classic", nameZh: "意式基石", nameEn: "Foundation" },
  { id: "lab", nameZh: "先锋实验", nameEn: "Avant-Garde" },
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
  const [activeCategory, setActiveCategory] = useState("all");

  const add = (product: ProductTileData, e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({ id: product.id, nameZh: product.nameZh, nameEn: product.nameEn, price: product.price, image: product.image });
    toast.success(t(`+1 ${product.nameZh}`, `+1 ${product.nameEn}`), { duration: 800 });
  };

  const qty = (id: string) => items.find(i => i.id === id)?.quantity || 0;

  const cartSubtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const cartDiscount = items.length === 0 ? 0 : (userCoupons.length > 0 ? Math.max(...userCoupons.map(c => c.value)) : 0);
  const cartTotal = items.length === 0 ? 0 : Math.max(0, cartSubtotal - cartDiscount) + ESTIMATED_DELIVERY_FEE;

  const showClassic = activeCategory === "all" || activeCategory === "classic";
  const showLab = activeCategory === "all" || activeCategory === "lab";

  const classicProducts = allProducts.filter(p => !p.isCreative);
  const labProducts = allProducts.filter(p => p.isCreative);

  const tabCategories = categories.map(c => ({
    ...c,
    count: c.id === "all" ? allProducts.length : c.id === "classic" ? classicProducts.length : labProducts.length,
  }));

  return (
    <div className="h-screen flex flex-col page-enter overflow-hidden">
      <div className="flex-shrink-0">
        <Header />
        <BrandBanner />
        <ServiceNodeBar />
      </div>


      <div className="flex-1 overflow-y-auto scrollbar-hide pb-16">
        <section className="px-4 pt-1 pb-0.5">
          {/* ── Foundation Series ── */}
          {showClassic && (
            <>
              <div className="mb-3 mt-2 flex items-baseline gap-2">
                <span className="font-mono text-[9px] font-bold tracking-[0.28em] text-primary uppercase tabular-nums">
                  Ch.I
                </span>
                <h2 className="font-serif text-[17px] font-bold tracking-tight text-espresso leading-none">
                  {t("意式基石", "FOUNDATION")}
                </h2>
                <span className="font-serif italic text-[10px] text-foreground/45 leading-none">
                  — Pure Extraction
                </span>
                <div className="flex-1 border-t border-foreground/15" />
                <span className="font-mono text-[8.5px] font-semibold tracking-[0.22em] text-foreground/40 uppercase tabular-nums">
                  {String(classicProducts.length).padStart(2,"0")}·SKU
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 stagger-fade-in auto-rows-fr">
                {classicProducts.map((product) => (
                  <ProductTile
                    key={product.id}
                    product={product}
                    estimatedPrice={getEstimatedPrice(product.price, product.id)}
                    quantityInCart={qty(product.id)}
                    onAddToCart={(e) => add(product, e)}
                  />
                ))}
              </div>
            </>
          )}

          {/* ── Avant-Garde Series ── */}
          {showLab && (
            <>
              <div className={`${showClassic ? "mt-6" : "mt-2"} mb-3 flex items-baseline gap-2`}>
                <span className="font-mono text-[9px] font-bold tracking-[0.28em] text-primary uppercase tabular-nums">
                  Ch.II
                </span>
                <h2 className="font-serif italic text-[17px] font-bold tracking-tight text-espresso leading-none">
                  {t("先锋实验", "AVANT-GARDE")}
                </h2>
                <span className="font-serif italic text-[10px] text-foreground/45 leading-none">
                  — WBC Inspired
                </span>
                <div className="flex-1 border-t border-dashed border-foreground/20" />
                <span className="font-mono text-[8.5px] font-semibold tracking-[0.22em] text-foreground/45 uppercase tabular-nums">
                  LAB·{String(labProducts.length).padStart(2,"0")}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 stagger-fade-in auto-rows-fr">
                {labProducts.map((product, index) => (
                  <ProductTile
                    key={product.id}
                    product={product}
                    estimatedPrice={getEstimatedPrice(product.price, product.id)}
                    quantityInCart={qty(product.id)}
                    onAddToCart={(e) => add(product, e)}
                    labIndex={index + 7}
                  />
                ))}
              </div>
            </>
          )}

          <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-foreground/15 px-0.5 pb-2">
            <span className="text-[9px] font-black tracking-[0.22em] text-foreground/45 uppercase">
              {t("TRIVA · 卷壹", "TRIVA · VOL.01")}
            </span>
            <div className="flex-1 h-px bg-foreground/10" />
            <div className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
              <span className="text-[9px] font-black tracking-[0.22em] text-copper uppercase">
                {t("全城精品店 · 全听调遣", "Elite Cafés · On Command")}
              </span>
            </div>
          </div>
        </section>
      </div>

      <MiniCartBar estimatedTotal={cartTotal} couponDiscount={cartDiscount} deliveryFee={ESTIMATED_DELIVERY_FEE} />
      <BottomNav />
    </div>
  );
};

export default Index;
