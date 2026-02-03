import * as React from "react";
import { NavLink } from "react-router-dom";
import { Radar, Cpu, ScanFace } from "lucide-react";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  isCenter?: boolean;
}

const navItems: NavItem[] = [
  { icon: Radar, label: "HOME", path: "/" },
  { icon: Cpu, label: "LIST", path: "/orders", isCenter: true },
  { icon: ScanFace, label: "ID", path: "/profile" },
];

export const BottomNav = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  (props, ref) => {
    return (
      <nav
        ref={ref}
        className="fixed bottom-0 left-0 right-0 bg-black safe-bottom z-50"
        {...props}
      >
        <div className="flex justify-center items-center gap-2 h-20 max-w-md mx-auto px-3 pb-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className="flex-1"
            >
              {({ isActive }) => (
                <div
                  className={`
                    relative flex flex-col items-center justify-center gap-1.5 
                    px-4 py-3 transition-all duration-200
                    ${item.isCenter ? 'min-h-[68px]' : 'min-h-[60px]'}
                    ${isActive 
                      ? 'bg-[#200020]' 
                      : 'bg-[#0a0a0a] hover:bg-[#151515]'
                    }
                    active:scale-95 active:brightness-75
                  `}
                  style={{
                    clipPath: item.isCenter 
                      ? 'polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)'
                      : 'polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)',
                  }}
                >
                  {/* HUD Corner Brackets - Active State */}
                  {isActive && (
                    <>
                      {/* Top-left bracket */}
                      <span className="absolute top-1.5 left-2 text-[8px] text-primary/60 font-mono">[</span>
                      {/* Top-right bracket */}
                      <span className="absolute top-1.5 right-2 text-[8px] text-primary/60 font-mono">]</span>
                      {/* Bottom-left + */}
                      <span className="absolute bottom-1.5 left-2 text-[6px] text-primary/40 font-mono">+</span>
                      {/* Bottom-right + */}
                      <span className="absolute bottom-1.5 right-2 text-[6px] text-primary/40 font-mono">+</span>
                    </>
                  )}

                  {/* Laser Line - Top */}
                  {isActive && (
                    <span 
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent"
                      style={{
                        boxShadow: '0 0 8px 2px rgba(160, 32, 240, 0.6), 0 0 20px 4px rgba(160, 32, 240, 0.3)'
                      }}
                    />
                  )}

                  {/* Icon */}
                  <item.icon
                    size={item.isCenter ? 24 : 20}
                    strokeWidth={1.5}
                    className={`
                      transition-all duration-200
                      ${isActive 
                        ? 'text-[#A020F0]' 
                        : 'text-[#3a3a3a]'
                      }
                    `}
                    style={isActive ? {
                      filter: 'drop-shadow(0 0 6px rgba(160, 32, 240, 0.8)) drop-shadow(0 0 12px rgba(160, 32, 240, 0.4))'
                    } : undefined}
                  />

                  {/* Label */}
                  <span 
                    className={`
                      font-mono text-[9px] uppercase tracking-[0.2em] font-medium
                      transition-all duration-200
                      ${isActive 
                        ? 'text-[#A020F0]' 
                        : 'text-[#3a3a3a]'
                      }
                    `}
                    style={isActive ? {
                      textShadow: '0 0 8px rgba(160, 32, 240, 0.6)'
                    } : undefined}
                  >
                    {item.label}
                  </span>

                  {/* Laser Line - Bottom (for center button) */}
                  {isActive && item.isCenter && (
                    <span 
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent"
                      style={{
                        boxShadow: '0 0 8px 2px rgba(160, 32, 240, 0.6), 0 0 20px 4px rgba(160, 32, 240, 0.3)'
                      }}
                    />
                  )}

                  {/* Center button extra glow border */}
                  {item.isCenter && isActive && (
                    <span 
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        clipPath: 'polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)',
                        boxShadow: 'inset 0 0 20px rgba(160, 32, 240, 0.2)'
                      }}
                    />
                  )}
                </div>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    );
  }
);

BottomNav.displayName = "BottomNav";
