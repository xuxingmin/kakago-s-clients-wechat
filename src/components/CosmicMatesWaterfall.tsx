import { useState, useEffect } from "react";
import { ChevronLeft, Zap, TrendingUp, Activity } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Mate {
  id: number;
  initial: string;
  name: string;
  beans: number;
  tag: "genesis" | "active" | "rising" | "new";
  joinDays: number;
}

const TAG_MAP = {
  genesis: { zh: "创世搭子", en: "Genesis Node", color: "hsl(271 81% 56%)" },
  active: { zh: "活跃节点", en: "Active Node", color: "hsl(200 80% 50%)" },
  rising: { zh: "潜力新星", en: "Rising Star", color: "hsl(45 90% 55%)" },
  new: { zh: "新连接", en: "New Link", color: "hsl(0 0% 50%)" },
};

const generateMates = (): Mate[] => {
  const names = [
    "林逸", "杰哥", "思思", "伟达", "晓晓", "轩辕", "萱萱", "宇航", "欣然", "浩天",
    "琳琳", "磊子", "静怡", "强哥", "芳华", "波波", "颖儿", "涛涛", "婷婷", "鹏飞",
    "雪儿", "峰哥", "丽丽", "军哥", "燕子", "超超", "娜娜", "明哥", "慧慧", "飞飞",
    "洁洁", "刚子", "玲玲", "平安", "敏敏", "斌斌", "霞光", "辉辉", "蕾蕾", "勇哥",
    "云朵", "兵哥", "蓉蓉", "华华", "薇薇", "龙哥", "莉莉", "威威", "彤彤", "坤坤",
    "凡凡", "岩岩", "茜茜", "翔哥", "冰冰", "鑫鑫", "露露", "楠楠", "雯雯", "康康",
    "瑶瑶", "杨杨", "琪琪", "旭日", "梅梅", "凯凯", "莹莹", "松松", "璐璐", "彬彬",
    "妮妮", "虎哥", "佳佳", "帅帅", "月月", "阳阳", "梦梦", "志远", "丹丹", "恒恒",
  ];
  const tags: Mate["tag"][] = ["genesis", "active", "rising", "new"];
  return names.map((n, i) => ({
    id: i + 1,
    initial: n[0],
    name: n,
    beans: i < 5 ? Math.floor(Math.random() * 2000) + 800 : Math.floor(Math.random() * 600) + 20,
    tag: i < 8 ? "genesis" : i < 30 ? "active" : i < 55 ? "rising" : "new",
    joinDays: Math.floor(Math.random() * 300) + 1,
  }));
};

const MATES = generateMates().sort((a, b) => b.beans - a.beans);

interface Props {
  open: boolean;
  onClose: () => void;
}

