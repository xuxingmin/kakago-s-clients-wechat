import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OrderCard } from "@/components/OrderCard";
import { EmptyState } from "@/components/EmptyState";
import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import { RatingModal } from "@/components/RatingModal";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

import coffeeLatteImg from "@/assets/coffee-latte.jpg";
import coffeeAmericanoImg from "@/assets/coffee-americano.jpg";
import coffeeCappuccinoImg from "@/assets/coffee-cappuccino.jpg";
import coffeeFlatwhiteImg from "@/assets/coffee-flatwhite.jpg";

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
  eta?: string;
  etaEn?: string;
  productImage?: string;
  itemCount?: number;
}

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
    merchantId: "a1b2c3d4",
    createdAt: "今天 14:32",
    createdAtEn: "Today 14:32",
    isRevealed: true,
    eta: "8 分钟",
    etaEn: "8 min",
    productImage: coffeeLatteImg,
    itemCount: 1,
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
    productImage: coffeeAmericanoImg,
    itemCount: 1,
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
    productImage: coffeeCappuccinoImg,
    itemCount: 2,
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
    productImage: coffeeFlatwhiteImg,
    itemCount: 1,
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

  const handleContact = () => {
    toast({
      title: t("联系门店", "Contact Store"),
      description: t("正在为您接通门店电话...", "Connecting to store..."),
    });
  };

  const handleReorder = (orderId: string) => {
    toast({
      title: t("再来一单", "Reorder"),
      description: t("已将商品加入购物车", "Item added to cart"),
    });
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

  const activeCount = orders.filter((o) => o.status !== "completed").length;
  const completedCount = orders.filter((o) => o.status === "completed").length;

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Minimal header */}
      <div className="flex-shrink-0">
        <Header />

        {/* Page title + toggle tabs */}
        <div className="px-4 pt-2 pb-3 max-w-md mx-auto bg-background">
          <h1 className="text-lg font-bold text-white tracking-tight mb-3 font-mono uppercase">
            {t("我的订单", "MY ORDERS")}
          </h1>

          {/* Toggle switches */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("active")}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-200 border ${
                activeTab === "active"
                  ? "bg-primary/15 border-primary/30 text-primary"
                  : "bg-white/[0.03] border-white/[0.06] text-white/40 hover:text-white/60"
              }`}
            >
              {t("执行中", "In Progress")} ({activeCount})
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-200 border ${
                activeTab === "completed"
                  ? "bg-primary/15 border-primary/30 text-primary"
                  : "bg-white/[0.03] border-white/[0.06] text-white/40 hover:text-white/60"
              }`}
            >
              {t("历史档案", "History")} ({completedCount})
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable order list */}
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
                  eta={order.eta}
                  etaEn={order.etaEn}
                  productImage={order.productImage}
                  itemCount={order.itemCount}
                  onClick={() => handleOrderClick(order.id)}
                  onContact={order.status !== "completed" ? handleContact : undefined}
                  onReorder={order.status === "completed" ? () => handleReorder(order.id) : undefined}
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

      {/* Bottom nav */}
      <div className="flex-shrink-0">
        <BottomNav />
      </div>

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
    </div>
  );
};

export default Orders;
