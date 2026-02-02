import { Ticket } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export interface Coupon {
  id: string;
  type: "universal" | "americano" | "latte" | "cappuccino";
  value: number;
  applicableProducts?: string[];
}

interface CouponFlagsProps {
  coupons: Coupon[];
}

// 旗帜配色方案
const flagColors: Record<string, { bg: string; border: string; text: string }> = {
  universal: {
    bg: "bg-gradient-to-b from-amber-400/90 to-amber-500/80",
    border: "border-amber-300/50",
    text: "text-amber-900",
  },
  americano: {
    bg: "bg-gradient-to-b from-slate-400/90 to-slate-500/80",
    border: "border-slate-300/50",
    text: "text-slate-900",
  },
  latte: {
    bg: "bg-gradient-to-b from-primary/90 to-purple-600/80",
    border: "border-primary/50",
    text: "text-white",
  },
  cappuccino: {
    bg: "bg-gradient-to-b from-orange-400/90 to-orange-500/80",
    border: "border-orange-300/50",
    text: "text-orange-900",
  },
};

export const CouponFlags = ({ coupons }: CouponFlagsProps) => {
  const { t } = useLanguage();

  if (coupons.length === 0) return null;

  return (
    <div className="flex items-end gap-1">
      {coupons.slice(0, 4).map((coupon, index) => {
        const colors = flagColors[coupon.type] || flagColors.universal;
        // 旗帜高度递减，营造层叠感
        const heights = ["h-10", "h-9", "h-8", "h-7"];
        const zIndexes = ["z-40", "z-30", "z-20", "z-10"];
        
        return (
          <div
            key={coupon.id}
            className={`relative ${heights[index]} w-6 ${colors.bg} ${colors.border} border rounded-t-sm shadow-sm transition-transform hover:scale-105 hover:-translate-y-0.5 ${zIndexes[index]}`}
            style={{ 
              marginLeft: index > 0 ? "-4px" : "0",
              clipPath: "polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)"
            }}
          >
            {/* 旗帜内容 */}
            <div className={`flex flex-col items-center justify-center h-full pt-0.5 ${colors.text}`}>
              <span className="text-[8px] font-bold leading-none">¥{coupon.value}</span>
              <Ticket className="w-2.5 h-2.5 mt-0.5 opacity-80" />
            </div>
            
            {/* 顶部装饰线 */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/30 rounded-t-sm" />
          </div>
        );
      })}
      
      {/* 券数量标签 */}
      <span className="text-[10px] text-white/40 ml-1.5 font-light">
        {coupons.length}{t("券", " coupons")}
      </span>
    </div>
  );
};
