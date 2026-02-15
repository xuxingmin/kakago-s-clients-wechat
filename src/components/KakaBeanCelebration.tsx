import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface KakaBeanCelebrationProps {
  isOpen: boolean;
  beans: number;
  onClose: () => void;
}

const Particle = ({ delay, x, color }: { delay: number; x: number; color: string }) => (
  <div
    className="absolute w-2 h-2 rounded-full"
    style={{
      left: `${x}%`,
      top: "50%",
      backgroundColor: color,
      animation: `celebration-burst 1s ${delay}s ease-out forwards`,
      opacity: 0,
    }}
  />
);

export const KakaBeanCelebration = ({ isOpen, beans, onClose }: KakaBeanCelebrationProps) => {
  const { t } = useLanguage();
  const [show, setShow] = useState(false);
  const [stage, setStage] = useState(0); // 0: hidden, 1: bean drop, 2: count reveal, 3: text

  useEffect(() => {
    if (!isOpen) {
      setShow(false);
      setStage(0);
      return;
    }
    setShow(true);
    setStage(1);
    const t1 = setTimeout(() => setStage(2), 600);
    const t2 = setTimeout(() => setStage(3), 1200);
    const t3 = setTimeout(() => onClose(), 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [isOpen, onClose]);

  if (!show) return null;

  const colors = [
    "hsl(271, 81%, 56%)", // primary purple
    "hsl(280, 70%, 65%)",
    "hsl(45, 100%, 60%)", // gold
    "hsl(35, 100%, 55%)",
    "hsl(271, 60%, 70%)",
    "hsl(50, 100%, 70%)",
  ];

  const particles = Array.from({ length: 24 }, (_, i) => ({
    delay: Math.random() * 0.4,
    x: 30 + Math.random() * 40,
    color: colors[i % colors.length],
  }));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 animate-fade-in" />

      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {stage >= 2 && particles.map((p, i) => (
          <Particle key={i} {...p} />
        ))}
      </div>

      {/* Main content */}
      <div className="relative flex flex-col items-center z-10">
        {/* Bean icon - bounces in */}
        <div
          className={`text-6xl transition-all duration-500 ${
            stage >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-50"
          }`}
          style={{
            animation: stage >= 1 ? "bean-bounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards" : undefined,
          }}
        >
          🫘
        </div>

        {/* Bean count */}
        <div
          className={`mt-4 transition-all duration-500 ${
            stage >= 2 ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-75 translate-y-4"
          }`}
        >
          <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-primary drop-shadow-[0_0_30px_rgba(139,92,246,0.6)]">
            +{beans}
          </span>
        </div>

        {/* Text */}
        <div
          className={`mt-3 text-center transition-all duration-500 ${
            stage >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <p className="text-lg font-bold text-white">
            {t("恭喜获得 KAKA 豆！", "You earned KAKA Beans!")}
          </p>
          <p className="text-xs text-white/50 mt-1">
            {t("感谢您的评价，豆子已存入账户", "Thanks for rating! Beans added to your account")}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes bean-bounce {
          0% { transform: scale(0) translateY(80px); opacity: 0; }
          50% { transform: scale(1.3) translateY(-20px); opacity: 1; }
          70% { transform: scale(0.9) translateY(5px); }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes celebration-burst {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { 
            transform: translate(
              ${Math.random() > 0.5 ? '' : '-'}${40 + Math.random() * 80}px, 
              ${-60 - Math.random() * 120}px
            ) scale(0); 
            opacity: 0; 
          }
        }
      `}</style>
    </div>
  );
};
