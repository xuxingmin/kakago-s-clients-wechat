import { MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ServiceStatusBadge } from "@/components/ServiceStatusBadge";

export const Header = () => {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border safe-top">
      <div className="flex items-center justify-between px-4 py-3 max-w-md mx-auto">
        {/* Location */}
        <div className="flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">
            {t("天鹅湖CBD", "Swan Lake CBD")}
          </span>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Dynamic Service Status */}
          <ServiceStatusBadge />

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="w-9 h-9 rounded-full bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all min-h-[36px]"
            aria-label={language === "zh" ? "Switch to English" : "切换中文"}
          >
            <span className="text-xs font-bold">
              {language === "zh" ? "EN" : "中"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
