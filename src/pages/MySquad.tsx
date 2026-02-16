import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  Copy, 
  Check,
  Gift,
  Coffee,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

// Demo data
const squadStats = {
  totalBeans: 124050,
  squadSize: 12,
  todayGrowth: 2,
  inviteCode: "KAKA2024",
};

const beansToRMB = (beans: number) => (beans / 100).toFixed(0);
const beansToCups = (beans: number) => Math.floor(beans / 100 / 28); // ~28元 per cup

const coffeeMates = [
  { id: 0, name: "我", initial: "H", isHost: true, isActive: true },
  { id: 1, name: "小明", initial: "明", isActive: true },
  { id: 2, name: "阿杰", initial: "杰", isActive: false },
  { id: 3, name: "Lisa", initial: "L", isActive: true },
  { id: 4, name: "小红", initial: "红", isActive: false },
  { id: 5, name: "David", initial: "D", isActive: true },
  { id: 6, name: "佳佳", initial: "佳", isActive: false },
  { id: 7, name: "Tom", initial: "T", isActive: true },
  { id: 8, name: "小芳", initial: "芳", isActive: false },
  { id: 9, name: "Yuki", initial: "Y", isActive: true },
  { id: 10, name: "阿强", initial: "强", isActive: false },
  { id: 11, name: "Mia", initial: "M", isActive: true },
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
        `使用我的邀请码 ${squadStats.inviteCode} 加入KAKAGO，首杯立减5元！`,
        `Join KAKAGO with my code ${squadStats.inviteCode} and get ¥5 off!`
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
      // User cancelled
    }
  };

  const cupsEarned = beansToCups(squadStats.totalBeans);
  const treatFund = beansToRMB(squadStats.totalBeans);
  const progressPercent = Math.min((cupsEarned % 10) / 10 * 100, 100);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <div className="flex-shrink-0 px-4 pt-3 pb-2 safe-top">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate("/profile")}
            className="w-9 h-9 rounded-full bg-secondary/60 flex items-center justify-center active:scale-95 transition-transform"
          >
            <ChevronLeft className="w-4 h-4 text-foreground/70" />
          </button>
          <div className="flex-1">
            <h1 className="text-base font-semibold text-foreground tracking-tight">
              {t("我的咖啡搭子", "My Coffee Mates")}
            </h1>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">

        {/* ═══ 1. Social Circle ═══ */}
        <section className="px-4 pt-2 pb-4">
          <div className="rounded-2xl bg-secondary/40 border border-border/20 p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-muted-foreground">
                {squadStats.squadSize} {t("位搭子已连接", "friends connected")}
              </p>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground/60">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 inline-block" />
                {t("在线", "active")}
              </div>
            </div>

            {/* Avatars with connecting line */}
            <div className="relative overflow-x-auto scrollbar-hide -mx-1 px-1">
              {/* Subtle connecting line */}
              <div className="absolute top-[22px] left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent z-0" />
              
              <div className="flex gap-2.5 relative z-10 pb-1" style={{ width: "max-content" }}>
                {coffeeMates.map((mate) => (
                  <div key={mate.id} className="flex flex-col items-center gap-1 min-w-[48px]">
                    <div className="relative">
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold
                        ${mate.isHost 
                          ? "bg-primary text-primary-foreground ring-2 ring-primary/40 ring-offset-2 ring-offset-background" 
                          : "bg-secondary border border-border/40 text-foreground/80"
                        }`}
                      >
                        {mate.initial}
                      </div>
                      {/* Active coffee indicator */}
                      {mate.isActive && (
                        <span className="absolute -bottom-0.5 -right-0.5 flex items-center justify-center w-4 h-4 rounded-full bg-background border border-border/30">
                          <Coffee className="w-2.5 h-2.5 text-primary" />
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] text-muted-foreground truncate max-w-[44px]">
                      {mate.isHost ? t("主理人", "Host") : mate.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 2. Treat Fund ═══ */}
        <section className="px-4 pb-4">
          <div className="rounded-2xl bg-secondary/40 border border-border/20 p-4">
            <p className="text-[11px] text-muted-foreground mb-2">
              {t("请客基金", "Treat Fund")}
            </p>

            {/* Cup counter */}
            <div className="flex items-end gap-2 mb-3">
              <span className="text-3xl font-bold text-foreground tracking-tight">{cupsEarned}</span>
              <span className="text-sm text-muted-foreground pb-0.5">{t("杯已攒下", "cups earned")}</span>
            </div>

            {/* Progress to next milestone */}
            <div className="mb-2">
              <div className="h-1 rounded-full bg-secondary overflow-hidden">
                <div 
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[9px] text-muted-foreground/60">
                  {t("再攒", "Next milestone in")} {10 - (cupsEarned % 10)} {t("杯解锁里程碑", "cups")}
                </span>
                <span className="text-[9px] text-muted-foreground/60">
                  ≈ ¥{treatFund}
                </span>
              </div>
            </div>

            <p className="text-[10px] text-muted-foreground/50 mt-2">
              {t("用来请搭子喝一杯，或自己享用", "Use this fund to treat your mates or yourself")}
            </p>

            {/* Benefits */}
            <div className="grid grid-cols-3 gap-2 mt-3">
              <div className="rounded-xl bg-background/30 py-2 text-center">
                <p className="text-[11px] font-semibold text-foreground">2%</p>
                <p className="text-[8px] text-muted-foreground">{t("消费返利", "Rebate")}</p>
              </div>
              <div className="rounded-xl bg-background/30 py-2 text-center">
                <p className="text-[11px] font-semibold text-foreground">∞</p>
                <p className="text-[8px] text-muted-foreground">{t("终身有效", "Lifetime")}</p>
              </div>
              <div className="rounded-xl bg-background/30 py-2 text-center">
                <Coffee className="w-3 h-3 text-foreground mx-auto" />
                <p className="text-[8px] text-muted-foreground">{t("兑换咖啡", "Redeem")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Invite code */}
        <section className="px-4 pb-4">
          <div className="rounded-2xl bg-secondary/40 border border-border/20 px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-[9px] text-muted-foreground mb-0.5">{t("邀请码", "Invite Code")}</p>
              <span className="text-sm font-mono font-bold text-foreground tracking-[0.2em]">
                {squadStats.inviteCode}
              </span>
            </div>
            <button 
              onClick={handleCopyCode}
              className="w-9 h-9 rounded-xl bg-background/40 flex items-center justify-center active:scale-90 transition-transform"
            >
              {copied ? (
                <Check className="w-4 h-4 text-primary" />
              ) : (
                <Copy className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          </div>
        </section>

        {/* ═══ 3. CTA ═══ */}
        <section className="px-4 pb-3">
          <button
            onClick={handleShare}
            className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-2.5 active:scale-[0.98] transition-transform"
          >
            <Gift className="w-5 h-5" />
            {t("摇人喝一杯", "Call for Coffee")}
          </button>
        </section>

        {/* Records link */}
        <section className="px-4 pb-3">
          <button
            onClick={() => navigate("/kaka-beans")}
            className="w-full rounded-2xl bg-secondary/30 border border-border/10 px-4 py-3 flex items-center justify-between active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-muted-foreground/60" />
              <div className="text-left">
                <p className="text-xs font-medium text-foreground">{t("查看请客记录", "View Treat History")}</p>
                <p className="text-[9px] text-muted-foreground">{t("所有返利记录统一在这里查看", "All rebate records in one place")}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
          </button>
        </section>

        {/* Footer */}
        <div className="text-center py-4 text-[10px] text-muted-foreground/40">
          ☕ {t("搭子每次下单，你都能攒一点请客基金", "Every friend's order adds to your treat fund")}
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="flex-shrink-0">
        <BottomNav />
      </div>

      {/* Poster Modal — preserved */}
      {showPoster && (
        <>
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[80]"
            onClick={() => setShowPoster(false)}
          />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[85] max-w-sm mx-auto">
            <div className="rounded-2xl bg-card p-5 border border-border/30">
              <div className="text-center">
                <h2 className="text-xl font-bold text-foreground mb-1">KAKAGO</h2>
                <p className="text-[10px] text-muted-foreground mb-4">{t("可负担的精品咖啡", "Affordable Specialty Coffee")}</p>
                <div className="w-28 h-28 mx-auto bg-background rounded-xl p-2 mb-3">
                  <div className="w-full h-full rounded-lg flex items-center justify-center border-2 border-dashed border-border/40">
                    <Coffee className="w-10 h-10 text-muted-foreground" />
                  </div>
                </div>
                <div className="bg-primary/10 rounded-xl px-3 py-1.5 inline-block mb-3">
                  <p className="text-[9px] text-muted-foreground mb-0.5">{t("邀请码", "Code")}</p>
                  <p className="text-base font-mono font-bold text-primary tracking-wider">{squadStats.inviteCode}</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("扫码加入，首杯立减", "Join now, get")} <span className="text-primary font-bold">¥5</span> {t("", "off")}
                </p>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setShowPoster(false)}
                  className="flex-1 py-2.5 rounded-xl bg-secondary text-secondary-foreground text-xs font-medium"
                >
                  {t("关闭", "Close")}
                </button>
                <button
                  onClick={() => { handleShare(); setShowPoster(false); }}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Gift className="w-3.5 h-3.5" />
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
