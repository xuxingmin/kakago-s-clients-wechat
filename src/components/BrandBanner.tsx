import { Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { TacticalBoosters } from "@/components/TacticalBoosters";

export const BrandBanner = () => {
  const { t } = useLanguage();

  return (
    <section className="hero-reveal bg-background">
      <div className="px-4 pt-0.5 pb-0">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-white tracking-tight">KAKAGO</h1>
          <Sparkles className="w-3.5 h-3.5 text-primary/60 float-subtle" />
        </div>
        <p className="text-xs text-white/80 mt-0 font-light">
          {t("不贵精品，即刻上瘾！", "Premium taste, instant addiction!")}
        </p>
      </div>
      <TacticalBoosters />
    </section>
  );
};
