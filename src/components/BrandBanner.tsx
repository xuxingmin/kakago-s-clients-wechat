import { Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const BrandBanner = () => {
  const { t } = useLanguage();

  return (
    <section className="px-4 pt-0.5 pb-0 hero-reveal bg-background">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">KAKAGO</h1>
            <Sparkles className="w-3.5 h-3.5 text-primary/60 float-subtle" />
          </div>
          <p className="text-xs text-white/80 mt-0 font-light">
            {t("不贵精品，即刻上瘾！", "Premium taste, instant addiction!")}
          </p>
        </div>
      </div>
    </section>
  );
};
