import { useState, useEffect } from "react";
import { MapPin, MoreHorizontal, ChevronLeft, ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAddress } from "@/contexts/AddressContext";
import { ServiceStatusBadge } from "@/components/ServiceStatusBadge";
import { useServiceAvailability } from "@/hooks/useServiceAvailability";
import { AddressPicker } from "@/components/AddressPicker";
import { useLocation, useNavigate } from "react-router-dom";

export const Header = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const { locationLoading, checkAvailability } = useServiceAvailability();
  const { selectedAddress } = useAddress();
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const [showPicker, setShowPicker] = useState(false);

  // When selected address changes, re-check service availability
  useEffect(() => {
    if (selectedAddress?.latitude && selectedAddress?.longitude) {
      checkAvailability(selectedAddress.latitude, selectedAddress.longitude);
    }
  }, [selectedAddress?.id]);

  const displayLocation = selectedAddress
    ? t(
        `${selectedAddress.detail} ${selectedAddress.city}`,
        `${selectedAddress.detailEn}, ${selectedAddress.cityEn}`
      )
    : null;

  return (
    <>
      <header className="sticky top-0 z-40">
        {/* WeChat Status Bar Simulation */}
        <div className="h-11 bg-background flex items-end justify-between px-6 pb-0.5">
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

        {/* WeChat Navigation Bar */}
        <div className="h-11 bg-background flex items-center justify-between px-3">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            {!isHome && (
              <button
                onClick={() => navigate(-1)}
                className="w-8 h-8 flex items-center justify-center text-white/80 -ml-1"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => setShowPicker(true)}
              className="flex items-center gap-1 text-white/90 truncate group"
            >
              <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="text-[13px] font-medium truncate max-w-[160px]">
                {locationLoading
                  ? t("定位中…", "Locating…")
                  : displayLocation || t("选择地址", "Select Address")}
              </span>
              <ChevronDown className="w-3 h-3 text-white/40 shrink-0 group-hover:text-white/60 transition-colors" />
            </button>
          </div>

          <div className="flex items-center h-8 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm overflow-hidden shrink-0">
            <ServiceStatusBadge variant="capsule" />
            <div className="w-px h-4 bg-white/15" />
            <button
              onClick={toggleLanguage}
              className="h-8 w-9 flex items-center justify-center text-white/70 hover:text-white transition-colors"
              aria-label={language === "zh" ? "Switch to English" : "切换中文"}
            >
              <span className="text-[10px] font-bold">
                {language === "zh" ? "EN" : "中"}
              </span>
            </button>
            <div className="w-px h-4 bg-white/15" />
            <button className="h-8 w-9 flex items-center justify-center text-white/70">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <AddressPicker isOpen={showPicker} onClose={() => setShowPicker(false)} />
    </>
  );
};
