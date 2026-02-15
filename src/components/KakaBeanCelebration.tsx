import { useEffect, useState, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface KakaBeanCelebrationProps {
  isOpen: boolean;
  beans: number;
  onClose: () => void;
}

/* ── Hero Bean SVG ── */
const HeroBean = ({ size = 80 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
    <defs>
      <linearGradient id="bean-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8A2BE2" />
        <stop offset="100%" stopColor="#6600FF" />
      </linearGradient>
      <linearGradient id="bean-shine" x1="30%" y1="0%" x2="70%" y2="100%">
        <stop offset="0%" stopColor="white" stopOpacity="0.4" />
        <stop offset="50%" stopColor="white" stopOpacity="0" />
      </linearGradient>
    </defs>
    {/* Bean body */}
    <ellipse cx="40" cy="40" rx="28" ry="34" fill="url(#bean-grad)" />
    {/* Center crease */}
    <path d="M40 12 Q36 28 40 40 Q44 52 40 68" stroke="#4400AA" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    {/* Shine */}
    <ellipse cx="32" cy="28" rx="10" ry="14" fill="url(#bean-shine)" />
  </svg>
);

/* ── Mini Bean for particles ── */
const MiniBean = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <ellipse cx="8" cy="8" rx="6" ry="7" fill="#8A2BE2" opacity="0.8" />
    <path d="M8 2.5 Q7 5.5 8 8 Q9 10.5 8 13.5" stroke="#5500CC" strokeWidth="0.8" fill="none" />
  </svg>
);

/* ── Confetti shapes ── */
const confettiColors = ["#8A2BE2", "#6600FF", "#A855F7", "#7C3AED", "#9333EA", "#C084FC"];

const ConfettiPiece = ({ shape, color, style }: { shape: string; color: string; style: React.CSSProperties }) => {
  if (shape === "circle") return <div className="absolute w-2 h-2 rounded-full" style={{ backgroundColor: color, ...style }} />;
  if (shape === "square") return <div className="absolute w-2 h-2 rounded-sm" style={{ backgroundColor: color, ...style }} />;
  return (
    <div className="absolute" style={style}>
      <svg width="8" height="8" viewBox="0 0 8 8"><polygon points="4,0 8,8 0,8" fill={color} /></svg>
    </div>
  );
};

/* ── Generate particles ── */
const generateParticles = () => {
  const shapes = ["circle", "square", "triangle"];
  return Array.from({ length: 32 }, (_, i) => {
    const angle = (i / 32) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
    const distance = 120 + Math.random() * 100;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance + 60; // gravity offset
    const rotation = Math.random() * 720 - 360;
    const delay = Math.random() * 0.15;
    const isBean = i < 8;
    return {
      isBean,
      shape: shapes[i % 3],
      color: confettiColors[i % confettiColors.length],
      tx, ty, rotation, delay,
    };
  });
};

export const KakaBeanCelebration = ({ isOpen, beans, onClose }: KakaBeanCelebrationProps) => {
  const { t } = useLanguage();
  const [phase, setPhase] = useState(0);
  const [counter, setCounter] = useState(0);
  const [particles] = useState(generateParticles);

  const stableClose = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    if (!isOpen) { setPhase(0); setCounter(0); return; }

    setPhase(1); // entrance
    const timers = [
      setTimeout(() => setPhase(2), 200),  // bean enters
      setTimeout(() => setPhase(3), 600),  // explosion
      setTimeout(() => setPhase(4), 800),  // text reveal + counter start
      setTimeout(() => setPhase(5), 3000), // exit
      setTimeout(() => stableClose(), 3400),
    ];
    return () => timers.forEach(clearTimeout);
  }, [isOpen, stableClose]);

  // Counter animation
  useEffect(() => {
    if (phase !== 4) return;
    const steps = 8;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      setCounter(Math.min(Math.round(beans * progress), beans));
      if (step >= steps) clearInterval(interval);
    }, 60);
    return () => clearInterval(interval);
  }, [phase, beans]);

  if (!isOpen && phase === 0) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-400 ${
        phase >= 5 ? "opacity-0" : "opacity-100"
      }`}
      style={{ backdropFilter: "blur(5px)" }}
      onClick={stableClose}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/85" />

      {/* Particle explosion */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {phase >= 3 && particles.map((p, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: "50%",
              top: "45%",
              animation: `confetti-burst 0.8s ${p.delay}s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
              opacity: 0,
              ["--tx" as string]: `${p.tx}px`,
              ["--ty" as string]: `${p.ty}px`,
              ["--rot" as string]: `${p.rotation}deg`,
            }}
          >
            {p.isBean ? <MiniBean size={12 + Math.random() * 8} /> : (
              <ConfettiPiece shape={p.shape} color={p.color} style={{}} />
            )}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative flex flex-col items-center z-10">
        {/* Hero Bean */}
        <div
          className={`transition-all ${phase >= 2 ? "opacity-100" : "opacity-0"}`}
          style={phase >= 2 ? {
            animation: "hero-bean-enter 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards",
            filter: "drop-shadow(0 0 30px rgba(138, 43, 226, 0.6))",
          } : { transform: "translateY(100px) scale(0.3)" }}
        >
          <HeroBean size={90} />
        </div>

        {/* Text + Counter */}
        <div className={`mt-6 text-center transition-all duration-500 ${
          phase >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}>
          <p className="text-xl font-bold text-white mb-2">
            {t("感谢你的评价！", "Thanks for your review!")}
          </p>
          <p className="text-base text-white/80">
            {t("你获得了", "You earned")}{" "}
            <span
              className="font-black text-primary text-2xl inline-block"
              style={counter === beans ? {
                animation: "counter-bump 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
              } : undefined}
            >
              {counter}
            </span>
            {" "}{t("个 KAKA 豆", "KAKA Beans")}
          </p>
        </div>

        {/* Claim button */}
        <button
          onClick={(e) => { e.stopPropagation(); stableClose(); }}
          className={`mt-8 px-10 py-3 rounded-2xl bg-primary text-white font-semibold text-sm transition-all duration-500 hover:bg-primary/80 active:scale-95 ${
            phase >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ boxShadow: "0 0 30px rgba(138, 43, 226, 0.4)" }}
        >
          {t("收下", "Claim")}
        </button>
      </div>

      <style>{`
        @keyframes hero-bean-enter {
          0% { transform: translateY(120px) scale(0.3); opacity: 0; }
          50% { transform: translateY(-10px) scale(1.3); opacity: 1; }
          70% { transform: translateY(5px) scale(0.95); }
          85% { transform: translateY(-3px) scale(1.05); }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes confetti-burst {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) rotate(var(--rot)) scale(0.3); opacity: 0; }
        }
        @keyframes counter-bump {
          0% { transform: scale(1); }
          50% { transform: scale(1.4); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};
