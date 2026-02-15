import { Coffee, Award, Snowflake, GlassWater, CupSoda, Flame, Wheat, FlaskConical, Beaker } from "lucide-react";
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

const ICON_COLOR = "text-violet-400";
const ICON_BG = "bg-violet-500/10";
const ICON_BG_LAB = "bg-purple-400/15";

const allProducts: ProductTileData[] = [
  { id: "hot-americano", nameZh: "热美式", nameEn: "Hot Americano", price: 12, image: coffeeAmericano, icon: Coffee, iconColor: ICON_COLOR, iconBg: ICON_BG, tagZh: "油脂完整 醇厚回甘", tagEn: "Rich crema, smooth finish", specZh: "360ml 热 中深烘焙", specEn: "360ml Hot Medium-Dark" },
  { id: "iced-americano", nameZh: "冰美式", nameEn: "Iced Americano", price: 12, image: coffeeAmericano, icon: Snowflake, iconColor: ICON_COLOR, iconBg: ICON_BG, tagZh: "酸质明亮 清脆鲜爽", tagEn: "Bright acidity, crisp & fresh", specZh: "360ml 冰 中深烘焙", specEn: "360ml Iced Medium-Dark" },
  { id: "hot-latte", nameZh: "热拿铁", nameEn: "Hot Latte", price: 15, image: coffeeLatte, icon: Coffee, iconColor: ICON_COLOR, iconBg: ICON_BG, tagZh: "奶泡绵密 丝滑平衡", tagEn: "Silky foam, perfectly balanced", specZh: "360ml 热 中深烘焙", specEn: "360ml Hot Medium-Dark" },
  { id: "iced-latte", nameZh: "冰拿铁", nameEn: "Iced Latte", price: 15, image: coffeeLatte, icon: GlassWater, iconColor: ICON_COLOR, iconBg: ICON_BG, tagZh: "坚果韵律 清晰透亮", tagEn: "Nutty notes, crystal clear", specZh: "360ml 冰 中深烘焙", specEn: "360ml Iced Medium-Dark" },
  { id: "cappuccino", nameZh: "卡布奇诺", nameEn: "Cappuccino", price: 15, image: coffeeCappuccino, icon: CupSoda, iconColor: ICON_COLOR, iconBg: ICON_BG, tagZh: "结构蓬松 啡味穿透", tagEn: "Fluffy structure, bold flavor", specZh: "240ml 热 中深烘焙", specEn: "240ml Hot Medium-Dark" },
  { id: "flat-white", nameZh: "澳白", nameEn: "Flat White", price: 15, image: coffeeFlatWhite, icon: Coffee, iconColor: ICON_COLOR, iconBg: ICON_BG, tagZh: "极薄奶沫 致密醇厚", tagEn: "Thin microfoam, rich & dense", specZh: "240ml 热 中深烘焙", specEn: "240ml Hot Medium-Dark" },
  { id: "palo-santo-latte", nameZh: "圣木拿铁", nameEn: "Palo Santo Latte", price: 22, image: coffeeDirty, icon: Flame, iconColor: ICON_COLOR, iconBg: ICON_BG_LAB, descZh: "秘鲁圣木 · 雪松檀香黑巧克力", descEn: "Sacred wood · cedar sandalwood dark chocolate", specTags: [{ icon: "cup", labelZh: "360ml", labelEn: "360ml" }, { icon: "snowflake", labelZh: "冰", labelEn: "Iced" }, { icon: "flask", labelZh: "真空慢煮", labelEn: "Sous-vide" }], isCreative: true },
  { id: "koji-latte", nameZh: "米曲鲜咖", nameEn: "Koji Fresh Coffee", price: 20, image: coffeeMatcha, icon: Wheat, iconColor: ICON_COLOR, iconBg: ICON_BG_LAB, descZh: "第五味觉 · 发酵糯米味噌麦芽", descEn: "Umami · fermented rice miso malt", specTags: [{ icon: "cup", labelZh: "360ml", labelEn: "360ml" }, { icon: "snowflake", labelZh: "冰", labelEn: "Iced" }, { icon: "flask", labelZh: "恒温发酵", labelEn: "Koji Ferm." }], isCreative: true },
  { id: "rock-salt-fermented", nameZh: "岩盐酵咖", nameEn: "Rock Salt Fermented", price: 20, image: coffeeCoconut, icon: FlaskConical, iconColor: ICON_COLOR, iconBg: ICON_BG_LAB, descZh: "发酵反叛 · 希腊酸奶海盐芝士", descEn: "Fermented rebellion · yogurt sea salt cheese", specTags: [{ icon: "cup", labelZh: "360ml", labelEn: "360ml" }, { icon: "snowflake", labelZh: "冰", labelEn: "Iced" }, { icon: "flask", labelZh: "乳酸发酵", labelEn: "Lacto Ferm." }], isCreative: true },
  { id: "glass-latte", nameZh: "玻璃拿铁", nameEn: "Glass Latte", price: 22, image: coffeeRose, icon: Beaker, iconColor: ICON_COLOR, iconBg: ICON_BG_LAB, descZh: "奶洗澄清 · 丝滑橙花熟成菠萝", descEn: "Milk-washed · silky orange blossom pineapple", specTags: [{ icon: "cup", labelZh: "360ml", labelEn: "360ml" }, { icon: "snowflake", labelZh: "冰", labelEn: "Iced" }, { icon: "droplets", labelZh: "奶洗澄清", labelEn: "Milk Wash" }], isCreative: true },
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
        <section className="px-4 py-1">
          {/* ── Standard Series Header ── */}
          <div className="mb-1">
            <div className="flex items-baseline justify-between">
              <h2 className="text-[11px] font-bold tracking-wide text-white/75">
                {t("意式基石系列", "FOUNDATION SERIES")}
              </h2>
              <span className="text-[9px] font-light tracking-[0.15em] text-white/30">
                {t("精品萃取标准，回归本味", "Premium extraction, pure origin")}
              </span>
            </div>
            <div className="mt-0.5 h-[0.5px] bg-violet-500/15" />
          </div>

          <div className="grid grid-cols-2 gap-1.5 stagger-fade-in auto-rows-fr">
            {allProducts.filter(p => !p.isCreative).map((product) => (
              <ProductTile
                key={product.id}
                product={product}
                estimatedPrice={getEstimatedPrice(product.price, product.id)}
                quantityInCart={qty(product.id)}
                onAddToCart={(e) => add(product, e)}
              />
            ))}
          </div>

          {/* ── Creative Series Header ── */}
          <div className="mt-2 mb-1">
            <div className="flex items-baseline justify-between">
              <h2 className="text-[11px] font-bold tracking-wide text-white/75">
                {t("先锋实验系列", "AVANT-GARDE LAB")}
              </h2>
              <span className="text-[10px] font-light tracking-wider text-white/35">
                {t("重构世界冠军灵感，先锋感官", "Reimagining WBC champion artistry")}
              </span>
            </div>
            <div className="mt-0.5 h-[0.5px] bg-gradient-to-r from-violet-500/15 via-purple-400/25 to-violet-500/15" />
          </div>

          <div className="grid grid-cols-2 gap-2 stagger-fade-in auto-rows-fr">
            {allProducts.filter(p => p.isCreative).map((product, index) => (
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
        </section>

        <section className="px-4 pt-1.5 pb-20">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-violet-400/30">
              <Coffee className="w-3 h-3" strokeWidth={1.5} />
              <Award className="w-3 h-3" strokeWidth={1.5} />
              <div className="flex items-center justify-center w-3 h-3 border border-violet-400/25 rounded-sm text-[5px] font-bold">4.0</div>
              <Coffee className="w-3 h-3" strokeWidth={1.5} />
              <span className="text-[8px]">🌱</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              <span className="text-[10px] text-white/30">
                {t("全城精品店，全听你调遣！", "Elite cafés at your command!")}
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
