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
  Gift
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

// 演示数据 - KAKA豆系统 (1元 = 100豆)
const squadStats = {
  totalBeans: 124050, // 相当于 ¥1240.50
  squadSize: 348,
  todayGrowth: 12,
  inviteCode: "KAKA2024",
};

// 2% 返豆记录
const recentCommissions = [
  { id: "1", productZh: "冰拿铁", productEn: "Iced Latte", beans: 30, time: "刚刚" },
  { id: "2", productZh: "澳白", productEn: "Flat White", beans: 30, time: "5分钟前" },
  { id: "3", productZh: "美式", productEn: "Americano", beans: 24, time: "12分钟前" },
  { id: "4", productZh: "卡布奇诺", productEn: "Cappuccino", beans: 32, time: "28分钟前" },
  { id: "5", productZh: "摩卡", productEn: "Mocha", beans: 35, time: "1小时前" },
];

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
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 glass safe-top">
        <div className="flex items-center justify-between px-4 py-3 max-w-md mx-auto">
          <button 
            onClick={() => navigate("/profile")}
            className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-base font-semibold text-white">{t("拉帮结派", "My Squad")}</h1>
          <div className="w-9" />
        </div>
      </header>

      {/* Brand Header */}
      <section className="px-4 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{t("拉帮结派", "My Squad")}</h1>
            <p className="text-sm text-white/50 mt-0.5">
              {t("邀请好友 · 终身返利", "Invite & Earn Forever")}
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-primary/20 border border-primary/30 px-3 py-1.5 rounded-full">
            <Users className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs text-primary font-medium">
              2% {t("返利", "Cashback")}
            </span>
          </div>
        </div>
      </section>

      {/* Fog Divider */}
      <div className="fog-divider mx-4" />

      {/* Stats Card - Purple Theme */}
      <section className="px-4 py-4">
        <div className="card-lg">
          {/* Main Stats Row */}
          <div className="flex items-center gap-4">
            {/* Total Beans Icon */}
            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
              <Coins className="w-7 h-7 text-primary" />
            </div>
            
            {/* Total Beans */}
            <div className="flex-1">
              <p className="text-xs text-white/50 mb-0.5">{t("累计获得 KAKA豆", "Total Earned")}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-primary">
                  {squadStats.totalBeans.toLocaleString()}
                </span>
              </div>
              <p className="text-[10px] text-white/40 mt-0.5">≈ ¥{beansToRMB(squadStats.totalBeans)}</p>
            </div>
            
            {/* Quick Stats */}
            <div className="flex gap-4">
              <div className="text-center">
                <div className="flex items-center gap-1 justify-center">
                  <Users className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xl font-bold text-white">{squadStats.squadSize}</span>
                </div>
                <p className="text-[10px] text-white/50">{t("队员", "Members")}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1 justify-center">
                  <TrendingUp className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-xl font-bold text-green-400">+{squadStats.todayGrowth}</span>
                </div>
                <p className="text-[10px] text-white/50">{t("今日", "Today")}</p>
              </div>
            </div>
          </div>
          
          {/* Divider */}
          <div className="h-px bg-white/10 my-4" />
          
          {/* Benefits Row - Simplified Graphics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center gap-1.5 py-2">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-black text-sm">2%</span>
              </div>
              <p className="text-[10px] text-white/50 text-center">{t("豆豆返利", "Rebate")}</p>
            </div>
            <div className="flex flex-col items-center gap-1.5 py-2">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Infinity className="w-4 h-4 text-primary" />
              </div>
              <p className="text-[10px] text-white/50 text-center">{t("终身有效", "Lifetime")}</p>
            </div>
            <div className="flex flex-col items-center gap-1.5 py-2">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Coffee className="w-4 h-4 text-primary" />
              </div>
              <p className="text-[10px] text-white/50 text-center">{t("兑换咖啡", "Redeem")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Invite Card */}
      <section className="px-4 pb-4">
        <div className="card-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <QrCode className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-white/50">{t("我的邀请码", "Invite Code")}</p>
              <div className="flex items-center gap-2">
                <span className="text-primary font-mono font-bold">{squadStats.inviteCode}</span>
                <button onClick={handleCopyCode} className="p-1">
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-green-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-white/50 hover:text-white transition-colors" />
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {/* Share Button */}
          <button
            onClick={handleShare}
            className="btn-gold px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-1.5"
          >
            <MessageCircle className="w-4 h-4" />
            {t("邀请", "Invite")}
          </button>
        </div>
      </section>

      {/* Fog Divider */}
      <div className="fog-divider mx-4" />

      {/* Section Header */}
      <section className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-white/70">
            {t("返豆流水", "Commission History")}
          </h2>
          <span className="text-xs text-white/40">2% {t("返利", "rebate")}</span>
        </div>
      </section>

      {/* Commission List */}
      <section className="px-4 space-y-2">
        {recentCommissions.map((item, index) => (
          <div
            key={item.id}
            className="card-sm flex items-center justify-between"
            style={{ animationDelay: `${index * 0.03}s` }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Coffee className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  {t("队员购买", "Member bought")} <span className="text-primary">{t(item.productZh, item.productEn)}</span>
                </p>
                <p className="text-[10px] text-white/40">{item.time}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-primary font-bold">+{item.beans}</span>
              <p className="text-[9px] text-white/40">≈¥{beansToRMB(item.beans)}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Quick Info Footer */}
      <section className="px-4 py-4">
        <div className="flex items-center justify-center text-xs text-white/30">
          <span>{t("💜 队员每次消费你都能获得2%返利", "💜 Earn 2% on every member purchase")}</span>
        </div>
      </section>

      {/* Poster Modal */}
      {showPoster && (
        <>
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[80]"
            onClick={() => setShowPoster(false)}
          />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[85] max-w-sm mx-auto">
            <div className="card-lg bg-gradient-to-br from-[#1a1025] to-[#0d0a12]">
              {/* Poster Content */}
              <div className="text-center">
                <h2 className="text-2xl font-black text-white tracking-tight mb-1">KAKAGO</h2>
                <p className="text-xs text-white/50 mb-6">{t("城市精品咖啡联盟", "Urban Specialty Coffee")}</p>
                
                {/* QR Placeholder */}
                <div className="w-36 h-36 mx-auto bg-white rounded-xl p-3 mb-4">
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-purple-dark/20 rounded-lg flex items-center justify-center border-2 border-dashed border-primary/30">
                    <QrCode className="w-12 h-12 text-primary" />
                  </div>
                </div>
                
                {/* Invite Code */}
                <div className="bg-primary/20 rounded-xl px-4 py-2 inline-block mb-4">
                  <p className="text-[10px] text-white/50 mb-0.5">{t("邀请码", "Code")}</p>
                  <p className="text-lg font-mono font-black text-primary tracking-wider">{squadStats.inviteCode}</p>
                </div>
                
                <p className="text-sm text-white/70">
                  {t("扫码加入，首杯立减", "Join now, get")} <span className="text-primary font-bold">¥5</span> {t("", "off")}
                </p>
              </div>
              
              {/* Actions */}
              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setShowPoster(false)}
                  className="flex-1 py-3 rounded-xl bg-secondary text-white/70 text-sm font-medium"
                >
                  {t("关闭", "Close")}
                </button>
                <button
                  onClick={() => {
                    handleShare();
                    setShowPoster(false);
                  }}
                  className="flex-1 py-3 rounded-xl btn-gold text-sm font-bold flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  {t("分享", "Share")}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <BottomNav />
    </div>
  );
};

export default MySquad;
