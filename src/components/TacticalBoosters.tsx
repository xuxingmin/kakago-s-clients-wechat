import { useLanguage } from "@/contexts/LanguageContext";

const modules = [
  { label: "RECRUIT", valueZh: "¥9.9", valueEn: "¥9.9", footerZh: "首杯补给", footerEn: "First Boost", bg: "bg-[#FF4500]", labelColor: "text-white/70", valueColor: "text-white", footerColor: "text-white/80" },
  { label: "SQUAD", valueZh: "20% OFF", valueEn: "20% OFF", footerZh: "职场充能", footerEn: "Squad Power", bg: "bg-[#222]", labelColor: "text-[#999]", valueColor: "text-white", footerColor: "text-[#888]" },
  { label: "WBC ACCESS", valueZh: "-¥5", valueEn: "-¥5", footerZh: "冠军立减", footerEn: "Champ Cut", bg: "bg-[#E0E0E0]", labelColor: "text-[#555]", valueColor: "text-[#111]", footerColor: "text-[#333]" },
];

export const TacticalBoosters = () => {
  const { t } = useLanguage();

  return (
    <section className="px-4 pt-0.5 pb-1">
      {/* Status bar */}
      <div className="flex items-center gap-1.5 mb-1">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        <span className="text-[8px] font-mono font-bold tracking-[0.15em] text-white/40 uppercase">
          LIVE STATUS: SQUAD ASSEMBLING...
        </span>
      </div>

      {/* Boosters strip */}
      <div className="flex gap-[1px] relative overflow-hidden">
        {modules.map((m, i) => (
          <div
            key={m.label}
            className={`flex-1 ${m.bg} overflow-hidden cursor-pointer active:scale-95 transition-transform duration-100`}
            style={{ transform: "skewX(-15deg)" }}
          >
            <div className="py-1.5 px-3 flex flex-col items-center justify-center relative" style={{ transform: "skewX(15deg)" }}>
              <span className={`text-[7px] font-mono font-bold uppercase tracking-[0.2em] ${m.labelColor}`}>
                {m.label}
              </span>
              <span className={`text-base font-black font-mono leading-tight ${m.valueColor}`}>
                {t(m.valueZh, m.valueEn)}
              </span>
              <span className={`text-[8px] font-medium ${m.footerColor}`}>
                {t(m.footerZh, m.footerEn)}
              </span>
            </div>
            {/* Shimmer */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)",
                animation: "tactical-shimmer 4s ease-in-out infinite",
                animationDelay: `${i * 0.3}s`,
              }}
            />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes tactical-shimmer {
          0%, 80%, 100% { transform: translateX(-150%); }
          40% { transform: translateX(150%); }
        }
      `}</style>
    </section>
  );
};
