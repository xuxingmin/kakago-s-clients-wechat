import { useState } from "react";
import { Header } from "@/components/Header";
import { OrderCard } from "@/components/OrderCard";
import { EmptyState } from "@/components/EmptyState";
import { BottomNav } from "@/components/BottomNav";

// Import images for demo
import coffeeLatte from "@/assets/coffee-latte.jpg";
import coffeeAmericano from "@/assets/coffee-americano.jpg";

type OrderStatus = "pending" | "preparing" | "ready" | "delivering" | "completed";

interface Order {
  id: string;
  productName: string;
  productImage: string;
  price: number;
  status: OrderStatus;
  cafeName?: string;
  createdAt: string;
  isRevealed: boolean;
}

// Demo orders data
const demoOrders: Order[] = [
  {
    id: "order-001",
    productName: "拿铁 (热)",
    productImage: coffeeLatte,
    price: 28,
    status: "preparing",
    cafeName: "Blue Bottle Coffee",
    createdAt: "今天 14:32",
    isRevealed: true,
  },
  {
    id: "order-002",
    productName: "美式咖啡 (冰)",
    productImage: coffeeAmericano,
    price: 22,
    status: "pending",
    createdAt: "今天 14:28",
    isRevealed: false,
  },
];

const tabs = [
  { id: "active", label: "进行中" },
  { id: "completed", label: "已完成" },
];

const Orders = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [orders] = useState<Order[]>(demoOrders);

  const filteredOrders = orders.filter((order) =>
    activeTab === "active"
      ? order.status !== "completed"
      : order.status === "completed"
  );

  const handleOrderClick = (orderId: string) => {
    console.log("View order:", orderId);
    // Navigate to order detail
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border safe-top">
        <div className="px-4 py-4 max-w-md mx-auto">
          <h1 className="text-xl font-bold text-foreground">我的订单</h1>
        </div>
        
        {/* Tabs */}
        <div className="flex px-4 max-w-md mx-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "text-primary border-primary"
                  : "text-muted-foreground border-transparent hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Orders List */}
      <section className="px-4 py-4 space-y-3">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order, index) => (
            <div
              key={order.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <OrderCard
                id={order.id}
                productName={order.productName}
                productImage={order.productImage}
                price={order.price}
                status={order.status}
                cafeName={order.cafeName}
                createdAt={order.createdAt}
                isRevealed={order.isRevealed}
                onClick={() => handleOrderClick(order.id)}
              />
            </div>
          ))
        ) : (
          <EmptyState
            title={activeTab === "active" ? "暂无进行中订单" : "暂无历史订单"}
            description="去选购一杯神秘咖啡吧，好运等着你！"
            actionLabel="立即选购"
            actionPath="/"
          />
        )}
      </section>

      <BottomNav />
    </div>
  );
};

export default Orders;
