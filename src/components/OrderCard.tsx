import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { ChevronRight, Star, Coffee, Phone, RotateCcw, X } from "lucide-react";

type OrderStatus = "pending" | "preparing" | "ready" | "delivering" | "completed";

interface OrderItem {
  name: string;
  nameEn?: string;
  qty: number;
}

interface OrderCardProps {
  id: string;
  items: OrderItem[];
  price: number;
  status: OrderStatus;
  cafeName?: string;
  cafeNameEn?: string;
  cafeRating?: number;
  merchantId?: string;
  createdAt: string;
  createdAtEn?: string;
  isRevealed: boolean;
  userRating?: number;
  eta?: string;
  etaEn?: string;
  storeLogo?: string;
  onClick: () => void;
  onContact?: () => void;
  onReorder?: () => void;
  onRefund?: () => void;
  t: (zh: string, en: string) => string;
  /** Timestamp (ms) when order was created, used for refund countdown */
  orderCreatedMs?: number;
}

const STATUS_PROGRESS: Record<OrderStatus, number> = {
  pending: 10,
  preparing: 45,
  ready: 70,
  delivering: 85,
  completed: 100,
};

const getStatusConfig = (t: (zh: string, en: string) => string) => ({
  pending: { label: t("匹配中", "Matching"), color: "text-primary", borderColor: "border-primary/40", bgColor: "bg-primary/15", blink: true },
  preparing: { label: t("制作中", "Making"), color: "text-primary", borderColor: "border-primary/40", bgColor: "bg-primary/15", blink: false },
  ready: { label: t("待取货", "Ready"), color: "text-primary", borderColor: "border-primary/40", bgColor: "bg-primary/15", blink: false },
  delivering: { label: t("配送中", "Delivering"), color: "text-primary", borderColor: "border-primary/40", bgColor: "bg-primary/15", blink: false },
  completed: { label: t("已完成", "Done"), color: "text-white/40", borderColor: "border-white/10", bgColor: "bg-white/5", blink: false },
});

const REFUND_WINDOW_MS = 60 * 1000; // 60 seconds

/* Radar scan animation for blind-box matching — purple themed */
const RadarScan = () => (
  <div className="w-[60px] h-[60px] rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-center relative overflow-hidden">
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border border-primary/15" />
      <div className="absolute w-6 h-6 rounded-full border border-primary/20" />
      <div className="absolute w-2 h-2 rounded-full bg-primary/60" />
    </div>
    <div
      className="absolute inset-0"
      style={{
        background: "conic-gradient(from 0deg, transparent 0deg, hsla(271, 81%, 56%, 0.25) 60deg, transparent 120deg)",
        animation: "radarSweep 2s linear infinite",
      }}
    />
    <span className="absolute bottom-0.5 text-[7px] font-mono font-bold text-primary/80 tracking-wider">SCAN</span>
  </div>
);

