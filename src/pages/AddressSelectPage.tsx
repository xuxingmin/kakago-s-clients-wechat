import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, MapPin, Loader2, Navigation, Building2 } from "lucide-react";
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

  // Auto-detect on mount
  useEffect(() => {
    detect();
  }, []);

  const handleComplete = () => {
    if (selectedPOI) {
      navigate(returnTo, { state: { selectedPOI } });
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const filteredPois = searchQuery
    ? pois.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : pois;

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top bar with Cancel / Done */}
      <div className="flex items-center justify-between px-4 py-3 bg-card/80 backdrop-blur border-b border-border flex-shrink-0 z-10">
        <button onClick={handleCancel} className="text-sm text-muted-foreground">
          {t("取消", "Cancel")}
        </button>
        <button
          onClick={handleComplete}
          disabled={!selectedPOI}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            selectedPOI
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {t("完成", "Done")}
        </button>
      </div>

      {/* Map area */}
      <div className="relative h-[45vh] bg-secondary/30 flex-shrink-0 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">{t("正在定位...", "Locating...")}</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
            </div>
          )}
        </div>

        {/* Fake map grid */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(8)].map((_, i) => (
            <div key={`h-${i}`} className="absolute w-full border-t border-foreground" style={{ top: `${(i + 1) * 11}%` }} />
          ))}
          {[...Array(6)].map((_, i) => (
            <div key={`v-${i}`} className="absolute h-full border-l border-foreground" style={{ left: `${(i + 1) * 16}%` }} />
          ))}
        </div>

        {/* Re-locate button */}
        <button
          onClick={detect}
          className="absolute bottom-3 left-3 w-9 h-9 rounded-full bg-card shadow-md flex items-center justify-center border border-border"
        >
          <Navigation className="w-4 h-4 text-primary" />
        </button>

        {error && (
          <div className="absolute bottom-3 left-14 right-3">
            <p className="text-xs text-destructive bg-card/90 rounded-lg py-1.5 px-3 shadow">{error}</p>
          </div>
        )}
      </div>

      {/* Search bar */}
      <div className="px-4 py-3 bg-card border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2 px-3 py-2.5 bg-secondary rounded-xl">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("搜索地点", "Search location")}
            className="flex-1 text-sm text-foreground placeholder:text-muted-foreground bg-transparent focus:outline-none"
          />
        </div>
      </div>

      {/* POI List */}
      <div className="flex-1 overflow-y-auto bg-card">
        {loading && pois.length === 0 && (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-5 h-5 animate-spin text-primary mr-2" />
            <span className="text-sm text-muted-foreground">{t("正在搜索附近地点...", "Searching nearby...")}</span>
          </div>
        )}

        {filteredPois.length > 0 && (
          <div className="divide-y divide-border">
            {filteredPois.map((poi, i) => {
              const isSelected = selectedPOI?.name === poi.name && selectedPOI?.lat === poi.lat;
              return (
                <button
                  key={`${poi.name}-${i}`}
                  type="button"
                  onClick={() => setSelectedPOI(poi)}
                  className={`w-full flex items-start gap-3 px-4 py-3.5 text-left transition-colors ${
                    isSelected ? "bg-primary/5" : "active:bg-secondary/50"
                  }`}
                >
                  <Building2 className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium leading-snug ${isSelected ? "text-primary" : "text-foreground"}`}>
                      {poi.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {poi.district} | {poi.address}
                    </p>
                  </div>
                  {isSelected && (
                    <svg className="w-5 h-5 text-primary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {!loading && filteredPois.length === 0 && (
          <div className="flex items-center justify-center py-10">
            <span className="text-sm text-muted-foreground">{t("未找到附近地点", "No nearby locations found")}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressSelectPage;
