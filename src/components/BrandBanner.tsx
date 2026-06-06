import { useLanguage } from "@/contexts/LanguageContext";
import trivaLogo from "@/assets/triva-logo.png.asset.json";

export const BrandBanner = () => {
  const { t } = useLanguage();

  return (
    <section className="px-4 pt-2 pb-1 hero-reveal bg-background">
      <div className="flex items-end justify-between gap-3 border-b border-foreground/15 pb-2">
        <div className="flex items-end gap-2 min-w-0">
          <img
            src={trivaLogo.url}
            alt="TRIVA"
            className="h-9 w-auto object-contain mix-blend-multiply select-none"
            draggable={false}
          />
          <span className="font-serif italic text-[11px] text-foreground/55 mb-1 truncate">
            {t("精品咖啡 · 现做现送", "Specialty · Freshly Crafted")}
          </span>
        </div>
        <span className="text-[10px] font-black tracking-[0.18em] text-copper uppercase shrink-0 mb-1">
          EST · HEFEI
        </span>
      </div>
      <p className="text-[11px] font-serif italic text-foreground/65 mt-1.5">
        {t("不贵精品，即刻上瘾。", "Premium taste, instant addiction.")}
      </p>
    </section>
  );
};
