import * as React from "react";
import { Home, ClipboardList, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export const BottomNav = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  (props, ref) => {
    const { t } = useLanguage();
    
    const navItems = [
      { icon: Home, labelZh: "首页", labelEn: "Home", path: "/" },
      { icon: ClipboardList, labelZh: "订单", labelEn: "Orders", path: "/orders" },
      { icon: User, labelZh: "我的", labelEn: "Profile", path: "/profile" },
    ];

    return (
      <nav
        ref={ref}
        className="fixed bottom-0 left-0 right-0 glass safe-bottom z-50"
        {...props}
      >
        <div className="flex justify-around items-center h-16 max-w-md mx-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `relative flex flex-col items-center justify-center gap-0.5 px-6 py-2 min-h-[48px] transition-all duration-300 -webkit-tap-highlight-color-transparent ${
                  isActive
                    ? "text-primary"
                    : "text-white/50 hover:text-white/80 active:scale-95"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active indicator - subtle glow */}
                  {isActive && (
                    <span className="absolute top-2 w-1 h-1 rounded-full bg-primary shadow-glow" />
                  )}
                  <item.icon
                    size={21}
                    strokeWidth={isActive ? 2.5 : 1.8}
                    className={`transition-all duration-300 ${isActive ? "drop-shadow-[0_0_6px_hsla(263,70%,50%,0.5)]" : ""}`}
                  />
                  <span className={`text-[10px] transition-all duration-300 ${isActive ? "font-semibold" : "font-normal"}`}>
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
