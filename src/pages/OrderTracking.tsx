import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  MapPin, 
  Phone, 
  ChevronLeft, 
  Coffee, 
  Home, 
  Star,
  Navigation,
  CheckCircle2
} from "lucide-react";
import cafeInterior from "@/assets/cafe-interior.jpg";

type OrderState = "matching" | "reveal" | "delivering";

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
const DeliveryMap = () => {
  const [riderProgress, setRiderProgress] = useState(30);

  useEffect(() => {
    const interval = setInterval(() => {
      setRiderProgress(prev => prev < 70 ? prev + 5 : prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

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

const OrderTracking = () => {
  const navigate = useNavigate();
  const [orderState, setOrderState] = useState<OrderState>("matching");
  const [showRevealCard, setShowRevealCard] = useState(false);

  // Auto transition for reveal animation
  useEffect(() => {
    if (orderState === "reveal") {
      const timer = setTimeout(() => setShowRevealCard(true), 300);
      return () => clearTimeout(timer);
    } else {
      setShowRevealCard(false);
    }
  }, [orderState]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border safe-top">
        <div className="flex items-center justify-between px-4 py-3 max-w-md mx-auto">
          <button 
            onClick={() => navigate("/")}
            className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-base font-semibold text-foreground">订单追踪</h1>
          <div className="w-9" />
        </div>
      </header>

      {/* Dev Panel */}
      <div className="bg-secondary/50 border-b border-border px-4 py-2">
        <p className="text-xs text-muted-foreground mb-2 text-center">🛠 开发演示面板</p>
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => setOrderState("matching")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              orderState === "matching" 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary text-muted-foreground hover:bg-mist-light"
            }`}
          >
            匹配中
          </button>
          <button
            onClick={() => setOrderState("reveal")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              orderState === "reveal" 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary text-muted-foreground hover:bg-mist-light"
            }`}
          >
            揭晓
          </button>
          <button
            onClick={() => setOrderState("delivering")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              orderState === "delivering" 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary text-muted-foreground hover:bg-mist-light"
            }`}
          >
            配送中
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative overflow-hidden">
        {/* State 1: Matching */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center px-6 transition-all duration-500 ${
          orderState === "matching" ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
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

        {/* State 2: Reveal */}
        <div className={`absolute inset-0 flex flex-col transition-all duration-500 ${
          orderState === "reveal" ? "opacity-100" : "opacity-0 pointer-events-none"
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
                  src={cafeInterior}
                  alt="咖啡馆内景"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white/70 text-xs mb-1">为您制作</p>
                  <h3 className="text-white text-2xl font-bold">静思咖啡工作室</h3>
                </div>
              </div>

              {/* Details */}
              <div className="p-5 space-y-4">
                {/* Barista & Equipment */}
                <div className="flex gap-4">
                  <div className="flex-1 bg-secondary rounded-xl p-3">
                    <p className="text-xs text-muted-foreground">首席咖啡师</p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">小杰</p>
                  </div>
                  <div className="flex-1 bg-secondary rounded-xl p-3">
                    <p className="text-xs text-muted-foreground">设备</p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">辣妈咖啡机</p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 py-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">4.9 · 精品认证</span>
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

        {/* State 3: Delivering */}
        <div className={`absolute inset-0 flex flex-col transition-all duration-500 ${
          orderState === "delivering" ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}>
          {/* Status Banner */}
          <div className="bg-primary text-primary-foreground py-3 px-4 flex items-center justify-center gap-2">
            <span className="text-lg">🏍️</span>
            <span className="font-medium">骑手正在配送中</span>
          </div>

          {/* Map Area */}
          <div className="flex-1 p-4">
            <DeliveryMap />
          </div>

          {/* Rider Info Card */}
          <div className="mx-4 mb-4 bg-card rounded-2xl p-4 shadow-lg border border-border">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center text-2xl">
                🧑‍💼
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-foreground">王师傅</h4>
                  <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                    顺丰配送
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3 h-3 fill-primary text-primary" />
                  <span className="text-xs text-muted-foreground">98% 好评率</span>
                </div>
              </div>
              <button className="w-11 h-11 rounded-full bg-green-500 flex items-center justify-center text-white shadow-lg">
                <Phone className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
