import { useLanguage } from "@/contexts/LanguageContext";

interface BrandHeaderProps {
  showTagline?: boolean;
}

export const BrandHeader = ({ showTagline = true }: BrandHeaderProps) => {
  const { t } = useLanguage();

  return (
    <header className="px-4 pt-14 pb-6 safe-top max-w-md mx-auto">
      <h1 className="font-serif text-4xl font-bold text-primary tracking-tight leading-none">TRIVA</h1>
      <p className="text-base text-copper font-medium mt-1.5">
        {t("不贵精品，即刻上瘾！", "Premium taste, instant addiction!")}
      </p>

      {showTagline && (
        <div className="flex items-center justify-between mt-6">
          <span className="font-serif text-lg font-semibold text-foreground">
            {t("精选咖啡", "Selected Coffee")}
          </span>
          <span className="text-sm text-foreground/60">
            {t("专业咖啡师出品", "Crafted by Professional Baristas")}
          </span>
        </div>
      )}
    </header>
  );
};
