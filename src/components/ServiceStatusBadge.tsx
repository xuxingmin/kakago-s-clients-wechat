import { RefreshCw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useServiceAvailability } from "@/hooks/useServiceAvailability";

export const ServiceStatusBadge = () => {
  const { t } = useLanguage();
  const { isAvailable, isLoading, nearbyMerchantCount, refresh } =
    useServiceAvailability();

  return (
    <div className="flex items-center gap-1.5 bg-secondary px-2.5 py-1.5 rounded-full">
      {isLoading ? (
        <>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-xs text-muted-foreground font-medium">
            {t("定位中...", "Locating...")}
          </span>
        </>
      ) : isAvailable ? (
        <>
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <span className="text-xs text-foreground font-medium">
            {t("可配送", "Available")}
          </span>
          {nearbyMerchantCount > 0 && (
            <span className="text-[10px] text-muted-foreground">
              ({nearbyMerchantCount})
            </span>
          )}
        </>
      ) : (
        <>
          <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
          <span className="text-xs text-muted-foreground font-medium">
            {t("暂不可配送", "Unavailable")}
          </span>
        </>
      )}
      <button
        onClick={refresh}
        className="p-0.5 text-muted-foreground hover:text-primary transition-colors"
        aria-label="Refresh"
      >
        <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
      </button>
    </div>
  );
};
