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
  createdAt: string;
  isRevealed: boolean;
  userRating?: number;
  onClick: () => void;
}

const statusConfig: Record<OrderStatus, { label: string; color: string }> = {
  pending: { label: "待接单", color: "text-muted-foreground" },
  preparing: { label: "制作中", color: "text-primary" },
  ready: { label: "待取货", color: "text-primary" },
  delivering: { label: "配送中", color: "text-primary" },
  completed: { label: "已完成", color: "text-muted-foreground" },
};

export const OrderCard = ({
  id,
  productName,
  productImage,
  price,
  status,
  cafeName,
  cafeRating,
  createdAt,
  isRevealed,
  userRating,
  onClick,
}: OrderCardProps) => {
  const statusInfo = statusConfig[status];

  return (
    <button
      onClick={onClick}
      className="card-premium p-4 w-full text-left transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Store className="w-4 h-4 text-muted-foreground" />
          {isRevealed ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">
                {cafeName}
              </span>
              {/* Store Rating Display */}
              {cafeRating && (
                <div className="flex items-center gap-0.5 bg-primary/10 px-1.5 py-0.5 rounded-full">
                  <Star className="w-3 h-3 fill-primary text-primary" />
                  <span className="text-xs font-medium text-primary">
                    {cafeRating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <span className="text-sm text-muted-foreground italic">
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
          <h3 className="font-medium text-foreground truncate">{productName}</h3>
          <div className="flex items-center gap-1 mt-1 text-muted-foreground text-xs">
            <Clock className="w-3 h-3" />
            <span>{createdAt}</span>
          </div>
          <p className="text-primary font-bold mt-2">¥{price.toFixed(0)}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground self-center" />
      </div>

      {/* User Rating (for completed orders) */}
      {status === "completed" && userRating && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">我的评价：</span>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3.5 h-3.5 ${
                    star <= userRating
                      ? "fill-primary text-primary"
                      : "text-border"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pending to rate hint (for completed orders without rating) */}
      {status === "completed" && !userRating && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">点击评价获取积分</span>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-3.5 h-3.5 text-border" />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mystery reveal animation hint */}
      {!isRevealed && status === "pending" && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="shimmer h-8 rounded-lg bg-secondary flex items-center justify-center">
            <span className="text-xs text-muted-foreground relative z-10">
              咖啡馆正在确认中，稍后揭晓...
            </span>
          </div>
        </div>
      )}
    </button>
  );
};
