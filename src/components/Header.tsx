import { MapPin, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const Header = () => {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 glass safe-top">
      <div className="flex items-center justify-between px-4 py-3 max-w-md mx-auto">
        {/* Location */}
        <div className="flex items-center gap-1.5 text-foreground">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-white">
            {t("天鹅湖CBD", "Swan Lake CBD")}
          </span>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Network Status */}
          <div className="flex items-center gap-2 bg-secondary/80 px-3 py-1.5 rounded-full border border-border">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-white/80 font-medium">
              {t("运行中", "Online")}
            </span>
          </div>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="w-9 h-9 rounded-full bg-secondary/80 border border-border flex items-center justify-center text-white/70 hover:text-primary hover:border-primary/50 transition-all min-h-[36px]"
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
