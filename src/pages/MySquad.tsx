import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  Copy, 
  Share2,
  QrCode,
  Check,
  Zap,
  Link2,
  ArrowRightLeft,
  ChevronRight,
  Coffee
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { BrandBanner } from "@/components/BrandBanner";
import { Header } from "@/components/Header";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

// Demo data
const squadStats = {
  totalBeans: 124050,
  squadSize: 348,
  todayGrowth: 12,
  inviteCode: "KAKA2024",
};

const matesAvatars = [
  { id: 1, name: "小林", initial: "林" },
  { id: 2, name: "阿杰", initial: "杰" },
  { id: 3, name: "思思", initial: "思" },
  { id: 4, name: "大伟", initial: "伟" },
  { id: 5, name: "晓晓", initial: "晓" },
  { id: 6, name: "子轩", initial: "轩" },
  { id: 7, name: "雨萱", initial: "萱" },
];

const activityFeed = [
  { id: 1, name: "小林", action: "下单了一杯 Dirty", beans: 56, time: "3分钟前" },
  { id: 2, name: "阿杰", action: "下单了一杯拿铁", beans: 48, time: "17分钟前" },
  { id: 3, name: "思思", action: "下单了一杯美式", beans: 36, time: "1小时前" },
  { id: 4, name: "大伟", action: "下单了一杯椰子拿铁", beans: 52, time: "3小时前" },
];

