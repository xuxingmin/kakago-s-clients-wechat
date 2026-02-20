import { useState } from "react";
import squadInvitePoster from "@/assets/squad-invite-poster.jpg";
import { useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  Copy, 
  Share2,
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

const squadStats = {
  totalBeans: 124050,
  squadSize: 348,
  todayGrowth: 12,
  inviteCode: "KAKA2024",
};

const matesAvatars = [
  { id: 1, initial: "林" },
  { id: 2, initial: "杰" },
  { id: 3, initial: "思" },
  { id: 4, initial: "伟" },
  { id: 5, initial: "晓" },
  { id: 6, initial: "轩" },
  { id: 7, initial: "萱" },
];

const activityFeed = [
  { id: 1, name: "小林", action: "Dirty", beans: 56, time: "3min" },
  { id: 2, name: "阿杰", action: "拿铁", beans: 48, time: "17min" },
  { id: 3, name: "思思", action: "美式", beans: 36, time: "1h" },
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
    } catch { /* cancelled */ }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-shrink-0">
        <Header />
        <BrandBanner />
        <div className="fog-divider mx-4" />
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide pb-24">
        {/* Back + Title + Avatars — single compact row */}
        <div className="px-4 pt-2 pb-1 flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="w-6 h-6 rounded-full bg-secondary/60 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <h2 className="text-sm font-medium text-muted-foreground flex-shrink-0">{t("我的咖啡搭子", "Coffee Mates")}</h2>
          <div className="flex items-center gap-0 ml-1">
            <div className="flex -space-x-2">
              {matesAvatars.map((m) => (
                <div
                  key={m.id}
                  className="w-6 h-6 rounded-full border border-background flex items-center justify-center text-[8px] font-bold text-primary-foreground"
                  style={{ background: `linear-gradient(135deg, hsl(271 81% ${38 + m.id * 5}%), hsl(280 70% ${33 + m.id * 4}%))` }}
                >
                  {m.initial}
                </div>
              ))}
            </div>
            <span className="text-[11px] text-muted-foreground ml-1.5">+{squadStats.squadSize}</span>
          </div>
        </div>

        {/* Fund Card — compact */}
        <section className="px-4 pt-1 pb-2">
          <div className="card-md text-center relative overflow-hidden !py-3">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-32 h-32 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, hsl(271 81% 56%), transparent 70%)' }} />
            </div>
            <div className="relative z-10">
              <p className="text-[11px] tracking-widest uppercase text-muted-foreground mb-1">{t("共饮小金库", "Coffee Fund")}</p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-3xl font-black text-gold-gradient tracking-tight tabular-nums">{squadStats.totalBeans.toLocaleString()}</span>
                <span className="text-xs font-medium text-muted-foreground">KKB</span>
              </div>
              <p className="text-[11px] text-muted-foreground/50 mt-0.5">{t("搭子每次消费，你都在蓄能", "Every mate's order charges your fund")}</p>
            </div>
          </div>
        </section>

        {/* 3 Rules — tight row */}
        <section className="px-4 pb-2">
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { icon: Zap, label: t("搭子蓄能", "Recharge"), sub: "2%" },
              { icon: Link2, label: t("永久连接", "Permanent"), sub: "∞" },
              { icon: ArrowRightLeft, label: t("随时兑换", "Redeem"), sub: "☕" },
            ].map((item, i) => (
              <div key={i} className="card-sm flex flex-col items-center gap-1 !p-2">
                <div className="w-7 h-7 rounded-lg border border-primary/20 flex items-center justify-center">
                  <item.icon className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
                </div>
                <p className="text-[11px] font-medium text-foreground/80">{item.label}</p>
                <span className="text-[10px] text-muted-foreground leading-none">{item.sub}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="fog-divider mx-4" />

        {/* VIP Invite Card — compact */}
        <section className="px-4 py-2">
          <div className="relative rounded-xl overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(271 40% 14%), hsl(280 30% 10%))' }}>
            <div className="absolute inset-0 opacity-25 shimmer pointer-events-none" />
            <div className="relative p-3">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground">KAKAGO · VIP PASS</p>
                  <p className="text-xs font-semibold text-foreground leading-tight mt-0.5">
                    {t("送好友一杯", "Gift a friend")} <span className="text-primary">{t("5 折首单特权", "50% off")}</span>
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-primary/10 border border-primary/20 rounded-md px-1.5 py-0.5">
                  <span className="text-primary font-mono text-xs font-bold">{squadStats.inviteCode}</span>
                  <button onClick={handleCopyCode} className="p-0.5">
                    {copied ? <Check className="w-2.5 h-2.5 text-green-400" /> : <Copy className="w-2.5 h-2.5 text-primary/60" />}
                  </button>
                </div>
              </div>
              <button
                onClick={() => setShowPoster(true)}
                className="btn-gold w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 pulse-glow !min-h-0"
              >
                <Coffee className="w-3.5 h-3.5" strokeWidth={1.5} />
                {t("摇人喝一杯", "Call for coffee")}
              </button>
            </div>
          </div>
        </section>

        <div className="fog-divider mx-4" />

        {/* Activity Feed — ultra compact */}
        <section className="px-4 py-2">
          <button onClick={() => navigate("/kaka-beans")} className="flex items-center justify-between w-full mb-1.5">
            <h3 className="text-xs font-semibold text-foreground/70">{t("搭子动态", "Mates Activity")}</h3>
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
          </button>
          <div className="space-y-1">
            {activityFeed.map((item) => (
              <div key={item.id} className="flex items-center gap-2 py-1 px-2 rounded-lg bg-secondary/30">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[7px] font-bold text-primary-foreground flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, hsl(271 81% ${38 + item.id * 6}%), hsl(280 70% ${33 + item.id * 5}%))` }}
                >
                  {item.name[0]}
                </div>
                <p className="text-[11px] text-muted-foreground flex-1 min-w-0 truncate">
                  <span className="text-foreground/70 font-medium">{item.name}</span> {t("点了", "ordered")} {item.action}
                </p>
                <span className="text-[11px] font-bold text-primary flex-shrink-0">+{item.beans}</span>
                <span className="text-[10px] text-muted-foreground/50 flex-shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="flex-shrink-0">
        <BottomNav />
      </div>

      {/* Poster Modal */}
      {showPoster && (
        <>
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[80]" onClick={() => setShowPoster(false)} />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[85] max-w-[340px] mx-auto">
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(160deg, hsl(270 12% 10%), hsl(280 15% 5%))',
                border: '1px solid hsl(271 81% 40% / 0.4)',
                boxShadow: '0 0 40px hsl(271 81% 56% / 0.15), inset 0 1px 0 hsl(0 0% 100% / 0.05)',
              }}
            >
              <div className="p-5">
                {/* Header */}
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <span className="text-lg font-black tracking-wider text-foreground">KAKAGO</span>
                    <span className="text-base">✨</span>
                  </div>
                  <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground/60">{t("创世搭子凭证", "Genesis Mate Pass")}</p>
                </div>

                {/* Poster Image — full width */}
                <div
                  className="rounded-xl overflow-hidden mb-4"
                  style={{ boxShadow: '0 0 24px hsl(271 81% 56% / 0.4), 0 0 48px hsl(271 81% 56% / 0.15)' }}
                >
                  <img src={squadInvitePoster} alt="KAKAGO VIP Pass" className="w-full h-auto object-cover" />
                </div>

                {/* Invite Code Pill */}
                <div className="flex justify-center mb-3">
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-full"
                    style={{ background: 'hsl(271 81% 56% / 0.1)', border: '1px solid hsl(271 81% 56% / 0.25)' }}
                  >
                    <span className="text-[11px] text-muted-foreground/60">{t("邀请码", "Code")}</span>
                    <span className="text-sm font-mono font-black text-primary tracking-widest">{squadStats.inviteCode}</span>
                    {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-primary/50" />}
                  </button>
                </div>

                {/* CTA Text */}
                <p className="text-center text-xs font-semibold text-foreground/90 mb-2">
                  {t("发送专属通行证，邀请搭子加入", "Send your exclusive pass and invite mates to join")}
                </p>

                {/* Sharer Benefit Note — single line */}
                <p className="text-center text-[10px] mb-4" style={{ color: 'hsl(142 71% 45%)' }}>
                  ⚡️ {t("绑定后搭子每笔消费为你注入 2% KKB", "Linked mates charge you 2% KKB per order")}
                </p>

                {/* Buttons */}
                <div className="flex gap-2.5">
                  <button
                    onClick={() => setShowPoster(false)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    style={{ border: '1px solid hsl(0 0% 100% / 0.1)' }}
                  >
                    {t("关闭", "Close")}
                  </button>
                  <button
                    onClick={() => { handleShare(); setShowPoster(false); }}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 text-primary-foreground transition-colors"
                    style={{ background: 'hsl(271 81% 40%)', boxShadow: '0 0 20px hsl(271 81% 56% / 0.3)' }}
                  >
                    <Share2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                    {t("发送通行证", "Send Pass")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MySquad;
