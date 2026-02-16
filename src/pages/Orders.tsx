import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OrderCard } from "@/components/OrderCard";
import { EmptyState } from "@/components/EmptyState";
import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import { RatingModal } from "@/components/RatingModal";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { BrandBanner } from "@/components/BrandBanner";
import { KakaBeanCelebration } from "@/components/KakaBeanCelebration";


type OrderStatus = "pending" | "preparing" | "ready" | "delivering" | "completed";

interface OrderItem {
  name: string;
  nameEn?: string;
  qty: number;
  unitPrice?: number;
  image?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
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
  eta?: string;
  etaEn?: string;
  storeLogo?: string;
  orderCreatedMs: number;
}

const demoOrders: Order[] = [
  {
    id: "order-001",
    orderNumber: "HF001-260215-0001",
    items: [
      { name: "拿铁 (热)", nameEn: "Latte (Hot)", qty: 2, unitPrice: 15 },
      { name: "美式 (冰)", nameEn: "Americano (Iced)", qty: 1, unitPrice: 12 },
    ],
    price: 42,
    status: "preparing",
    cafeName: "静思咖啡工作室",
    cafeNameEn: "Tranquil Coffee Studio",
    cafeRating: 4.9,
    merchantId: "a1b2c3d4",
    createdAt: "今天 14:32",
    createdAtEn: "Today 14:32",
    isRevealed: true,
    eta: "8 分钟",
    etaEn: "8 min",
    orderCreatedMs: Date.now() - 20 * 1000,
  },
  {
    id: "order-002",
    orderNumber: "HF001-260215-0002",
    items: [
      { name: "美式咖啡 (冰)", nameEn: "Americano (Iced)", qty: 1, unitPrice: 12 },
    ],
    price: 12,
    status: "pending",
    createdAt: "今天 14:28",
    createdAtEn: "Today 14:28",
    isRevealed: false,
    orderCreatedMs: Date.now() - 10 * 1000,
  },
  {
    id: "order-003",
    orderNumber: "HF001-260214-0003",
    items: [
      { name: "卡布奇诺", nameEn: "Cappuccino", qty: 1, unitPrice: 16 },
      { name: "澳白", nameEn: "Flat White", qty: 1, unitPrice: 14 },
    ],
    price: 30,
    status: "completed",
    cafeName: "微醺咖啡",
    cafeNameEn: "Tipsy Coffee",
    cafeRating: 4.7,
    createdAt: "昨天 10:15",
    createdAtEn: "Yesterday 10:15",
    isRevealed: true,
    userRating: 5,
    orderCreatedMs: Date.now() - 86400000,
  },
  {
    id: "order-004",
    orderNumber: "HF001-260213-0004",
    items: [
      { name: "澳白", nameEn: "Flat White", qty: 3, unitPrice: 15 },
    ],
    price: 45,
    status: "completed",
    cafeName: "慢时光咖啡",
    cafeNameEn: "Slow Time Coffee",
    cafeRating: 4.8,
    createdAt: "前天 15:42",
    createdAtEn: "2 days ago 15:42",
    isRevealed: true,
    orderCreatedMs: Date.now() - 172800000,
  },
];

const Orders = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { addItem } = useCart();
  const [activeTab, setActiveTab] = useState("active");
  const [orders, setOrders] = useState<Order[]>(demoOrders);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedOrderForRating, setSelectedOrderForRating] = useState<Order | null>(null);
  const [celebrationOpen, setCelebrationOpen] = useState(false);
  const [celebrationBeans, setCelebrationBeans] = useState(0);

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
      navigate(`/order-tracking?status=${order.status}`);
    }
  };

  const handleContact = () => {
    toast({
      title: t("联系门店", "Contact Store"),
      description: t("正在为您接通门店电话...", "Connecting to store..."),
    });
  };

  const handleReorder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    // Add all items from this order to cart
    order.items.forEach((item) => {
      for (let i = 0; i < item.qty; i++) {
        addItem({
          id: `${item.name}-${Date.now()}-${i}`,
          nameZh: item.name,
          nameEn: item.nameEn || item.name,
          price: item.unitPrice || 0,
          image: item.image || "",
        });
      }
    });
    toast({
      title: t("已加入购物车", "Added to Cart"),
      description: t("正在前往订单确认页...", "Going to checkout..."),
    });
    navigate("/checkout");
  };

  const handleRefund = (orderId: string) => {
    toast({
      title: t("申请退款", "Refund Requested"),
      description: t("您的退款申请已提交，预计1-3个工作日处理", "Your refund request has been submitted"),
    });
  };

  const handleCancel = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    toast({
      title: t("订单已取消", "Order Cancelled"),
      description: t("款项将在1-3个工作日内退回", "Refund will be processed in 1-3 business days"),
    });
  };

  const handleInvoice = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      navigate(`/invoice-request?orderNumber=${encodeURIComponent(order.orderNumber)}&price=${order.price}`);
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
    const beansEarned = Math.floor(Math.random() * 10) + 1;
    setCelebrationBeans(beansEarned);
    setCelebrationOpen(true);
  };

  const activeCount = orders.filter((o) => o.status !== "completed").length;
  const completedCount = orders.filter((o) => o.status === "completed").length;

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-shrink-0">
        <Header />
        <BrandBanner />
        <div className="px-4 pt-2 pb-3 max-w-md mx-auto bg-background">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("active")}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-200 border ${
                activeTab === "active"
                  ? "bg-primary/15 border-primary/30 text-primary"
                  : "bg-white/[0.03] border-white/[0.06] text-white/40 hover:text-white/60"
              }`}
            >
              {t("当前订单", "Current")} ({activeCount})
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-200 border ${
                activeTab === "completed"
                  ? "bg-primary/15 border-primary/30 text-primary"
                  : "bg-white/[0.03] border-white/[0.06] text-white/40 hover:text-white/60"
              }`}
            >
              {t("历史订单", "History")} ({completedCount})
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <section className="px-4 py-3 space-y-3 max-w-md mx-auto pb-24">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order, index) => (
              <div
                key={order.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <OrderCard
                  id={order.id}
                  orderNumber={order.orderNumber}
                  items={order.items}
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
                  eta={order.eta}
                  etaEn={order.etaEn}
                  storeLogo={order.storeLogo}
                  orderCreatedMs={order.orderCreatedMs}
                  onClick={() => handleOrderClick(order.id)}
                  onContact={handleContact}
                  onReorder={() => handleReorder(order.id)}
                  onRefund={() => handleRefund(order.id)}
                  onCancel={() => handleCancel(order.id)}
                  onInvoice={() => handleInvoice(order.id)}
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
      </div>

      <div className="flex-shrink-0">
        <BottomNav />
      </div>

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
      <KakaBeanCelebration
        isOpen={celebrationOpen}
        beans={celebrationBeans}
        onClose={() => setCelebrationOpen(false)}
      />
    </div>
  );
};

export default Orders;
