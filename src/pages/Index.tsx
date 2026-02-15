import { Coffee, Snowflake, GlassWater, CupSoda, Flame, Wheat, FlaskConical, Beaker, Award } from "lucide-react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { BrandBanner } from "@/components/BrandBanner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { Coupon } from "@/components/CouponFlags";
import { MiniCartBar } from "@/components/MiniCartBar";
import { StandardCard, StandardCardData } from "@/components/StandardCard";
import { CreativeLabCard, CreativeLabCardData } from "@/components/CreativeLabCard";
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

const standardProducts: StandardCardData[] = [
  { id: "hot-americano", nameZh: "9Bar 美式", nameEn: "9Bar Americano", price: 12, image: coffeeAmericano, icon: Coffee, volume: "360ml", roastZh: "深度烘焙", roastEn: "Deep Roast", tempZh: "热", tempEn: "Hot", tagZh: "坚果、巧克力尾韵", tagEn: "Nutty, chocolate finish" },
  { id: "iced-americano", nameZh: "冰美式", nameEn: "Iced Americano", price: 12, image: coffeeAmericano, icon: Snowflake, volume: "360ml", roastZh: "深度烘焙", roastEn: "Deep Roast", tempZh: "冰", tempEn: "Ice", tagZh: "酸质明亮 清脆鲜爽", tagEn: "Bright acidity, crisp & fresh" },
  { id: "hot-latte", nameZh: "经典拿铁", nameEn: "Classic Latte", price: 15, image: coffeeLatte, icon: Coffee, volume: "360ml", roastZh: "中度烘焙", roastEn: "Medium Roast", tempZh: "热", tempEn: "Hot", tagZh: "丝滑香甜", tagEn: "Silky & sweet" },
  { id: "iced-latte", nameZh: "冰拿铁", nameEn: "Iced Latte", price: 15, image: coffeeLatte, icon: GlassWater, volume: "360ml", roastZh: "中度烘焙", roastEn: "Medium Roast", tempZh: "冰", tempEn: "Ice", tagZh: "坚果韵律 清晰透亮", tagEn: "Nutty notes, crystal clear" },
  { id: "cappuccino", nameZh: "卡布奇诺", nameEn: "Cappuccino", price: 15, image: coffeeCappuccino, icon: CupSoda, volume: "360ml", roastZh: "中度烘焙", roastEn: "Medium Roast", tempZh: "热", tempEn: "Hot", tagZh: "结构蓬松 啡味穿透", tagEn: "Fluffy, bold coffee flavor" },
  { id: "flat-white", nameZh: "澳白", nameEn: "Flat White", price: 15, image: coffeeFlatWhite, icon: Coffee, volume: "360ml", roastZh: "中度烘焙", roastEn: "Medium Roast", tempZh: "热", tempEn: "Hot", tagZh: "极薄奶沫 致密醇厚", tagEn: "Thin microfoam, dense & rich" },
];

const creativeProducts: CreativeLabCardData[] = [
  { id: "palo-santo-latte", nameZh: "圣木拿铁", nameEn: "Palo Santo Latte", price: 25, image: coffeeDirty, icon: Flame, volume: "360ml", tempZh: "冰", tempEn: "Ice Only", beanZh: "SOE 豆", beanEn: "SOE Bean", flavorNotes: "Cedar | Sandalwood | Dark Choc", labIndex: 7 },
  { id: "koji-latte", nameZh: "米曲鲜咖", nameEn: "Koji Umami Latte", price: 25, image: coffeeMatcha, icon: Wheat, volume: "360ml", tempZh: "冰", tempEn: "Ice Only", beanZh: "SOE 豆", beanEn: "SOE Bean", flavorNotes: "Savory | Malt | Creamy", labIndex: 8 },
  { id: "rock-salt-fermented", nameZh: "岩盐酵咖", nameEn: "Rock Salt Fermented", price: 25, image: coffeeCoconut, icon: FlaskConical, volume: "360ml", tempZh: "冰", tempEn: "Ice Only", beanZh: "拼配豆", beanEn: "Blend", flavorNotes: "Yogurt | Sea Salt | Cheese", labIndex: 9 },
  { id: "glass-latte", nameZh: "玻璃拿铁", nameEn: "Glass Latte", price: 25, image: coffeeRose, icon: Beaker, volume: "360ml", tempZh: "冰", tempEn: "Ice Only", beanZh: "SOE 豆", beanEn: "SOE Bean", flavorNotes: "Orange Blossom | Pineapple | Silk", labIndex: 10 },
];

const Index = () => {
  const { t } = useLanguage();
  const { items, addItem } = useCart();

  const addStandard = (product: StandardCardData, e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({ id: product.id, nameZh: product.nameZh, nameEn: product.nameEn, price: product.price, image: product.image });
    toast.success(t(`+1 ${product.nameZh}`, `+1 ${product.nameEn}`), { duration: 800 });
  };

  const addCreative = (product: CreativeLabCardData, e: React.MouseEvent) => {
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
              <h2 className="text-[11px] font-bold tracking-wide text-foreground/70">
                {t("意式基石系列", "FOUNDATION SERIES")}
              </h2>
              <span className="text-[9px] font-light tracking-[0.15em] text-muted-foreground/50">
                {t("世界级萃取标准，回归本味", "World-class extraction, pure origin")}
              </span>
            </div>
            <div className="mt-0.5 h-[0.5px] bg-foreground/10" />
          </div>

          <div className="flex flex-col gap-1.5 stagger-fade-in">
            {standardProducts.map((product) => (
              <StandardCard
                key={product.id}
                product={product}
                quantityInCart={qty(product.id)}
                onAddToCart={(e) => addStandard(product, e)}
              />
            ))}
          </div>

          {/* ── Creative Series Header ── */}
          <div className="mt-3 mb-1">
            <div className="flex items-baseline justify-between">
              <h2 className="text-[11px] font-bold tracking-wide text-foreground/80">
                {t("先锋实验系列", "AVANT-GARDE LAB")}
              </h2>
              <span className="text-[10px] font-light tracking-wider text-muted-foreground/60">
                {t("重构世界冠军灵感，先锋感官", "Reimagining WBC champion artistry")}
              </span>
            </div>
            <div className="mt-0.5 h-[0.5px] bg-gradient-to-r from-foreground/15 via-primary/20 to-foreground/15" />
          </div>

          <div className="grid grid-cols-2 gap-2 stagger-fade-in">
            {creativeProducts.map((product) => (
              <CreativeLabCard
                key={product.id}
                product={product}
                quantityInCart={qty(product.id)}
                onAddToCart={(e) => addCreative(product, e)}
              />
            ))}
          </div>
        </section>

        <section className="px-4 pt-1.5 pb-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-muted-foreground/40">
              <Coffee className="w-3 h-3" strokeWidth={1.5} />
              <Award className="w-3 h-3" strokeWidth={1.5} />
              <div className="flex items-center justify-center w-3 h-3 border border-muted-foreground/30 rounded-sm text-[5px] font-bold">4.0</div>
              <Coffee className="w-3 h-3" strokeWidth={1.5} />
              <span className="text-[8px]">🌱</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] text-muted-foreground/40">
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
