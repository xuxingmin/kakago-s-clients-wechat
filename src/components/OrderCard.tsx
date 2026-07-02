import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import {
  Star,
  Coffee,
  Phone,
  RotateCcw,
  ChevronRight,
  FileText,
  Ban,
  LifeBuoy,
  ChevronDown,
} from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { AfterSalesSheet } from "@/components/AfterSalesSheet";

type OrderStatus = "pending" | "preparing" | "delivering" | "delivered" | "completed";

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
  delivered: 100,
  completed: 100,
};

const getStatusConfig = (t: (zh: string, en: string) => string) => ({
  pending: { label: t("待接单", "Pending"), color: "text-primary", borderColor: "border-primary/40", bgColor: "bg-primary/15", blink: true },
  preparing: { label: t("制作中", "Making"), color: "text-primary", borderColor: "border-primary/40", bgColor: "bg-primary/15", blink: false },
  delivering: { label: t("配送中", "Delivering"), color: "text-primary", borderColor: "border-primary/40", bgColor: "bg-primary/15", blink: false },
  delivered: { label: t("已送达", "Delivered"), color: "text-primary", borderColor: "border-primary/40", bgColor: "bg-primary/15", blink: false },
  completed: { label: t("已完成", "Done"), color: "text-foreground/45", borderColor: "border-foreground/15", bgColor: "bg-foreground/[0.04]", blink: false },
});

