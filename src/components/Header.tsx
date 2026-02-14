import { MapPin, ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ServiceStatusBadge } from "@/components/ServiceStatusBadge";

export const Header = () => {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 glass safe-top">
      <div className="flex items-center justify-between px-4 py-3 max-w-md mx-auto">
        {/* Location */}
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">
            {t("天鹅湖CBD", "Swan Lake CBD")}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          <ServiceStatusBadge />
          <button
            onClick={toggleLanguage}
            className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary transition-colors min-h-[32px]"
            aria-label={language === "zh" ? "Switch to English" : "切换中文"}
          >
            <span className="text-xs font-semibold">
              {language === "zh" ? "EN" : "中"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
