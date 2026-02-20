import { useState, useEffect, useRef } from "react";
import { ChevronLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Mate {
  id: number;
  initial: string;
  name: string;
  beans: number;
}

// Generate 80+ mock mates for the cosmic view
const generateMates = (): Mate[] => {
  const names = [
    "林", "杰", "思", "伟", "晓", "轩", "萱", "宇", "欣", "浩",
    "琳", "磊", "静", "强", "芳", "波", "颖", "涛", "婷", "鹏",
    "雪", "峰", "丽", "军", "燕", "超", "娜", "明", "慧", "飞",
    "洁", "刚", "玲", "平", "敏", "斌", "霞", "辉", "蕾", "勇",
    "云", "兵", "蓉", "华", "薇", "龙", "莉", "威", "彤", "坤",
    "凡", "岩", "茜", "翔", "冰", "鑫", "露", "楠", "雯", "康",
    "瑶", "杨", "琪", "旭", "梅", "凯", "莹", "松", "璐", "彬",
    "妮", "虎", "佳", "帅", "月", "阳", "梦", "志", "丹", "恒",
  ];
  return names.map((n, i) => ({
    id: i + 1,
    initial: n,
    name: n,
    beans: Math.floor(Math.random() * 500) + 20,
  }));
};

const MATES = generateMates();
const COLUMNS = 5;

interface Props {
  open: boolean;
  onClose: () => void;
}

export const CosmicMatesWaterfall = ({ open, onClose }: Props) => {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setVisible(true);
      setRevealedCount(0);
      // Stagger reveal avatars
      const interval = setInterval(() => {
        setRevealedCount((prev) => {
          if (prev >= MATES.length) {
            clearInterval(interval);
            return prev;
          }
          return prev + 3;
        });
      }, 40);
      return () => clearInterval(interval);
    } else {
      setRevealedCount(0);
      const timer = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!visible) return null;

  // Split into columns for waterfall effect
  const columns: Mate[][] = Array.from({ length: COLUMNS }, () => []);
  MATES.forEach((mate, i) => {
    columns[i % COLUMNS].push(mate);
  });

  return (
    <div
      className={`fixed inset-0 z-[90] transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      style={{ background: "hsl(270 20% 4% / 0.97)" }}
    >
      {/* Cosmic background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `hsl(271 81% ${50 + Math.random() * 30}% / ${0.15 + Math.random() * 0.3})`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center gap-3 px-4 pt-3 pb-2">
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-secondary/60 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-sm font-bold text-foreground">{t("全部咖啡搭子", "All Coffee Mates")}</h2>
          <p className="text-[10px] text-muted-foreground">{t(`共 ${MATES.length} 位搭子在宇宙中闪耀`, `${MATES.length} mates shining in the cosmos`)}</p>
        </div>
      </div>

      {/* Waterfall Grid */}
      <div
        ref={containerRef}
        className="relative z-10 flex-1 overflow-y-auto scrollbar-hide px-3 pb-20"
        style={{ height: "calc(100vh - 60px)" }}
      >
        <div className="flex gap-2 pt-2">
          {columns.map((col, colIdx) => (
            <div
              key={colIdx}
              className="flex-1 flex flex-col gap-2"
              style={{ marginTop: `${colIdx * 12}px` }}
            >
              {col.map((mate, rowIdx) => {
                const globalIdx = rowIdx * COLUMNS + colIdx;
                const isRevealed = globalIdx < revealedCount;
                const hue = 260 + (mate.id % 40);
                const lightness = 35 + (mate.id % 25);

                return (
                  <div
                    key={mate.id}
                    className="flex flex-col items-center gap-1 py-2 rounded-xl transition-all duration-500"
                    style={{
                      opacity: isRevealed ? 1 : 0,
                      transform: isRevealed ? "translateY(0) scale(1)" : "translateY(20px) scale(0.7)",
                      transitionDelay: `${globalIdx * 15}ms`,
                      background: isRevealed ? `hsl(${hue} 30% 12% / 0.5)` : "transparent",
                    }}
                  >
                    {/* Avatar */}
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white relative"
                      style={{
                        background: `linear-gradient(135deg, hsl(${hue} 70% ${lightness}%), hsl(${hue + 20} 60% ${lightness - 8}%))`,
                        boxShadow: isRevealed
                          ? `0 0 ${12 + (mate.beans % 8)}px hsl(${hue} 70% ${lightness}% / 0.4)`
                          : "none",
                      }}
                    >
                      {mate.initial}
                      {/* Glow ring for high-bean mates */}
                      {mate.beans > 300 && (
                        <div
                          className="absolute inset-0 rounded-full animate-pulse-soft"
                          style={{
                            border: `2px solid hsl(${hue} 80% 60% / 0.5)`,
                          }}
                        />
                      )}
                    </div>
                    {/* Name + beans */}
                    <p className="text-[10px] font-medium text-foreground/70">{mate.name}</p>
                    <p className="text-[9px] text-primary/60">{mate.beans} KKB</p>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
