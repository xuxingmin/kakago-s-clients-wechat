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
  Check
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
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border safe-top">
        <div className="flex items-center justify-between px-4 py-3 max-w-md mx-auto">
          <button 
            onClick={() => navigate("/profile")}
            className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-base font-semibold text-foreground">拉帮结派</h1>
          <div className="w-9" />
        </div>
      </header>

      {/* Scoreboard Section */}
      <section className="px-4 py-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-purple-500 to-primary/80 p-6 shadow-xl shadow-primary/20">
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <Sparkles className="absolute top-4 right-4 w-6 h-6 text-white/30 animate-pulse" />
          
          <div className="relative">
            {/* Total Earned */}
            <div className="text-center mb-6">
              <p className="text-white/70 text-sm font-medium mb-2">
                累计被动收入
              </p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-white/70 text-2xl font-bold">¥</span>
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
                <p className="text-xs text-white/60">我的队员</p>
              </div>
              <div className="w-px bg-white/20" />
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <TrendingUp className="w-4 h-4 text-white/70" />
                  <span className="text-2xl font-bold text-white">+{squadStats.todayGrowth}</span>
                </div>
                <p className="text-xs text-white/60">今日新增</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Invite Tools Section */}
      <section className="px-4 mb-6">
        <div className="card-premium overflow-hidden">
          {/* Header */}
          <div className="px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">招募新成员</h3>
                <p className="text-xs text-muted-foreground">分享邀请码，永久获得返佣</p>
              </div>
            </div>
          </div>
          
          {/* Poster Preview */}
          <div className="p-5">
            <div className="relative rounded-xl bg-secondary/50 border border-border p-4 mb-4">
              {/* Mini Poster Preview */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <QrCode className="w-12 h-12 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-foreground font-semibold text-sm">您的专属推广海报</p>
                  <p className="text-muted-foreground text-xs mt-1">扫码即成为您的永久队员</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-primary font-mono text-xs bg-primary/10 px-2 py-0.5 rounded">
                      {squadStats.inviteCode}
                    </span>
                    <button
                      onClick={handleCopyCode}
                      className="p-1 rounded hover:bg-secondary transition-colors"
                    >
                      {copied ? (
                        <Check className="w-3.5 h-3.5 text-green-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Generate Button */}
            <button
              onClick={handleGeneratePoster}
              className="w-full py-4 rounded-2xl btn-gold font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            >
              <Share2 className="w-5 h-5" />
              生成我的海报
            </button>
            
            <p className="text-center text-muted-foreground text-xs mt-3">
              分享到微信群，扫码者将成为您的永久队员
            </p>
          </div>
        </div>
      </section>

      {/* Money Stream Section */}
      <section className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">收益流水</h3>
          </div>
          <span className="text-xs text-muted-foreground">实时更新</span>
        </div>
        
        <div className="card-premium overflow-hidden">
          {recentCommissions.map((item, index) => (
            <div
              key={item.id}
              className={`flex items-center justify-between px-4 py-3.5 ${
                index !== recentCommissions.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
                  <Coffee className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-foreground">
                    <span className="text-muted-foreground">{item.userName}</span>
                    {" "}购买了{" "}
                    <span className="text-primary font-medium">{item.product}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              </div>
              <span className="text-primary font-bold">
                +¥{item.amount.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </section>

      <BottomNav />
    </div>
  );
};

export default MySquad;
