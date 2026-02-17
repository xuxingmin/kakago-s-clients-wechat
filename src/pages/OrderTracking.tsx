import { useState, useEffect, useRef } from "react";
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
  Package,
  X,
  Send
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useOrder, submitOrderRating } from "@/hooks/useOrders";
import { useLanguage } from "@/contexts/LanguageContext";

type OrderState = "pending" | "accepted" | "rider_assigned" | "picked_up" | "delivered" | "rating";

// Hefei independent coffee brands
const hefeiBrands = [
  "赤云咖啡", "山丘咖啡", "CUBIC³", "野兽派", "1912咖啡",
  "鹿角巷", "拾光社", "半日闲", "无序咖啡", "对白咖啡",
  "三分之一", "松果咖啡", "觅境", "壹杯咖啡", "沐森",
  "时光邮局", "荒野咖啡", "旧日时光", "幸会咖啡", "云端咖啡",
];

// Cosmic Universe Scanner Component
const CosmicScanner = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [matchedBrand, setMatchedBrand] = useState<string | null>(null);
  const [matchedBrands, setMatchedBrands] = useState<Set<string>>(new Set());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const W = 360;
    const H = 400;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    const stars = Array.from({ length: 150 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.2,
      opacity: Math.random() * 0.7 + 0.1,
      twinkleSpeed: Math.random() * 0.03 + 0.005,
      phase: Math.random() * Math.PI * 2,
      color: Math.random() > 0.8 
        ? [180, 200, 255]
        : Math.random() > 0.5
          ? [220, 200, 255]
          : [255, 255, 255],
    }));

    const shootingStars: { x: number; y: number; vx: number; vy: number; life: number; maxLife: number }[] = [];

    const nebula = Array.from({ length: 30 }, () => ({
      x: W / 2 + (Math.random() - 0.5) * 200,
      y: H / 2 + (Math.random() - 0.5) * 200,
      r: Math.random() * 40 + 20,
      opacity: Math.random() * 0.04 + 0.01,
      hue: Math.random() > 0.5 ? 265 : 280,
      drift: Math.random() * 0.2 - 0.1,
      phase: Math.random() * Math.PI * 2,
    }));

    let frame = 0;
    let animId: number;

    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, W, H);

      nebula.forEach((n) => {
        const breathe = Math.sin(frame * 0.008 + n.phase) * 0.5 + 0.5;
        const grad = ctx.createRadialGradient(
          n.x + Math.sin(frame * 0.003 + n.phase) * 10,
          n.y + Math.cos(frame * 0.004 + n.phase) * 8,
          0, n.x, n.y, n.r
        );
        grad.addColorStop(0, `hsla(${n.hue}, 70%, 50%, ${n.opacity * (0.6 + breathe * 0.4)})`);
        grad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      stars.forEach((s) => {
        const twinkle = Math.sin(frame * s.twinkleSpeed + s.phase) * 0.4 + 0.6;
        const alpha = s.opacity * twinkle;
        if (s.r > 1) {
          const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 3);
          glow.addColorStop(0, `rgba(${s.color.join(",")}, ${alpha * 0.3})`);
          glow.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.color.join(",")}, ${alpha})`;
        ctx.fill();
      });

      if (frame % 90 === 0 && shootingStars.length < 2) {
        shootingStars.push({
          x: Math.random() * W * 0.6, y: Math.random() * H * 0.3,
          vx: 3 + Math.random() * 2, vy: 1.5 + Math.random(),
          life: 0, maxLife: 30 + Math.random() * 20,
        });
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.x += ss.vx; ss.y += ss.vy; ss.life++;
        const fade = 1 - ss.life / ss.maxLife;
        ctx.save();
        ctx.globalAlpha = fade;
        const tailGrad = ctx.createLinearGradient(ss.x, ss.y, ss.x - ss.vx * 8, ss.y - ss.vy * 8);
        tailGrad.addColorStop(0, "rgba(255, 255, 255, 0.8)");
        tailGrad.addColorStop(1, "transparent");
        ctx.strokeStyle = tailGrad;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(ss.x - ss.vx * 8, ss.y - ss.vy * 8);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.restore();
        if (ss.life >= ss.maxLife) shootingStars.splice(i, 1);
      }

      const cx = W / 2;
      const cy = H / 2;
      const pulse = Math.sin(frame * 0.025) * 0.15 + 0.85;

      for (let i = 4; i > 0; i--) {
        const radius = 30 + i * 40;
        const ringPulse = Math.sin(frame * 0.012 + i * 0.8) * 0.06 + 0.94;
        ctx.beginPath();
        ctx.arc(cx, cy, radius * ringPulse, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(265, 70%, 60%, ${0.06 + (4 - i) * 0.025})`;
        ctx.lineWidth = 0.8;
        ctx.setLineDash([2, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      const angle1 = (frame * 0.018) % (Math.PI * 2);
      const angle2 = (angle1 + Math.PI) % (Math.PI * 2);
      [angle1, angle2].forEach((a, idx) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(a);
        const beamGrad = ctx.createLinearGradient(0, 0, 160, 0);
        beamGrad.addColorStop(0, `hsla(265, 80%, 60%, ${idx === 0 ? 0.2 : 0.12})`);
        beamGrad.addColorStop(0.6, `hsla(265, 80%, 60%, 0.05)`);
        beamGrad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, 160, -0.15, 0.15);
        ctx.closePath();
        ctx.fillStyle = beamGrad;
        ctx.fill();
        ctx.restore();
      });

      [35, 20, 10].forEach((size, idx) => {
        const r = size * pulse;
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        const alphas = [0.15, 0.3, 0.6];
        grad.addColorStop(0, `hsla(265, 80%, 70%, ${alphas[idx]})`);
        grad.addColorStop(0.6, `hsla(265, 80%, 50%, ${alphas[idx] * 0.3})`);
        grad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${0.8 + Math.sin(frame * 0.05) * 0.2})`;
      ctx.shadowColor = "rgba(139, 92, 246, 0.8)";
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;

      const orbX = cx + Math.cos(frame * 0.025) * 110;
      const orbY = cy + Math.sin(frame * 0.025) * 110;
      ctx.beginPath();
      ctx.arc(orbX, orbY, 2, 0, Math.PI * 2);
      ctx.fillStyle = "hsla(265, 80%, 70%, 0.8)";
      ctx.fill();

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      const brand = hefeiBrands[idx % hefeiBrands.length];
      setMatchedBrand(brand);
      setMatchedBrands(prev => new Set([...prev, brand]));
      idx++;
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative w-80 h-80">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ width: 360, height: 400 }} />
        {hefeiBrands.slice(0, 8).map((brand, i) => {
          const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
          const radius = 125;
          const isActive = brand === matchedBrand;
          const wasMatched = matchedBrands.has(brand);
          return (
            <div key={brand} className="absolute pointer-events-none" style={{ left: `calc(50% + ${Math.cos(angle) * radius}px)`, top: `calc(50% + ${Math.sin(angle) * radius}px)`, transform: "translate(-50%, -50%)" }}>
              <span className={`text-[10px] whitespace-nowrap px-2 py-0.5 rounded-full border transition-all duration-500 ${isActive ? "bg-primary/40 text-white border-primary/60 font-bold scale-125" : wasMatched ? "bg-primary/10 text-primary/70 border-primary/20" : "text-white/20 border-white/5 bg-white/5"}`} style={isActive ? { boxShadow: "0 0 16px rgba(139,92,246,0.6), 0 0 32px rgba(139,92,246,0.2)" } : {}}>
                {brand}
              </span>
            </div>
          );
        })}
        {hefeiBrands.slice(8, 14).map((brand, i) => {
          const angle = (i / 6) * Math.PI * 2 - Math.PI / 4;
          const radius = 75;
          const isActive = brand === matchedBrand;
          const wasMatched = matchedBrands.has(brand);
          return (
            <div key={brand} className="absolute pointer-events-none" style={{ left: `calc(50% + ${Math.cos(angle) * radius}px)`, top: `calc(50% + ${Math.sin(angle) * radius}px)`, transform: "translate(-50%, -50%)" }}>
              <span className={`text-[9px] whitespace-nowrap px-1.5 py-0.5 rounded-full transition-all duration-500 ${isActive ? "bg-primary/40 text-white font-bold scale-125" : wasMatched ? "text-primary/50" : "text-white/15"}`} style={isActive ? { boxShadow: "0 0 12px rgba(139,92,246,0.5)" } : {}}>
                {brand}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Delivery Map Component
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
      <div className="absolute inset-0 opacity-20">
        {[...Array(6)].map((_, i) => (
          <div key={`h-${i}`} className="absolute w-full h-px bg-white/20" style={{ top: `${i * 20}%` }} />
        ))}
        {[...Array(6)].map((_, i) => (
          <div key={`v-${i}`} className="absolute h-full w-px bg-white/20" style={{ left: `${i * 20}%` }} />
        ))}
      </div>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M 15 80 Q 30 60 50 50 T 85 20" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5" strokeDasharray="2,2" className="opacity-40" />
        <path d="M 15 80 Q 30 60 50 50 T 85 20" fill="none" stroke="hsl(var(--primary))" strokeWidth="1" strokeDasharray={`${riderProgress} 100`} />
      </svg>
      <div className="absolute" style={{ left: "15%", top: "80%", transform: "translate(-50%, -50%)" }}>
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <Coffee className="w-4 h-4 text-primary-foreground" />
        </div>
      </div>
      <div className="absolute transition-all duration-1000 ease-out" style={{ left: `${15 + riderProgress}%`, top: `${80 - riderProgress * 0.85}%`, transform: "translate(-50%, -50%)" }}>
        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-xs animate-bounce">🏍️</div>
      </div>
      <div className="absolute" style={{ left: "85%", top: "20%", transform: "translate(-50%, -50%)" }}>
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
          <Home className="w-4 h-4 text-background" />
        </div>
      </div>
      <div className="absolute top-3 right-3 bg-card/90 px-3 py-2 rounded-xl">
        <p className="text-xs text-muted-foreground">ETA</p>
        <p className="text-lg font-bold text-foreground">12 min</p>
      </div>
    </div>
  );
};

// ─── Horizontal Progress Bar Timeline ───
interface StatusTimelineProps {
  currentStatus: OrderState;
  timestamps: {
    created_at?: string;
    accepted_at?: string | null;
    rider_assigned_at?: string | null;
    picked_up_at?: string | null;
    delivered_at?: string | null;
  };
  onStatusClick?: (status: OrderState) => void;
  isInteractive?: boolean;
  t: (zh: string, en: string) => string;
}

const StatusTimeline = ({ currentStatus, onStatusClick, isInteractive, t }: StatusTimelineProps) => {
  const steps = [
    { key: "pending" as OrderState, labelZh: "待接单", labelEn: "Pending", icon: Clock },
    { key: "accepted" as OrderState, labelZh: "制作中", labelEn: "Brewing", icon: Coffee },
    { key: "picked_up" as OrderState, labelZh: "配送中", labelEn: "On Way", icon: Package },
    { key: "delivered" as OrderState, labelZh: "已送达", labelEn: "Done", icon: CheckCircle2 },
  ];

  const statusIndex = steps.findIndex(s => s.key === currentStatus);
  // Progress percentage for the bar (0 to 100)
  const progress = statusIndex >= 0 ? (statusIndex / (steps.length - 1)) * 100 : 0;

  return (
    <div className="mx-4 mt-2 mb-3">
      {isInteractive && (
        <p className="text-[10px] text-muted-foreground text-center mb-2">🛠 {t("点击切换状态演示", "Click to switch status")}</p>
      )}

      {/* Horizontal progress bar */}
      <div className="relative px-2 mb-3">
        <div className="absolute top-[11px] left-[calc(10%)] right-[calc(10%)] h-[2px] bg-secondary rounded-full" />
        <div 
          className="absolute top-[11px] left-[calc(10%)] h-[2px] bg-primary rounded-full transition-all duration-500"
          style={{ width: `${progress * 0.8}%` }}
        />
      </div>

      {/* Step icons + labels */}
      <div className="flex justify-between items-start">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index <= statusIndex;
          const isCurrent = step.key === currentStatus;

          return (
            <button
              key={step.key}
              onClick={() => isInteractive && onStatusClick?.(step.key)}
              disabled={!isInteractive}
              className={`flex flex-col items-center flex-1 gap-1 ${isInteractive ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCurrent
                    ? "bg-primary text-primary-foreground shadow-[0_0_12px_hsla(var(--primary),0.5)]"
                    : isActive
                      ? "bg-primary/25 text-primary"
                      : "bg-secondary text-muted-foreground"
                }`}
              >
                <Icon className="w-3 h-3" strokeWidth={1.5} />
              </div>
              <span className={`text-[10px] leading-tight text-center ${isActive ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                {t(step.labelZh, step.labelEn)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ─── Star Rating Row ───
const StarRatingRow = ({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) => (
  <div className="flex items-center justify-between py-3">
    <span className="text-sm text-foreground/70">{label}</span>
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map((v) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className="p-0.5 transition-transform active:scale-90"
        >
          <Star
            className={`w-5 h-5 transition-colors ${
              v <= value
                ? "fill-primary text-primary"
                : "fill-none text-muted-foreground/30"
            }`}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  </div>
);

// ─── Main Component ───
const OrderTracking = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("id");
  const { toast } = useToast();
  const { t } = useLanguage();

  const { order, loading } = useOrder(orderId);

  const initialStatus = searchParams.get("status");
  const [demoState, setDemoState] = useState<OrderState>(
    initialStatus === "pending" ? "pending" : "accepted"
  );
  const [showRevealCard, setShowRevealCard] = useState(false);
  const [tasteRating, setTasteRating] = useState(0);
  const [packagingRating, setPackagingRating] = useState(0);
  const [timelinessRating, setTimelinessRating] = useState(0);
  const [ratingComment, setRatingComment] = useState("");
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [showNavigateDialog, setShowNavigateDialog] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);

  const currentState: OrderState = order?.status as OrderState || demoState;

  useEffect(() => {
    if (currentState === "pending" && !orderId) {
      const timer = setTimeout(() => setDemoState("accepted"), 2500);
      return () => clearTimeout(timer);
    }
  }, [currentState, orderId]);

  useEffect(() => {
    if (currentState === "accepted") {
      const timer = setTimeout(() => setShowRevealCard(true), 300);
      return () => clearTimeout(timer);
    } else {
      setShowRevealCard(false);
    }
  }, [currentState]);

  const isRatingValid = tasteRating > 0 && packagingRating > 0 && timelinessRating > 0;

  const handleRatingSubmit = async () => {
    if (!isRatingValid) return;
    setIsSubmittingRating(true);
    try {
      if (orderId) {
        await submitOrderRating(orderId, tasteRating, packagingRating, timelinessRating, ratingComment);
      }
      setRatingSubmitted(true);
      toast({ title: t("评价已提交", "Review Submitted"), description: t("感谢您的评价！", "Thanks for your review!") });
    } catch {
      toast({ title: t("评价提交失败", "Submission Failed"), description: t("请稍后重试", "Please try again later"), variant: "destructive" });
    }
    setIsSubmittingRating(false);
  };

  const demoMerchant = {
    name: t("静思咖啡工作室", "Tranquil Coffee Studio"),
    rating: 4.9,
    barista: t("小杰", "Jay"),
    equipment: "La Marzocco",
    merchantId: "A1B2C3D4",
    phone: "021-12345678",
    latitude: 31.2304,
    longitude: 121.4737,
    address: t("上海市静安区南京西路123号", "123 West Nanjing Rd, Jing'an, Shanghai"),
    description: t("专注精品咖啡十二年，坚持产地直采精品豆。", "12 years of specialty coffee. Direct-sourced premium beans."),
    greeting_message: t("愿这杯咖啡带来温暖与能量。", "May this cup bring warmth and energy."),
  };

  const demoRider = {
    name: t("王师傅", "Driver Wang"),
    phone: "138****8888",
    platform: t("顺丰配送", "SF Express"),
    rating: 98,
  };

  const getMerchantInfo = () => {
    const merchant = order?.merchants || demoMerchant;
    return {
      name: merchant.name || demoMerchant.name,
      phone: merchant.phone || demoMerchant.phone,
      address: merchant.address || demoMerchant.address,
      latitude: merchant.latitude || demoMerchant.latitude,
      longitude: merchant.longitude || demoMerchant.longitude,
      description: (merchant as any).description || demoMerchant.description,
      greeting_message: (merchant as any).greeting_message || demoMerchant.greeting_message,
    };
  };

  const confirmNavigateToStore = () => {
    const info = getMerchantInfo();
    const name = encodeURIComponent(info.name);
    const amapUrl = `https://uri.amap.com/navigation?to=${info.longitude},${info.latitude},${name}&mode=car&policy=1&src=kafei&coordinate=gaode`;
    window.open(amapUrl, '_blank');
    setShowNavigateDialog(false);
  };

  const confirmContactStore = () => {
    const info = getMerchantInfo();
    if (info.phone) window.location.href = `tel:${info.phone}`;
    setShowContactDialog(false);
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
        <div className="flex items-center justify-between px-4 py-2.5 max-w-md mx-auto">
          <button onClick={() => navigate("/orders")} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
            <ChevronLeft className="w-4 h-4 text-foreground" strokeWidth={1.5} />
          </button>
          <h1 className="text-sm font-semibold text-foreground">{t("订单追踪", "Order Tracking")}</h1>
          <div className="w-8" />
        </div>
      </header>

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
        isInteractive={!orderId}
        onStatusClick={(status) => setDemoState(status)}
        t={t}
      />

      {/* Main Content */}
      <div className="flex-1 relative overflow-hidden">
        {/* State 1: Pending */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center px-6 transition-all duration-500 ${currentState === "pending" ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}>
          <CosmicScanner />
          <h2 className="text-lg font-bold text-foreground mt-8 text-center">
            {t("正在为您匹配您附近的精品咖啡店...", "Matching nearby specialty coffee shops...")}
          </h2>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            {t("请稍候，通常需要 10-30 秒", "Please wait, usually 10-30 seconds")}
          </p>
        </div>

        {/* State 2: Accepted */}
        <div className={`absolute inset-0 flex flex-col transition-all duration-500 ${currentState === "accepted" ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          <div className={`flex-1 px-4 pb-4 space-y-2 transition-all duration-700 ease-out ${showRevealCard ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
            {/* Coffee Parameters */}
            <div className="card-lg !p-3 space-y-2">
              <div className="flex items-center gap-2 pb-1.5 border-b border-border">
                <Coffee className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
                <span className="text-[10px] text-muted-foreground tracking-wider">{t("您的咖啡制作的相关参数", "Your Coffee Parameters")}</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <div className="bg-secondary/50 rounded-xl p-2">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t("咖啡机", "Machine")}</p>
                  <p className="text-[11px] font-medium text-foreground">La Marzocco</p>
                </div>
                <div className="bg-secondary/50 rounded-xl p-2">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t("磨豆机", "Grinder")}</p>
                  <p className="text-[11px] font-medium text-foreground">Mahlkönig EK43</p>
                </div>
              </div>
              <div className="bg-secondary/50 rounded-xl p-2">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t("咖啡豆拼配", "Blend")}</p>
                <p className="text-[11px] font-medium text-foreground">{t("埃塞俄比亚 耶加雪菲 60% + 哥伦比亚 慧兰 40%", "Ethiopia Yirgacheffe 60% + Colombia Huila 40%")}</p>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <div className="bg-secondary/50 rounded-xl p-2">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t("SCA 风味指向", "SCA Flavor")}</p>
                  <p className="text-[11px] font-medium text-foreground">{t("花香 · 柑橘 · 焦糖", "Floral · Citrus · Caramel")}</p>
                </div>
                <div className="bg-secondary/50 rounded-xl p-2">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t("萃取参数", "Extraction")}</p>
                  <p className="text-[11px] font-medium text-foreground">93°C / 25s / 1:2</p>
                </div>
              </div>
            </div>

            {/* Store Info */}
            <div className="card-lg !p-3 space-y-2">
              <div className="flex items-center gap-2 pb-1.5 border-b border-border">
                <Home className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{t("为您呈现", "Presented By")}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Coffee className="w-5 h-5 text-primary" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-foreground">{order?.merchants?.name || demoMerchant.name}</h3>
                  <p className="text-[10px] text-muted-foreground">{t("首席咖啡师", "Head Barista")}: {demoMerchant.barista}</p>
                </div>
                <div className="flex items-center gap-1 bg-primary/20 px-2 py-0.5 rounded-full">
                  <Star className="w-3 h-3 fill-primary text-primary" />
                  <span className="text-[10px] font-medium text-primary">{order?.merchants?.rating || demoMerchant.rating}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <div className="bg-secondary/50 rounded-xl p-2">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t("门店简介", "About")}</p>
                  <p className="text-[10px] text-foreground/70 leading-snug mt-0.5">{getMerchantInfo().description}</p>
                </div>
                <div className="bg-secondary/50 rounded-xl p-2">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t("店家寄语", "Message")}</p>
                  <p className="text-[10px] text-foreground/70 leading-snug mt-0.5">"{getMerchantInfo().greeting_message}"</p>
                </div>
              </div>
              <div className="flex justify-end">
                <span className="text-[9px] text-muted-foreground/50 font-mono">ID: {demoMerchant.merchantId}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button onClick={() => setShowNavigateDialog(true)} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl border border-primary/40 text-primary text-xs font-medium hover:bg-primary/10 transition-colors">
                <Navigation className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>{t("导航到店", "Navigate")}</span>
              </button>
              <button onClick={() => setShowContactDialog(true)} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl border border-primary/40 text-primary text-xs font-medium hover:bg-primary/10 transition-colors">
                <Phone className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>{t("联系门店", "Contact")}</span>
              </button>
            </div>
          </div>
        </div>

        {/* State 3: Rider Assigned */}
        <div className={`absolute inset-0 flex flex-col transition-all duration-500 ${currentState === "rider_assigned" ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="w-full card-xl text-center">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-3xl mx-auto mb-4">🧑‍💼</div>
              <h3 className="text-lg font-bold text-foreground">{order?.rider_name || demoRider.name}</h3>
              <span className="inline-block text-xs text-muted-foreground bg-secondary px-3 py-1 rounded-full mt-2">{order?.delivery_platform || demoRider.platform}</span>
              <div className="flex items-center justify-center gap-1 mt-3">
                <Star className="w-3 h-3 fill-primary text-primary" />
                <span className="text-xs text-muted-foreground">{demoRider.rating}% {t("好评率", "Rating")}</span>
              </div>
              <button className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-green-500 text-white text-sm font-medium">
                <Phone className="w-4 h-4" strokeWidth={1.5} />
                <span>{t("联系骑手", "Contact Rider")}</span>
              </button>
            </div>
          </div>
        </div>

        {/* State 4: Picked Up */}
        <div className={`absolute inset-0 flex flex-col transition-all duration-500 ${currentState === "picked_up" ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          <div className="flex-1 p-4">
            <DeliveryMap riderLat={order?.rider_lat} riderLng={order?.rider_lng} />
          </div>
          <div className="mx-4 mb-4 card-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-xl">🧑‍💼</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-foreground text-sm">{order?.rider_name || demoRider.name}</h4>
                  <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">{order?.delivery_platform || demoRider.platform}</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3 h-3 fill-primary text-primary" />
                  <span className="text-xs text-muted-foreground">{demoRider.rating}% {t("好评率", "Rating")}</span>
                </div>
              </div>
              <button className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">
                <Phone className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>

        {/* State 5: Delivered — Redesigned */}
        <div className={`absolute inset-0 overflow-y-auto transition-all duration-500 ${currentState === "delivered" ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          <div className="flex flex-col items-center px-5 pt-12 pb-8 max-w-sm mx-auto">

            {/* Breathing glow checkmark */}
            <div className="relative mb-5">
              <div className="absolute inset-0 rounded-full animate-pulse" style={{ boxShadow: "0 0 40px 8px hsla(var(--primary), 0.25)" }} />
              <div className="w-20 h-20 rounded-full border-2 border-primary/40 flex items-center justify-center relative" style={{ boxShadow: "0 0 24px hsla(var(--primary), 0.2)" }}>
                <CheckCircle2 className="w-10 h-10 text-primary" strokeWidth={1.5} />
              </div>
            </div>

            <h2 className="text-xl font-bold text-foreground mb-1">{t("咖啡已送达", "Coffee Delivered")}</h2>
            <p className="text-sm text-muted-foreground mb-8">{t("请享用您的咖啡", "Enjoy your coffee")}</p>

            {/* Inline Rating */}
            {!order?.order_ratings && !ratingSubmitted ? (
              <div className="w-full">
                {/* Rating dimensions */}
                <div className="w-full divide-y divide-border/50">
                  <StarRatingRow label={t("☕ 口味", "☕ Taste")} value={tasteRating} onChange={setTasteRating} />
                  <StarRatingRow label={t("📦 包装", "📦 Package")} value={packagingRating} onChange={setPackagingRating} />
                  <StarRatingRow label={t("⏱️ 时效", "⏱️ Speed")} value={timelinessRating} onChange={setTimelinessRating} />
                </div>

                {/* Feedback textarea */}
                <textarea
                  value={ratingComment}
                  onChange={(e) => setRatingComment(e.target.value)}
                  placeholder={t("分享你的体验（选填）...", "Share your experience (optional)...")}
                  className="w-full h-20 mt-5 px-4 py-3 bg-white/5 border border-border/30 rounded-2xl text-sm text-foreground placeholder:text-muted-foreground/40 resize-none focus:outline-none focus:ring-1 focus:ring-primary/40"
                  maxLength={200}
                />

                {/* Submit button */}
                <button
                  onClick={handleRatingSubmit}
                  disabled={!isRatingValid || isSubmittingRating}
                  className={`w-full mt-4 py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                    isRatingValid
                      ? "btn-gold"
                      : "bg-secondary text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  {isSubmittingRating ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>{t("提交评价", "Submit Review")}</>
                  )}
                </button>
              </div>
            ) : (
              /* Rating summary */
              <div className="w-full rounded-2xl bg-secondary/50 p-5">
                <p className="text-xs text-muted-foreground text-center mb-4">{t("您的评价", "Your Rating")}</p>
                <div className="flex justify-around">
                  {[
                    { v: order?.order_ratings?.taste_rating || tasteRating, l: t("口味", "Taste") },
                    { v: order?.order_ratings?.packaging_rating || packagingRating, l: t("包装", "Package") },
                    { v: order?.order_ratings?.timeliness_rating || timelinessRating, l: t("时效", "Speed") },
                  ].map((d) => (
                    <div key={d.l} className="text-center">
                      <div className="flex items-center justify-center gap-0.5 mb-1">
                        {[...Array(d.v)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
                        ))}
                      </div>
                      <p className="text-[11px] text-muted-foreground">{d.l}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-[70] transition-opacity duration-300 ${showNavigateDialog || showContactDialog ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => { setShowNavigateDialog(false); setShowContactDialog(false); }}
      />

      {/* Navigate Bottom Sheet */}
      <div className={`fixed bottom-0 left-0 right-0 z-[70] transition-transform duration-300 ease-out ${showNavigateDialog ? "translate-y-0" : "translate-y-full"}`}>
        <div className="bg-card rounded-t-3xl max-w-md mx-auto">
          <div className="flex justify-center pt-3 pb-2"><div className="w-10 h-1 bg-border rounded-full" /></div>
          <div className="flex items-center justify-between px-6 pb-4 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Navigation className="w-5 h-5 text-primary" strokeWidth={1.5} />
              {t("导航到门店", "Navigate to Store")}
            </h3>
            <button onClick={() => setShowNavigateDialog(false)} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="px-6 py-6 space-y-3">
            <p className="text-base font-medium text-foreground">{getMerchantInfo().name}</p>
            <p className="text-sm text-muted-foreground">{getMerchantInfo().address}</p>
            <p className="text-xs text-muted-foreground/60 pt-2">{t("将打开高德地图为您导航", "Opens Amap for navigation")}</p>
          </div>
          <div className="px-6 py-4 border-t border-border safe-bottom flex gap-3">
            <button onClick={() => setShowNavigateDialog(false)} className="flex-1 py-3 rounded-2xl bg-secondary text-foreground font-medium hover:bg-secondary/80 transition-colors">{t("取消", "Cancel")}</button>
            <button onClick={confirmNavigateToStore} className="flex-1 py-3 rounded-2xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">{t("开始导航", "Start")}</button>
          </div>
        </div>
      </div>

      {/* Contact Bottom Sheet */}
      <div className={`fixed bottom-0 left-0 right-0 z-[70] transition-transform duration-300 ease-out ${showContactDialog ? "translate-y-0" : "translate-y-full"}`}>
        <div className="bg-card rounded-t-3xl max-w-md mx-auto">
          <div className="flex justify-center pt-3 pb-2"><div className="w-10 h-1 bg-border rounded-full" /></div>
          <div className="flex items-center justify-between px-6 pb-4 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Phone className="w-5 h-5 text-green-500" strokeWidth={1.5} />
              {t("联系门店", "Contact Store")}
            </h3>
            <button onClick={() => setShowContactDialog(false)} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="px-6 py-6 space-y-3 text-center">
            <p className="text-base font-medium text-foreground">{getMerchantInfo().name}</p>
            <p className="text-3xl font-bold text-primary py-2">{getMerchantInfo().phone}</p>
            <p className="text-xs text-muted-foreground/60">{t("将呼叫门店联系电话", "Will call store phone number")}</p>
          </div>
          <div className="px-6 py-4 border-t border-border safe-bottom flex gap-3">
            <button onClick={() => setShowContactDialog(false)} className="flex-1 py-3 rounded-2xl bg-secondary text-foreground font-medium hover:bg-secondary/80 transition-colors">{t("取消", "Cancel")}</button>
            <button onClick={confirmContactStore} className="flex-1 py-3 rounded-2xl bg-green-500 text-white font-medium hover:bg-green-600 transition-colors">{t("立即拨打", "Call Now")}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
