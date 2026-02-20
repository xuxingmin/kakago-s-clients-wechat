import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Ticket, HelpCircle, Store, ChevronRight,
  Users, LucideIcon, Coins, MapPin, FileText, LogOut, User, Phone
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { BrandBanner } from "@/components/BrandBanner";
import { Header } from "@/components/Header";
import { WeChatAuthModal } from "@/components/WeChatAuthModal";
import { PhoneAuthModal } from "@/components/PhoneAuthModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user, profile, signOut, loading } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const isLoggedIn = !!user;
  const userPhone = profile?.phone;
  const userName = userPhone ? `${userPhone.slice(0, 3)}****${userPhone.slice(-4)}` : profile?.display_name || "用户";

  const assetItems: AssetItem[] = [
    { Icon: Ticket, value: isLoggedIn ? "3" : "--", labelZh: "优惠券", labelEn: "Coupons", onClick: () => navigate("/wallet") },
    { Icon: Coins, value: isLoggedIn ? "124K" : "--", labelZh: "KAKA豆", labelEn: "KAKA Beans", onClick: () => navigate("/kaka-beans") },
  ];

  const menuItems: MenuItem[] = [
    { Icon: MapPin, labelZh: "地址管理", labelEn: "Address Management", descZh: "管理收货地址", descEn: "Manage delivery addresses", onClick: () => navigate("/address") },
    { Icon: FileText, labelZh: "发票管理", labelEn: "Invoice Management", descZh: "管理发票抬头", descEn: "Manage invoice headers", onClick: () => navigate("/invoice") },
    { Icon: HelpCircle, labelZh: "帮助与支持", labelEn: "Help & Support", descZh: "常见问题与联系客服", descEn: "FAQ and customer service", onClick: () => navigate("/help") },
    { Icon: Store, labelZh: "成为合作商家", labelEn: "Become a Partner", descZh: "加入我们，一起成长", descEn: "Join us and grow together", onClick: () => navigate("/merchant-auth") },
  ];

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-shrink-0">
        <Header />
        <BrandBanner />
        <div className="fog-divider mx-4" />
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* Top Row */}
        <section className="px-4 pt-3 max-w-md mx-auto">
          <div className="grid grid-cols-2 gap-2">
            {/* User Profile Card */}
            <button
              onClick={() => !isLoggedIn && setAuthModalOpen(true)}
              className="card-md text-left flex flex-col"
            >
              <div className="flex items-center gap-2 mb-1.5">
                {isLoggedIn ? (
                  <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Phone className="w-3 h-3 text-primary" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-lg bg-muted flex items-center justify-center">
                    <User className="w-3 h-3 text-muted-foreground" />
                  </div>
                )}
                <span className="text-[9px] text-muted-foreground">{t("安全中心", "Security")}</span>
              </div>
              <h3 className="text-base font-black text-foreground leading-tight mb-1">
                {isLoggedIn ? t("我的账号", "My Account") : t("点击登录", "Tap to Login")}
              </h3>
              <p className="text-xs text-muted-foreground mb-auto">
                {isLoggedIn ? userName : t("手机号快捷登录", "Quick phone login")}
              </p>
              <p className="text-[9px] text-muted-foreground mt-2">
                {isLoggedIn
                  ? (userPhone ? t("已绑定手机", "Phone linked") : t("已登录", "Logged in"))
                  : t("登录享更多权益", "Login for benefits")}
              </p>
            </button>

            {/* Coffee Mates Card */}
            <button onClick={() => navigate("/my-squad")} className="card-md text-left flex flex-col">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Users className="w-3 h-3 text-primary" />
                </div>
                <span className="text-[9px] text-muted-foreground">{t("一起喝更快乐", "Better together")}</span>
              </div>
              <h3 className="text-base font-black text-foreground leading-tight mb-1">
                {t("咖啡搭子", "Coffee Mates")}
              </h3>
              <p className="text-xs text-muted-foreground mb-auto">
                {isLoggedIn ? t("共 348 位成员", "348 members total") : "--"}
              </p>
              {isLoggedIn ? (
                <div className="flex items-center gap-1 text-[9px] mt-2" style={{ color: 'hsl(142 71% 45%)' }}>
                  <span>⚡️</span>
                  <span className="font-medium">{t("今日产出", "Today")} +1,200 KAKA{t("豆", " Beans")}</span>
                </div>
              ) : (
                <p className="text-[9px] text-muted-foreground mt-2">&nbsp;</p>
              )}
            </button>
          </div>
        </section>

        {/* Asset Bar */}
        <section className="px-4 mt-2 max-w-md mx-auto">
          <div className="grid grid-cols-2 gap-2">
            {assetItems.map((item) => {
              const IconComponent = item.Icon;
              return (
                <button key={item.labelZh} onClick={item.onClick} className="card-sm flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
                      <IconComponent className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-xs font-medium text-foreground">{t(item.labelZh, item.labelEn)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-base font-bold text-primary">{item.value}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
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
                  className={`w-full flex items-center gap-3 px-3 py-3 hover:bg-accent/50 transition-colors ${
                    index !== menuItems.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center">
                    <IconComponent className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-foreground text-xs">{t(item.labelZh, item.labelEn)}</p>
                    <p className="text-[10px] text-muted-foreground">{t(item.descZh, item.descEn)}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              );
            })}

            {/* Logout button - only when logged in */}
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-3 hover:bg-accent/50 transition-colors border-t border-border"
              >
                <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center">
                  <LogOut className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-foreground text-xs">{t("退出登录", "Log Out")}</p>
                  <p className="text-[10px] text-muted-foreground">{t("退出当前账号", "Sign out of current account")}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </section>

        <p className="text-center text-[10px] text-muted-foreground mt-4 pb-4">
          KAKAGO v1.0.0
        </p>
      </div>

      <div className="flex-shrink-0">
        <BottomNav />
      </div>

      <PhoneAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
};

export default Profile;
