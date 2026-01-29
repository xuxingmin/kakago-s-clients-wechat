import { Bean, Droplet, ShieldCheck, Leaf, Settings, ClipboardCheck, Zap, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import type { LucideIcon } from "lucide-react";

interface StandardItem {
  Icon: LucideIcon;
  labelZh: string;
  labelEn: string;
}

const standards: StandardItem[] = [
  { Icon: Bean, labelZh: "精品豆", labelEn: "Beans" },
  { Icon: Droplet, labelZh: "蛋白4.0", labelEn: "4.0" },
  { Icon: ShieldCheck, labelZh: "食安", labelEn: "Safe" },
  { Icon: Leaf, labelZh: "有机", labelEn: "Organic" },
  { Icon: Settings, labelZh: "Pro设备", labelEn: "Pro" },
  { Icon: ClipboardCheck, labelZh: "100% SOP", labelEn: "SOP" },
  { Icon: Zap, labelZh: "极速", labelEn: "Fast" },
];

interface BrandStandardsGridProps {
  onCartClick?: () => void;
}

export const BrandStandardsGrid = ({ onCartClick }: BrandStandardsGridProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { totalItems } = useCart();

  const hasCartItems = totalItems > 0;

  return (
    <section className="px-4 py-3">
      <div className="grid grid-cols-4 gap-2">
        {/* Standard Cards - Icon Only with Morph */}
        {standards.map((item, index) => {
          const IconComponent = item.Icon;
          return (
            <div
              key={index}
              className="group relative flex items-center justify-center h-12 rounded-lg bg-white/5 backdrop-blur-md border border-white/10 cursor-default transition-all duration-300 hover:bg-white/10 hover:border-primary/30"
            >
              {/* Icon Glow Effect */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-8 h-8 rounded-full bg-primary/20 blur-lg opacity-60 group-hover:opacity-0 transition-opacity duration-300" />
              </div>
              
              {/* Icon - visible by default, fades on hover */}
              <IconComponent 
                className="w-6 h-6 text-primary relative z-10 transition-all duration-300 ease-in-out group-hover:opacity-0 group-hover:scale-75" 
              />
              
              {/* Text Label - hidden by default, appears on hover */}
              <span className="absolute inset-0 flex items-center justify-center text-[11px] font-mono font-semibold text-white opacity-0 scale-110 transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:scale-100">
                {t(item.labelZh, item.labelEn)}
              </span>
            </div>
          );
        })}

        {/* 8th Card - Cart (when items) or GO (when empty) */}
        {hasCartItems ? (
          <button
            onClick={onCartClick}
            className="relative flex items-center justify-center h-12 rounded-lg bg-gradient-to-br from-primary to-purple-dark border border-primary/30 pulse-glow cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95 gap-1.5"
          >
            <ShoppingCart className="w-4 h-4 text-white" />
            <span className="text-sm font-mono font-bold text-white">
              {totalItems}
            </span>
          </button>
        ) : (
          <button
            onClick={() => navigate("/my-squad")}
            className="relative flex items-center justify-center h-12 rounded-lg bg-gradient-to-br from-primary to-purple-dark border border-primary/30 pulse-glow cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95"
          >
            <span className="text-sm font-mono font-black text-white tracking-wider">
              GO
            </span>
          </button>
        )}
      </div>
    </section>
  );
};
