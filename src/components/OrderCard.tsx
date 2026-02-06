import * as React from "react";
import { Clock, ChevronRight, Star, Coffee } from "lucide-react";

type OrderStatus = "pending" | "preparing" | "ready" | "delivering" | "completed";

interface OrderCardProps {
  id: string;
  productName: string;
  productNameEn?: string;
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
  onClick: () => void;
  t: (zh: string, en: string) => string;
}

const getStatusConfig = (t: (zh: string, en: string) => string) => ({
  pending: { label: t("待接单", "Pending"), color: "text-muted-foreground", bgColor: "bg-secondary" },
  preparing: { label: t("制作中", "Preparing"), color: "text-primary", bgColor: "bg-primary/10" },
  ready: { label: t("待取货", "Ready"), color: "text-primary", bgColor: "bg-primary/10" },
  delivering: { label: t("配送中", "Delivering"), color: "text-primary", bgColor: "bg-primary/10" },
  completed: { label: t("已完成", "Completed"), color: "text-muted-foreground", bgColor: "bg-secondary" },
});

export const OrderCard = React.forwardRef<HTMLButtonElement, OrderCardProps>(
  (
    {
      id,
      productName,
      productNameEn,
      price,
      status,
      cafeName,
      cafeNameEn,
      cafeRating,
      merchantId,
      createdAt,
      createdAtEn,
      isRevealed,
      userRating,
      onClick,
      t,
    },
    ref
  ) => {
    const statusConfig = getStatusConfig(t);
    const statusInfo = statusConfig[status];
    const displayCafeName = t(cafeName || "", cafeNameEn || cafeName || "");
    const displayProductName = t(productName, productNameEn || productName);
    const displayCreatedAt = t(createdAt, createdAtEn || createdAt);

    return (
      <button
        ref={ref}
        onClick={onClick}
        className="w-full text-left bg-card rounded-2xl border border-border p-4 hover:border-primary/30 transition-all"
      >
        {/* Top Row: Store & Status */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Coffee className="w-4 h-4 text-primary" />
            </div>
            {isRevealed ? (
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground truncate">
                    {displayCafeName}
                  </span>
                  {cafeRating && (
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      <Star className="w-3 h-3 fill-primary text-primary" />
                      <span className="text-xs font-medium text-primary">
                        {cafeRating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
                {merchantId && (
                  <span className="text-xs text-muted-foreground font-mono">
                    ID: {merchantId.slice(0, 8).toUpperCase()}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-sm text-muted-foreground italic">
                {t("等待揭晓...", "Awaiting reveal...")}
              </span>
            )}
          </div>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusInfo.color} ${statusInfo.bgColor}`}>
            {statusInfo.label}
          </span>
        </div>

        {/* Middle Row: Product Info */}
        <div className="flex items-center justify-between py-2 border-t border-b border-border">
          <div className="flex-1">
            <h3 className="font-medium text-foreground">{displayProductName}</h3>
            <div className="flex items-center gap-1 mt-1 text-muted-foreground text-xs">
              <Clock className="w-3 h-3" />
              <span>{displayCreatedAt}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-primary font-bold text-lg">¥{price.toFixed(0)}</p>
          </div>
        </div>

        {/* Bottom Row: Actions or Rating */}
        <div className="flex items-center justify-between mt-3">
          {status === "completed" && userRating ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{t("我的评价", "My Rating")}</span>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3 h-3 ${
                      star <= userRating
                        ? "fill-primary text-primary"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
            </div>
          ) : status === "completed" && !userRating ? (
            <span className="text-xs text-primary">{t("点击评价获取积分 →", "Rate to earn points →")}</span>
          ) : !isRevealed && status === "pending" ? (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs text-muted-foreground">{t("咖啡馆正在确认中...", "Café confirming...")}</span>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">{t("点击查看详情", "Tap for details")}</span>
          )}
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </div>
      </button>
    );
  }
);

OrderCard.displayName = "OrderCard";
