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
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-border safe-bottom z-50"
        {...props}
      >
        <div className="flex justify-around items-center h-14 max-w-md mx-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-0.5 px-8 py-1.5 min-h-[48px] transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    size={22}
                    strokeWidth={isActive ? 2 : 1.5}
                  />
                  <span className={`text-[10px] ${
                    isActive ? "font-semibold" : "font-normal"
                  }`}>
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
