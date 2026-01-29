import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { HeroBanner } from "@/components/HeroBanner";
import { ProductGridCard } from "@/components/ProductGridCard";
import { CheckoutModal } from "@/components/CheckoutModal";
import { BottomNav } from "@/components/BottomNav";

// Import coffee images
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
    // Navigate to order tracking (matching state)
    navigate("/order-tracking");
  };

  return (
    <div className="min-h-screen pb-20">
      <Header />

      {/* Hero Banner */}
      <HeroBanner />

      {/* Product Grid */}
      <section className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">精选咖啡</h2>
          <span className="text-xs text-white/70 px-3 py-1.5 bg-secondary/80 rounded-full border border-border">
            专业咖啡师出品
          </span>
        </div>
        
        {/* Fog Divider */}
        <div className="fog-divider mb-4" />
        
        <div className="grid grid-cols-2 gap-3">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <ProductGridCard
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image}
                tag={product.tag}
                onSelect={handleProductSelect}
              />
            </div>
          ))}
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
