import * as React from "react";
import { useState, useEffect } from "react";
import { Star, Coffee, Phone, RotateCcw, ChevronRight, X, FileText, Ban } from "lucide-react";

type OrderStatus = "pending" | "preparing" | "delivering" | "completed";

interface OrderItem {
  name: string;
  nameEn?: string;
  qty: number;
  unitPrice?: number;
}

interface OrderCardProps {
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
  onCancel?: () => void;
  onInvoice?: () => void;
  t: (zh: string, en: string) => string;
  orderCreatedMs?: number;
}

const STATUS_PROGRESS: Record<OrderStatus, number> = {
  pending: 0,
  preparing: 35,
  delivering: 70,
  completed: 100,
};

const getStatusConfig = (t: (zh: string, en: string) => string) => ({
  pending: { label: t("待接单", "Pending"), color: "text-primary", borderColor: "border-primary/40", bgColor: "bg-primary/15", blink: true },
  preparing: { label: t("制作中", "Making"), color: "text-primary", borderColor: "border-primary/40", bgColor: "bg-primary/15", blink: false },
  delivering: { label: t("配送中", "Delivering"), color: "text-primary", borderColor: "border-primary/40", bgColor: "bg-primary/15", blink: false },
  completed: { label: t("已完成", "Done"), color: "text-white/40", borderColor: "border-white/10", bgColor: "bg-white/5", blink: false },
});

const REFUND_WINDOW_MS = 60 * 1000;

/* RadarScan removed — pending state now uses same layout as other states */

export const OrderCard = React.forwardRef<HTMLButtonElement, OrderCardProps>(
  (
    {
      orderNumber,
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
      onCancel,
      onInvoice,
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
    const canCancel = status === "pending";

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



    return (
      <div className={`relative rounded-xl border bg-[hsl(270,15%,10%)] overflow-hidden transition-all duration-300 ${
        isSearching ? "border-primary/25 shadow-[0_0_20px_hsla(271,81%,56%,0.08)]" : "border-white/[0.06]"
      }`}>
        <button ref={ref} onClick={onClick} className="w-full text-left p-3.5 pb-0">
          {/* Header: Order number + Status */}
          <div className="flex items-center justify-between mb-2.5">
            <div className="min-w-0">
              <span className="text-[11px] font-mono text-white/30 block">
                {t("订单编号", "Order No")}
              </span>
              <span className={`text-sm font-bold font-mono tracking-wide ${isSearching ? "text-primary" : "text-white"}`}>
                {orderNumber}
              </span>
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${statusInfo.color} ${statusInfo.bgColor} ${statusInfo.borderColor} ${statusInfo.blink ? "animate-pulse" : ""}`}>
                {statusInfo.label}
              </span>
              {displayEta && !isCompleted && (
                <span className="text-[10px] font-mono text-primary/70">≈ {displayEta}</span>
              )}
            </div>
          </div>

          {/* Progress bar for active orders */}
          {!isCompleted && (
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 h-[3px] rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 bg-primary"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-white/30 flex-shrink-0">{progress}%</span>
            </div>
          )}

          {/* Items list */}
          <div className="space-y-1.5 mb-2.5">
            {(items || []).map((item, idx) => {
              const name = t(item.name, item.nameEn || item.name);
              return (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <Coffee className="w-3.5 h-3.5 text-primary/40 flex-shrink-0" />
                    <span className="text-xs text-white/70 truncate">{name}</span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs font-mono text-white/40">×{item.qty}</span>
                    {item.unitPrice && (
                      <span className="text-xs font-mono text-white/30">¥{(item.unitPrice * item.qty).toFixed(0)}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cafe attribution + total */}
          <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
            <div className="flex items-center gap-1.5 min-w-0">
              {!isSearching && storeLogo ? (
                <img src={storeLogo} alt="" className="w-4 h-4 rounded-full object-cover" />
              ) : !isSearching ? (
                <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Coffee className="w-2.5 h-2.5 text-primary/40" />
                </div>
              ) : null}
              {isSearching ? (
                <span className="text-[10px] text-primary/60 font-mono animate-pulse">
                  {t("正在为您匹配最近的精品咖啡馆", "Matching nearest specialty café")}
                </span>
              ) : (
                <span className="text-[10px] text-white/30 truncate">
                  {displayCafeName} {t("为你呈现", "presents")}
                  {cafeRating && (
                    <span className="inline-flex items-center ml-1">
                      <Star className="w-2.5 h-2.5 fill-primary text-primary inline" />
                      <span className="text-primary/60 ml-0.5">{cafeRating.toFixed(1)}</span>
                    </span>
                  )}
                </span>
              )}
            </div>
            <span className="text-base font-bold text-primary flex-shrink-0">¥{price.toFixed(0)}</span>
          </div>
        </button>

        {/* Bottom action bar */}
        <div className="flex items-center justify-between px-3.5 py-2.5 mt-2 border-t border-dashed border-white/[0.05]">
          {/* Left side */}
          <div className="flex items-center gap-1.5">
            {!isCompleted && onCancel && (
              <button
                onClick={(e) => { e.stopPropagation(); if (canCancel) onCancel(); }}
                disabled={!canCancel}
                className={`flex items-center gap-1 px-2 py-1.5 rounded-lg border text-[10px] font-medium transition-colors ${
                  canCancel
                    ? "bg-white/[0.04] border-white/[0.06] text-white/50 hover:text-white/70"
                    : "bg-white/[0.02] border-white/[0.04] text-white/20 cursor-not-allowed"
                }`}
              >
                <Ban className="w-3 h-3" />
                {t("取消订单", "Cancel")}
              </button>
            )}
            {isCompleted && !userRating && (
              <button
                onClick={(e) => { e.stopPropagation(); onClick(); }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-[10px] font-medium text-primary hover:bg-primary/20 transition-colors"
              >
                <Star className="w-3 h-3" />
                {t("评价得KAKA豆", "Rate for beans")}
              </button>
            )}
            {isCompleted && userRating && (
              <span className="text-[10px] text-white/30">
                {t("已评价", "Rated")}
              </span>
            )}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-1.5">
            {isCompleted && onInvoice && (
              <button
                onClick={(e) => { e.stopPropagation(); onInvoice(); }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-primary/30 bg-primary/5 text-[10px] font-medium text-primary hover:bg-primary/15 transition-colors"
              >
                <FileText className="w-3 h-3" />
                {t("联系店家开票", "Request Invoice")}
              </button>
            )}

            {!isCompleted && onContact && (
              <button
                onClick={(e) => { e.stopPropagation(); onContact(); }}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[10px] font-medium text-white/50 hover:text-white/70 transition-colors"
              >
                <Phone className="w-3 h-3" />
                {t("联系商家", "Contact")}
              </button>
            )}

            {onReorder && (
              <button
                onClick={(e) => { e.stopPropagation(); onReorder(); }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-[10px] font-medium text-primary hover:bg-primary/20 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                {t("再来一单", "Reorder")}
              </button>
            )}

            {!isCompleted && (
              <button
                onClick={(e) => { e.stopPropagation(); onClick(); }}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[10px] font-medium text-white/50 hover:text-white/70 transition-colors"
              >
                <ChevronRight className="w-3 h-3" />
                {t("查看订单", "View")}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
);

OrderCard.displayName = "OrderCard";
