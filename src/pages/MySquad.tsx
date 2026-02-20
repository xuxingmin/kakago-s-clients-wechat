import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  Users, 
  TrendingUp, 
  Copy, 
  Share2,
  QrCode,
  Coffee,
  Check,
  MessageCircle,
  Coins,
  Infinity,
  ChevronRight
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { BrandBanner } from "@/components/BrandBanner";
import { Header } from "@/components/Header";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

// 演示数据 - KAKA豆系统 (1元 = 100豆)
const squadStats = {
  totalBeans: 124050, // 相当于 ¥1240.50
  squadSize: 348,
  todayGrowth: 12,
  inviteCode: "KAKA2024",
};

// 豆转人民币
const beansToRMB = (beans: number) => (beans / 100).toFixed(2);

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

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* 固定顶部区域 */}
      <div className="flex-shrink-0">
        <Header />
        <BrandBanner />
        <div className="fog-divider mx-4" />

        {/* Section Title with Back */}
        <div className="px-4 pt-3 pb-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="w-7 h-7 rounded-full bg-secondary/60 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h2 className="text-sm font-medium text-muted-foreground">{t("拉帮结派", "My Squad")}</h2>
          </div>
        </div>

        {/* Stats Card */}
        <section className="px-4 pt-3 pb-2">
          <div className="card-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                <Coins className="w-6 h-6 text-primary" />
              </div>
              
              <div className="flex-1">
                <p className="text-[10px] text-white/50 mb-0.5">{t("累计获得 KAKA豆", "Total Earned")}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-primary">
                    {squadStats.totalBeans.toLocaleString()}
                  </span>
                </div>
                <p className="text-[9px] text-white/40 mt-0.5">≈ ¥{beansToRMB(squadStats.totalBeans)}</p>
              </div>
              
              <div className="flex gap-3">
                <div className="text-center">
                  <div className="flex items-center gap-0.5 justify-center">
                    <Users className="w-3 h-3 text-primary" />
                    <span className="text-lg font-bold text-white">{squadStats.squadSize}</span>
                  </div>
                  <p className="text-[9px] text-white/50">{t("队员", "Members")}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-0.5 justify-center">
                    <TrendingUp className="w-3 h-3 text-green-400" />
                    <span className="text-lg font-bold text-green-400">+{squadStats.todayGrowth}</span>
                  </div>
                  <p className="text-[9px] text-white/50">{t("今日", "Today")}</p>
                </div>
              </div>
            </div>
            
            <div className="h-px bg-white/10 my-3" />
            
            {/* Benefits Row */}
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center gap-1 py-1.5">
                <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-black text-[10px]">2%</span>
                </div>
                <p className="text-[9px] text-white/50">{t("豆豆返利", "Rebate")}</p>
              </div>
              <div className="flex flex-col items-center gap-1 py-1.5">
                <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Infinity className="w-3.5 h-3.5 text-primary" />
                </div>
                <p className="text-[9px] text-white/50">{t("终身有效", "Lifetime")}</p>
              </div>
              <div className="flex flex-col items-center gap-1 py-1.5">
                <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Coffee className="w-3.5 h-3.5 text-primary" />
                </div>
                <p className="text-[9px] text-white/50">{t("兑换咖啡", "Redeem")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Invite Card */}
        <section className="px-4 pb-2">
          <div className="card-md flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center">
                <QrCode className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-[10px] text-white/50">{t("我的邀请码", "Invite Code")}</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-primary font-mono font-bold text-sm">{squadStats.inviteCode}</span>
                  <button onClick={handleCopyCode} className="p-0.5">
                    {copied ? (
                      <Check className="w-3 h-3 text-green-400" />
                    ) : (
                      <Copy className="w-3 h-3 text-white/50 hover:text-white transition-colors" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setShowPoster(true)}
              className="btn-gold px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              {t("邀请", "Invite")}
            </button>
          </div>
        </section>

        <div className="fog-divider mx-4" />
      </div>

      {/* 可滚动中间区域 */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* View Records Link */}
        <section className="px-4 py-3">
          <button
            onClick={() => navigate("/kaka-beans")}
            className="card-sm w-full flex items-center justify-between group"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
                <Coins className="w-4 h-4 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-xs font-medium text-white">{t("查看豆豆收支记录", "View Transaction History")}</p>
                <p className="text-[9px] text-white/40">{t("所有返利记录统一在这里查看", "All rebate records in one place")}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-primary transition-colors" />
          </button>
        </section>

        <section className="px-4 py-3">
          <div className="flex items-center justify-center text-[10px] text-white/30">
            <span>{t("💜 队员每次消费你都能获得2%返利", "💜 Earn 2% on every member purchase")}</span>
          </div>
        </section>
      </div>

      {/* 固定底部区域 */}
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
            <div className="card-lg bg-gradient-to-br from-[#1a1025] to-[#0d0a12]">
              <div className="text-center">
                <h2 className="text-xl font-black text-white tracking-tight mb-1">KAKAGO</h2>
                <p className="text-[10px] text-white/50 mb-4">{t("可负担的精品咖啡", "Affordable Specialty Coffee")}</p>
                
                <div className="w-28 h-28 mx-auto bg-white rounded-xl p-2 mb-3">
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-purple-dark/20 rounded-lg flex items-center justify-center border-2 border-dashed border-primary/30">
                    <QrCode className="w-10 h-10 text-primary" />
                  </div>
                </div>
                
                <div className="bg-primary/20 rounded-xl px-3 py-1.5 inline-block mb-3">
                  <p className="text-[9px] text-white/50 mb-0.5">{t("邀请码", "Code")}</p>
                  <p className="text-base font-mono font-black text-primary tracking-wider">{squadStats.inviteCode}</p>
                </div>
                
                <p className="text-xs text-white/70">
                  {t("扫码加入，首杯立减", "Join now, get")} <span className="text-primary font-bold">¥5</span> {t("", "off")}
                </p>
              </div>
              
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setShowPoster(false)}
                  className="flex-1 py-2.5 rounded-xl bg-secondary text-white/70 text-xs font-medium"
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
