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
  Bean
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { toast } from "@/hooks/use-toast";

// 演示数据 - KAKA豆系统 (1元 = 100豆)
const squadStats = {
  totalBeans: 124050, // 相当于 ¥1240.50
  squadSize: 348,
  todayGrowth: 12,
  inviteCode: "KAKA2024",
};

// 2% 返豆记录
const recentCommissions = [
  { id: "1", product: "冰拿铁", beans: 30, time: "刚刚" }, // ¥15 × 2% = ¥0.30 = 30豆
  { id: "2", product: "澳白", beans: 30, time: "5分钟前" },
  { id: "3", product: "美式", beans: 24, time: "12分钟前" },
  { id: "4", product: "卡布奇诺", beans: 32, time: "28分钟前" },
  { id: "5", product: "摩卡", beans: 35, time: "1小时前" },
  { id: "6", product: "拿铁", beans: 28, time: "2小时前" },
];

// 豆转人民币
const beansToRMB = (beans: number) => (beans / 100).toFixed(2);

const MySquad = () => {
  const navigate = useNavigate();
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
          <h1 className="text-base font-semibold text-white">拉帮结派</h1>
          <div className="w-9" />
        </div>
      </header>

      {/* Compact Scoreboard - KAKA豆 */}
      <section className="px-4 pt-4 pb-3">
        <div className="card-lg bg-gradient-to-br from-amber-500/20 to-orange-600/20 border-amber-500/20">
          <div className="flex items-center justify-between">
            {/* Total Beans */}
            <div>
              <p className="text-white/50 text-xs mb-0.5">累计获得 KAKA豆</p>
              <div className="flex items-baseline gap-1">
                <Bean className="w-5 h-5 text-amber-400" />
                <span className="text-3xl font-black text-amber-400">
                  {squadStats.totalBeans.toLocaleString()}
                </span>
              </div>
              <p className="text-[10px] text-white/40 mt-1">≈ ¥{beansToRMB(squadStats.totalBeans)}</p>
            </div>
            
            {/* Stats */}
            <div className="flex gap-4">
              <div className="text-center">
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xl font-bold text-white">{squadStats.squadSize}</span>
                </div>
                <p className="text-[10px] text-white/50">队员</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-xl font-bold text-white">+{squadStats.todayGrowth}</span>
                </div>
                <p className="text-[10px] text-white/50">今日</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rules Banner */}
      <section className="px-4 pb-3">
        <div className="card-sm bg-primary/10 border-primary/20">
          <p className="text-xs text-white/70 text-center">
            队员每次消费，你获得 <span className="text-amber-400 font-bold">2%</span> KAKA豆返利 · 终身有效 · 可兑换咖啡
          </p>
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
                <p className="text-sm font-medium text-white">邀请码</p>
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
                海报
              </button>
              <button
                onClick={handleShare}
                className="px-3 py-2 rounded-lg bg-primary text-xs font-medium text-white flex items-center gap-1 hover:bg-primary/80 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                转发
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
          <h3 className="text-sm font-medium text-white/70">返豆流水</h3>
          <span className="text-[10px] text-white/40">2% 返利</span>
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
                    队员购买了 <span className="text-primary">{item.product}</span>
                  </p>
                  <p className="text-[10px] text-white/30">{item.time}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-amber-400 font-bold text-sm flex items-center gap-0.5">
                  +{item.beans} <Bean className="w-3 h-3" />
                </span>
                <p className="text-[9px] text-white/30">≈¥{beansToRMB(item.beans)}</p>
              </div>
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
                <p className="text-xs text-white/50 mb-6">城市精品咖啡联盟</p>
                
                {/* QR Placeholder */}
                <div className="w-40 h-40 mx-auto bg-white rounded-xl p-3 mb-4">
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-purple-dark/20 rounded-lg flex items-center justify-center border-2 border-dashed border-primary/30">
                    <QrCode className="w-16 h-16 text-primary" />
                  </div>
                </div>
                
                {/* Invite Code */}
                <div className="bg-amber-500/20 rounded-lg px-4 py-2 inline-block mb-4">
                  <p className="text-[10px] text-white/50 mb-0.5">邀请码</p>
                  <p className="text-lg font-mono font-black text-amber-400 tracking-wider">{squadStats.inviteCode}</p>
                </div>
                
                {/* Benefit */}
                <p className="text-sm text-white/70">
                  扫码加入，首杯立减 <span className="text-primary font-bold">¥5</span>
                </p>
              </div>
              
              {/* Actions */}
              <div className="px-4 pb-4 flex gap-2">
                <button
                  onClick={() => setShowPoster(false)}
                  className="flex-1 py-3 rounded-xl bg-secondary text-white/70 text-sm font-medium"
                >
                  关闭
                </button>
                <button
                  onClick={() => {
                    handleShare();
                    setShowPoster(false);
                  }}
                  className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-bold flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  转发微信
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
