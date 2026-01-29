import { useLanguage } from "@/contexts/LanguageContext";

interface BrandHeaderProps {
  showTagline?: boolean;
}

export const BrandHeader = ({ showTagline = true }: BrandHeaderProps) => {
  const { t } = useLanguage();

  return (
    <header className="px-4 pt-14 pb-6 safe-top max-w-md mx-auto">
      <h1 className="text-3xl font-black text-white tracking-tight">KAKAGO</h1>
      <p className="text-base text-primary font-medium mt-1">
        {t("城市精品咖啡联盟", "Urban Specialty Coffee Alliance")}
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
