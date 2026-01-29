import { useLanguage } from "@/contexts/LanguageContext";
import kakagoLogo from "@/assets/kakago-logo.png";

interface BrandHeaderProps {
  showTagline?: boolean;
}

export const BrandHeader = ({ showTagline = true }: BrandHeaderProps) => {
  const { t } = useLanguage();

  return (
    <header className="px-4 pt-14 pb-6 safe-top max-w-md mx-auto">
      <img 
        src={kakagoLogo} 
        alt="KAKAGO" 
        className="h-8 w-auto object-contain"
      />
      <p className="text-base text-primary font-medium mt-2">
        {t("可负担的精品咖啡", "Affordable Specialty Coffee")}
      </p>
      
      {showTagline && (
        <div className="flex items-center justify-between mt-6">
          <span className="text-base font-semibold text-white">
            {t("精选咖啡", "Selected Coffee")}
          </span>
          <span className="text-sm text-white/50">
            {t("专业咖啡师出品", "Crafted by Professional Baristas")}
          </span>
        </div>
      )}
    </header>
  );
};
