import { Coffee, ChevronRight, TrendingUp, Coins } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import {
  getIdentityBadge,
  getAllBadges,
  type UserIdentities,
} from "@/components/IdentityVerificationModal";

interface UserInfoCardProps {
  userName: string;
  identities: UserIdentities;
  onAvatarClick: () => void;
}

export const UserInfoCard = ({ userName, identities, onAvatarClick }: UserInfoCardProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const allBadges = getAllBadges(identities);

  return (
    <section className="px-4 pt-3">
      <div className="card-premium p-4">
        {/* Top row: avatar + info */}
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <button
            onClick={onAvatarClick}
            className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center shrink-0 active:scale-95 transition-transform"
          >
            <Coffee className="w-7 h-7 text-primary" />
          </button>

          {/* Name + badges */}
          <div className="flex-1 min-w-0 pt-1">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-foreground truncate">{userName}</h2>
              <button
                onClick={onAvatarClick}
                className="flex items-center gap-0.5 text-white/40 hover:text-white/60 transition-colors"
              >
                <span className="text-[10px]">{t("编辑", "Edit")}</span>
                <ChevronRight className="w-2.5 h-2.5" />
              </button>
            </div>

            {/* Identity badges */}
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {allBadges.length > 0 ? (
                allBadges.map((badge, index) => {
                  const IconComponent = badge.icon;
                  return (
                    <span
                      key={index}
                      className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                        index === 0
                          ? "bg-primary/15 border-primary/25 text-primary"
                          : "bg-emerald/10 border-emerald/20 text-emerald"
                      }`}
                    >
                      <IconComponent className="w-2.5 h-2.5" />
                      {badge.label}
                    </span>
                  );
                })
              ) : (
                <span className="text-[10px] text-muted-foreground px-2 py-0.5 rounded-full bg-secondary/50 border border-white/[0.06]">
                  {t("未认证", "Not verified")}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Earnings + KAKA beans row */}
        <div className="flex items-center mt-4 pt-3 border-t border-white/[0.06]">
          {/* Earnings */}
          <button
            onClick={() => navigate("/my-squad")}
            className="flex-1 flex flex-col items-center gap-0.5 active:scale-95 transition-transform"
          >
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-primary tracking-tight">1,240</span>
              <TrendingUp className="w-3.5 h-3.5 text-emerald" />
            </div>
            <span className="text-[10px] text-muted-foreground">{t("累计收益 (¥)", "Earnings (¥)")}</span>
          </button>

          {/* Divider */}
          <div className="w-px h-10 bg-white/[0.08]" />

          {/* KAKA beans */}
          <button
            onClick={() => navigate("/kaka-beans")}
            className="flex-1 flex flex-col items-center gap-0.5 active:scale-95 transition-transform"
          >
            <div className="flex items-baseline gap-1">
              <Coins className="w-4 h-4 text-primary" />
              <span className="text-2xl font-black text-primary tracking-tight">124K</span>
            </div>
            <span className="text-[10px] text-muted-foreground">{t("KAKA豆", "KAKA Beans")}</span>
          </button>
        </div>
      </div>
    </section>
  );
};
