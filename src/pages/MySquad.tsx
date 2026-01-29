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
  MessageCircle
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

// 演示数据
const squadStats = {
  totalEarned: 1240.50,
  squadSize: 348,
  todayGrowth: 12,
  inviteCode: "KAKA2024",
};

const recentCommissions = [
  { id: "1", product: "冰拿铁", amount: 0.30, time: "刚刚" },
  { id: "2", product: "澳白", amount: 0.30, time: "5分钟前" },
  { id: "3", product: "美式", amount: 0.24, time: "12分钟前" },
  { id: "4", product: "卡布奇诺", amount: 0.32, time: "28分钟前" },
  { id: "5", product: "摩卡", amount: 0.35, time: "1小时前" },
  { id: "6", product: "拿铁", amount: 0.28, time: "2小时前" },
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
      toast({ title: "复制成功", description: "邀请码已复制" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: "复制失败", variant: "destructive" });
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'KAKAGO 咖啡联盟',
      text: `使用我的邀请码 ${squadStats.inviteCode} 加入KAKAGO，首杯立减5元！`,
      url: window.location.origin,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast({ title: "分享成功" });
      } else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        toast({ title: "已复制分享内容", description: "可粘贴到微信发送" });
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

      {/* Compact Scoreboard */}
      <section className="px-4 pt-4 pb-3">
        <div className="card-lg bg-gradient-to-br from-primary/20 to-purple-dark/20 border-primary/20">
          <div className="flex items-center justify-between">
            {/* Total Earned */}
            <div>
              <p className="text-white/50 text-xs mb-0.5">{t("累计被动收入", "Total Earned")}</p>
              <div className="flex items-baseline gap-0.5">
                <span className="text-white/60 text-lg">¥</span>
                <span className="text-3xl font-black text-white">
                  {squadStats.totalEarned.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex gap-4">
              <div className="text-center">
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xl font-bold text-white">{squadStats.squadSize}</span>
                </div>
                <p className="text-[10px] text-white/50">{t("队员", "Members")}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-xl font-bold text-white">+{squadStats.todayGrowth}</span>
                </div>
                <p className="text-[10px] text-white/50">{t("今日", "Today")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Invite Card - Compact */}
      <section className="px-4 pb-3">
        <div className="card-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
                <QrCode className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">{t("邀请码", "Invite Code")}</p>
                <div className="flex items-center gap-2">
                  <span className="text-primary font-mono text-sm font-bold">{squadStats.inviteCode}</span>
                  <button onClick={handleCopyCode} className="p-1">
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-green-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-white/50" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowPoster(true)}
                className="px-3 py-2 rounded-lg bg-secondary text-xs font-medium text-white/80 hover:bg-secondary/80 transition-colors"
              >
                {t("海报", "Poster")}
              </button>
              <button
                onClick={handleShare}
                className="px-3 py-2 rounded-lg bg-primary text-xs font-medium text-white flex items-center gap-1 hover:bg-primary/80 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                {t("转发", "Share")}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Fog Divider */}
      <div className="fog-divider mx-4" />

      {/* Commission Stream - Compact */}
      <section className="px-4 py-3">
        <div className="flex items-center justify-between mb-2 px-1">
          <h3 className="text-sm font-medium text-white/70">{t("收益流水", "Earnings")}</h3>
          <span className="text-[10px] text-white/40">{t("实时更新", "Live")}</span>
        </div>
        
        <div className="card-premium overflow-hidden">
          {recentCommissions.map((item, index) => (
            <div
              key={item.id}
              className={`flex items-center justify-between px-3 py-2.5 ${
                index !== recentCommissions.length - 1 ? "border-b border-white/5" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <Coffee className="w-4 h-4 text-primary/60" />
                <div>
                  <p className="text-xs text-white/70">
                    {t("你的队员", "Member")} {t("购买了", "bought")} <span className="text-primary">{item.product}</span>
                  </p>
                  <p className="text-[10px] text-white/30">{item.time}</p>
                </div>
              </div>
              <span className="text-primary font-bold text-sm">+¥{item.amount.toFixed(2)}</span>
            </div>
          ))}
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
            {/* Poster Card */}
            <div className="bg-gradient-to-br from-[#1a1025] to-[#0d0a12] rounded-2xl overflow-hidden border border-primary/20 shadow-glow">
              {/* Poster Content */}
              <div className="p-6 text-center">
                {/* Brand */}
                <h2 className="text-2xl font-black text-white tracking-tight mb-1">KAKAGO</h2>
                <p className="text-xs text-white/50 mb-6">{t("城市精品咖啡联盟", "Urban Specialty Coffee")}</p>
                
                {/* QR Placeholder */}
                <div className="w-40 h-40 mx-auto bg-white rounded-xl p-3 mb-4">
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-purple-dark/20 rounded-lg flex items-center justify-center border-2 border-dashed border-primary/30">
                    <QrCode className="w-16 h-16 text-primary" />
                  </div>
                </div>
                
                {/* Invite Code */}
                <div className="bg-primary/20 rounded-lg px-4 py-2 inline-block mb-4">
                  <p className="text-[10px] text-white/50 mb-0.5">{t("邀请码", "Invite Code")}</p>
                  <p className="text-lg font-mono font-black text-primary tracking-wider">{squadStats.inviteCode}</p>
                </div>
                
                {/* Benefit */}
                <p className="text-sm text-white/70">
                  {t("扫码加入，首杯立减", "Scan to join, save")} <span className="text-primary font-bold">¥5</span>
                </p>
              </div>
              
              {/* Actions */}
              <div className="px-4 pb-4 flex gap-2">
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
                  className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-bold flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  {t("转发微信", "Share")}
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