const MySquad = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [showPoster, setShowPoster] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(squadStats.inviteCode);
      setCopied(true);
      toast({ title: t("复制成功", "Copied"), description: t("邀请码已复制", "Invite code copied") });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: t("复制失败", "Copy failed"), variant: "destructive" });
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'KAKAGO',
      text: t(
        `使用我的邀请码 ${squadStats.inviteCode} 加入KAKAGO，首杯5折！`,
        `Join KAKAGO with my code ${squadStats.inviteCode} and get 50% off!`
      ),
      url: window.location.origin,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        toast({ title: t("已复制分享内容", "Copied share content") });
      }
    } catch {
      // cancelled
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Fixed top */}
      <div className="flex-shrink-0">
        <Header />
        <BrandBanner />
        <div className="fog-divider mx-4" />
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* Back + Title */}
        <div className="px-4 pt-3 pb-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="w-7 h-7 rounded-full bg-secondary/60 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h2 className="text-sm font-medium text-muted-foreground">{t("我的咖啡搭子", "Coffee Mates")}</h2>
          </div>
        </div>

        {/* Mates Avatars Row */}
        <section className="px-4 pt-2 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2.5">
              {matesAvatars.map((mate) => (
                <div
                  key={mate.id}
                  className="w-9 h-9 rounded-full border-2 border-background flex items-center justify-center text-[10px] font-bold text-primary-foreground"
                  style={{
                    background: `linear-gradient(135deg, hsl(271 81% ${40 + mate.id * 5}%), hsl(280 70% ${35 + mate.id * 4}%))`,
                  }}
                >
                  {mate.initial}
                </div>
              ))}
            </div>
            <span className="text-[10px] text-muted-foreground">
              +{squadStats.squadSize} {t("位搭子", "mates")}
            </span>
          </div>
        </section>

        {/* The Fund — Central Bean Count */}
        <section className="px-4 pb-4">
          <div className="card-lg text-center relative overflow-hidden">
            {/* Glow backdrop */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-40 h-40 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, hsl(271 81% 56%), transparent 70%)' }} />
            </div>
            <div className="relative z-10">
              <p className="text-[10px] tracking-widest uppercase text-muted-foreground mb-3">
                {t("共饮小金库", "Coffee Fund")}
              </p>
              <div className="flex items-baseline justify-center gap-1.5 mb-1">
                <span className="text-4xl font-black text-gold-gradient tracking-tight tabular-nums">
                  {squadStats.totalBeans.toLocaleString()}
                </span>
                <span className="text-xs font-medium text-muted-foreground">KKB</span>
              </div>
              <p className="text-[9px] text-muted-foreground/60">{t("搭子每次消费，你都在蓄能", "Every mate's order charges your fund")}</p>
            </div>
          </div>
        </section>

        {/* 3 Rules */}
        <section className="px-4 pb-4">
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: Zap, label: t("搭子蓄能", "Mates Recharge"), sub: "2%" },
              { icon: Link2, label: t("永久连接", "Permanent Link"), sub: "∞" },
              { icon: ArrowRightLeft, label: t("随时兑换", "Redeem Anytime"), sub: "☕" },
            ].map((item, i) => (
              <div key={i} className="card-sm flex flex-col items-center gap-1.5 !p-3">
                <div className="w-8 h-8 rounded-xl border border-primary/20 flex items-center justify-center">
                  <item.icon className="w-4 h-4 text-primary" strokeWidth={1.5} />
                </div>
                <p className="text-[10px] font-medium text-foreground/80">{item.label}</p>
                <span className="text-[9px] text-muted-foreground">{item.sub}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="fog-divider mx-4" />

        {/* VIP Invite Card */}
        <section className="px-4 py-4">
          <div className="relative rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(271 40% 14%), hsl(280 30% 10%))' }}>
            {/* Subtle shimmer */}
            <div className="absolute inset-0 opacity-30 shimmer pointer-events-none" />
            <div className="absolute top-0 right-0 w-24 h-24 opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle at top right, hsl(271 81% 56%), transparent 70%)' }} />
            
            <div className="relative p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground mb-1">KAKAGO · VIP PASS</p>
                  <p className="text-sm font-semibold text-foreground leading-snug">
                    {t("送好友一杯", "Gift a friend")}<br/>
                    <span className="text-primary">{t("5 折首单特权", "50% off first order")}</span>
                  </p>
                </div>
                <div className="flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-lg px-2 py-1">
                  <span className="text-primary font-mono text-[11px] font-bold">{squadStats.inviteCode}</span>
                  <button onClick={handleCopyCode} className="p-0.5">
                    {copied ? (
                      <Check className="w-3 h-3 text-green-400" />
                    ) : (
                      <Copy className="w-3 h-3 text-primary/60 hover:text-primary transition-colors" />
                    )}
                  </button>
                </div>
              </div>
              
              <button
                onClick={() => setShowPoster(true)}
                className="btn-gold w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 pulse-glow"
              >
                <Coffee className="w-4 h-4" strokeWidth={1.5} />
                {t("摇人喝一杯", "Call for coffee")}
              </button>
            </div>
          </div>
        </section>

        <div className="fog-divider mx-4" />

        {/* Activity Feed */}
        <section className="px-4 py-3">
          <button
            onClick={() => navigate("/kaka-beans")}
            className="flex items-center justify-between w-full mb-3"
          >
            <h3 className="text-xs font-semibold text-foreground/80">{t("搭子动态", "Mates Activity")}</h3>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
          </button>

          <div className="space-y-2 stagger-fade-in">
            {activityFeed.map((item) => (
              <div key={item.id} className="card-sm flex items-center gap-3 !p-2.5">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-primary-foreground flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, hsl(271 81% ${40 + item.id * 6}%), hsl(280 70% ${35 + item.id * 5}%))`,
                  }}
                >
                  {item.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-foreground/80 truncate">
                    <span className="font-medium">{item.name}</span>{" "}
                    <span className="text-muted-foreground">{item.action}</span>
                  </p>
                  <p className="text-[9px] text-muted-foreground/60">{item.time}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-bold text-primary">+{item.beans}</span>
                  <p className="text-[8px] text-muted-foreground">KKB</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom spacer */}
        <div className="h-4" />
      </div>

      {/* Fixed bottom */}
      <div className="flex-shrink-0">
        <BottomNav />
      </div>

      {/* Poster Modal */}
      {showPoster && (
        <>
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[80]"
            onClick={() => setShowPoster(false)}
          />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[85] max-w-sm mx-auto">
            <div className="card-lg bg-gradient-to-br from-[hsl(270,15%,12%)] to-[hsl(280,20%,6%)]">
              <div className="text-center">
                <h2 className="text-xl font-black text-foreground tracking-tight mb-1">KAKAGO</h2>
                <p className="text-[10px] text-muted-foreground mb-4">{t("可负担的精品咖啡", "Affordable Specialty Coffee")}</p>
                
                <div className="w-28 h-28 mx-auto bg-foreground rounded-xl p-2 mb-3">
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-purple-800/20 rounded-lg flex items-center justify-center border-2 border-dashed border-primary/30">
                    <QrCode className="w-10 h-10 text-primary" />
                  </div>
                </div>
                
                <div className="bg-primary/15 rounded-xl px-3 py-1.5 inline-block mb-3">
                  <p className="text-[9px] text-muted-foreground mb-0.5">{t("邀请码", "Code")}</p>
                  <p className="text-base font-mono font-black text-primary tracking-wider">{squadStats.inviteCode}</p>
                </div>
                
                <p className="text-xs text-foreground/70">
                  {t("扫码加入，首杯", "Join now, get")} <span className="text-primary font-bold">5{t("折", "0% off")}</span>
                </p>
              </div>
              
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setShowPoster(false)}
                  className="flex-1 py-2.5 rounded-xl bg-secondary text-muted-foreground text-xs font-medium"
                >
                  {t("关闭", "Close")}
                </button>
                <button
                  onClick={() => {
                    handleShare();
                    setShowPoster(false);
                  }}
                  className="flex-1 py-2.5 rounded-xl btn-gold text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  {t("分享", "Share")}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MySquad;
