import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OrderCard } from "@/components/OrderCard";
import { EmptyState } from "@/components/EmptyState";
import { BottomNav } from "@/components/BottomNav";
import { RatingModal } from "@/components/RatingModal";
import { BrandHeader } from "@/components/BrandHeader";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

type OrderStatus = "pending" | "preparing" | "ready" | "delivering" | "completed";

interface Order {
  id: string;
  productName: string;
  productNameEn: string;
  price: number;
  status: OrderStatus;
  cafeName?: string;
  cafeNameEn?: string;
  cafeRating?: number;
  merchantId?: string;
  createdAt: string;
  createdAtEn: string;
  isRevealed: boolean;
  userRating?: number;
}

// Demo orders with bilingual data
const demoOrders: Order[] = [
  {
    id: "order-001",
    productName: "拿铁 (热)",
    productNameEn: "Latte (Hot)",
    price: 15,
    status: "preparing",
    cafeName: "静思咖啡工作室",
    cafeNameEn: "Tranquil Coffee Studio",
    cafeRating: 4.9,
    merchantId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    createdAt: "今天 14:32",
    createdAtEn: "Today 14:32",
    isRevealed: true,
  },
  {
    id: "order-002",
    productName: "美式咖啡 (冰)",
    productNameEn: "Americano (Iced)",
    price: 12,
    status: "pending",
    createdAt: "今天 14:28",
    createdAtEn: "Today 14:28",
    isRevealed: false,
  },
  {
    id: "order-003",
    productName: "卡布奇诺",
    productNameEn: "Cappuccino",
    price: 15,
    status: "completed",
    cafeName: "微醺咖啡",
    cafeNameEn: "Tipsy Coffee",
    cafeRating: 4.7,
    createdAt: "昨天 10:15",
    createdAtEn: "Yesterday 10:15",
    isRevealed: true,
    userRating: 5,
  },
  {
    id: "order-004",
    productName: "澳白",
    productNameEn: "Flat White",
    price: 15,
    status: "completed",
    cafeName: "慢时光咖啡",
    cafeNameEn: "Slow Time Coffee",
    cafeRating: 4.8,
    createdAt: "前天 15:42",
    createdAtEn: "2 days ago 15:42",
    isRevealed: true,
  },
];

const Orders = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("active");
  const [orders, setOrders] = useState<Order[]>(demoOrders);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedOrderForRating, setSelectedOrderForRating] = useState<Order | null>(null);

  const filteredOrders = orders.filter((order) =>
    activeTab === "active"
      ? order.status !== "completed"
      : order.status === "completed"
  );

  const handleOrderClick = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    if (order.status === "completed" && !order.userRating) {
      setSelectedOrderForRating(order);
      setRatingModalOpen(true);
    } else if (order.status !== "completed") {
      navigate("/order-tracking");
    }
  };

  const handleRatingSubmit = (rating: number, tags: string[], note: string) => {
    if (!selectedOrderForRating) return;

    setOrders((prev) =>
      prev.map((order) =>
        order.id === selectedOrderForRating.id
          ? { ...order, userRating: rating }
          : order
      )
    );

    toast({
      title: t("评价已提交", "Review Submitted"),
      description: t(
        `感谢您的${rating}星评价！已获得10积分奖励`,
        `Thanks for your ${rating}-star review! +10 points earned`
      ),
    });
  };

  const tabs = [
    { id: "active", label: t("进行中", "In Progress") },
    { id: "completed", label: t("已完成", "Completed") },
  ];

  return (
    <div className="min-h-screen pb-20">
      {/* Brand Header */}
      <BrandHeader showTagline={false} />

      {/* Header */}
      <header className="sticky top-0 z-40 glass">
        <div className="px-4 py-3 max-w-md mx-auto">
          <h2 className="text-lg font-bold text-white">{t("我的订单", "My Orders")}</h2>
        </div>
        
        {/* Tabs */}
        <div className="flex px-4 max-w-md mx-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 min-h-[48px] text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "text-primary border-primary"
                  : "text-white/50 border-transparent hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Fog Divider */}
      <div className="fog-divider" />

      {/* Orders List */}
      <section className="px-4 py-4 space-y-3 max-w-md mx-auto">
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
                productNameEn={order.productNameEn}
                price={order.price}
                status={order.status}
                cafeName={order.cafeName}
                cafeNameEn={order.cafeNameEn}
                cafeRating={order.cafeRating}
                merchantId={order.merchantId}
                createdAt={order.createdAt}
                createdAtEn={order.createdAtEn}
                isRevealed={order.isRevealed}
                userRating={order.userRating}
                onClick={() => handleOrderClick(order.id)}
                t={t}
              />
            </div>
          ))
        ) : (
          <EmptyState
            title={activeTab === "active" 
              ? t("暂无进行中订单", "No Active Orders") 
              : t("暂无历史订单", "No Order History")}
            description={t(
              "去选购一杯神秘咖啡吧，好运等着你！",
              "Order a mystery coffee and let luck find you!"
            )}
            actionLabel={t("立即选购", "Order Now")}
            actionPath="/"
          />
        )}
      </section>

      {/* Rating Modal */}
      <RatingModal
        isOpen={ratingModalOpen}
        onClose={() => {
          setRatingModalOpen(false);
          setSelectedOrderForRating(null);
        }}
        storeName={t(
          selectedOrderForRating?.cafeName || "",
          selectedOrderForRating?.cafeNameEn || selectedOrderForRating?.cafeName || ""
        )}
        onSubmit={handleRatingSubmit}
      />

      <BottomNav />
    </div>
  );
};

export default Orders;
