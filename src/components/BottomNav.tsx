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

    const activeIndex = navItems.findIndex(
      (item) => item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path)
    );

    return (
      <nav
        ref={ref}
        className="fixed bottom-0 left-0 right-0 bg-black/40 backdrop-blur-2xl border-t border-white/[0.06] safe-bottom z-50"
        style={{ WebkitBackdropFilter: 'blur(40px) saturate(180%)' }}
        {...props}
      >
        <div className="relative flex justify-around items-center h-16 max-w-md mx-auto gap-4 px-4">
          {/* Sliding indicator */}
          <span
            className="absolute top-0 h-[2px] bg-primary rounded-full transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-[0_0_12px_hsla(271,81%,56%,0.6)]"
            style={{
              width: '40px',
              left: `calc(${(activeIndex * 100) / navItems.length}% + ${100 / navItems.length / 2}% - 20px)`,
            }}
          />
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `relative flex flex-col items-center justify-center gap-1 px-6 py-2 min-h-[52px] rounded-2xl transition-all duration-300 active:scale-95 ${
                  isActive
                    ? "text-primary"
                    : "text-white/55 hover:text-white/70"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute inset-0 rounded-2xl bg-primary/10 shadow-[0_0_20px_4px_hsla(271,81%,56%,0.2)] pointer-events-none animate-fade-in" />
                  )}
                  <item.icon
                    size={22}
                    strokeWidth={isActive ? 2.2 : 1.5}
                    className={`relative z-10 transition-all duration-300 ${
                      isActive ? "drop-shadow-[0_0_10px_rgba(127,0,255,0.6)]" : ""
                    }`}
                  />
                  <span className={`relative z-10 text-[10px] transition-all duration-300 ${
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
