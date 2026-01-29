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

type OrderState = "pending" | "accepted" | "rider_assigned" | "picked_up" | "delivered" | "rating";

// Radar Scanner Component - Minimal
const RadarScanner = () => {
  return (
    <div className="relative w-48 h-48">
      {/* Outer rings */}
      <div className="absolute inset-0 rounded-full border border-primary/20" />
      <div className="absolute inset-6 rounded-full border border-primary/30" />
      <div className="absolute inset-12 rounded-full border border-primary/40" />
      
      {/* Center dot */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
      </div>
      
      {/* Scanning beam */}
      <div 
        className="absolute inset-0 rounded-full overflow-hidden"
        style={{
          background: "conic-gradient(from 0deg, transparent 0deg, hsla(245, 58%, 51%, 0.3) 30deg, transparent 60deg)",
          animation: "spin 2s linear infinite",
        }}
      />
    </div>
  );
};

// Delivery Map Component - Minimal
interface DeliveryMapProps {
  riderLat?: number | null;
  riderLng?: number | null;
}

const DeliveryMap = ({ riderLat, riderLng }: DeliveryMapProps) => {
  const [riderProgress, setRiderProgress] = useState(30);

  useEffect(() => {
    const interval = setInterval(() => {
      setRiderProgress(prev => prev < 70 ? prev + 5 : prev);
    }, 2000);
    return () => clearInterval(interval);
  }, [riderLat, riderLng]);

  return (
    <div className="relative w-full h-full bg-secondary rounded-2xl overflow-hidden">
      {/* Minimal grid */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(6)].map((_, i) => (
          <div key={`h-${i}`} className="absolute w-full h-px bg-white/20" style={{ top: `${i * 20}%` }} />
        ))}
        {[...Array(6)].map((_, i) => (
          <div key={`v-${i}`} className="absolute h-full w-px bg-white/20" style={{ left: `${i * 20}%` }} />
        ))}
      </div>

      {/* Route line */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path
          d="M 15 80 Q 30 60 50 50 T 85 20"
          fill="none"
          stroke="hsl(245, 58%, 51%)"
          strokeWidth="0.5"
          strokeDasharray="2,2"
          className="opacity-40"
        />
        <path
          d="M 15 80 Q 30 60 50 50 T 85 20"
          fill="none"
          stroke="hsl(245, 58%, 51%)"
          strokeWidth="1"
          strokeDasharray={`${riderProgress} 100`}
        />
      </svg>

      {/* Cafe marker */}
      <div className="absolute" style={{ left: "15%", top: "80%", transform: "translate(-50%, -50%)" }}>
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <Coffee className="w-4 h-4 text-primary-foreground" />
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
        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-xs animate-bounce">
          🏍️
        </div>
      </div>

      {/* User home marker */}
      <div className="absolute" style={{ left: "85%", top: "20%", transform: "translate(-50%, -50%)" }}>
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
          <Home className="w-4 h-4 text-background" />
        </div>
      </div>

      {/* ETA badge */}
      <div className="absolute top-3 right-3 bg-card/90 px-3 py-2 rounded-xl">
        <p className="text-xs text-white/60">预计送达</p>
        <p className="text-lg font-bold text-white">12 分钟</p>
      </div>
    </div>
  );
};

// Status Timeline Component - Minimal
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
    { key: "pending", label: "待接单", icon: Clock },
    { key: "accepted", label: "制作中", icon: Coffee },
    { key: "rider_assigned", label: "骑手接单", icon: Navigation },
    { key: "picked_up", label: "配送中", icon: Package },
    { key: "delivered", label: "已送达", icon: CheckCircle2 },
  ];

  const statusIndex = steps.findIndex(s => s.key === currentStatus);

  return (
    <div className="card-premium p-4 mx-4 mb-4">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index <= statusIndex;
          const isCurrent = step.key === currentStatus;
          
          return (
            <div key={step.key} className="flex flex-col items-center flex-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                  isActive
                    ? isCurrent
                      ? "bg-primary text-white"
                      : "bg-primary/30 text-primary"
                    : "bg-secondary text-white/30"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span
                className={`text-xs mt-1 text-center ${
                  isActive ? "text-white font-medium" : "text-white/40"
                }`}
              >
                {step.label}
              </span>
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
  
  const { order, loading } = useOrder(orderId);
  
  const [demoState, setDemoState] = useState<OrderState>("pending");
  const [showRevealCard, setShowRevealCard] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);

  const currentState: OrderState = order?.status as OrderState || demoState;

  useEffect(() => {
    if (currentState === "accepted") {
      const timer = setTimeout(() => setShowRevealCard(true), 300);
      return () => clearTimeout(timer);
    } else {
      setShowRevealCard(false);
    }
  }, [currentState]);

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
    equipment: "La Marzocco",
    merchantId: "A1B2C3D4",
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
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 glass safe-top">
        <div className="flex items-center justify-between px-4 py-3 max-w-md mx-auto">
          <button 
            onClick={() => navigate("/orders")}
            className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-base font-semibold text-white">订单追踪</h1>
          <div className="w-9" />
        </div>
      </header>

      {/* Dev Panel */}
      {!orderId && (
        <div className="bg-secondary/50 border-b border-white/10 px-4 py-2">
          <p className="text-xs text-white/40 mb-2 text-center">🛠 开发演示</p>
          <div className="flex gap-1 justify-center flex-wrap">
            {(["pending", "accepted", "rider_assigned", "picked_up", "delivered"] as OrderState[]).map((state) => (
              <button
                key={state}
                onClick={() => setDemoState(state)}
                className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                  demoState === state 
                    ? "bg-primary text-white" 
                    : "bg-secondary text-white/50 hover:bg-white/10"
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
          <h2 className="text-lg font-bold text-white mt-8 text-center">
            正在寻找最近的咖啡师...
          </h2>
          <p className="text-sm text-white/50 mt-2 text-center">
            请稍候，通常需要 10-30 秒
          </p>
        </div>

        {/* State 2: Accepted - Reveal */}
        <div className={`absolute inset-0 flex flex-col transition-all duration-500 ${
          currentState === "accepted" ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}>
          {/* Success Banner */}
          <div className="bg-green-500/20 border-b border-green-500/30 text-green-400 py-3 px-4 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-sm font-medium">订单已接受，正在制作中</span>
          </div>

          {/* Reveal Card - Minimal */}
          <div className={`flex-1 flex items-center p-4 transition-all duration-700 ease-out ${
            showRevealCard ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}>
            <div className="w-full card-premium p-6 space-y-4">
              {/* Store Info */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
                  <Coffee className="w-7 h-7 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-white/50">为您制作</p>
                  <h3 className="text-lg font-bold text-white">
                    {order?.merchants?.name || demoMerchant.name}
                  </h3>
                  <span className="text-xs text-white/40 font-mono">
                    ID: {demoMerchant.merchantId}
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-primary/20 px-2 py-1 rounded-full">
                  <Star className="w-3 h-3 fill-primary text-primary" />
                  <span className="text-xs font-medium text-primary">
                    {order?.merchants?.rating || demoMerchant.rating}
                  </span>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-secondary rounded-xl p-3">
                  <p className="text-xs text-white/50">首席咖啡师</p>
                  <p className="text-sm font-semibold text-white mt-0.5">{demoMerchant.barista}</p>
                </div>
                <div className="bg-secondary rounded-xl p-3">
                  <p className="text-xs text-white/50">设备</p>
                  <p className="text-sm font-semibold text-white mt-0.5">{demoMerchant.equipment}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-primary/50 text-primary text-sm font-medium hover:bg-primary/10 transition-colors">
                  <Navigation className="w-4 h-4" />
                  <span>导航到店</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-primary/50 text-primary text-sm font-medium hover:bg-primary/10 transition-colors">
                  <Phone className="w-4 h-4" />
                  <span>联系咖啡师</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* State 3: Rider Assigned */}
        <div className={`absolute inset-0 flex flex-col transition-all duration-500 ${
          currentState === "rider_assigned" ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}>
          <div className="bg-blue-500/20 border-b border-blue-500/30 text-blue-400 py-3 px-4 flex items-center justify-center gap-2">
            <span className="text-sm">🏍️</span>
            <span className="text-sm font-medium">骑手已接单，即将取货</span>
          </div>

          <div className="flex-1 flex items-center justify-center p-4">
            <div className="w-full card-premium p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-3xl mx-auto mb-4">
                🧑‍💼
              </div>
              <h3 className="text-lg font-bold text-white">
                {order?.rider_name || demoRider.name}
              </h3>
              <span className="inline-block text-xs text-white/50 bg-secondary px-3 py-1 rounded-full mt-2">
                {order?.delivery_platform || demoRider.platform}
              </span>
              <div className="flex items-center justify-center gap-1 mt-3">
                <Star className="w-3 h-3 fill-primary text-primary" />
                <span className="text-xs text-white/50">{demoRider.rating}% 好评率</span>
              </div>
              <button className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500 text-white text-sm font-medium">
                <Phone className="w-4 h-4" />
                <span>联系骑手</span>
              </button>
            </div>
          </div>
        </div>

        {/* State 4: Picked Up - Delivering */}
        <div className={`absolute inset-0 flex flex-col transition-all duration-500 ${
          currentState === "picked_up" ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}>
          <div className="bg-primary/20 border-b border-primary/30 text-primary py-3 px-4 flex items-center justify-center gap-2">
            <span className="text-sm">🏍️</span>
            <span className="text-sm font-medium">骑手正在配送中</span>
          </div>

          <div className="flex-1 p-4">
            <DeliveryMap 
              riderLat={order?.rider_lat}
              riderLng={order?.rider_lng}
            />
          </div>

          <div className="mx-4 mb-4 card-premium p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-xl">
                🧑‍💼
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-white text-sm">
                    {order?.rider_name || demoRider.name}
                  </h4>
                  <span className="text-xs text-white/50 bg-secondary px-2 py-0.5 rounded-full">
                    {order?.delivery_platform || demoRider.platform}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3 h-3 fill-primary text-primary" />
                  <span className="text-xs text-white/50">{demoRider.rating}% 好评率</span>
                </div>
              </div>
              <button className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">
                <Phone className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* State 5: Delivered */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center px-6 transition-all duration-500 ${
          currentState === "delivered" ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        }`}>
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-white text-center">
            咖啡已送达！
          </h2>
          <p className="text-sm text-white/50 mt-2 text-center">
            感谢您的订购，请享用您的咖啡
          </p>
          
          {!order?.order_ratings && (
            <button
              onClick={() => setShowRatingModal(true)}
              className="mt-8 px-8 py-4 bg-primary text-white rounded-2xl font-semibold"
            >
              为这杯咖啡评分
            </button>
          )}

          {order?.order_ratings && (
            <div className="mt-6 card-premium p-4 w-full max-w-xs">
              <p className="text-xs text-white/50 text-center mb-2">您的评价</p>
              <div className="flex justify-center gap-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-primary">{order.order_ratings.taste_rating}</p>
                  <p className="text-xs text-white/50">口味</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-primary">{order.order_ratings.packaging_rating}</p>
                  <p className="text-xs text-white/50">包装</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-primary">{order.order_ratings.timeliness_rating}</p>
                  <p className="text-xs text-white/50">时效</p>
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
