import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { BlindBoxHero } from "@/components/BlindBoxHero";
import { CategoryTabs } from "@/components/CategoryTabs";
import { ProductCard } from "@/components/ProductCard";
import { ProductSheet } from "@/components/ProductSheet";
import { BottomNav } from "@/components/BottomNav";

// Import coffee images
import coffeeLatte from "@/assets/coffee-latte.jpg";
import coffeeAmericano from "@/assets/coffee-americano.jpg";
import coffeeCappuccino from "@/assets/coffee-cappuccino.jpg";
import coffeeFlatWhite from "@/assets/coffee-flatwhite.jpg";

// Product data
const categories = [
  { id: "all", name: "全部" },
  { id: "black", name: "黑咖啡" },
  { id: "milk", name: "奶咖" },
];

const products = [
  {
    id: "americano-hot",
    name: "美式咖啡",
    nameEn: "Americano",
    price: 22,
    image: coffeeAmericano,
    category: "black",
    isHot: true,
    hasIceOption: true,
  },
  {
    id: "latte",
    name: "拿铁",
    nameEn: "Caffè Latte",
    price: 28,
    image: coffeeLatte,
    category: "milk",
    isHot: true,
    hasIceOption: true,
  },
  {
    id: "cappuccino",
    name: "卡布奇诺",
    nameEn: "Cappuccino",
    price: 28,
    image: coffeeCappuccino,
    category: "milk",
    isHot: false,
    hasIceOption: false,
  },
  {
    id: "flat-white",
    name: "澳白",
    nameEn: "Flat White",
    price: 30,
    image: coffeeFlatWhite,
    category: "milk",
    isHot: true,
    hasIceOption: false,
  },
];

const Index = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const handleProductSelect = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setIsSheetOpen(true);
    }
  };

  const handleAddToCart = (
    productId: string,
    options: { temperature: "hot" | "iced"; quantity: number }
  ) => {
    // In a real app, this would add to cart or create an order
    console.log("Order:", { productId, ...options });
    navigate("/order-confirm", {
      state: {
        product: selectedProduct,
        options,
      },
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header location="上海市浦东新区" />

      {/* Hero Section */}
      <BlindBoxHero onExplore={() => setActiveCategory("all")} />

      {/* Category Tabs */}
      <CategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* Product List */}
      <section className="px-4 space-y-3 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">精选咖啡</h2>
          <span className="text-sm text-muted-foreground">
            {filteredProducts.length} 款可选
          </span>
        </div>
        {filteredProducts.map((product, index) => (
          <div
            key={product.id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <ProductCard
              id={product.id}
              name={product.name}
              nameEn={product.nameEn}
              price={product.price}
              image={product.image}
              isHot={product.isHot}
              onSelect={handleProductSelect}
            />
          </div>
        ))}
      </section>

      {/* Product Sheet */}
      <ProductSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        product={selectedProduct}
        onAddToCart={handleAddToCart}
      />

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Index;
