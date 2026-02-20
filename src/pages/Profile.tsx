import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Ticket, Coffee, HelpCircle, Store, ChevronRight,
  Users, TrendingUp, LucideIcon, Coins, MapPin, FileText, LogOut, User
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { BrandBanner } from "@/components/BrandBanner";
import { Header } from "@/components/Header";
import { WeChatAuthModal } from "@/components/WeChatAuthModal";
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
  const userName = profile?.display_name || "微信用户";

  const assetItems: AssetItem[] = [
    { Icon: Ticket, value: isLoggedIn ? "3" : "--", labelZh: "优惠券", labelEn: "Coupons", onClick: () => navigate("/wallet") },
    { Icon: Coins, value: isLoggedIn ? "124K" : "--", labelZh: "KAKA豆", labelEn: "KAKA Beans", onClick: () => navigate("/kaka-beans") },
  ];

  const menuItems: MenuItem[] = [
    { Icon: MapPin, labelZh: "地址管理", labelEn: "Address Management", descZh: "管理收货地址", descEn: "Manage delivery addresses", onClick: () => navigate("/address") },
    { Icon: FileText, labelZh: "发票管理", labelEn: "Invoice Management", descZh: "管理发票抬头", descEn: "Manage invoice headers", onClick: () => navigate("/invoice") },
    { Icon: HelpCircle, labelZh: "帮助与支持", labelEn: "Help & Support", descZh: "常见问题与联系客服", descEn: "FAQ and customer service", onClick: () => {} },
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
              className="card-md text-left"
            >
              <div className="flex items-center gap-2 mb-2">
                {isLoggedIn ? (
                  profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="avatar" className="w-9 h-9 rounded-full object-cover" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
                      <Coffee className="w-4 h-4 text-primary" />
                    </div>
                  )
                ) : (
                  <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                    <User className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h2 className="text-xs font-semibold text-foreground truncate">
                    {isLoggedIn ? userName : t("点击登录", "Tap to Login")}
                  </h2>
                  {!isLoggedIn && (
                    <div className="text-[9px] text-muted-foreground flex items-center gap-0.5">
                      <span>{t("授权微信登录", "WeChat Authorization")}</span>
                      <ChevronRight className="w-2 h-2" />
                    </div>
                  )}
                </div>
              </div>
              
              {isLoggedIn ? (
                <p className="text-[9px] text-muted-foreground">
                  {profile?.phone ? profile.phone : t("微信已授权", "WeChat Authorized")}
                </p>
              ) : (
                <p className="text-[9px] text-muted-foreground">
                  {t("登录后享受更多权益", "Login for more benefits")}
                </p>
              )}
            </button>

            {/* My Squad Card */}
            <button onClick={() => navigate("/my-squad")} className="card-md text-left">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Users className="w-3.5 h-3.5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-foreground">{t("拉帮结派", "My Squad")}</h3>
                  <p className="text-[9px] text-muted-foreground">{t("邀请返佣", "Invite & Earn")}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] text-muted-foreground">{t("累计收益", "Earnings")}</p>
                  <span className="text-base font-black text-primary">{isLoggedIn ? "¥1,240" : "--"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="text-right">
                    <p className="text-xs font-bold text-foreground">{isLoggedIn ? "348" : "--"}</p>
                    <p className="text-[9px] text-muted-foreground">{t("队员", "Members")}</p>
                  </div>
                  {isLoggedIn && (
                    <div className="flex items-center gap-0.5 text-green-400">
                      <TrendingUp className="w-2.5 h-2.5" />
                      <span className="text-[10px] font-bold">+12</span>
                    </div>
                  )}
                </div>
              </div>
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
                className="w-full flex items-center gap-3 px-3 py-3 hover:bg-destructive/10 transition-colors border-t border-border"
              >
                <div className="w-8 h-8 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <LogOut className="w-4 h-4 text-destructive" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-destructive text-xs">{t("退出登录", "Log Out")}</p>
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

      <WeChatAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
};

export default Profile;
