import { Coffee, Snowflake, GlassWater, CupSoda, Flame, Wheat, FlaskConical, Beaker, Award } from "lucide-react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { BrandBanner } from "@/components/BrandBanner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { Coupon } from "@/components/CouponFlags";
import { MiniCartBar } from "@/components/MiniCartBar";
import { UnifiedCard, UnifiedCardData } from "@/components/UnifiedCard";
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

const allProducts: UnifiedCardData[] = [
  // Standard Series
  { id: "hot-americano", nameZh: "9Bar 美式", nameEn: "9Bar Americano", price: 12, image: coffeeAmericano, icon: Coffee, volume: "360ml", tagZh: "坚果、巧克力尾韵", tagEn: "Nutty, chocolate finish" },
  { id: "iced-americano", nameZh: "冰美式", nameEn: "Iced Americano", price: 12, image: coffeeAmericano, icon: Snowflake, volume: "360ml", tagZh: "酸质明亮 清脆鲜爽", tagEn: "Bright, crisp & fresh" },
  { id: "hot-latte", nameZh: "经典拿铁", nameEn: "Classic Latte", price: 15, image: coffeeLatte, icon: Coffee, volume: "360ml", tagZh: "丝滑香甜", tagEn: "Silky & sweet" },
  { id: "iced-latte", nameZh: "冰拿铁", nameEn: "Iced Latte", price: 15, image: coffeeLatte, icon: GlassWater, volume: "360ml", tagZh: "坚果韵律 清晰透亮", tagEn: "Nutty, crystal clear" },
  { id: "cappuccino", nameZh: "卡布奇诺", nameEn: "Cappuccino", price: 15, image: coffeeCappuccino, icon: CupSoda, volume: "360ml", tagZh: "结构蓬松 啡味穿透", tagEn: "Fluffy, bold flavor" },
  { id: "flat-white", nameZh: "澳白", nameEn: "Flat White", price: 15, image: coffeeFlatWhite, icon: Coffee, volume: "360ml", tagZh: "极薄奶沫 致密醇厚", tagEn: "Dense & rich" },
  // Creative Series
  { id: "palo-santo-latte", nameZh: "圣木拿铁", nameEn: "Palo Santo", price: 25, image: coffeeDirty, icon: Flame, volume: "360ml", tagZh: "雪松 | 檀香 | 黑巧", tagEn: "Cedar | Sandalwood | Choc", isCreative: true, labIndex: 7 },
  { id: "koji-latte", nameZh: "米曲鲜咖", nameEn: "Koji Umami", price: 25, image: coffeeMatcha, icon: Wheat, volume: "360ml", tagZh: "鲜味 | 麦芽 | 奶感", tagEn: "Savory | Malt | Creamy", isCreative: true, labIndex: 8 },
  { id: "rock-salt-fermented", nameZh: "岩盐酵咖", nameEn: "Rock Salt", price: 25, image: coffeeCoconut, icon: FlaskConical, volume: "360ml", tagZh: "酸奶 | 海盐 | 芝士", tagEn: "Yogurt | Salt | Cheese", isCreative: true, labIndex: 9 },
  { id: "glass-latte", nameZh: "玻璃拿铁", nameEn: "Glass Latte", price: 25, image: coffeeRose, icon: Beaker, volume: "360ml", tagZh: "橙花 | 菠萝 | 丝滑", tagEn: "Blossom | Pineapple | Silk", isCreative: true, labIndex: 10 },
];

const Index = () => {
  const { t } = useLanguage();
  const { items, addItem } = useCart();

  const add = (product: UnifiedCardData, e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({ id: product.id, nameZh: product.nameZh, nameEn: product.nameEn, price: product.price, image: product.image });
    toast.success(t(`+1 ${product.nameZh}`, `+1 ${product.nameEn}`), { duration: 800 });
  };

  const qty = (id: string) => items.find(i => i.id === id)?.quantity || 0;

  const cartSubtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const cartDiscount = items.length === 0 ? 0 : (userCoupons.length > 0 ? Math.max(...userCoupons.map(c => c.value)) : 0);
  const cartTotal = items.length === 0 ? 0 : Math.max(0, cartSubtotal - cartDiscount) + ESTIMATED_DELIVERY_FEE;

  const standard = allProducts.filter(p => !p.isCreative);
  const creative = allProducts.filter(p => p.isCreative);

  return (
    <div className="h-screen flex flex-col page-enter overflow-hidden">
      <div className="flex-shrink-0">
        <Header />
        <BrandBanner />
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <section className="px-3 pt-1 pb-0.5">
          {/* ── Standard Series ── */}
          <div className="flex items-baseline justify-between mb-0.5">
            <h2 className="text-[10px] font-bold tracking-wide text-foreground/60 uppercase">
              {t("意式基石", "Foundation")}
            </h2>
            <span className="text-[8px] font-light tracking-widest text-muted-foreground/40">
              {t("世界级萃取", "World-class extraction")}
            </span>
          </div>
          <div className="h-[0.5px] bg-foreground/8 mb-1" />

          <div className="grid grid-cols-2 gap-1 stagger-fade-in">
            {standard.map((product) => (
              <UnifiedCard
                key={product.id}
                product={product}
                quantityInCart={qty(product.id)}
                onAddToCart={(e) => add(product, e)}
              />
            ))}
          </div>

          {/* ── Creative Series ── */}
          <div className="flex items-baseline justify-between mt-2 mb-0.5">
            <h2 className="text-[10px] font-bold tracking-wide text-foreground/70 uppercase">
              {t("先锋实验", "Avant-Garde Lab")}
            </h2>
            <span className="text-[8px] font-light tracking-widest text-muted-foreground/50">
              {t("WBC 冠军灵感", "WBC Champion Artistry")}
            </span>
          </div>
          <div className="h-[0.5px] bg-gradient-to-r from-foreground/10 via-primary/20 to-foreground/10 mb-1" />

          <div className="grid grid-cols-2 gap-1 stagger-fade-in">
            {creative.map((product) => (
              <UnifiedCard
                key={product.id}
                product={product}
                quantityInCart={qty(product.id)}
                onAddToCart={(e) => add(product, e)}
              />
            ))}
          </div>
        </section>

        <section className="px-3 pt-1 pb-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-muted-foreground/30">
              <Coffee className="w-2.5 h-2.5" strokeWidth={1.5} />
              <Award className="w-2.5 h-2.5" strokeWidth={1.5} />
              <span className="text-[7px]">🌱</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[8px] text-muted-foreground/30">
                {t("精品店全听你调遣", "Elite cafés at your command")}
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
