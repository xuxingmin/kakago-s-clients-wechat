import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  Copy, 
  Check,
  Gift,
  Coffee,
  ChevronRight,
  Heart,
  Sparkles,
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

// Demo data - KAKA beans (1元 = 100豆)
const squadStats = {
  totalBeans: 124050,
  squadSize: 348,
  todayGrowth: 12,
  inviteCode: "KAKA2024",
};

const beansToRMB = (beans: number) => (beans / 100).toFixed(0);

// Demo coffee mates
const coffeeMates = [
  { id: 1, name: "小明", initial: "明", joinDays: 30 },
  { id: 2, name: "阿杰", initial: "杰", joinDays: 25 },
  { id: 3, name: "Lisa", initial: "L", joinDays: 22 },
  { id: 4, name: "小红", initial: "红", joinDays: 18 },
  { id: 5, name: "David", initial: "D", joinDays: 15 },
  { id: 6, name: "佳佳", initial: "佳", joinDays: 12 },
  { id: 7, name: "Tom", initial: "T", joinDays: 8 },
  { id: 8, name: "小芳", initial: "芳", joinDays: 5 },
  { id: 9, name: "Yuki", initial: "Y", joinDays: 3 },
  { id: 10, name: "阿强", initial: "强", joinDays: 1 },
];

const warmColors = [
  "from-amber-600/80 to-orange-700/80",
  "from-rose-600/80 to-pink-700/80",
  "from-violet-600/80 to-purple-700/80",
  "from-teal-600/80 to-cyan-700/80",
  "from-emerald-600/80 to-green-700/80",
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
      // User cancelled share
    }
  };

  const treatFund = beansToRMB(squadStats.totalBeans);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Fixed top */}
      <div className="flex-shrink-0">
        {/* Header bar */}
        <div className="px-4 pt-3 pb-2 flex items-center gap-3 safe-top">
          <button 
            onClick={() => navigate("/profile")}
            className="w-9 h-9 rounded-full bg-card/80 backdrop-blur flex items-center justify-center active:scale-95 transition-transform"
          >
            <ChevronLeft className="w-4 h-4 text-foreground/70" />
          </button>
          <div className="flex-1">
            <h1 className="text-base font-semibold text-foreground tracking-tight">
              {t("我的咖啡搭子", "My Coffee Mates")}
            </h1>
            <p className="text-[10px] text-muted-foreground">
              {t("一起喝咖啡，更有味道 ☕", "Coffee is better together ☕")}
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable middle */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        
        {/* Treat Fund Card */}
        <section className="px-4 pt-2 pb-3">
          <div className="rounded-2xl bg-card/60 border border-border/30 p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Heart className="w-3 h-3 text-rose-400" />
                  {t("请客基金", "Treat Fund")}
                </p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-bold text-foreground">¥{treatFund}</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {t("可用于下次点单", "Available for your next order")}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
                  <span className="text-[10px] font-medium text-emerald-400">
                    +{squadStats.todayGrowth} {t("今日", "today")}
                  </span>
                </div>
              </div>
            </div>

            {/* Benefits row */}
            <div className="flex gap-2">
              <div className="flex-1 rounded-xl bg-background/40 px-3 py-2 text-center">
                <p className="text-xs font-semibold text-foreground">2%</p>
                <p className="text-[9px] text-muted-foreground">{t("好友消费返利", "Friend rebate")}</p>
              </div>
              <div className="flex-1 rounded-xl bg-background/40 px-3 py-2 text-center">
                <p className="text-xs font-semibold text-foreground">∞</p>
                <p className="text-[9px] text-muted-foreground">{t("终身有效", "Lifetime")}</p>
              </div>
              <div className="flex-1 rounded-xl bg-background/40 px-3 py-2 text-center">
                <p className="text-xs font-semibold text-foreground">
                  <Coffee className="w-3 h-3 inline-block" />
                </p>
                <p className="text-[9px] text-muted-foreground">{t("兑换咖啡", "Redeem")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Coffee Mates Circle */}
        <section className="px-4 pb-3">
          <div className="flex items-center justify-between mb-2.5">
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                {t("咖啡搭子", "Coffee Mates")}
              </h2>
              <p className="text-[10px] text-muted-foreground">
                {squadStats.squadSize} {t("位好友已加入", "friends connected")}
              </p>
            </div>
          </div>

          {/* Horizontal scrollable avatars */}
          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
            <div className="flex gap-3 pb-1" style={{ width: "max-content" }}>
              {coffeeMates.map((mate, i) => (
                <div key={mate.id} className="flex flex-col items-center gap-1 min-w-[52px]">
                  <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${warmColors[i % warmColors.length]} flex items-center justify-center text-sm font-semibold text-white shadow-md`}>
                    {mate.initial}
                  </div>
                  <span className="text-[9px] text-muted-foreground truncate max-w-[48px]">
                    {mate.name}
                  </span>
                </div>
              ))}
              {/* More indicator */}
              <div className="flex flex-col items-center gap-1 min-w-[52px]">
                <div className="w-11 h-11 rounded-full bg-card border border-border/40 flex items-center justify-center text-[10px] text-muted-foreground">
                  +{squadStats.squadSize - coffeeMates.length}
                </div>
                <span className="text-[9px] text-muted-foreground">{t("更多", "More")}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Invite Code */}
        <section className="px-4 pb-3">
          <div className="rounded-2xl bg-card/60 border border-border/30 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-muted-foreground mb-1">{t("我的邀请码", "My Invite Code")}</p>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-mono font-bold text-foreground tracking-widest">
                    {squadStats.inviteCode}
                  </span>
                  <button 
                    onClick={handleCopyCode} 
                    className="p-1.5 rounded-lg bg-background/40 active:scale-90 transition-transform"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Button */}
        <section className="px-4 pb-3">
          <button
            onClick={handleShare}
            className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-lg shadow-primary/20"
          >
            <Gift className="w-4.5 h-4.5" />
            {t("请朋友喝一杯", "Gift a Cup to a Friend")}
          </button>
        </section>

        {/* View records */}
        <section className="px-4 pb-3">
          <button
            onClick={() => navigate("/kaka-beans")}
            className="w-full rounded-2xl bg-card/40 border border-border/20 px-4 py-3 flex items-center justify-between active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-2.5">
              <Coffee className="w-4 h-4 text-muted-foreground" />
              <div className="text-left">
                <p className="text-xs font-medium text-foreground">{t("查看请客记录", "View Treat History")}</p>
                <p className="text-[9px] text-muted-foreground">{t("所有返利记录统一在这里查看", "All rebate records in one place")}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
          </button>
        </section>

        {/* Warm footer message */}
        <section className="px-4 py-4">
          <div className="text-center text-[10px] text-muted-foreground/60">
            <span>☕ {t("好友每次下单，你都能攒一点请客基金", "Every friend's order adds to your treat fund")}</span>
          </div>
        </section>
      </div>

      {/* Fixed bottom */}
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
                  onClick={() => {
                    handleShare();
                    setShowPoster(false);
                  }}
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
