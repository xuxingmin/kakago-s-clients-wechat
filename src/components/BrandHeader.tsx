import { useLanguage } from "@/contexts/LanguageContext";

interface BrandHeaderProps {
  showTagline?: boolean;
}

export const BrandHeader = ({ showTagline = true }: BrandHeaderProps) => {
  const { t } = useLanguage();

  return (
    <header className="px-4 pt-12 pb-4 safe-top max-w-md mx-auto">
      <h1 className="text-2xl font-black text-white tracking-tight">KAKAGO</h1>
      <p className="text-sm text-primary font-medium mt-0.5">
        {t("城市精品咖啡联盟", "Urban Specialty Coffee Alliance")}
      </p>
      
      {showTagline && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm font-semibold text-white">
            {t("精选咖啡", "Selected Coffee")}
          </span>
          <span className="text-xs text-white/50">
            {t("专业咖啡师出品", "Crafted by Professional Baristas")}
          </span>
        </div>
      )}
    </header>
  );
};
