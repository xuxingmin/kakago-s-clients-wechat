import { Ticket, CreditCard, Wallet, Star, LucideIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

interface AssetItem {
  Icon: LucideIcon;
  value: string;
  labelZh: string;
  labelEn: string;
  path: string;
}

const assets: AssetItem[] = [
  { Icon: Ticket, value: "3", labelZh: "优惠券", labelEn: "Coupons", path: "/wallet" },
  { Icon: CreditCard, value: "2", labelZh: "卡券包", labelEn: "Card Pack", path: "/wallet" },
  { Icon: Wallet, value: "¥88", labelZh: "余额", labelEn: "Balance", path: "/wallet" },
  { Icon: Star, value: "520", labelZh: "积分", labelEn: "Points", path: "/kaka-beans" },
];

export const AssetsGrid = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <section className="px-4 mt-3">
      <div className="grid grid-cols-4 gap-2">
        {assets.map((item) => {
          const IconComponent = item.Icon;
          return (
            <button
              key={item.labelZh}
              onClick={() => navigate(item.path)}
              className="card-premium flex flex-col items-center justify-center gap-1.5 py-3 active:scale-95 transition-transform"
            >
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <IconComponent className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm font-bold text-foreground">{item.value}</span>
              <span className="text-[10px] text-muted-foreground">{t(item.labelZh, item.labelEn)}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
