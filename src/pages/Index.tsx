import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Flame } from "lucide-react";
import { Header } from "@/components/Header";
import { CheckoutModal } from "@/components/CheckoutModal";
import { BottomNav } from "@/components/BottomNav";

// Import coffee images for modal only
import coffeeLatte from "@/assets/coffee-latte.jpg";
import coffeeAmericano from "@/assets/coffee-americano.jpg";
import coffeeCappuccino from "@/assets/coffee-cappuccino.jpg";
import coffeeFlatWhite from "@/assets/coffee-flatwhite.jpg";

// 产品数据 - 6款精选咖啡
const products = [
  {
    id: "hot-americano",
    name: "热美式",
    price: 12,
    image: coffeeAmericano,
    tag: "单一产地精品豆",
    isHot: true,
  },
  {
    id: "iced-americano",
    name: "冰美式",
    price: 12,
    image: coffeeAmericano,
    tag: "清爽冰饮",
  },
  {
    id: "hot-latte",
    name: "热拿铁",
    price: 15,
    image: coffeeLatte,
    tag: "丝滑醇厚",
    isHot: true,
  },
  {
    id: "iced-latte",
    name: "冰拿铁",
    price: 15,
    image: coffeeLatte,
    tag: "4.0高蛋白牛奶",
  },
  {
    id: "cappuccino",
    name: "卡布奇诺",
    price: 15,
    image: coffeeCappuccino,
    tag: "绵密奶泡",
  },
  {
    id: "flat-white",
    name: "澳白",
    price: 15,
    image: coffeeFlatWhite,
    tag: "浓缩精萃",
  },
];

const Index = () => {
  const navigate = useNavigate();
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

  return (
    <div className="min-h-screen pb-20">
      <Header />

      {/* Minimal Brand Header */}
      <section className="px-4 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-white tracking-tight">KAKAGO</h1>
        <p className="text-sm text-white/50 mt-0.5">城市精品咖啡联盟</p>
      </section>

      {/* Fog Divider */}
      <div className="fog-divider mx-4" />

      {/* Compact Product List */}
      <section className="px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-white/70">精选咖啡</h2>
          <span className="text-xs text-white/40">专业咖啡师出品</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {products.map((product, index) => (
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
                      {product.name}
                    </h3>
                    {product.isHot && (
                      <Flame className="w-3 h-3 text-orange-400" />
                    )}
                  </div>
                  <p className="text-xs text-white/40 mt-0.5 truncate">
                    {product.tag}
                  </p>
                </div>
                
                {/* Price & Add */}
                <div className="flex items-center gap-2">
                  <span className="text-primary font-bold text-base">
                    ¥{product.price}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-purple">
                    <Plus className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Fog Divider */}
      <div className="fog-divider mx-4" />

      {/* Quick Info Footer */}
      <section className="px-4 py-4">
        <div className="flex items-center justify-between text-xs text-white/30">
          <span>☕ 认证精品咖啡馆制作</span>
          <span>配送约15-30分钟</span>
        </div>
      </section>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        onConfirm={handleConfirmOrder}
      />

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Index;
