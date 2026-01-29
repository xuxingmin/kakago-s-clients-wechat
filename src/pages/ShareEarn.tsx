import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  Copy, 
  Share2, 
  Gift, 
  Users, 
  Coins,
  Check,
  QrCode
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { toast } from "@/hooks/use-toast";

// Demo referral data
const referralStats = {
  inviteCode: "COFFEE2024",
  totalInvites: 5,
  totalEarnings: 12.50,
  pendingEarnings: 3.20,
};

const invitedFriends = [
  { id: "1", name: "小明", date: "2026-01-25", earnings: 2.80 },
  { id: "2", name: "咖啡达人", date: "2026-01-20", earnings: 4.50 },
  { id: "3", name: "拿铁控", date: "2026-01-15", earnings: 3.10 },
  { id: "4", name: "美式爱好者", date: "2026-01-10", earnings: 1.20 },
  { id: "5", name: "新用户A", date: "2026-01-05", earnings: 0.90 },
];

const ShareEarn = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralStats.inviteCode);
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "KAKAGO 咖啡盲盒",
        text: `用我的邀请码 ${referralStats.inviteCode} 注册KAKAGO，首单立减5元！`,
        url: window.location.origin,
      }).catch(() => {
        // User cancelled or share failed silently
      });
    } else {
      handleCopyCode();
    }
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
          <h1 className="text-base font-semibold text-foreground">分享赚佣金</h1>
          <div className="w-9" />
        </div>
      </header>

      {/* Hero Card */}
      <div className="px-4 py-4">
        <div className="bg-gradient-to-br from-primary via-purple-500 to-primary/80 rounded-3xl p-6 text-white relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Gift className="w-5 h-5" />
              <span className="text-sm font-medium opacity-90">邀请好友 · 享1%返佣</span>
            </div>
            
            <h2 className="text-2xl font-bold mb-1">邀请好友喝咖啡</h2>
            <p className="text-sm opacity-80 mb-6">好友每笔订单，您都能获得1%佣金</p>
            
            {/* Invite Code Box */}
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
              <p className="text-xs opacity-70 mb-2">我的邀请码</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black tracking-wider">
                  {referralStats.inviteCode}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center hover:bg-white/40 transition-colors"
                >
                  {copied ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="w-full mt-4 py-4 bg-white text-primary rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/90 transition-colors"
            >
              <Share2 className="w-5 h-5" />
              立即分享给好友
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <section className="px-4 mt-2">
        <div className="grid grid-cols-3 gap-3">
          <div className="card-premium p-4 text-center">
            <Users className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{referralStats.totalInvites}</p>
            <p className="text-xs text-muted-foreground mt-1">邀请好友</p>
          </div>
          <div className="card-premium p-4 text-center">
            <Coins className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">¥{referralStats.totalEarnings.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-1">累计收益</p>
          </div>
          <div className="card-premium p-4 text-center">
            <Gift className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">¥{referralStats.pendingEarnings.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-1">待结算</p>
          </div>
        </div>
      </section>

      {/* QR Code Card */}
      <section className="px-4 mt-4">
        <div className="card-premium p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">专属推广海报</h3>
              <p className="text-xs text-muted-foreground mt-1">生成带二维码的分享海报</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-full text-sm font-medium text-foreground hover:bg-mist-light transition-colors">
              <QrCode className="w-4 h-4" />
              生成海报
            </button>
          </div>
        </div>
      </section>

      {/* Rules */}
      <section className="px-4 mt-4">
        <div className="card-premium p-5">
          <h3 className="font-semibold text-foreground mb-3">活动规则</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
              <span>好友使用您的邀请码注册并完成首单</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
              <span>好友后续每笔订单，您都将获得1%返佣</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
              <span>佣金将在订单完成后7天内结算到账</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
              <span>返佣金额可用于订单抵扣或提现</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Invited Friends List */}
      <section className="px-4 mt-4 mb-6">
        <h3 className="font-semibold text-foreground mb-3 px-1">邀请记录</h3>
        <div className="card-premium overflow-hidden">
          {invitedFriends.length > 0 ? (
            invitedFriends.map((friend, index) => (
              <div
                key={friend.id}
                className={`flex items-center justify-between px-4 py-3 ${
                  index !== invitedFriends.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
                    <span className="text-sm font-medium text-foreground">
                      {friend.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{friend.name}</p>
                    <p className="text-xs text-muted-foreground">{friend.date}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-primary">
                  +¥{friend.earnings.toFixed(2)}
                </span>
              </div>
            ))
          ) : (
            <div className="py-12 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground text-sm">暂无邀请记录</p>
              <p className="text-muted-foreground text-xs mt-1">快去邀请好友吧</p>
            </div>
          )}
        </div>
      </section>

      <BottomNav />
    </div>
  );
};

export default ShareEarn;
