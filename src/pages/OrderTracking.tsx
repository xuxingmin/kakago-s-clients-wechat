import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
  MapPin, 
  Phone, 
  ChevronLeft, 
  Coffee, 
  Home, 
  Star,
  Navigation,
  CheckCircle2,
  Clock,
  Package
} from "lucide-react";
import { MultiDimensionRatingModal } from "@/components/MultiDimensionRatingModal";
import { useToast } from "@/hooks/use-toast";
import { useOrder, submitOrderRating } from "@/hooks/useOrders";
import cafeInterior from "@/assets/cafe-interior.jpg";

type OrderState = "pending" | "accepted" | "rider_assigned" | "picked_up" | "delivered" | "rating";

// Radar Scanner Component
const RadarScanner = () => {
  return (
    <div className="relative w-64 h-64">
      {/* Outer rings */}
      <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
      <div className="absolute inset-4 rounded-full border-2 border-primary/30" />
      <div className="absolute inset-8 rounded-full border-2 border-primary/40" />
      <div className="absolute inset-12 rounded-full border-2 border-primary/50" />
      
      {/* Center dot */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-4 h-4 rounded-full bg-primary animate-pulse" />
      </div>
      
      {/* Scanning beam */}
      <div 
        className="absolute inset-0 rounded-full overflow-hidden"
        style={{
          background: "conic-gradient(from 0deg, transparent 0deg, hsla(245, 58%, 51%, 0.4) 30deg, transparent 60deg)",
          animation: "spin 2s linear infinite",
        }}
      />
      
      {/* Pulse rings */}
      <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" style={{ animationDuration: "2s" }} />
      <div className="absolute inset-8 rounded-full border-2 border-primary/20 animate-ping" style={{ animationDuration: "2.5s", animationDelay: "0.5s" }} />
    </div>
  );
};

// Delivery Map Component
interface DeliveryMapProps {
  riderLat?: number | null;
  riderLng?: number | null;
  destinationLat?: number | null;
  destinationLng?: number | null;
  storeLat?: number;
  storeLng?: number;
}

const DeliveryMap = ({ riderLat, riderLng }: DeliveryMapProps) => {
  const [riderProgress, setRiderProgress] = useState(30);

  useEffect(() => {
    // If we have real rider location, calculate progress
    // For now, simulate progress
    const interval = setInterval(() => {
      setRiderProgress(prev => prev < 70 ? prev + 5 : prev);
    }, 2000);
    return () => clearInterval(interval);
  }, [riderLat, riderLng]);

  return (
    <div className="relative w-full h-full bg-mist rounded-2xl overflow-hidden">
      {/* Fake map grid */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(10)].map((_, i) => (
          <div key={`h-${i}`} className="absolute w-full h-px bg-border" style={{ top: `${i * 10}%` }} />
        ))}
        {[...Array(10)].map((_, i) => (
          <div key={`v-${i}`} className="absolute h-full w-px bg-border" style={{ left: `${i * 10}%` }} />
        ))}
      </div>

      {/* Route line */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path
          d="M 15 80 Q 30 60 50 50 T 85 20"
          fill="none"
          stroke="hsl(245, 58%, 51%)"
          strokeWidth="0.8"
          strokeDasharray="2,2"
          className="opacity-60"
        />
        <path
          d="M 15 80 Q 30 60 50 50 T 85 20"
          fill="none"
          stroke="hsl(245, 58%, 51%)"
          strokeWidth="0.8"
          strokeDasharray={`${riderProgress} 100`}
        />
      </svg>

      {/* Cafe marker */}
      <div className="absolute" style={{ left: "15%", top: "80%", transform: "translate(-50%, -50%)" }}>
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg">
            <Coffee className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rotate-45" />
        </div>
      </div>

      {/* Rider marker */}
      <div 
        className="absolute transition-all duration-1000 ease-out"
        style={{ 
          left: `${15 + riderProgress}%`, 
          top: `${80 - riderProgress * 0.85}%`, 
          transform: "translate(-50%, -50%)" 
        }}
      >
        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-lg animate-bounce">
          <span className="text-sm">🏍️</span>
        </div>
      </div>

      {/* User home marker */}
      <div className="absolute" style={{ left: "85%", top: "20%", transform: "translate(-50%, -50%)" }}>
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center shadow-lg">
            <Home className="w-5 h-5 text-background" />
          </div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-foreground rotate-45" />
        </div>
      </div>

      {/* ETA badge */}
      <div className="absolute top-4 right-4 bg-card px-3 py-2 rounded-xl shadow-lg">
        <p className="text-xs text-muted-foreground">预计送达</p>
        <p className="text-lg font-bold text-foreground">12 分钟</p>
      </div>
    </div>
  );
};

// Status Timeline Component
interface StatusTimelineProps {
  currentStatus: OrderState;
  timestamps: {
    created_at?: string;
    accepted_at?: string | null;
    rider_assigned_at?: string | null;
    picked_up_at?: string | null;
    delivered_at?: string | null;
  };
}

const StatusTimeline = ({ currentStatus, timestamps }: StatusTimelineProps) => {
  const steps = [
    { key: "pending", label: "待接单", icon: Clock, time: timestamps.created_at },
    { key: "accepted", label: "开始制作", icon: Coffee, time: timestamps.accepted_at },
    { key: "rider_assigned", label: "骑手接单", icon: Navigation, time: timestamps.rider_assigned_at },
    { key: "picked_up", label: "配送中", icon: Package, time: timestamps.picked_up_at },
    { key: "delivered", label: "已送达", icon: CheckCircle2, time: timestamps.delivered_at },
  ];

  const statusIndex = steps.findIndex(s => s.key === currentStatus);

  return (
    <div className="bg-card rounded-2xl p-4 mx-4 mb-4">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index <= statusIndex;
          const isCurrent = step.key === currentStatus;
          
          return (
            <div key={step.key} className="flex flex-col items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  isActive
                    ? isCurrent
                      ? "bg-primary text-white scale-110"
                      : "bg-primary/20 text-primary"
                    : "bg-secondary text-white/30"
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span
                className={`text-xs mt-1.5 text-center ${
                  isActive ? "text-white font-medium" : "text-white/40"
                }`}
              >
                {step.label}
              </span>
              {step.time && (
                <span className="text-xs text-white/40 mt-0.5">
                  {new Date(step.time).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const OrderTracking = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("id");
  const { toast } = useToast();
  
  // Use real order data if available
  const { order, loading } = useOrder(orderId);
  
  // Demo state for development
  const [demoState, setDemoState] = useState<OrderState>("pending");
  const [showRevealCard, setShowRevealCard] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);

  // Determine current state from order or demo
  const currentState: OrderState = order?.status as OrderState || demoState;

  // Auto transition for reveal animation
  useEffect(() => {
    if (currentState === "accepted") {
      const timer = setTimeout(() => setShowRevealCard(true), 300);
      return () => clearTimeout(timer);
    } else {
      setShowRevealCard(false);
    }
  }, [currentState]);

  // Auto show rating modal when delivered
  useEffect(() => {
    if (currentState === "delivered" && !order?.order_ratings) {
      const timer = setTimeout(() => setShowRatingModal(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [currentState, order?.order_ratings]);

  const handleRatingSubmit = async (
    tasteRating: number,
    packagingRating: number,
    timelinessRating: number,
    comment: string
  ) => {
    try {
      if (orderId) {
        await submitOrderRating(orderId, tasteRating, packagingRating, timelinessRating, comment);
      }
      
      toast({
        title: "评价已提交",
        description: `感谢您的评价！综合评分: ${((tasteRating + packagingRating + timelinessRating) / 3).toFixed(1)}`,
      });

      console.log("Rating submitted:", {
        orderId,
        tasteRating,
        packagingRating,
        timelinessRating,
        comment,
      });
    } catch (error) {
      toast({
        title: "评价提交失败",
        description: "请稍后重试",
        variant: "destructive",
      });
    }
  };

  // Demo data
  const demoMerchant = {
    name: "静思咖啡工作室",
    rating: 4.9,
    barista: "小杰",
    equipment: "辣妈咖啡机",
  };

  const demoRider = {
    name: "王师傅",
    phone: "138****8888",
    platform: "顺丰配送",
    rating: 98,
  };

  const demoProduct = {
    name: "拿铁 (热)",
    price: 15,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border safe-top">
        <div className="flex items-center justify-between px-4 py-3 max-w-md mx-auto">
          <button 
            onClick={() => navigate("/orders")}
            className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-base font-semibold text-foreground">订单追踪</h1>
          <div className="w-9" />
        </div>
      </header>

      {/* Dev Panel (for demo) */}
      {!orderId && (
        <div className="bg-secondary/50 border-b border-border px-4 py-2">
          <p className="text-xs text-muted-foreground mb-2 text-center">🛠 开发演示面板</p>
          <div className="flex gap-1 justify-center flex-wrap">
            {(["pending", "accepted", "rider_assigned", "picked_up", "delivered"] as OrderState[]).map((state) => (
              <button
                key={state}
                onClick={() => setDemoState(state)}
                className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                  demoState === state 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-secondary text-muted-foreground hover:bg-mist-light"
                }`}
              >
                {state === "pending" && "待接单"}
                {state === "accepted" && "制作中"}
                {state === "rider_assigned" && "骑手接单"}
                {state === "picked_up" && "配送中"}
                {state === "delivered" && "已送达"}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Status Timeline */}
      <StatusTimeline 
        currentStatus={currentState}
        timestamps={{
          created_at: order?.created_at || new Date().toISOString(),
          accepted_at: order?.accepted_at,
          rider_assigned_at: order?.rider_assigned_at,
          picked_up_at: order?.picked_up_at,
          delivered_at: order?.delivered_at,
        }}
      />

      {/* Main Content */}
      <div className="flex-1 relative overflow-hidden">
        {/* State 1: Pending - Matching */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center px-6 transition-all duration-500 ${
          currentState === "pending" ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        }`}>
          <RadarScanner />
          <h2 className="text-xl font-bold text-foreground mt-8 text-center">
            正在寻找最近的精品咖啡师...
          </h2>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            请稍候，我们正在为您匹配订单
          </p>
          <div className="flex items-center gap-2 mt-6 text-xs text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>通常需要 10-30 秒</span>
          </div>
        </div>

        {/* State 2: Accepted - Reveal & Making */}
        <div className={`absolute inset-0 flex flex-col transition-all duration-500 ${
          currentState === "accepted" ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}>
          {/* Success Banner */}
          <div className="bg-green-500 text-white py-3 px-4 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium">订单已接受！正在制作中</span>
          </div>

          {/* Reveal Card */}
          <div className={`flex-1 flex items-end p-4 transition-all duration-700 ease-out ${
            showRevealCard ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
          }`}>
            <div className="w-full bg-card rounded-3xl overflow-hidden shadow-2xl">
              {/* Cafe Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={order?.merchants?.logo_url || cafeInterior}
                  alt="咖啡馆内景"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white/70 text-xs mb-1">为您制作</p>
                  <h3 className="text-white text-2xl font-bold">
                    {order?.merchants?.name || demoMerchant.name}
                  </h3>
                </div>
              </div>

              {/* Details */}
              <div className="p-5 space-y-4">
                {/* Barista & Equipment */}
                <div className="flex gap-4">
                  <div className="flex-1 bg-secondary rounded-xl p-3">
                    <p className="text-xs text-muted-foreground">首席咖啡师</p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">{demoMerchant.barista}</p>
                  </div>
                  <div className="flex-1 bg-secondary rounded-xl p-3">
                    <p className="text-xs text-muted-foreground">设备</p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">{demoMerchant.equipment}</p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 py-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {order?.merchants?.rating || demoMerchant.rating} · 精品认证
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-primary text-primary font-medium transition-colors hover:bg-primary/5">
                    <Navigation className="w-4 h-4" />
                    <span>导航到店</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-primary text-primary font-medium transition-colors hover:bg-primary/5">
                    <Phone className="w-4 h-4" />
                    <span>联系咖啡师</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* State 3: Rider Assigned */}
        <div className={`absolute inset-0 flex flex-col transition-all duration-500 ${
          currentState === "rider_assigned" ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}>
          {/* Status Banner */}
          <div className="bg-blue-500 text-white py-3 px-4 flex items-center justify-center gap-2">
            <span className="text-lg">🏍️</span>
            <span className="font-medium">骑手已接单，即将取货</span>
          </div>

          {/* Rider Info Card */}
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="w-full bg-card rounded-2xl p-6 shadow-lg border border-border text-center">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center text-4xl mx-auto mb-4">
                🧑‍💼
              </div>
              <h3 className="text-xl font-bold text-foreground">
                {order?.rider_name || demoRider.name}
              </h3>
              <span className="inline-block text-sm text-muted-foreground bg-secondary px-3 py-1 rounded-full mt-2">
                {order?.delivery_platform || demoRider.platform}
              </span>
              <div className="flex items-center justify-center gap-1 mt-3">
                <Star className="w-4 h-4 fill-primary text-primary" />
                <span className="text-sm text-muted-foreground">{demoRider.rating}% 好评率</span>
              </div>
              <button className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500 text-white font-medium">
                <Phone className="w-4 h-4" />
                <span>联系骑手 {order?.rider_phone || demoRider.phone}</span>
              </button>
            </div>
          </div>
        </div>

        {/* State 4: Picked Up - Delivering */}
        <div className={`absolute inset-0 flex flex-col transition-all duration-500 ${
          currentState === "picked_up" ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}>
          {/* Status Banner */}
          <div className="bg-primary text-primary-foreground py-3 px-4 flex items-center justify-center gap-2">
            <span className="text-lg">🏍️</span>
            <span className="font-medium">骑手正在配送中</span>
          </div>

          {/* Map Area */}
          <div className="flex-1 p-4">
            <DeliveryMap 
              riderLat={order?.rider_lat}
              riderLng={order?.rider_lng}
            />
          </div>

          {/* Rider Info Card */}
          <div className="mx-4 mb-4 bg-card rounded-2xl p-4 shadow-lg border border-border">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center text-2xl">
                🧑‍💼
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-foreground">
                    {order?.rider_name || demoRider.name}
                  </h4>
                  <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                    {order?.delivery_platform || demoRider.platform}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3 h-3 fill-primary text-primary" />
                  <span className="text-xs text-muted-foreground">{demoRider.rating}% 好评率</span>
                </div>
              </div>
              <button className="w-11 h-11 rounded-full bg-green-500 flex items-center justify-center text-white shadow-lg">
                <Phone className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* State 5: Delivered */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center px-6 transition-all duration-500 ${
          currentState === "delivered" ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        }`}>
          <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-foreground text-center">
            咖啡已送达！
          </h2>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            感谢您的订购，请享用您的咖啡
          </p>
          
          {!order?.order_ratings && (
            <button
              onClick={() => setShowRatingModal(true)}
              className="mt-8 px-8 py-4 btn-gold rounded-2xl font-semibold"
            >
              为这杯咖啡评分
            </button>
          )}

          {order?.order_ratings && (
            <div className="mt-6 bg-card rounded-2xl p-4 w-full max-w-xs">
              <p className="text-xs text-muted-foreground text-center mb-2">您的评价</p>
              <div className="flex justify-center gap-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-primary">{order.order_ratings.taste_rating}</p>
                  <p className="text-xs text-muted-foreground">口味</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-primary">{order.order_ratings.packaging_rating}</p>
                  <p className="text-xs text-muted-foreground">包装</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-primary">{order.order_ratings.timeliness_rating}</p>
                  <p className="text-xs text-muted-foreground">时效</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Rating Modal */}
      <MultiDimensionRatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        storeName={order?.merchants?.name || demoMerchant.name}
        productName={order?.product_name || demoProduct.name}
        onSubmit={handleRatingSubmit}
      />
    </div>
  );
};

export default OrderTracking;
