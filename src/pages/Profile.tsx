import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Ticket, 
  Wallet, 
  Coffee, 
  ClipboardList, 
  HelpCircle, 
  Store, 
  ChevronRight,
  Users,
  TrendingUp,
  Sparkles,
  LucideIcon
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BottomNav } from "@/components/BottomNav";
import { 
  IdentityVerificationModal, 
  getIdentityBadge,
  type IdentityType 
} from "@/components/IdentityVerificationModal";

interface AssetItem {
  Icon: LucideIcon;
  value: string;
  label: string;
  onClick: () => void;
}

interface MenuItem {
  Icon: LucideIcon;
  label: string;
  description: string;
  onClick: () => void;
}

const Profile = () => {
  const navigate = useNavigate();
  const [identityModalOpen, setIdentityModalOpen] = useState(false);
  const [currentIdentity, setCurrentIdentity] = useState<IdentityType>("fan");

  const identityBadge = getIdentityBadge(currentIdentity);

  const assetItems: AssetItem[] = [
    { 
      Icon: Ticket, 
      value: "3", 
      label: "优惠券",
      onClick: () => navigate("/wallet"),
    },
    { 
      Icon: Wallet, 
      value: "¥0.00", 
      label: "余额",
      onClick: () => {},
    },
    { 
      Icon: Coffee, 
      value: "12", 
      label: "杯咖啡",
      onClick: () => navigate("/orders"),
    },
  ];

  const menuItems: MenuItem[] = [
    { 
      Icon: ClipboardList, 
      label: "订单历史", 
      description: "查看订单与评价状态",
      onClick: () => navigate("/orders"),
    },
    { 
      Icon: HelpCircle, 
      label: "帮助与支持", 
      description: "常见问题与联系客服",
      onClick: () => {},
    },
    {
      Icon: Store, 
      label: "成为合作商家", 
      description: "加入我们，一起成长",
      onClick: () => navigate("/merchant-auth"),
    },
  ];

  return (
    <div className="min-h-screen pb-20">
      {/* Minimal Header */}
      <header className="px-4 pt-12 pb-4 safe-top max-w-md mx-auto">
        <div className="flex items-center justify-between">
          {/* User Info - Minimal */}
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12 border-2 border-primary/30">
              <AvatarImage src="/placeholder.svg" alt="用户头像" />
              <AvatarFallback className="bg-primary/20 text-primary font-bold">
                咖
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-base font-semibold text-white">咖啡探索家</h2>
              <button
                onClick={() => setIdentityModalOpen(true)}
                className="text-xs text-white/60 flex items-center gap-1 hover:text-primary transition-colors min-h-[32px]"
              >
                <span>☕️ {identityBadge.label}</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* My Squad Card - Hero Section */}
      <section className="px-4 max-w-md mx-auto">
        <button
          onClick={() => navigate("/my-squad")}
          className="w-full relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-purple-600 to-purple-dark p-6 shadow-glow hover:shadow-purple transition-all active:scale-[0.98] min-h-[180px]"
        >
          {/* Background Decorations */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <Sparkles className="absolute top-4 right-4 w-6 h-6 text-white/30 animate-pulse" />
          
          <div className="relative">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-white">拉帮结派</h3>
                <p className="text-xs text-white/70">邀请返佣 · 永久有效</p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex items-end justify-between">
              <div className="text-left">
                <p className="text-white/70 text-xs mb-1">累计收益</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">¥1,240</span>
                  <span className="text-white/60 text-sm">.50</span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-xl font-bold text-white">348</p>
                    <p className="text-xs text-white/60">队员</p>
                  </div>
                  <div className="h-8 w-px bg-white/20" />
                  <div className="flex items-center gap-1 text-green-400">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-semibold">+12</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* CTA */}
            <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between">
              <span className="text-sm text-white/80">邀请好友，享永久返佣</span>
              <ChevronRight className="w-5 h-5 text-white/60" />
            </div>
          </div>
        </button>
      </section>

      {/* Asset Bar */}
      <section className="px-4 mt-4 max-w-md mx-auto">
        <div className="card-premium p-4">
          <div className="flex items-center justify-around">
            {assetItems.map((item, index) => {
              const IconComponent = item.Icon;
              return (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className={`flex-1 flex flex-col items-center gap-1.5 py-2 min-h-[64px] hover:scale-105 transition-transform ${
                    index !== assetItems.length - 1 ? "border-r border-white/10" : ""
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <IconComponent className="w-4 h-4 text-primary" />
                    <span className="text-lg font-bold text-white">{item.value}</span>
                  </div>
                  <span className="text-xs text-white/60">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Menu List */}
      <section className="px-4 mt-4 max-w-md mx-auto">
        <div className="card-premium overflow-hidden">
          {menuItems.map((item, index) => {
            const IconComponent = item.Icon;
            return (
              <button
                key={item.label}
                onClick={item.onClick}
                className={`w-full flex items-center gap-4 px-4 py-4 min-h-[72px] hover:bg-white/5 transition-colors ${
                  index !== menuItems.length - 1 ? "border-b border-white/10" : ""
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <IconComponent className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-white">{item.label}</p>
                  <p className="text-xs text-white/50">{item.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-white/40" />
              </button>
            );
          })}
        </div>
      </section>

      {/* Version Footer */}
      <p className="text-center text-xs text-white/40 mt-8">
        KAKAGO v1.0.0
      </p>

      <BottomNav />

      {/* Identity Verification Modal */}
      <IdentityVerificationModal
        isOpen={identityModalOpen}
        onClose={() => setIdentityModalOpen(false)}
        currentIdentity={currentIdentity}
        onSelectIdentity={setCurrentIdentity}
      />
    </div>
  );
};

export default Profile;
