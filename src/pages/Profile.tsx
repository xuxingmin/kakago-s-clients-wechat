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
      {/* Top Row - Two Column Layout */}
      <section className="px-4 pt-12 safe-top max-w-md mx-auto">
        <div className="grid grid-cols-2 gap-3">
          {/* Left Card - User Profile */}
          <button
            onClick={() => setIdentityModalOpen(true)}
            className="card-md text-left"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Coffee className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">咖啡探索家</h2>
                <div className="text-[10px] text-white/50 flex items-center gap-1">
                  <span>☕️ {identityBadge.label}</span>
                  <ChevronRight className="w-2.5 h-2.5" />
                </div>
              </div>
            </div>
          </button>

          {/* Right Card - My Squad */}
          <button
            onClick={() => navigate("/my-squad")}
            className="card-md text-left"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Users className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">拉帮结派</h3>
                <p className="text-[10px] text-white/50">邀请返佣</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-white/40">累计收益</p>
                <span className="text-lg font-black text-primary">¥1,240</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="text-sm font-bold text-white">348</p>
                  <p className="text-[10px] text-white/40">队员</p>
                </div>
                <div className="flex items-center gap-0.5 text-green-400">
                  <TrendingUp className="w-3 h-3" />
                  <span className="text-xs font-bold">+12</span>
                </div>
              </div>
            </div>
          </button>
        </div>
      </section>

      {/* Asset Bar - Two Column */}
      <section className="px-4 mt-3 max-w-md mx-auto">
        <div className="grid grid-cols-2 gap-3">
          {assetItems.map((item) => {
            const IconComponent = item.Icon;
            return (
              <button
                key={item.label}
                onClick={item.onClick}
                className="card-sm flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center">
                    <IconComponent className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-white">{item.label}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-bold text-primary">{item.value}</span>
                  <ChevronRight className="w-4 h-4 text-white/30" />
                </div>
              </button>
            );
          })}
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
