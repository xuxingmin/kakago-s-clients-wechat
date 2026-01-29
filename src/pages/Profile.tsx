import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Ticket, 
  Coffee, 
  ClipboardList, 
  HelpCircle, 
  Store, 
  ChevronRight,
  Users,
  TrendingUp,
  LucideIcon,
  Bean
} from "lucide-react";
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
      Icon: Bean, 
      value: "124K", 
      label: "KAKA豆",
      onClick: () => navigate("/kaka-beans"),
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
      {/* Minimal Header - Compact user info */}
      <header className="px-4 pt-12 pb-2 safe-top max-w-md mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Coffee className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-semibold text-white">咖啡探索家</h2>
            <button
              onClick={() => setIdentityModalOpen(true)}
              className="text-xs text-white/60 flex items-center gap-1 hover:text-primary transition-colors"
            >
              <span>☕️ {identityBadge.label}</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </header>

      {/* My Squad Card - Merged layout */}
      <section className="px-4 pt-4 max-w-md mx-auto">
        <button
          onClick={() => navigate("/my-squad")}
          className="w-full card-lg"
        >
          <div className="flex">
            {/* Left Section - Icon + Title + Earnings */}
            <div className="flex-1 pr-4 border-r border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-white">拉帮结派</h3>
                  <p className="text-xs text-white/50">邀请返佣 · 永久有效</p>
                </div>
              </div>
              
              <div className="text-left">
                <p className="text-white/50 text-xs mb-1">累计收益</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-primary">¥1,240</span>
                  <span className="text-white/40 text-sm">.50</span>
                </div>
              </div>
            </div>
            
            {/* Right Section - Stats + Arrow */}
            <div className="flex items-center gap-3 pl-4">
              <div className="text-center">
                <p className="text-xl font-bold text-white">348</p>
                <p className="text-xs text-white/50">队员</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 text-green-400">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-bold">+12</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/30" />
            </div>
          </div>
        </button>
      </section>

      {/* Asset Bar - LG Card */}
      <section className="px-4 mt-4 max-w-md mx-auto">
        <div className="card-asset-bar">
          <div className="flex items-center justify-around">
            {assetItems.map((item, index) => {
              const IconComponent = item.Icon;
              return (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className={`flex-1 flex flex-col items-center gap-1.5 py-2 card-menu-item hover:scale-105 transition-transform ${
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

      {/* Menu List - LG Card */}
      <section className="px-4 mt-4 max-w-md mx-auto">
        <div className="card-lg !p-0 overflow-hidden">
          {menuItems.map((item, index) => {
            const IconComponent = item.Icon;
            return (
              <button
                key={item.label}
                onClick={item.onClick}
                className={`w-full flex items-center gap-4 px-4 card-menu-item hover:bg-white/5 transition-colors ${
                  index !== menuItems.length - 1 ? "border-b border-white/10" : ""
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
                  <IconComponent className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-white text-sm">{item.label}</p>
                  <p className="text-xs text-white/50">{item.description}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-white/40" />
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
