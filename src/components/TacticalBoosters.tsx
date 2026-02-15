import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

interface BoosterModule {
  label: string;
  valueZh: string;
  valueEn: string;
  footerZh: string;
  footerEn: string;
  bg: string;
  labelColor: string;
  valueColor: string;
  footerColor: string;
}

const boosters: BoosterModule[] = [
  {
    label: "RECRUIT",
    valueZh: "¥9.9",
    valueEn: "¥9.9",
    footerZh: "新人券",
    footerEn: "New User",
    bg: "bg-gradient-to-br from-[hsl(16,100%,50%)] to-[hsl(30,100%,50%)]",
    labelColor: "text-white/80",
    valueColor: "text-white",
    footerColor: "text-white/70",
  },
  {
    label: "SQUAD",
    valueZh: "免运费",
    valueEn: "FREE SHIP",
    footerZh: "免运费券",
    footerEn: "Free Delivery",
    bg: "bg-gradient-to-br from-[hsl(0,0%,13%)] to-[hsl(0,0%,18%)]",
    labelColor: "text-[hsl(0,0%,60%)]",
    valueColor: "text-white",
    footerColor: "text-[hsl(0,0%,55%)]",
  },
  {
    label: "ACCESS",
    valueZh: "-¥5",
    valueEn: "-¥5",
    footerZh: "生日礼券",
    footerEn: "Birthday",
    bg: "bg-gradient-to-br from-[hsl(0,0%,82%)] to-[hsl(0,0%,88%)]",
    labelColor: "text-[hsl(0,0%,20%)]",
    valueColor: "text-[hsl(0,0%,8%)]",
    footerColor: "text-[hsl(0,0%,30%)]",
  },
];

export const TacticalBoosters = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div
      className="px-4 py-1 cursor-pointer group"
      onClick={() => navigate("/wallet")}
    >
      {/* Status line */}
      <div className="flex items-center gap-1.5 mb-1">
        <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
        <span className="text-[7px] font-mono font-bold tracking-[0.15em] text-muted-foreground uppercase">
          {t("实况状态：补给就绪", "LIVE STATUS: BOOSTERS READY")}
        </span>
      </div>

      {/* Boosters strip */}
      <div className="flex gap-[1px] tactical-shimmer overflow-hidden rounded-sm group-active:scale-[0.97] transition-transform duration-150">
        {boosters.map((b, i) => (
          <div
            key={i}
            className={`flex-1 ${b.bg} relative overflow-hidden`}
            style={{ transform: "skewX(-15deg)" }}
          >
            {/* Inner content un-skewed */}
            <div
              className="flex flex-col items-center justify-center py-1.5 px-2"
              style={{ transform: "skewX(15deg)" }}
            >
              <span
                className={`text-[6px] font-mono font-bold tracking-[0.2em] uppercase ${b.labelColor}`}
              >
                {b.label}
              </span>
              <span
                className={`text-sm font-black font-mono leading-none mt-0.5 ${b.valueColor}`}
              >
                {t(b.valueZh, b.valueEn)}
              </span>
              <span className={`text-[7px] font-medium mt-0.5 ${b.footerColor}`}>
                {t(b.footerZh, b.footerEn)}
              </span>
            </div>

            {/* Shimmer overlay */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
              style={{
                animation: `boosterShimmer 4s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes boosterShimmer {
          0%, 80%, 100% {
            opacity: 0;
            transform: translateX(-120%);
          }
          90% {
            opacity: 1;
            transform: translateX(120%);
          }
        }
      `}</style>
    </div>
  );
};
