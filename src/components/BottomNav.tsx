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
        className="fixed bottom-0 left-0 right-0 safe-bottom z-50 backdrop-blur-xl"
        style={{
          backgroundColor: "hsla(33, 65%, 96%, 0.78)",
          borderTop: "1px solid hsla(24,13%,9%,0.08)",
          boxShadow: "0 -8px 28px -18px hsla(24,13%,9%,0.18)",
          backgroundImage:
            "repeating-linear-gradient(90deg, hsla(24,13%,9%,0.12) 0 3px, transparent 3px 7px)",
          backgroundSize: "100% 1px",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "top",
        }}
        {...props}
      >
        <div className="relative flex justify-around items-center h-[54px] max-w-md mx-auto gap-4 px-4">
          <span
            className="absolute top-[1px] h-[2px] bg-primary rounded-full transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
            style={{
              width: '24px',
              left: `calc(${(activeIndex * 100) / navItems.length}% + ${100 / navItems.length / 2}% - 12px)`,
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
                return `relative flex flex-col items-center justify-center gap-0.5 px-5 py-1.5 min-h-[48px] rounded-xl transition-all duration-300 active:scale-95 ${
                  isActive
                    ? "text-primary"
                    : "text-espresso/40 hover:text-espresso/70"
                }`;
              }}
            >
              {() => {
                const isActive = item.path === "/profile" ? isProfileSection
                  : item.path === "/" ? location.pathname === "/"
                  : location.pathname.startsWith(item.path);
                return (
                <>
                  <item.icon
                    size={20}
                    strokeWidth={isActive ? 2 : 1.5}
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
