import * as React from "react";
import { Clock, Store, ChevronRight, Star } from "lucide-react";

type OrderStatus = "pending" | "preparing" | "ready" | "delivering" | "completed";

interface OrderCardProps {
  id: string;
  productName: string;
  productImage: string;
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

const statusConfig: Record<OrderStatus, { label: string; color: string }> = {
  pending: { label: "待接单", color: "text-white/60" },
  preparing: { label: "制作中", color: "text-primary" },
  ready: { label: "待取货", color: "text-primary" },
  delivering: { label: "配送中", color: "text-primary" },
  completed: { label: "已完成", color: "text-white/50" },
};

export const OrderCard = React.forwardRef<HTMLButtonElement, OrderCardProps>(
  (
    {
      id,
      productName,
      productImage,
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
        className="card-premium p-4 w-full text-left transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] min-h-[120px]"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-white/60" />
            {isRevealed ? (
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">
                    {cafeName}
                  </span>
                  {/* Store Rating Display */}
                  {cafeRating && (
                    <div className="flex items-center gap-0.5 bg-primary/20 px-1.5 py-0.5 rounded-full">
                      <Star className="w-3 h-3 fill-primary text-primary" />
                      <span className="text-xs font-medium text-primary">
                        {cafeRating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
                {/* Merchant ID Display - show for preparing status */}
                {status === "preparing" && merchantId && (
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
          <span className={`text-sm font-medium ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
        </div>

        {/* Content */}
        <div className="flex gap-3">
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
            <img
              src={productImage}
              alt={productName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-white truncate">{productName}</h3>
            <div className="flex items-center gap-1 mt-1 text-white/50 text-xs">
              <Clock className="w-3 h-3" />
              <span>{createdAt}</span>
            </div>
            <p className="text-primary font-bold text-lg mt-2">¥{price.toFixed(0)}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-white/40 self-center" />
        </div>

        {/* User Rating (for completed orders) */}
        {status === "completed" && userRating && (
          <div className="mt-3 pt-3 border-t border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/50">我的评价：</span>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3.5 h-3.5 ${
                      star <= userRating
                        ? "fill-primary text-primary"
                        : "text-white/20"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Pending to rate hint (for completed orders without rating) */}
        {status === "completed" && !userRating && (
          <div className="mt-3 pt-3 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/50">点击评价获取积分</span>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-3.5 h-3.5 text-white/20" />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mystery reveal animation hint */}
        {!isRevealed && status === "pending" && (
          <div className="mt-3 pt-3 border-t border-white/10">
            <div className="shimmer h-8 rounded-lg bg-secondary flex items-center justify-center">
              <span className="text-xs text-white/50 relative z-10">
                咖啡馆正在确认中，稍后揭晓...
              </span>
            </div>
          </div>
        )}
      </button>
    );
  }
);

OrderCard.displayName = "OrderCard";
