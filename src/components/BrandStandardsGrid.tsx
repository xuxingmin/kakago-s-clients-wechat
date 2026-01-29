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
    <section className="px-4 py-4">
      <div className="grid grid-cols-4 gap-2 stagger-fade-in">
        {/* Standard Cards - Refined Glass Morphism */}
        {standards.map((item, index) => {
          const IconComponent = item.Icon;
          return (
            <div
              key={index}
              className="group relative flex items-center justify-center h-12 rounded-xl bg-white/[0.04] backdrop-blur-md border border-white/[0.06] cursor-default transition-all duration-400 hover:bg-white/[0.08] hover:border-primary/20 active:scale-95"
              style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
            >
              {/* Subtle glow on hover */}
              <div className="absolute inset-0 rounded-xl bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-400 blur-xl pointer-events-none" />
              
              {/* Icon - fades on hover */}
              <IconComponent 
                className="w-5 h-5 text-primary/70 relative z-10 transition-all duration-300 ease-out group-hover:opacity-0 group-hover:scale-75" 
              />
              
              {/* Text Label - appears on hover */}
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium text-white/80 opacity-0 scale-110 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:scale-100">
                {t(item.labelZh, item.labelEn)}
              </span>
            </div>
          );
        })}

        {/* Action Card - Cart or GO */}
        {hasCartItems ? (
          <button
            onClick={onCartClick}
            className="relative flex items-center justify-center h-12 rounded-xl bg-gradient-to-br from-primary/90 to-purple-dark/90 border border-primary/30 pulse-glow cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 gap-1.5 overflow-hidden"
            style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
          >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <ShoppingCart className="w-4 h-4 text-white relative z-10" />
            <span className="text-sm font-semibold text-white relative z-10">
              {totalItems}
            </span>
          </button>
        ) : (
          <button
            onClick={() => navigate("/my-squad")}
            className="relative flex items-center justify-center h-12 rounded-xl bg-gradient-to-br from-primary/90 to-purple-dark/90 border border-primary/30 pulse-glow cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden"
            style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
          >
            <span className="text-sm font-bold text-white tracking-wider relative z-10">
              GO
            </span>
          </button>
        )}
      </div>
    </section>
  );
};
