import { useLanguage } from "@/contexts/LanguageContext";
import trivaLogo from "@/assets/triva-logo.png.asset.json";

export const BrandBanner = () => {
  const { t } = useLanguage();

  return (
    <section className="px-5 pt-4 pb-3 hero-reveal bg-background">
      {/* Editorial volume rule */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[9px] font-black tracking-[0.22em] text-foreground/40 uppercase tabular-nums">
          Vol. 01
        </span>
        <div className="flex-1 h-px bg-foreground/12" />
        <span className="text-[9px] font-black tracking-[0.22em] text-copper/85 uppercase">
          EST · HEFEI · MMXXVI
        </span>
      </div>

      {/* Brand signboard — generous whitespace, logo as primary mark */}
      <div className="flex items-end justify-between gap-4 pl-0.5">
        <img
          src={trivaLogo.url}
          alt="TRIVA"
          className="h-12 w-auto object-contain mix-blend-multiply select-none"
          draggable={false}
        />
        <div className="text-right pb-1">
          <p className="font-serif italic text-[12px] leading-[1.15] text-foreground/75">
            {t("精品咖啡", "Specialty")}
          </p>
          <p className="font-serif italic text-[12px] leading-[1.15] text-foreground/75">
            {t("现做现送", "Freshly crafted")}
          </p>
        </div>
      </div>

      {/* Tagline + issue mark */}
      <div className="flex items-baseline justify-between gap-3 mt-3.5 pt-2.5 border-t border-foreground/12">
        <p className="font-serif italic text-[13px] text-foreground/85 leading-snug">
          {t("不贵精品 · 即刻上瘾", "Premium taste, instant addiction")}
        </p>
        <span className="text-[9px] font-black tracking-[0.22em] text-primary uppercase shrink-0 tabular-nums">
          № 001
        </span>
      </div>
    </section>
  );
};