export const OrderCard = React.forwardRef<HTMLButtonElement, OrderCardProps>(
  (
    {
      items,
      price,
      status,
      cafeName,
      cafeNameEn,
      cafeRating,
      eta,
      etaEn,
      storeLogo,
      isRevealed,
      userRating,
      onClick,
      onContact,
      onReorder,
      onRefund,
      t,
      orderCreatedMs,
    },
    ref
  ) => {
    const statusConfig = getStatusConfig(t);
    const statusInfo = statusConfig[status];
    const displayCafeName = t(cafeName || "", cafeNameEn || cafeName || "");
    const displayEta = eta ? t(eta, etaEn || eta) : null;
    const progress = STATUS_PROGRESS[status];
    const isSearching = !isRevealed && status === "pending";
    const isCompleted = status === "completed";

    // Refund countdown logic
    const [refundSecondsLeft, setRefundSecondsLeft] = useState<number | null>(null);

    useEffect(() => {
      if (!orderCreatedMs || isCompleted) return;
      const calc = () => {
        const elapsed = Date.now() - orderCreatedMs;
        const remaining = Math.max(0, Math.ceil((REFUND_WINDOW_MS - elapsed) / 1000));
        setRefundSecondsLeft(remaining);
      };
      calc();
      const interval = setInterval(calc, 1000);
      return () => clearInterval(interval);
    }, [orderCreatedMs, isCompleted]);

    const canSelfRefund = refundSecondsLeft !== null && refundSecondsLeft > 0;

    // Format items display
    const itemsDisplay = (items || []).map((item) => {
      const name = t(item.name, item.nameEn || item.name);
      return `${name} ×${item.qty}`;
    }).join("、");

    return (
      <div className={`relative rounded-xl border bg-[hsl(270,15%,10%)] overflow-hidden transition-all duration-300 ${
        isSearching ? "border-primary/25 shadow-[0_0_20px_hsla(271,81%,56%,0.08)]" : "border-white/[0.06]"
      }`}>
        {/* Main clickable area */}
        <button
          ref={ref}
          onClick={onClick}
          className="w-full text-left p-3.5 pb-0"
        >
          <div className="flex gap-3">
            {/* Left: Store logo or radar */}
            {isSearching ? (
              <RadarScan />
            ) : (
              <div className="w-[60px] h-[60px] rounded-xl bg-card overflow-hidden flex-shrink-0 flex items-center justify-center">
                {storeLogo ? (
                  <img src={storeLogo} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                    <Coffee className="w-6 h-6 text-primary/40" />
                  </div>
                )}
              </div>
            )}

            {/* Middle: Info stack */}
            <div className="flex-1 min-w-0">
              {/* Row 1: Shop name + rating */}
              {isSearching ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono font-bold text-primary tracking-wider animate-pulse">
                    📡 MATCHING...
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-sm font-semibold text-white truncate">{displayCafeName}</span>
                  {cafeRating && (
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      <Star className="w-3 h-3 fill-primary text-primary" />
                      <span className="text-[11px] font-medium text-primary">{cafeRating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Row 2: Product details with quantities */}
              <p className="text-xs text-white/50 mt-0.5 truncate">
                {itemsDisplay}
              </p>

              {/* Row 3: Progress bar (active orders only) */}
              {!isCompleted && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-[3px] rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 bg-primary"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-white/30 flex-shrink-0">{progress}%</span>
                </div>
              )}
            </div>

            {/* Right: Price + status + ETA */}
            <div className="flex flex-col items-end justify-between flex-shrink-0 min-h-[60px]">
              <span className="text-base font-bold text-primary">¥{price.toFixed(0)}</span>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${statusInfo.color} ${statusInfo.bgColor} ${statusInfo.borderColor} ${statusInfo.blink ? "animate-pulse" : ""}`}>
                {statusInfo.label}
              </span>
              {displayEta && !isCompleted && (
                <span className="text-[10px] font-mono text-primary/70 mt-0.5">≈ {displayEta}</span>
              )}
            </div>
          </div>
        </button>

        {/* Bottom action bar */}
        <div className="flex items-center justify-between px-3.5 py-2.5 mt-2 border-t border-dashed border-white/[0.05]">
          {isCompleted && userRating ? (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-white/30">{t("已评价", "Rated")}</span>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-2.5 h-2.5 ${star <= userRating ? "fill-primary text-primary" : "text-white/15"}`}
                  />
                ))}
              </div>
            </div>
          ) : isCompleted && !userRating ? (
            <button onClick={onClick} className="text-[11px] font-medium text-primary hover:text-primary/80 transition-colors">
              {t("⭐ 评价得积分", "⭐ Rate for points")}
            </button>
          ) : isSearching ? (
            <span className="text-[10px] text-primary/60 font-mono">
              {t("正在为您匹配最近的精品咖啡师 (3km)", "Matching nearest barista (3km)")}
            </span>
          ) : (
            <span className="text-[10px] text-white/20" />
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-1.5">
            {/* Refund button for active orders */}
            {!isCompleted && onRefund && (
              canSelfRefund ? (
                <button
                  onClick={(e) => { e.stopPropagation(); onRefund(); }}
                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-destructive/10 border border-destructive/20 text-[10px] font-medium text-destructive hover:bg-destructive/20 transition-colors"
                >
                  <X className="w-3 h-3" />
                  {t(`退款 ${refundSecondsLeft}s`, `Refund ${refundSecondsLeft}s`)}
                </button>
              ) : (
                <button
                  onClick={(e) => { e.stopPropagation(); onContact?.(); }}
                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[10px] font-medium text-white/50 hover:text-white/70 transition-colors"
                >
                  <Phone className="w-3 h-3" />
                  {t("联系退款", "Contact Refund")}
                </button>
              )
            )}
            {isCompleted && onReorder && (
              <button
                onClick={(e) => { e.stopPropagation(); onReorder(); }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-[10px] font-medium text-primary hover:bg-primary/20 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                {t("再来一单", "Reorder")}
              </button>
            )}
            {!isCompleted && onContact && (
              <button
                onClick={(e) => { e.stopPropagation(); onContact(); }}
                className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/40 hover:text-white/70 hover:bg-white/[0.08] transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
              </button>
            )}
            {!isSearching && (
              <ChevronRight className="w-4 h-4 text-white/20 ml-0.5" />
            )}
          </div>
        </div>
      </div>
    );
  }
);

OrderCard.displayName = "OrderCard";
