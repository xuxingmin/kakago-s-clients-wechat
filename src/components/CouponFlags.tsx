import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

export interface Coupon {
  id: string;
  type: "universal" | "americano" | "latte" | "cappuccino";
  value: number;
  applicableProducts?: string[];
}

// Map coupon type to short label
const couponLabel: Record<Coupon["type"], { zh: string; en: string }> = {
  universal: { zh: "通用", en: "ALL" },
  americano: { zh: "美式", en: "AMR" },
  latte: { zh: "拿铁", en: "LAT" },
  cappuccino: { zh: "卡布", en: "CAP" },
};

interface CouponFlagsProps {
  coupons: Coupon[];
}

export const CouponFlags = ({ coupons }: CouponFlagsProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  if (coupons.length === 0) return null;

  const topCoupons = [...coupons]
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);

  const sizes = ["small", "large", "small"] as const;

  return (
    <button
      onClick={() => navigate("/wallet")}
      className="flex items-end gap-0.5 active:scale-95 transition-transform cursor-pointer"
    >
      {topCoupons.map((coupon, index) => {
        const isLarge = sizes[index] === "large";
        const label = couponLabel[coupon.type] || couponLabel.universal;

        return (
          <div
            key={coupon.id}
            className="relative flex flex-col items-center"
            style={{
              animation: `flagWave ${1.5 + index * 0.2}s ease-in-out infinite`,
              animationDelay: `${index * 0.15}s`,
            }}
          >
            <div
              className={`relative bg-gradient-to-br from-primary via-purple-500 to-violet-600 shadow-lg overflow-hidden ${
                isLarge ? "w-8 h-11" : "w-7 h-9"
              }`}
              style={{
                clipPath: "polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)",
                transform: `skewX(-3deg) rotate(${index === 0 ? -2 : index === 2 ? 2 : 0}deg)`,
              }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center px-1">
                <span
                  className={`text-white/90 font-bold tracking-tight ${
                    isLarge ? "text-[7px]" : "text-[6px]"
                  }`}
                  style={{ transform: "skewX(3deg)" }}
                >
                  {t(label.zh, label.en)}
                </span>
                <span
                  className={`text-white font-black mt-0.5 ${
                    isLarge ? "text-xs" : "text-[10px]"
                  }`}
                  style={{ transform: "skewX(3deg)" }}
                >
                  ¥{coupon.value}
                </span>
              </div>

              <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/30" />
              <div className="absolute top-0 right-0 w-1 h-full bg-white/10" />

              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                style={{
                  animation: "shimmer 2s ease-in-out infinite",
                  animationDelay: `${index * 0.3}s`,
                }}
              />
            </div>

            <div
              className={`w-0.5 bg-gradient-to-b from-white/50 to-white/20 rounded-b-full ${
                isLarge ? "h-2" : "h-1.5"
              }`}
            />
          </div>
        );
      })}

      <div className="ml-1.5 flex flex-col items-start">
        <span className="text-[9px] font-bold text-primary animate-pulse">
          GO!
        </span>
        <span className="text-[8px] text-muted-foreground">
          {t("自动用券", "Auto coupon")}
        </span>
      </div>

      <style>{`
        @keyframes flagWave {
          0%, 100% { transform: rotate(0deg) translateY(0); }
          25% { transform: rotate(1deg) translateY(-1px); }
          75% { transform: rotate(-1deg) translateY(1px); }
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0; transform: translateX(-100%); }
          50% { opacity: 1; transform: translateX(100%); }
        }
      `}</style>
    </button>
  );
};
