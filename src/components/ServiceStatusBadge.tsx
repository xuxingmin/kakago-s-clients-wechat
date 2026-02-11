import { RefreshCw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useServiceAvailability } from "@/hooks/useServiceAvailability";

export const ServiceStatusBadge = () => {
  const { t } = useLanguage();
  const { isAvailable, isLoading, nearbyMerchantCount, refresh } =
    useServiceAvailability();

  return (
    <div className="flex items-center gap-2 bg-secondary/80 px-3 py-1.5 rounded-full border border-border">
      {isLoading ? (
        <>
          <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
          <span className="text-xs text-white/80 font-medium">
            {t("定位中...", "Locating...")}
          </span>
        </>
      ) : isAvailable ? (
        <>
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-white/80 font-medium">
            {t("可提供服务", "Available")}
          </span>
          {nearbyMerchantCount > 0 && (
            <span className="text-[10px] text-white/50">
              ({nearbyMerchantCount})
            </span>
          )}
        </>
      ) : (
        <>
          <span className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-xs text-white/60 font-medium">
            {t("暂时无法提供服务", "Unavailable")}
          </span>
        </>
      )}
      <button
        onClick={refresh}
        className="ml-1 p-0.5 text-white/40 hover:text-white/80 transition-colors"
        aria-label="Refresh"
      >
        <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
      </button>
    </div>
  );
};
