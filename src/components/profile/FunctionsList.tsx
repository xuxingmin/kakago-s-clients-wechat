import {
  MapPin,
  ClipboardList,
  Heart,
  Crown,
  Headphones,
  Settings,
  ChevronRight,
  LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

interface FuncItem {
  Icon: LucideIcon;
  labelZh: string;
  labelEn: string;
  path: string;
}

const items: FuncItem[] = [
  { Icon: MapPin, labelZh: "地址管理", labelEn: "Addresses", path: "/address" },
  { Icon: ClipboardList, labelZh: "我的订单", labelEn: "My Orders", path: "/orders" },
  { Icon: Heart, labelZh: "收藏足迹", labelEn: "Favorites", path: "" },
  { Icon: Crown, labelZh: "会员中心", labelEn: "Membership", path: "" },
  { Icon: Headphones, labelZh: "客服中心", labelEn: "Support", path: "" },
  { Icon: Settings, labelZh: "设置", labelEn: "Settings", path: "" },
];

export const FunctionsList = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <section className="px-4 mt-3">
      <div className="card-premium !p-0 overflow-hidden">
        {items.map((item, index) => {
          const IconComponent = item.Icon;
          return (
            <button
              key={item.labelZh}
              onClick={() => item.path && navigate(item.path)}
              className={`w-full card-menu-item flex items-center gap-3 px-4 py-3 ${
                index !== items.length - 1 ? "border-b border-white/[0.06]" : ""
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <IconComponent className="w-4 h-4 text-primary" strokeWidth={1.5} />
              </div>
              <span className="flex-1 text-left text-sm font-medium text-foreground">
                {t(item.labelZh, item.labelEn)}
              </span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          );
        })}
      </div>
    </section>
  );
};
