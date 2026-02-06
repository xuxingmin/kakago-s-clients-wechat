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

export const CouponFlags = ({ coupons }: CouponFlagsProps) => {
  const { t } = useLanguage();

  if (coupons.length === 0) return null;

  // 按面额排序，取最贵的三张券
  const topCoupons = [...coupons]
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);

  // 旗帜配置：KAKA, GO, COFFEE
  const flagConfig = [
    { label: "KAKA", size: "small" },
    { label: "GO", size: "large" },
    { label: "COFFEE", size: "small" },
  ];

  return (
    <div className="flex items-end gap-0.5">
      {topCoupons.map((coupon, index) => {
        const config = flagConfig[index];
        const isLarge = config.size === "large";
        
        return (
          <div
            key={coupon.id}
            className="relative flex flex-col items-center"
            style={{
              animation: `flagWave ${1.5 + index * 0.2}s ease-in-out infinite`,
              animationDelay: `${index * 0.15}s`,
            }}
          >
            {/* 旗帜本体 */}
            <div
              className={`relative bg-gradient-to-br from-primary via-purple-500 to-violet-600 shadow-lg overflow-hidden ${
                isLarge ? "w-10 h-14" : "w-8 h-11"
              }`}
              style={{
                clipPath: "polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)",
                transform: `skewX(-3deg) rotate(${index === 0 ? -2 : index === 2 ? 2 : 0}deg)`,
              }}
            >
              {/* 旗帜内容 */}
              <div className="absolute inset-0 flex flex-col items-center justify-center px-1">
                {/* 品牌文字 */}
                <span 
                  className={`text-white/90 font-bold tracking-tight ${
                    isLarge ? "text-[8px]" : "text-[6px]"
                  }`}
                  style={{ transform: "skewX(3deg)" }}
                >
                  {config.label}
                </span>
                {/* 券面额 */}
                <span 
                  className={`text-white font-black mt-0.5 ${
                    isLarge ? "text-sm" : "text-xs"
                  }`}
                  style={{ transform: "skewX(3deg)" }}
                >
                  ¥{coupon.value}
                </span>
              </div>
              
              {/* 高光效果 */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-white/30" />
              <div className="absolute top-0 right-0 w-1.5 h-full bg-white/10" />
              
              {/* 飘扬波纹 */}
              <div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                style={{
                  animation: "shimmerFlag 2s ease-in-out infinite",
                  animationDelay: `${index * 0.3}s`,
                }}
              />
            </div>
            
            {/* 旗杆 */}
            <div 
              className={`w-0.5 bg-gradient-to-b from-muted-foreground/50 to-muted-foreground/20 rounded-b-full ${
                isLarge ? "h-3" : "h-2"
              }`}
            />
          </div>
        );
      })}
      
      {/* 券数量标识 */}
      <div className="ml-2 flex flex-col items-start">
        <span className="text-[10px] font-bold text-primary animate-pulse">
          GO!
        </span>
        <span className="text-[9px] text-muted-foreground">
          {t("自动用券", "Auto coupon")}
        </span>
      </div>
      
      {/* 飘扬动画样式 */}
      <style>{`
        @keyframes flagWave {
          0%, 100% {
            transform: rotate(0deg) translateY(0);
          }
          25% {
            transform: rotate(1deg) translateY(-1px);
          }
          75% {
            transform: rotate(-1deg) translateY(1px);
          }
        }
        
        @keyframes shimmerFlag {
          0%, 100% {
            opacity: 0;
            transform: translateX(-100%);
          }
          50% {
            opacity: 1;
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};
