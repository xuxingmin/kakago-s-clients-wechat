import * as React from "react";
import { Home, Compass, Coffee, MessageCircle, User } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export const BottomNav = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  (props, ref) => {
    const { t } = useLanguage();
    const location = useLocation();
    
    const navItems = [
      { icon: Home, labelZh: "首页", labelEn: "Home", path: "/" },
      { icon: Compass, labelZh: "发现", labelEn: "Discover", path: "/discover" },
      { icon: Coffee, labelZh: "咖卡圈", labelEn: "Circle", path: "/circle" },
      { icon: MessageCircle, labelZh: "消息", labelEn: "Messages", path: "/messages" },
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
        <div className="relative flex justify-around items-center h-14 max-w-md mx-auto px-2">
          {/* Sliding indicator */}
          <span
            className="absolute top-0 h-[2px] bg-primary rounded-full transition-all duration-400 ease-spring shadow-[0_0_12px_hsla(271,81%,56%,0.6)]"
            style={{
              width: '32px',
              left: `calc(${(activeIndex * 100) / navItems.length}% + ${100 / navItems.length / 2}% - 16px)`,
            }}
          />
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `relative flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 min-h-[48px] min-w-[48px] rounded-xl transition-all duration-300 active:scale-95 ${
                  isActive
                    ? "text-primary"
                    : "text-white/50 hover:text-white/70"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute inset-0 rounded-xl bg-primary/10 shadow-[0_0_16px_2px_hsla(271,81%,56%,0.15)] pointer-events-none animate-fade-in" />
                  )}
                  <item.icon
                    size={20}
                    strokeWidth={isActive ? 2.2 : 1.5}
                    className={`relative z-10 transition-all duration-300 ${
                      isActive ? "drop-shadow-[0_0_8px_rgba(127,0,255,0.5)]" : ""
                    }`}
                  />
                  <span className={`relative z-10 text-[9px] transition-all duration-300 ${
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
