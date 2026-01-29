import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Flame, Ticket } from "lucide-react";
import { Header } from "@/components/Header";
import { CheckoutModal } from "@/components/CheckoutModal";
import { BottomNav } from "@/components/BottomNav";
import { useLanguage } from "@/contexts/LanguageContext";

// Import coffee images for modal only
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

// 用户可用优惠券
const userCoupons: Coupon[] = [
  {
    id: "coupon-001",
    type: "universal",
    value: 5,
  },
  {
    id: "coupon-002",
    type: "americano",
    value: 8,
    applicableProducts: ["hot-americano", "iced-americano"],
  },
  {
    id: "coupon-003",
    type: "latte",
    value: 6,
    applicableProducts: ["hot-latte", "iced-latte"],
  },
];

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
  // 筛选适用于该产品的所有优惠券
  const applicableCoupons = userCoupons.filter((coupon) => {
    // 通用券适用于所有产品
    if (coupon.type === "universal") return true;
    // 专属券检查是否在适用列表中
    if (coupon.applicableProducts?.includes(productId)) return true;
    return false;
  });

  if (applicableCoupons.length === 0) return null;

  // 选择折扣金额最大的优惠券
  const maxDiscount = Math.max(...applicableCoupons.map(c => c.value));
  
  // 计算到手价（不能低于0）
  const finalPrice = Math.max(0, originalPrice - maxDiscount);
  
  // 只有真正有折扣时才返回
  return finalPrice < originalPrice ? finalPrice : null;
};

const Index = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProductSelect = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setIsModalOpen(true);
    }
  };

  const handleConfirmOrder = (productId: string) => {
    navigate("/order-tracking");
  };

  // Convert selected product to modal format
  const modalProduct = selectedProduct ? {
    id: selectedProduct.id,
    name: t(selectedProduct.nameZh, selectedProduct.nameEn),
    price: selectedProduct.price,
    image: selectedProduct.image,
    tag: t(selectedProduct.tagZh, selectedProduct.tagEn),
  } : null;

  const totalCoupons = userCoupons.length;

  return (
    <div className="min-h-screen pb-20">
      <Header />

      {/* Minimal Brand Header */}
      <section className="px-4 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">KAKAGO</h1>
            <p className="text-sm text-white/50 mt-0.5">
              {t("城市精品咖啡联盟", "Urban Specialty Coffee Alliance")}
            </p>
          </div>
          {/* Coupon Badge */}
          {totalCoupons > 0 && (
            <div className="flex items-center gap-1.5 bg-primary/20 border border-primary/30 px-3 py-1.5 rounded-full">
              <Ticket className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs text-primary font-medium">
                {totalCoupons}{t("张券", " Coupons")}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Fog Divider */}
      <div className="fog-divider mx-4" />

      {/* Compact Product List */}
      <section className="px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-white/70">
            {t("精选咖啡", "Featured Coffee")}
          </h2>
          <span className="text-xs text-white/40">
            {t("专业咖啡师出品", "Crafted by Pro Baristas")}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {products.map((product, index) => {
            const discountedPrice = getBestDiscount(product.id, product.price);
            const hasDiscount = discountedPrice !== null;
            
            return (
              <button
                key={product.id}
                onClick={() => handleProductSelect(product.id)}
                className="group card-premium p-3 text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] min-h-[72px] relative"
                style={{ animationDelay: `${index * 0.03}s` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-semibold text-white text-sm group-hover:text-primary transition-colors">
                        {t(product.nameZh, product.nameEn)}
                      </h3>
                      {product.isHot && (
                        <Flame className="w-3 h-3 text-orange-400" />
                      )}
                    </div>
                    <p className="text-xs text-white/40 mt-0.5 truncate">
                      {t(product.tagZh, product.tagEn)}
                    </p>
                  </div>
                  
                  {/* Price - Side by Side */}
                  <div className="flex flex-col items-end">
                    <div className="flex items-baseline gap-1.5">
                      {hasDiscount && (
                        <span className="text-white/40 text-xs line-through">
                          ¥{product.price}
                        </span>
                      )}
                      <span className="text-primary font-bold text-base">
                        ¥{hasDiscount ? discountedPrice : product.price}
                      </span>
                    </div>
                    {hasDiscount && (
                      <span className="text-primary/70 text-[10px] mt-0.5">
                        {t("预估到手", "Est.")}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Hover Add Button */}
                <div className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-purple">
                  <Plus className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Fog Divider */}
      <div className="fog-divider mx-4" />

      {/* Quick Info Footer */}
      <section className="px-4 py-4">
        <div className="flex items-center justify-between text-xs text-white/30">
          <span>{t("☕ 认证精品咖啡馆制作", "☕ Certified Specialty Cafés")}</span>
          <span>{t("配送约15-30分钟", "Delivery 15-30 min")}</span>
        </div>
      </section>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={modalProduct}
        onConfirm={handleConfirmOrder}
      />

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Index;
