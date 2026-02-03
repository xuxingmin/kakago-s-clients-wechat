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
  Coins,
  MapPin,
  FileText
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { BrandBanner } from "@/components/BrandBanner";
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
      Icon: MapPin, 
      labelZh: "地址管理", 
      labelEn: "Address Management",
      descZh: "管理收货地址",
      descEn: "Manage delivery addresses",
      onClick: () => navigate("/address"),
    },
    { 
      Icon: FileText, 
      labelZh: "发票管理", 
      labelEn: "Invoice Management",
      descZh: "管理发票抬头",
      descEn: "Manage invoice headers",
      onClick: () => navigate("/invoice"),
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
    <div className="h-screen flex flex-col overflow-hidden">
      {/* 固定顶部区域 */}
      <div className="flex-shrink-0">
        <BrandBanner />
        <div className="fog-divider mx-4" />
      </div>

      {/* 可滚动中间区域 */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* Top Row - Two Column Layout */}
        <section className="px-4 pt-3 max-w-md mx-auto">
          <div className="grid grid-cols-2 gap-2">
            {/* Left Card - User Profile */}
            <button
              onClick={() => setIdentityModalOpen(true)}
              className="card-md text-left"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
                  <Coffee className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xs font-semibold text-white truncate">{userName}</h2>
                  <div className="text-[9px] text-white/50 flex items-center gap-0.5">
                    <span>{t("点击认证", "Tap to verify")}</span>
                    <ChevronRight className="w-2 h-2" />
                  </div>
                </div>
              </div>
              
              {/* Identity Badges */}
              <div className="flex flex-wrap gap-1">
                {allBadges.length > 0 ? (
                  allBadges.slice(0, 2).map((badge, index) => {
                    const IconComponent = badge.icon;
                    return (
                      <span 
                        key={index}
                        className={`inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-full bg-secondary/50 ${badge.color}`}
                      >
                        <IconComponent className="w-2 h-2" />
                        {badge.label}
                      </span>
                    );
                  })
                ) : (
                  <span className="text-[9px] text-white/40 px-1.5 py-0.5 rounded-full bg-secondary/50">
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
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Users className="w-3.5 h-3.5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-white">{t("拉帮结派", "My Squad")}</h3>
                  <p className="text-[9px] text-white/50">{t("邀请返佣", "Invite & Earn")}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] text-white/40">{t("累计收益", "Earnings")}</p>
                  <span className="text-base font-black text-primary">¥1,240</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="text-right">
                    <p className="text-xs font-bold text-white">348</p>
                    <p className="text-[9px] text-white/40">{t("队员", "Members")}</p>
                  </div>
                  <div className="flex items-center gap-0.5 text-green-400">
                    <TrendingUp className="w-2.5 h-2.5" />
                    <span className="text-[10px] font-bold">+12</span>
                  </div>
                </div>
              </div>
            </button>
          </div>
        </section>

        {/* Asset Bar - Two Column */}
        <section className="px-4 mt-2 max-w-md mx-auto">
          <div className="grid grid-cols-2 gap-2">
            {assetItems.map((item) => {
              const IconComponent = item.Icon;
              return (
                <button
                  key={item.labelZh}
                  onClick={item.onClick}
                  className="card-sm flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
                      <IconComponent className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-xs font-medium text-white">{t(item.labelZh, item.labelEn)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-base font-bold text-primary">{item.value}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-white/30" />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Menu List */}
        <section className="px-4 mt-3 max-w-md mx-auto">
          <div className="card-lg !p-0 overflow-hidden">
            {menuItems.map((item, index) => {
              const IconComponent = item.Icon;
              return (
                <button
                  key={item.labelZh}
                  onClick={item.onClick}
                  className={`w-full flex items-center gap-3 px-3 py-3 hover:bg-white/5 transition-colors ${
                    index !== menuItems.length - 1 ? "border-b border-white/10" : ""
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center">
                    <IconComponent className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-white text-xs">{t(item.labelZh, item.labelEn)}</p>
                    <p className="text-[10px] text-white/50">{t(item.descZh, item.descEn)}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/40" />
                </button>
              );
            })}
          </div>
        </section>

        {/* Version Footer */}
        <p className="text-center text-[10px] text-white/30 mt-4 pb-4">
          KAKAGO v1.0.0
        </p>
      </div>

      {/* 固定底部区域 */}
      <div className="flex-shrink-0">
        <BottomNav />
      </div>

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
