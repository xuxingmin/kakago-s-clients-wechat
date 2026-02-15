import * as React from "react";
import { Hexagon, Ticket, IdCard } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export const BottomNav = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  (props, ref) => {
    const { t } = useLanguage();
    
    const navItems = [
      { icon: Hexagon, labelZh: "基地", labelEn: "Base", path: "/" },
      { icon: Ticket, labelZh: "进度", labelEn: "Status", path: "/orders" },
      { icon: IdCard, labelZh: "档案", labelEn: "ID", path: "/profile" },
    ];

    return (
      <nav
        ref={ref}
        className="fixed bottom-0 left-0 right-0 bg-[#000000] border-t border-[#222222] safe-bottom z-50"
        {...props}
      >
        <div className="flex justify-around items-center h-16 max-w-md mx-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1.5 px-8 py-2 min-h-[52px] transition-all duration-200 active:scale-95 ${
                  isActive
                    ? "text-white"
                    : "text-[#555555] hover:text-[#777777]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Glowing dot indicator */}
                  <div
                    className={`w-1 h-1 rounded-full transition-all duration-300 ${
                      isActive
                        ? "bg-primary shadow-[0_0_6px_2px_hsl(var(--primary)/0.6)]"
                        : "bg-transparent"
                    }`}
                  />
                  <item.icon
                    size={20}
                    strokeWidth={isActive ? 0 : 2}
                    fill={isActive ? "currentColor" : "none"}
                    className="transition-all duration-200"
                  />
                  <span
                    className={`text-[10px] tracking-[1px] uppercase transition-all duration-200 ${
                      isActive
                        ? "font-semibold text-primary"
                        : "font-normal"
                    }`}
                  >
                    {t(item.labelZh, item.labelEn)}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    );
  }
);

BottomNav.displayName = "BottomNav";
