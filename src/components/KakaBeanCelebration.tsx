import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface KakaBeanCelebrationProps {
  isOpen: boolean;
  beans: number;
  onClose: () => void;
}

export const KakaBeanCelebration = ({ isOpen, beans, onClose }: KakaBeanCelebrationProps) => {
  const { t } = useLanguage();
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (!isOpen) { setStage(0); return; }
    setStage(1);
    const t1 = setTimeout(() => setStage(2), 400);
    const t2 = setTimeout(() => setStage(3), 900);
    const t3 = setTimeout(() => onClose(), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 animate-fade-in" />

      <div className="relative flex flex-col items-center z-10">
        {/* Bean icon */}
        <div
          className={`w-20 h-20 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center transition-all duration-500 ${
            stage >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-50"
          }`}
          style={stage >= 1 ? { animation: "bean-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards", boxShadow: "0 0 40px hsl(271,81%,56%,0.3)" } : undefined}
        >
          <span className="text-3xl">🫘</span>
        </div>

        {/* Count */}
        <div className={`mt-5 transition-all duration-400 ${stage >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
          <span className="text-4xl font-black text-primary drop-shadow-[0_0_20px_hsl(271,81%,56%,0.5)]">
            +{beans}
          </span>
        </div>

        {/* Label */}
        <p className={`mt-2 text-sm text-white/60 transition-all duration-400 ${stage >= 3 ? "opacity-100" : "opacity-0"}`}>
          {t("KAKA豆已到账", "KAKA Beans earned")}
        </p>
      </div>

      <style>{`
        @keyframes bean-pop {
          0% { transform: scale(0); }
          60% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};
