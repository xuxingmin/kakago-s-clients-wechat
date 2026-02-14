import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, MapPin, Loader2, Navigation, Building2, Check } from "lucide-react";
import { useLocationDetect, NearbyPOI } from "@/hooks/useLocationDetect";
import { useLanguage } from "@/contexts/LanguageContext";

const AddressSelectPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { loading, pois, showList, error, detect } = useLocationDetect();
  const [selectedPOI, setSelectedPOI] = useState<NearbyPOI | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const returnTo = (location.state as any)?.returnTo || "/address/new";

  useEffect(() => {
    detect();
  }, []);

  const handleComplete = () => {
    if (selectedPOI) {
      navigate(returnTo, { state: { selectedPOI } });
    }
  };

  const filteredPois = searchQuery
    ? pois.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : pois;

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="flex-shrink-0 glass">
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
        <div className="h-11 flex items-center justify-between px-4">
          <button onClick={() => navigate(-1)} className="text-sm text-white/60 active:text-white transition-colors">
            {t("取消", "Cancel")}
          </button>
          <button
            onClick={handleComplete}
            disabled={!selectedPOI}
            className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${
              selectedPOI
                ? "bg-primary text-white shadow-[0_0_20px_hsla(271,81%,56%,0.4)]"
                : "bg-white/5 text-white/20"
            }`}
          >
            {t("完成", "Done")}
          </button>
        </div>
      </div>

      {/* Map area */}
      <div className="relative flex-shrink-0 overflow-hidden" style={{
        height: '42vh',
        background: 'linear-gradient(180deg, hsla(270, 20%, 10%, 0.9) 0%, hsla(270, 25%, 6%, 1) 100%)'
      }}>
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-[0.04]">
          {[...Array(12)].map((_, i) => (
            <div key={`h-${i}`} className="absolute w-full border-t border-white" style={{ top: `${(i + 1) * 8}%` }} />
          ))}
          {[...Array(8)].map((_, i) => (
            <div key={`v-${i}`} className="absolute h-full border-l border-white" style={{ left: `${(i + 1) * 12}%` }} />
          ))}
        </div>

        {/* Center pin */}
        <div className="absolute inset-0 flex items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center gap-3 animate-fade-in">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <span className="text-sm text-white/50 font-medium">{t("正在定位...", "Locating...")}</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center pulse-glow">
                <MapPin className="w-7 h-7 text-primary" />
              </div>
              <div className="w-3 h-3 rounded-full bg-primary/40 blur-sm -mt-1" />
            </div>
          )}
        </div>

        {/* Re-locate */}
        <button
          onClick={detect}
          className="absolute bottom-4 left-4 w-10 h-10 rounded-full glass-light flex items-center justify-center border border-white/10 active:scale-95 transition-transform"
        >
          <Navigation className="w-4 h-4 text-primary" />
        </button>

        {error && (
          <div className="absolute bottom-4 left-16 right-4 animate-fade-in">
            <p className="text-xs text-red-400 bg-black/60 backdrop-blur-md rounded-xl py-2 px-3 border border-red-400/20">{error}</p>
          </div>
        )}
      </div>

      {/* Search bar */}
      <div className="flex-shrink-0 px-4 py-3">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/8">
          <Search className="w-4 h-4 text-white/30 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("搜索地点", "Search location")}
            className="flex-1 text-sm text-white placeholder:text-white/25 bg-transparent focus:outline-none"
          />
        </div>
      </div>

      {/* POI List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {loading && pois.length === 0 && (
          <div className="flex items-center justify-center py-10 animate-fade-in">
            <Loader2 className="w-4 h-4 animate-spin text-primary mr-2" />
            <span className="text-sm text-white/40">{t("正在搜索附近地点...", "Searching nearby...")}</span>
          </div>
        )}

        {filteredPois.length > 0 && (
          <div className="px-4 space-y-1 stagger-fade-in pb-6">
            {filteredPois.map((poi, i) => {
              const isSelected = selectedPOI?.name === poi.name && selectedPOI?.lat === poi.lat;
              return (
                <button
                  key={`${poi.name}-${i}`}
                  type="button"
                  onClick={() => setSelectedPOI(poi)}
                  className={`w-full flex items-start gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                    isSelected
                      ? "bg-primary/10 border border-primary/20"
                      : "bg-white/[0.02] border border-transparent hover:bg-white/5 active:bg-white/8"
                  }`}
                >
                  <Building2 className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? "text-primary" : "text-white/25"}`} />
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium leading-snug ${isSelected ? "text-primary" : "text-white/80"}`}>
                      {poi.name}
                    </p>
                    <p className="text-xs text-white/30 mt-0.5">
                      {poi.district} | {poi.address}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {!loading && filteredPois.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
            <MapPin className="w-8 h-8 text-white/10 mb-3" />
            <span className="text-sm text-white/30">{t("未找到附近地点", "No nearby locations")}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressSelectPage;
