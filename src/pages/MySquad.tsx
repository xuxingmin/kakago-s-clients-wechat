import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  Users, 
  TrendingUp, 
  Coins, 
  Copy, 
  Share2,
  QrCode,
  Sparkles,
  Coffee,
  Check,
  Crown
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { toast } from "@/hooks/use-toast";

// Demo data
const squadStats = {
  totalEarned: 1240.50,
  squadSize: 348,
  todayGrowth: 12,
  inviteCode: "SQUAD2024",
};

const recentCommissions = [
  { id: "1", userName: "Mike***", product: "冰拿铁", amount: 0.30, time: "刚刚" },
  { id: "2", userName: "李**", product: "澳白", amount: 0.30, time: "5分钟前" },
  { id: "3", userName: "Emma***", product: "美式", amount: 0.24, time: "12分钟前" },
  { id: "4", userName: "张**", product: "卡布奇诺", amount: 0.32, time: "28分钟前" },
  { id: "5", userName: "Tom***", product: "摩卡", amount: 0.35, time: "1小时前" },
  { id: "6", userName: "王**", product: "拿铁", amount: 0.28, time: "2小时前" },
  { id: "7", userName: "Sarah***", product: "冷萃", amount: 0.26, time: "3小时前" },
  { id: "8", userName: "陈**", product: "燕麦拿铁", amount: 0.34, time: "5小时前" },
];

const MySquad = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(squadStats.inviteCode);
      setCopied(true);
      toast({
        title: "复制成功",
        description: "邀请码已复制到剪贴板",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "复制失败",
        description: "请手动复制邀请码",
        variant: "destructive",
      });
    }
  };

  const handleGeneratePoster = () => {
    toast({
      title: "生成海报中...",
      description: "您的专属推广海报即将生成",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-zinc-900/90 backdrop-blur-md border-b border-amber-500/20 safe-top">
        <div className="flex items-center justify-between px-4 py-3 max-w-md mx-auto">
          <button 
            onClick={() => navigate("/profile")}
            className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center border border-amber-500/30"
          >
            <ChevronLeft className="w-5 h-5 text-amber-400" />
          </button>
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-400" />
            <h1 className="text-base font-bold text-amber-400">拉帮结派</h1>
          </div>
          <div className="w-9" />
        </div>
      </header>

      {/* Scoreboard Section */}
      <section className="px-4 py-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 p-6 shadow-2xl shadow-amber-500/20">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>
          
          {/* Sparkle Effects */}
          <Sparkles className="absolute top-4 right-4 w-6 h-6 text-white/40 animate-pulse" />
          
          <div className="relative">
            {/* Total Earned */}
            <div className="text-center mb-6">
              <p className="text-amber-100/80 text-sm font-medium mb-2">
                Lifetime Passive Income
              </p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-white/80 text-2xl font-bold">¥</span>
                <span className="text-5xl font-black text-white tracking-tight">
                  {squadStats.totalEarned.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
            
            {/* Stats Row */}
            <div className="flex justify-around pt-4 border-t border-white/20">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Users className="w-4 h-4 text-white/70" />
                  <span className="text-2xl font-bold text-white">{squadStats.squadSize}</span>
                </div>
                <p className="text-xs text-amber-100/70">Squad Members</p>
              </div>
              <div className="w-px bg-white/20" />
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <TrendingUp className="w-4 h-4 text-white/70" />
                  <span className="text-2xl font-bold text-white">+{squadStats.todayGrowth}</span>
                </div>
                <p className="text-xs text-amber-100/70">Today's Growth</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Invite Tools Section */}
      <section className="px-4 mb-6">
        <div className="rounded-2xl bg-zinc-800/80 border border-zinc-700/50 overflow-hidden">
          {/* Header */}
          <div className="px-5 py-4 border-b border-zinc-700/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <Users className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <h3 className="font-bold text-white">Recruit New Members</h3>
                <p className="text-xs text-zinc-400">招募新成员</p>
              </div>
            </div>
          </div>
          
          {/* Poster Preview */}
          <div className="p-5">
            <div className="relative rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-800 border border-amber-500/30 p-4 mb-4">
              {/* Mini Poster Preview */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                  <QrCode className="w-12 h-12 text-amber-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm">您的专属推广海报</p>
                  <p className="text-zinc-400 text-xs mt-1">扫码即成为您的永久队员</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-amber-400 font-mono text-xs bg-amber-500/10 px-2 py-0.5 rounded">
                      {squadStats.inviteCode}
                    </span>
                    <button
                      onClick={handleCopyCode}
                      className="p-1 rounded hover:bg-zinc-700 transition-colors"
                    >
                      {copied ? (
                        <Check className="w-3.5 h-3.5 text-green-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-zinc-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Generate Button */}
            <button
              onClick={handleGeneratePoster}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-900 font-bold flex items-center justify-center gap-2 hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/20 active:scale-[0.98]"
            >
              <Share2 className="w-5 h-5" />
              Generate My Poster
            </button>
            
            <p className="text-center text-zinc-500 text-xs mt-3">
              分享到微信群，扫码者将成为您的永久队员
            </p>
          </div>
        </div>
      </section>

      {/* Money Stream Section */}
      <section className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white">Money Stream</h3>
          </div>
          <span className="text-xs text-zinc-500">实时收益</span>
        </div>
        
        <div className="rounded-2xl bg-zinc-800/80 border border-zinc-700/50 overflow-hidden">
          {recentCommissions.map((item, index) => (
            <div
              key={item.id}
              className={`flex items-center justify-between px-4 py-3.5 ${
                index !== recentCommissions.length - 1 ? "border-b border-zinc-700/50" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-zinc-700/50 flex items-center justify-center">
                  <Coffee className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-white">
                    <span className="text-zinc-400">{item.userName}</span>
                    {" "}bought{" "}
                    <span className="text-amber-400">{item.product}</span>
                  </p>
                  <p className="text-xs text-zinc-500">{item.time}</p>
                </div>
              </div>
              <span className="text-amber-400 font-bold">
                +¥{item.amount.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Custom Dark Bottom Nav Override */}
      <nav className="fixed bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-md border-t border-zinc-800 safe-bottom z-50">
        <div className="flex justify-around items-center h-16 max-w-md mx-auto">
          <button 
            onClick={() => navigate("/")}
            className="flex flex-col items-center justify-center gap-1 px-6 py-2 text-zinc-500"
          >
            <Coffee className="w-5 h-5" />
            <span className="text-xs">首页</span>
          </button>
          <button 
            onClick={() => navigate("/orders")}
            className="flex flex-col items-center justify-center gap-1 px-6 py-2 text-zinc-500"
          >
            <Coins className="w-5 h-5" />
            <span className="text-xs">订单</span>
          </button>
          <button 
            onClick={() => navigate("/profile")}
            className="flex flex-col items-center justify-center gap-1 px-6 py-2 text-amber-400"
          >
            <Users className="w-5 h-5" />
            <span className="text-xs">我的</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default MySquad;
