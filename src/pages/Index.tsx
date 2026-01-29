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

// Product data - 6 hardcoded items
const products = [
  {
    id: "hot-americano",
    name: "热美式",
    price: 12,
    image: coffeeAmericano,
    tag: "Single Origin SOE",
  },
  {
    id: "iced-americano",
    name: "冰美式",
    price: 12,
    image: coffeeAmericano,
    tag: "Cold Refresh",
  },
  {
    id: "hot-latte",
    name: "热拿铁",
    price: 15,
    image: coffeeLatte,
    tag: "Silky & Rich",
  },
  {
    id: "iced-latte",
    name: "冰拿铁",
    price: 15,
    image: coffeeLatte,
    tag: "4.0 Protein Milk",
  },
  {
    id: "cappuccino",
    name: "卡布奇诺",
    price: 15,
    image: coffeeCappuccino,
    tag: "Dense Foam",
  },
  {
    id: "flat-white",
    name: "澳白",
    price: 15,
    image: coffeeFlatWhite,
    tag: "Ristretto Base",
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
    // Navigate to order confirmation
    navigate("/order-confirm", {
      state: {
        product: selectedProduct,
        options: { quantity: 1 },
      },
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      {/* Hero Banner */}
      <HeroBanner />

      {/* Product Grid */}
      <section className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">精选咖啡</h2>
          <span className="text-xs text-muted-foreground px-2 py-1 bg-secondary rounded-full">
            SCA Barista Crafted
          </span>
        </div>
        
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
