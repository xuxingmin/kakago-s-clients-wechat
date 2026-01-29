import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Ticket, 
  Wallet, 
  Coffee, 
  ClipboardList, 
  Share2, 
  HelpCircle, 
  Store, 
  ChevronRight,
  Crown,
  LucideIcon
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
  badge?: string;
  onClick: () => void;
}

const Profile = () => {
  const navigate = useNavigate();
  const [identityModalOpen, setIdentityModalOpen] = useState(false);
  const [currentIdentity, setCurrentIdentity] = useState<IdentityType>("fan");

  const identityBadge = getIdentityBadge(currentIdentity);
  const IdentityIcon = identityBadge.icon;

  const assetItems: AssetItem[] = [
    { 
      Icon: Ticket, 
      value: "3", 
      label: "张优惠券",
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
      Icon: Share2, 
      label: "分享赚佣金", 
      description: "邀请好友，享1%返佣",
      badge: "热门",
      onClick: () => navigate("/share-earn"),
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
      onClick: () => {},
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header with Avatar */}
      <header className="relative pt-8 pb-4 safe-top">
        {/* Gradient Background */}
        <div className="absolute inset-0 h-32 bg-gradient-to-br from-primary/20 via-lavender to-background" />
        
        {/* User Card */}
        <div className="relative px-4 pt-4 max-w-md mx-auto">
          <div className="card-premium p-5">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <Avatar className="w-16 h-16 border-2 border-primary/30 shadow-lg">
                <AvatarImage src="/placeholder.svg" alt="用户头像" />
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground text-xl font-bold">
                  咖
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                {/* Nickname */}
                <h2 className="text-lg font-bold text-foreground">
                  咖啡探索家
                </h2>
                
                {/* Identity Badge - Clickable */}
                <button
                  onClick={() => setIdentityModalOpen(true)}
                  className={`inline-flex items-center gap-1 mt-1.5 px-2.5 py-1 rounded-full border text-xs font-medium transition-all hover:scale-105 active:scale-95 ${identityBadge.color}`}
                >
                  <IdentityIcon className="w-3 h-3" />
                  <span>☕️ {identityBadge.label}</span>
                  <ChevronRight className="w-3 h-3 opacity-50" />
                </button>
                
                {/* Member Level Badge */}
                <div className="flex items-center gap-1.5 mt-1.5">
                  <Badge 
                    variant="secondary" 
                    className="bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 border border-amber-200/50 gap-1 px-2 py-0.5"
                  >
                    <Crown className="w-3 h-3" />
                    <span className="text-xs font-medium">Coffee Explorer</span>
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

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
                  className={`flex-1 flex flex-col items-center gap-1.5 py-2 hover:scale-105 transition-transform ${
                    index !== assetItems.length - 1 ? "border-r border-border" : ""
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <IconComponent className="w-4 h-4 text-primary" />
                    <span className="text-lg font-bold text-foreground">{item.value}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{item.label}</span>
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
                className={`w-full flex items-center gap-4 px-4 py-4 hover:bg-secondary/50 transition-colors ${
                  index !== menuItems.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <IconComponent className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{item.label}</p>
                    {item.badge && (
                      <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            );
          })}
        </div>
      </section>

      {/* Version Footer */}
      <p className="text-center text-xs text-muted-foreground mt-8">
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
