import { Ticket } from "lucide-react";

export type CouponType = "universal" | "americano" | "latte";

interface CouponCardProps {
  id: string;
  type: CouponType;
  title: string;
  value: number;
  minSpend?: number;
  expiryDate: string;
  isUsed?: boolean;
  isExpired?: boolean;
  onSelect?: (id: string) => void;
  selected?: boolean;
}

const couponStyles: Record<CouponType, { gradient: string; accent: string; label: string }> = {
  universal: {
    gradient: "from-amber-400 via-yellow-500 to-amber-600",
    accent: "text-amber-900",
    label: "全品类通用券",
  },
  americano: {
    gradient: "from-slate-300 via-gray-400 to-slate-500",
    accent: "text-slate-800",
    label: "美式咖啡专享",
  },
  latte: {
    gradient: "from-purple-400 via-primary to-purple-600",
    accent: "text-white",
    label: "拿铁专享券",
  },
};

export const CouponCard = ({
  id,
  type,
  title,
  value,
  minSpend,
  expiryDate,
  isUsed = false,
  isExpired = false,
  onSelect,
  selected = false,
}: CouponCardProps) => {
  const style = couponStyles[type];
  const isDisabled = isUsed || isExpired;

  return (
    <button
      onClick={() => !isDisabled && onSelect?.(id)}
      disabled={isDisabled}
      className={`relative w-full overflow-hidden card-lg !p-0 ${
        isDisabled ? "opacity-50 cursor-not-allowed" : ""
      } ${selected ? "ring-2 ring-primary ring-offset-2" : ""}`}
    >
      {/* Ticket Shape Container */}
      <div className="flex min-h-[100px]">
        {/* Left Section - Value */}
        <div className={`relative flex-shrink-0 w-28 bg-gradient-to-br ${style.gradient} p-4 flex flex-col items-center justify-center rounded-l-2xl`}>
          {/* Perforated edge effect */}
          <div className="absolute right-0 top-0 bottom-0 w-3 flex flex-col justify-around">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-3 h-3 rounded-full bg-background -mr-1.5" />
            ))}
          </div>
          
          <span className={`text-xs font-medium ${style.accent} opacity-80`}>立减</span>
          <div className={`flex items-baseline ${style.accent}`}>
            <span className="text-2xl font-bold">¥</span>
            <span className="text-4xl font-black">{value}</span>
          </div>
          {minSpend && (
            <span className={`text-[10px] ${style.accent} opacity-70 mt-1`}>
              满¥{minSpend}可用
            </span>
          )}
        </div>

        {/* Right Section - Details */}
        <div className="flex-1 bg-card border border-l-0 border-border rounded-r-2xl p-4 text-left">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-foreground text-sm">{title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{style.label}</p>
            </div>
            <Ticket className={`w-5 h-5 ${isDisabled ? "text-muted-foreground" : "text-primary"}`} />
          </div>
          
          <div className="mt-3 pt-3 border-t border-dashed border-border flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              有效期至 {expiryDate}
            </span>
            {isUsed ? (
              <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                已使用
              </span>
            ) : isExpired ? (
              <span className="text-xs font-medium text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">
                已过期
              </span>
            ) : (
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                可使用
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Used/Expired Overlay */}
      {isDisabled && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`w-20 h-20 rounded-full border-4 ${isUsed ? "border-muted-foreground" : "border-destructive"} flex items-center justify-center rotate-[-15deg] opacity-60`}>
            <span className={`text-sm font-bold ${isUsed ? "text-muted-foreground" : "text-destructive"}`}>
              {isUsed ? "已使用" : "已过期"}
            </span>
          </div>
        </div>
      )}
    </button>
  );
};
