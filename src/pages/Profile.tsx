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
  Coins
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { 
  IdentityVerificationModal, 
  getIdentityBadge,
  getAllBadges,
  type UserIdentities 
} from "@/components/IdentityVerificationModal";
import { useLanguage } from "@/contexts/LanguageContext";

interface AssetItem {
  Icon: LucideIcon;
  value: string;
  labelZh: string;
  labelEn: string;
  onClick: () => void;
}

interface MenuItem {
  Icon: LucideIcon;
  labelZh: string;
  labelEn: string;
  descZh: string;
  descEn: string;
  onClick: () => void;
}

const Profile = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [identityModalOpen, setIdentityModalOpen] = useState(false);
  const [currentIdentities, setCurrentIdentities] = useState<UserIdentities>({
    industry: null,
    user: "expert",
    squad: "leader",
  });

  // Mock user data
  const userName = "微信用户_8K3nF";

  const identityBadge = getIdentityBadge(currentIdentities);
  const allBadges = getAllBadges(currentIdentities);

  const assetItems: AssetItem[] = [
    { 
      Icon: Ticket, 
      value: "3", 
      labelZh: "优惠券",
      labelEn: "Coupons",
      onClick: () => navigate("/wallet"),
    },
    { 
      Icon: Coins, 
      value: "124K", 
      labelZh: "KAKA豆",
      labelEn: "KAKA Beans",
      onClick: () => navigate("/kaka-beans"),
    },
  ];

  const menuItems: MenuItem[] = [
    { 
      Icon: ClipboardList, 
      labelZh: "订单历史", 
      labelEn: "Order History",
      descZh: "查看订单与评价状态",
      descEn: "View orders and ratings",
      onClick: () => navigate("/orders"),
    },
    { 
      Icon: HelpCircle, 
      labelZh: "帮助与支持", 
      labelEn: "Help & Support",
      descZh: "常见问题与联系客服",
      descEn: "FAQ and customer service",
      onClick: () => {},
    },
    {
      Icon: Store, 
      labelZh: "成为合作商家", 
      labelEn: "Become a Partner",
      descZh: "加入我们，一起成长",
      descEn: "Join us and grow together",
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
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Coffee className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-semibold text-white truncate">{userName}</h2>
                <div className="text-[10px] text-white/50 flex items-center gap-1">
                  <span>{t("点击认证", "Tap to verify")}</span>
                  <ChevronRight className="w-2.5 h-2.5" />
                </div>
              </div>
            </div>
            
            {/* Identity Badges */}
            <div className="flex flex-wrap gap-1">
              {allBadges.length > 0 ? (
                allBadges.map((badge, index) => {
                  const IconComponent = badge.icon;
                  return (
                    <span 
                      key={index}
                      className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-secondary/50 ${badge.color}`}
                    >
                      <IconComponent className="w-2.5 h-2.5" />
                      {badge.label}
                    </span>
                  );
                })
              ) : (
                <span className="text-[10px] text-white/40 px-2 py-0.5 rounded-full bg-secondary/50">
                  {t("未认证", "Not verified")}
                </span>
              )}
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
                <h3 className="text-sm font-semibold text-white">{t("拉帮结派", "My Squad")}</h3>
                <p className="text-[10px] text-white/50">{t("邀请返佣", "Invite & Earn")}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-white/40">{t("累计收益", "Earnings")}</p>
                <span className="text-lg font-black text-primary">¥1,240</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="text-sm font-bold text-white">348</p>
                  <p className="text-[10px] text-white/40">{t("队员", "Members")}</p>
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
                key={item.labelZh}
                onClick={item.onClick}
                className="card-sm flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center">
                    <IconComponent className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-white">{t(item.labelZh, item.labelEn)}</span>
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
                key={item.labelZh}
                onClick={item.onClick}
                className={`w-full flex items-center gap-4 px-4 card-menu-item hover:bg-white/5 transition-colors ${
                  index !== menuItems.length - 1 ? "border-b border-white/10" : ""
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
                  <IconComponent className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-white text-sm">{t(item.labelZh, item.labelEn)}</p>
                  <p className="text-xs text-white/50">{t(item.descZh, item.descEn)}</p>
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
        currentIdentities={currentIdentities}
        onUpdateIdentities={setCurrentIdentities}
      />
    </div>
  );
};

export default Profile;
