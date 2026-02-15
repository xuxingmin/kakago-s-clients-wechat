import { useState, useEffect } from "react";
import { MapPin, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAddress } from "@/contexts/AddressContext";
import { ServiceStatusBadge } from "@/components/ServiceStatusBadge";
import { useServiceAvailability } from "@/hooks/useServiceAvailability";
import { useLocation, useNavigate } from "react-router-dom";

export const Header = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const { locationLoading, checkAvailability } = useServiceAvailability();
  const { selectedAddress } = useAddress();
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  

  useEffect(() => {
    if (selectedAddress?.latitude && selectedAddress?.longitude) {
      checkAvailability(selectedAddress.latitude, selectedAddress.longitude);
    }
  }, [selectedAddress?.id]);

  // Short location: max 6 chars
  const shortLocation = selectedAddress
    ? t(
        selectedAddress.detail.replace(/[·．・]/g, '').slice(0, 6),
        (selectedAddress.detailEn || '').split(',')[0].slice(0, 12)
      )
    : null;

  return (
    <>
      <header className="sticky top-0 z-40">
        {/* WeChat Status Bar */}
        <div className="h-8 bg-background flex items-end justify-between px-6 pb-0.5">
          <span className="text-xs font-semibold text-white/90">
            {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
          <div className="flex items-center gap-1">
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none" className="text-white/70">
              <rect x="0" y="8" width="3" height="4" rx="0.5" fill="currentColor" />
              <rect x="4.5" y="5" width="3" height="7" rx="0.5" fill="currentColor" />
              <rect x="9" y="2" width="3" height="10" rx="0.5" fill="currentColor" />
              <rect x="13" y="0" width="3" height="12" rx="0.5" fill="currentColor" />
            </svg>
            <span className="text-[10px] text-white/70 font-medium ml-0.5">5G</span>
            <svg width="22" height="11" viewBox="0 0 22 11" fill="none" className="text-white/70 ml-1">
              <rect x="0.5" y="0.5" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1" />
              <rect x="19.5" y="3" width="2" height="5" rx="1" fill="currentColor" />
              <rect x="2" y="2" width="12" height="7" rx="1" fill="currentColor" />
            </svg>
          </div>
        </div>

        {/* Navigation Bar - Matching PS mockup */}
        <div className="h-9 bg-background flex items-center justify-between px-3">
          {/* Left: Location + Status */}
          <button
            onClick={() => navigate("/address")}
            className="flex items-center gap-1.5 text-white/90 truncate group min-w-0 flex-1"
          >
            <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="text-[13px] font-medium truncate">
              {locationLoading
                ? t("定位中…", "Locating…")
                : shortLocation || t("选择地址", "Select")}
            </span>
            <div className="w-px h-3 bg-white/20 shrink-0 mx-0.5" />
            <ServiceStatusBadge variant="capsule" />
            <ChevronRight className="w-3 h-3 text-white/30 shrink-0" />
          </button>

          {/* Right: EN + WeChat capsule (dots + close) */}
          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            {/* EN Button - Purple */}
            <button
              onClick={toggleLanguage}
              className="h-7 px-2.5 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center hover:bg-primary/25 transition-colors"
              aria-label={language === "zh" ? "Switch to English" : "切换中文"}
            >
              <span className="text-[11px] font-bold text-primary">
                {language === "zh" ? "ENGLISH" : "中文"}
              </span>
            </button>

            {/* WeChat capsule: dots + close */}
            <div className="flex items-center h-7 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm overflow-hidden">
              <button className="h-7 w-8 flex items-center justify-center text-white/60 hover:text-white/90 transition-colors">
                {/* Three dots icon */}
                <svg width="16" height="4" viewBox="0 0 16 4" fill="currentColor">
                  <circle cx="2" cy="2" r="1.5" />
                  <circle cx="8" cy="2" r="1.5" />
                  <circle cx="14" cy="2" r="1.5" />
                </svg>
              </button>
              <div className="w-px h-3.5 bg-white/20" />
              <button className="h-7 w-8 flex items-center justify-center text-white/60 hover:text-white/90 transition-colors">
                {/* Circle close icon */}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <circle cx="8" cy="8" r="6.5" />
                  <line x1="5.5" y1="5.5" x2="10.5" y2="10.5" />
                  <line x1="10.5" y1="5.5" x2="5.5" y2="10.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

    </>
  );
};
