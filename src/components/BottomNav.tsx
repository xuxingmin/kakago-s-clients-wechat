import * as React from "react";
import { Home, ClipboardList, User } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export const BottomNav = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  (props, ref) => {
    const { t } = useLanguage();
    const location = useLocation();
    
    const navItems = [
      { icon: Home, labelZh: "首页", labelEn: "Home", path: "/" },
      { icon: ClipboardList, labelZh: "订单", labelEn: "Orders", path: "/orders" },
      { icon: User, labelZh: "我的", labelEn: "Profile", path: "/profile" },
    ];

    const profileSubPaths = ["/profile", "/address", "/invoice", "/wallet", "/kaka-beans", "/my-squad", "/merchant", "/help"];
    const isProfileSection = profileSubPaths.some(p => location.pathname.startsWith(p));

    const activeIndex = navItems.findIndex(
      (item) => {
        if (item.path === "/profile") return isProfileSection;
        if (item.path === "/") return location.pathname === "/";
        return location.pathname.startsWith(item.path);
      }
    );

    return (
      <nav
        ref={ref}
        className="fixed bottom-0 left-0 right-0 bg-paper/92 backdrop-blur-xl border-t border-foreground/12 safe-bottom z-50"
        style={{ WebkitBackdropFilter: 'blur(24px) saturate(140%)' }}
        {...props}
      >
        <div className="relative flex justify-around items-center h-16 max-w-md mx-auto gap-4 px-4">
          <span
            className="absolute top-0 h-[2.5px] bg-primary rounded-full transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
            style={{
              width: '36px',
              left: `calc(${(activeIndex * 100) / navItems.length}% + ${100 / navItems.length / 2}% - 18px)`,
            }}
          />
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={() => {
                const isActive = item.path === "/profile" ? isProfileSection
                  : item.path === "/" ? location.pathname === "/"
                  : location.pathname.startsWith(item.path);
                return `relative flex flex-col items-center justify-center gap-0.5 px-6 py-2 min-h-[52px] rounded-2xl transition-all duration-300 active:scale-95 ${
                  isActive
                    ? "text-primary"
                    : "text-espresso/45 hover:text-espresso/75"
                }`;
              }}
            >
              {() => {
                const isActive = item.path === "/profile" ? isProfileSection
                  : item.path === "/" ? location.pathname === "/"
                  : location.pathname.startsWith(item.path);
                return (
                <>
                  {isActive && (
                    <span className="absolute inset-0 rounded-2xl bg-primary/[0.06] pointer-events-none animate-fade-in" />
                  )}
                  <item.icon
                    size={21}
                    strokeWidth={isActive ? 2.25 : 1.6}
                    className="relative z-10 transition-all duration-300"
                  />
                  <span className={`relative z-10 text-[10px] tracking-wide transition-all duration-300 ${
                    isActive ? "font-bold" : "font-medium"
                  }`}>
                    {t(item.labelZh, item.labelEn)}
                  </span>
                </>
                );
              }}
            </NavLink>
          ))}
        </div>
      </nav>
    );
  }
);

BottomNav.displayName = "BottomNav";