export const CosmicMatesWaterfall = ({ open, onClose }: Props) => {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);

  const totalEnergy = MATES.reduce((s, m) => s + m.beans, 0);

  useEffect(() => {
    if (open) {
      setVisible(true);
      setRevealedCount(0);
      const interval = setInterval(() => {
        setRevealedCount((prev) => {
          if (prev >= MATES.length) { clearInterval(interval); return prev; }
          return prev + 2;
        });
      }, 30);
      return () => clearInterval(interval);
    } else {
      setRevealedCount(0);
      const timer = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!visible) return null;

  const isTopContributor = (beans: number) => beans >= 500;

  return (
    <div
      className={`fixed inset-0 z-[90] transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      style={{ background: "#0A0A0F" }}
    >
      {/* Circuit pattern background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Vertical data streams */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`stream-${i}`}
            className="absolute w-px opacity-[0.04]"
            style={{
              left: `${12 + i * 12}%`,
              top: 0,
              height: "100%",
              background: `linear-gradient(180deg, transparent, hsl(271 81% 56%), transparent)`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
        {/* Horizontal scan lines */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={`line-${i}`}
            className="absolute h-px w-full opacity-[0.03]"
            style={{
              top: `${8 + i * 8}%`,
              background: `linear-gradient(90deg, transparent 10%, hsl(271 81% 56% / 0.3) 50%, transparent 90%)`,
            }}
          />
        ))}
        {/* Floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`p-${i}`}
            className="absolute rounded-full animate-float"
            style={{
              width: `${1.5 + Math.random() * 2}px`,
              height: `${1.5 + Math.random() * 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `hsl(${260 + Math.random() * 40} 70% 60% / ${0.1 + Math.random() * 0.2})`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 px-4 pt-3 pb-2">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{ background: "hsl(271 30% 15% / 0.6)", border: "1px solid hsl(271 50% 30% / 0.3)" }}
          >
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <div className="flex-1">
            <h2 className="text-sm font-bold text-foreground tracking-wide">
              {t("数字搭子网络", "Digital Mate Network")}
            </h2>
            <p className="text-[10px] font-mono tracking-wider" style={{ color: "hsl(271 60% 55%)" }}>
              NETWORK MONITOR · {MATES.length} {t("节点在线", "NODES ONLINE")}
            </p>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-md" style={{ background: "hsl(142 60% 40% / 0.1)", border: "1px solid hsl(142 60% 40% / 0.2)" }}>
            <Activity className="w-3 h-3" style={{ color: "hsl(142 71% 45%)" }} strokeWidth={1.5} />
            <span className="text-[10px] font-mono font-bold" style={{ color: "hsl(142 71% 45%)" }}>LIVE</span>
          </div>
        </div>

        {/* Network Stats Bar */}
        <div className="flex gap-2 mb-2">
          {[
            { label: t("总蓄能", "Total Energy"), value: totalEnergy.toLocaleString(), unit: "KKB", color: "hsl(142 71% 45%)" },
            { label: t("活跃节点", "Active Nodes"), value: MATES.filter(m => m.tag !== "new").length.toString(), unit: "", color: "hsl(271 81% 56%)" },
            { label: t("今日新增", "New Today"), value: "+12", unit: "", color: "hsl(45 90% 55%)" },
          ].map((stat, i) => (
            <div
              key={i}
              className="flex-1 rounded-lg px-2.5 py-2 text-center"
              style={{
                background: "hsl(260 20% 10% / 0.6)",
                border: "1px solid hsl(271 40% 25% / 0.3)",
                backdropFilter: "blur(8px)",
              }}
            >
              <p className="text-[9px] tracking-wider uppercase text-muted-foreground/60">{stat.label}</p>
              <p className="text-sm font-mono font-black" style={{ color: stat.color }}>
                {stat.value}<span className="text-[8px] ml-0.5 font-normal opacity-60">{stat.unit}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Mate Cards List */}
      <div
        className="relative z-10 overflow-y-auto scrollbar-hide px-4 pb-20"
        style={{ height: "calc(100vh - 155px)" }}
      >
        <div className="space-y-2">
          {MATES.map((mate, idx) => {
            const isRevealed = idx < revealedCount;
            const isTop = isTopContributor(mate.beans);
            const tagInfo = TAG_MAP[mate.tag];
            const hue = 260 + (mate.id % 40);
            const lightness = 38 + (mate.id % 20);

            return (
              <div
                key={mate.id}
                className="relative rounded-xl overflow-hidden transition-all duration-500"
                style={{
                  opacity: isRevealed ? 1 : 0,
                  transform: isRevealed ? "translateY(0) scale(1)" : "translateY(16px) scale(0.96)",
                  transitionDelay: `${idx * 20}ms`,
                  background: "hsl(260 15% 9% / 0.65)",
                  backdropFilter: "blur(12px)",
                  border: `1px solid ${isTop ? "hsl(142 60% 40% / 0.35)" : "hsl(271 50% 30% / 0.2)"}`,
                  boxShadow: isTop
                    ? "0 0 20px hsl(142 60% 40% / 0.08), inset 0 1px 0 hsl(0 0% 100% / 0.03)"
                    : "inset 0 1px 0 hsl(0 0% 100% / 0.02)",
                }}
              >
                {/* Top contributor glow line */}
                {isTop && (
                  <div
                    className="absolute top-0 left-0 right-0 h-px"
                    style={{ background: "linear-gradient(90deg, transparent, hsl(142 60% 50% / 0.5), transparent)" }}
                  />
                )}

                <div className="flex items-center gap-3 p-3">
                  {/* Avatar — Glowing circular frame */}
                  <div className="relative flex-shrink-0">
                    {/* Outer glow ring */}
                    <div
                      className="absolute -inset-0.5 rounded-full"
                      style={{
                        background: isTop
                          ? `linear-gradient(135deg, hsl(142 60% 45% / 0.4), hsl(160 70% 40% / 0.2))`
                          : `linear-gradient(135deg, hsl(${hue} 60% 45% / 0.3), hsl(${hue + 20} 50% 35% / 0.15))`,
                        filter: `blur(${isTop ? 3 : 2}px)`,
                      }}
                    />
                    <div
                      className="relative w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white"
                      style={{
                        background: `linear-gradient(135deg, hsl(${hue} 65% ${lightness}%), hsl(${hue + 25} 55% ${lightness - 10}%))`,
                        border: `1.5px solid ${isTop ? "hsl(142 60% 50% / 0.5)" : `hsl(${hue} 60% 50% / 0.3)`}`,
                        boxShadow: `0 0 ${isTop ? 16 : 10}px ${isTop ? "hsl(142 60% 45% / 0.25)" : `hsl(${hue} 60% 50% / 0.15)`}`,
                      }}
                    >
                      {mate.initial}
                    </div>
                    {/* Rank badge for top 3 */}
                    {idx < 3 && (
                      <div
                        className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black"
                        style={{
                          background: idx === 0 ? "hsl(45 90% 55%)" : idx === 1 ? "hsl(0 0% 75%)" : "hsl(25 70% 50%)",
                          color: "#000",
                          boxShadow: `0 0 8px ${idx === 0 ? "hsl(45 90% 55% / 0.5)" : "transparent"}`,
                        }}
                      >
                        {idx + 1}
                      </div>
                    )}
                  </div>

                  {/* Identity — Middle */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-foreground truncate">{mate.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span
                        className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-mono font-bold tracking-wider uppercase"
                        style={{
                          color: tagInfo.color,
                          background: `${tagInfo.color}15`,
                          border: `1px solid ${tagInfo.color}30`,
                        }}
                      >
                        [ {t(TAG_MAP[mate.tag].zh, TAG_MAP[mate.tag].en)} ]
                      </span>
                      <span className="text-[9px] text-muted-foreground/40 font-mono">
                        {mate.joinDays}d
                      </span>
                    </div>
                  </div>

                  {/* Energy Contribution — Right */}
                  <div className="flex flex-col items-end flex-shrink-0">
                    <div className="flex items-center gap-1">
                      <Zap
                        className="w-3.5 h-3.5"
                        style={{ color: "hsl(142 71% 45%)" }}
                        strokeWidth={1.5}
                        fill="hsl(142 71% 45% / 0.2)"
                      />
                      <span
                        className="text-base font-mono font-black tracking-tight"
                        style={{
                          color: "hsl(142 71% 45%)",
                          textShadow: "0 0 12px hsl(142 71% 45% / 0.3)",
                        }}
                      >
                        +{mate.beans.toLocaleString()}
                      </span>
                    </div>
                    <span className="text-[8px] text-muted-foreground/40 font-mono mt-0.5">
                      KKB · {t("累计蓄能", "Total Energy")}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