const AFTER_SALES_WINDOW_MS = 24 * 60 * 60 * 1000;

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
      merchantId,
      isRevealed,
      userRating,
      onClick,
      onContact,
      onReorder,
      onCancel,
      onInvoice,
      t,
      orderCreatedMs,
    },
    ref
  ) => {
    const { toast } = useToast();
    const statusConfig = getStatusConfig(t);
    const statusInfo = statusConfig[status];
    const displayCafeName = t(cafeName || "", cafeNameEn || cafeName || "");
    const displayEta = eta ? t(eta, etaEn || eta) : null;
    const progress = STATUS_PROGRESS[status];
    const isSearching = !isRevealed && status === "pending";
    const isCompleted = status === "completed";
    const isDelivered = status === "delivered";
    const isFinished = isCompleted || isDelivered;
    const canCancel = status === "pending";

    // History vs current-completed split
    const startOfToday = useMemo(() => new Date().setHours(0, 0, 0, 0), []);
    const isHistory =
      isCompleted &&
      (!!userRating || (orderCreatedMs !== undefined && orderCreatedMs < startOfToday));
    const isCurrentCompleted = isFinished && !isHistory;

    // After-sales availability
    const withinAfterSalesWindow =
      orderCreatedMs !== undefined && Date.now() - orderCreatedMs <= AFTER_SALES_WINDOW_MS;
    const afterSalesEnabled = isFinished
      ? withinAfterSalesWindow
      : status === "delivering";

    const [afterSalesOpen, setAfterSalesOpen] = useState(false);
    const [popoverOpen, setPopoverOpen] = useState(false);

    const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

    const handleAfterSalesClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!afterSalesEnabled) {
        if (isFinished) {
          toast({
            title: t("售后已超时", "After-sales expired"),
            description: t(
              "已超过该食品安全订单的售后有效时效（24 小时）",
              "Beyond the 24h food-safety after-sales window."
            ),
          });
        } else {
          toast({
            title: t("暂不可申请售后", "Not yet eligible"),
            description: t(
              "订单进入配送后即可发起售后申请",
              "After-sales opens once the order is out for delivery."
            ),
          });
        }
        return;
      }
      setPopoverOpen(false);
      setAfterSalesOpen(true);
    };

    const handleContact = (e: React.MouseEvent) => {
      e.stopPropagation();
      setPopoverOpen(false);
      onContact?.();
    };

    const handleInvoice = (e: React.MouseEvent) => {
      e.stopPropagation();
      setPopoverOpen(false);
      onInvoice?.();
    };

    return (
      <div className={`relative rounded-xl border bg-paper overflow-hidden transition-all duration-300 ${
        isSearching ? "border-primary/30 shadow-md" : "border-foreground/10"
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
              {displayEta && !isFinished && (
                <span className="text-[10px] font-mono text-primary/70">≈ {displayEta}</span>
              )}
            </div>
          </div>

          {/* Progress bar for active orders */}
          {!isFinished && (
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

          {/* Certified node attribution + total */}
          <div className="flex items-start justify-between pt-2 border-t border-dashed border-foreground/10 gap-2">
            <div className="flex-1 min-w-0">
              {isSearching ? (
                <span className="text-[10px] text-primary/70 font-mono animate-pulse">
                  {t("正在匹配附近认证节点", "Matching certified node…")}
                </span>
              ) : (
                <>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-[hsl(var(--matcha))]" />
                    <span className="text-[10.5px] text-foreground/85">
                      {t("由 ", "By ")}
                      <span className="font-mono font-bold text-primary tracking-[0.05em]">
                        HF-{String(((merchantId ?? displayCafeName ?? "017").charCodeAt(0) * 7) % 900 + 100)}
                      </span>
                      {t(" 认证节点制作", " · certified node")}
                    </span>
                  </div>
                  {displayCafeName && (
                    <div className="flex items-center gap-1 mt-0.5 pl-2.5 text-[9.5px] text-foreground/45 truncate">
                      <span className="truncate">{displayCafeName}</span>
                      {cafeRating && (
                        <span className="inline-flex items-center shrink-0">
                          <span className="mx-0.5 text-foreground/25">·</span>
                          <Star className="w-2.5 h-2.5 fill-copper-500 text-copper-500" />
                          <span className="ml-0.5 text-copper-600 tabular-nums">{cafeRating.toFixed(1)}</span>
                        </span>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
            <span className="text-base font-bold text-primary flex-shrink-0 tabular-nums">¥{price.toFixed(0)}</span>
          </div>
        </button>

        {/* Bottom action bar */}
        <div className="flex items-center justify-between gap-1.5 px-3.5 py-2.5 mt-2 border-t border-dashed border-foreground/10">

          {/* Leftmost pill — varies by state */}
          <div className="flex items-center">
            {!isFinished && (
              <button
                onClick={(e) => { e.stopPropagation(); if (canCancel) onCancel?.(); }}
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

            {isCurrentCompleted && !userRating && (
              <button
                onClick={(e) => { e.stopPropagation(); onClick(); }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-[10px] font-medium text-primary hover:bg-primary/20 transition-colors"
              >
                <Star className="w-3 h-3" />
                {t("去评价", "Rate")}
              </button>
            )}

            {isHistory && (
              <span className="inline-flex items-center px-2.5 py-1.5 rounded-lg text-[10px] font-medium text-white/40 bg-white/[0.02] border border-white/[0.04]">
                {userRating ? t("已评价", "Rated") : t("未评价", "Not rated")}
              </span>
            )}
          </div>

          {/* Right cluster */}
          <div className="flex items-center gap-1.5">
            {/* Unified Contact & After-sales popover */}
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <button
                  onClick={stopPropagation}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[10px] font-medium text-white/55 hover:text-white/80 transition-colors"
                >
                  <LifeBuoy className="w-3 h-3" />
                  {t("联系与售后", "Help")}
                  <ChevronDown className="w-2.5 h-2.5 opacity-70" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                side="top"
                align="end"
                sideOffset={6}
                onClick={stopPropagation}
                className="w-52 p-1 bg-paper border border-foreground/12 shadow-lg rounded-xl"
              >
                {/* Active states: 联系商家 + 申请售后 */}
                {!isFinished && (
                  <>
                    <button
                      onClick={handleContact}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-[12px] text-espresso hover:bg-oat transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-primary" />
                      <span>{t("联系商家", "Call store")}</span>
                    </button>
                    <button
                      onClick={handleAfterSalesClick}
                      disabled={!afterSalesEnabled}
                      className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-[12px] transition-colors ${
                        afterSalesEnabled
                          ? "text-espresso hover:bg-oat"
                          : "text-foreground/30 cursor-not-allowed"
                      }`}
                    >
                      <LifeBuoy className="w-3.5 h-3.5" />
                      <span>{t("申请售后", "Request after-sales")}</span>
                    </button>
                  </>
                )}

                {/* Completed/Delivered states: 联系商家开票 + 申请售后 */}
                {isFinished && (
                  <>
                    <button
                      onClick={handleInvoice}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-[12px] text-espresso hover:bg-oat transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-primary" />
                      <span>{t("联系商家开票", "Request invoice")}</span>
                    </button>
                    <button
                      onClick={handleAfterSalesClick}
                      disabled={!afterSalesEnabled}
                      className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-[12px] transition-colors ${
                        afterSalesEnabled
                          ? "text-espresso hover:bg-oat"
                          : "text-foreground/30 cursor-not-allowed"
                      }`}
                    >
                      <LifeBuoy className="w-3.5 h-3.5" />
                      <span>{t("申请售后", "Request after-sales")}</span>
                    </button>
                  </>
                )}
              </PopoverContent>
            </Popover>

            {onReorder && (
              <button
                onClick={(e) => { e.stopPropagation(); onReorder(); }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-[10px] font-medium text-primary hover:bg-primary/20 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                {t("再来一单", "Reorder")}
              </button>
            )}

            {!isFinished && (
              <button
                onClick={(e) => { e.stopPropagation(); onClick(); }}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[10px] font-medium text-white/50 hover:text-white/70 transition-colors"
              >
                <ChevronRight className="w-3 h-3" />
                {t("查看", "View")}
              </button>
            )}
          </div>
        </div>

        {/* After-sales sheet */}
        <AfterSalesSheet
          open={afterSalesOpen}
          onClose={() => setAfterSalesOpen(false)}
          orderNumber={orderNumber}
          items={items}
          t={t}
        />
      </div>
    );
  }
);

OrderCard.displayName = "OrderCard";
