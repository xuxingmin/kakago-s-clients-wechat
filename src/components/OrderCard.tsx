import * as React from "react";
import { Clock, Store, ChevronRight, Star, Coffee } from "lucide-react";

type OrderStatus = "pending" | "preparing" | "ready" | "delivering" | "completed";

interface OrderCardProps {
  id: string;
  productName: string;
  productImage?: string; // Now optional, not used in minimalist design
  price: number;
  status: OrderStatus;
  cafeName?: string;
  cafeRating?: number;
  merchantId?: string;
  createdAt: string;
  isRevealed: boolean;
  userRating?: number;
  onClick: () => void;
}

const statusConfig: Record<OrderStatus, { label: string; color: string; bgColor: string }> = {
  pending: { label: "待接单", color: "text-white/60", bgColor: "bg-white/10" },
  preparing: { label: "制作中", color: "text-primary", bgColor: "bg-primary/20" },
  ready: { label: "待取货", color: "text-primary", bgColor: "bg-primary/20" },
  delivering: { label: "配送中", color: "text-primary", bgColor: "bg-primary/20" },
  completed: { label: "已完成", color: "text-white/50", bgColor: "bg-white/10" },
};

export const OrderCard = React.forwardRef<HTMLButtonElement, OrderCardProps>(
  (
    {
      id,
      productName,
      price,
      status,
      cafeName,
      cafeRating,
      merchantId,
      createdAt,
      isRevealed,
      userRating,
      onClick,
    },
    ref
  ) => {
    const statusInfo = statusConfig[status];

    return (
      <button
        ref={ref}
        onClick={onClick}
        className="card-lg w-full text-left"
      >
        {/* Top Row: Store & Status */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Coffee className="w-4 h-4 text-primary" />
            </div>
            {isRevealed ? (
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white truncate">
                    {cafeName}
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
                  <span className="text-xs text-white/40 font-mono">
                    ID: {merchantId.slice(0, 8).toUpperCase()}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-sm text-white/50 italic">
                等待揭晓...
              </span>
            )}
          </div>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusInfo.color} ${statusInfo.bgColor}`}>
            {statusInfo.label}
          </span>
        </div>

        {/* Middle Row: Product Info */}
        <div className="flex items-center justify-between py-2 border-t border-b border-white/5">
          <div className="flex-1">
            <h3 className="font-medium text-white">{productName}</h3>
            <div className="flex items-center gap-1 mt-1 text-white/50 text-xs">
              <Clock className="w-3 h-3" />
              <span>{createdAt}</span>
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
              <span className="text-xs text-white/50">我的评价</span>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3 h-3 ${
                      star <= userRating
                        ? "fill-primary text-primary"
                        : "text-white/20"
                    }`}
                  />
                ))}
              </div>
            </div>
          ) : status === "completed" && !userRating ? (
            <span className="text-xs text-primary">点击评价获取积分 →</span>
          ) : !isRevealed && status === "pending" ? (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs text-white/50">咖啡馆正在确认中...</span>
            </div>
          ) : (
            <span className="text-xs text-white/40">点击查看详情</span>
          )}
          <ChevronRight className="w-4 h-4 text-white/30" />
        </div>
      </button>
    );
  }
);

OrderCard.displayName = "OrderCard";
