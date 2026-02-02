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

// 旗帜配色方案 - 更鲜艳的渐变
const flagColors: Record<string, { bg: string; accent: string }> = {
  universal: {
    bg: "from-amber-400 via-amber-500 to-orange-500",
    accent: "bg-amber-300/50",
  },
  americano: {
    bg: "from-slate-400 via-slate-500 to-slate-600",
    accent: "bg-slate-300/50",
  },
  latte: {
    bg: "from-primary via-purple-500 to-violet-600",
    accent: "bg-purple-300/50",
  },
  cappuccino: {
    bg: "from-orange-400 via-orange-500 to-red-500",
    accent: "bg-orange-300/50",
  },
};

export const CouponFlags = ({ coupons }: CouponFlagsProps) => {
  const { t } = useLanguage();

  if (coupons.length === 0) return null;

  return (
    <div className="flex items-center">
      {/* 旗帜组 - 向右飘扬的冲锋感 */}
      <div className="flex items-end" style={{ transform: "perspective(200px) rotateY(-5deg)" }}>
        {coupons.slice(0, 4).map((coupon, index) => {
          const colors = flagColors[coupon.type] || flagColors.universal;
          // 旗帜高度递增，营造向右冲锋的感觉
          const heights = ["h-7", "h-8", "h-9", "h-10"];
          const delays = ["0ms", "50ms", "100ms", "150ms"];
          
          return (
            <div
              key={coupon.id}
              className="relative flex"
              style={{ 
                marginLeft: index > 0 ? "-2px" : "0",
                animationDelay: delays[index],
              }}
            >
              {/* 旗杆 */}
              <div className="w-0.5 bg-gradient-to-b from-white/60 to-white/20 rounded-full" 
                   style={{ height: index === 0 ? "28px" : index === 1 ? "32px" : index === 2 ? "36px" : "40px" }} />
              
              {/* 旗帜本体 - 向右飘扬 */}
              <div
                className={`relative ${heights[index]} w-8 bg-gradient-to-r ${colors.bg} rounded-r-sm shadow-lg overflow-hidden`}
                style={{ 
                  clipPath: "polygon(0 0, 85% 5%, 100% 15%, 95% 50%, 100% 85%, 85% 95%, 0 100%)",
                  transform: `skewX(-3deg) translateX(${index * 0.5}px)`,
                }}
              >
                {/* 旗帜内容 */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-bold text-[10px] drop-shadow-sm" style={{ transform: "skewX(3deg)" }}>
                    ¥{coupon.value}
                  </span>
                </div>
                
                {/* 飘扬的波纹效果 */}
                <div className={`absolute top-0 right-0 w-2 h-full ${colors.accent} opacity-60`}
                     style={{ clipPath: "polygon(0 10%, 100% 0, 100% 100%, 0 90%)" }} />
                
                {/* 顶部高光 */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-white/30" />
              </div>
            </div>
          );
        })}
      </div>
      
      {/* GO! 标识 */}
      <div className="ml-2 flex flex-col items-start">
        <span className="text-[10px] font-bold text-primary tracking-wider animate-pulse">
          GO!
        </span>
        <span className="text-[8px] text-white/40">
          {coupons.length}{t("券可用", " available")}
        </span>
      </div>
    </div>
  );
};
