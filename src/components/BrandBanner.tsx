import { useLanguage } from "@/contexts/LanguageContext";
import trivaLogo from "@/assets/triva-logo.png.asset.json";

export const BrandBanner = () => {
  const { t } = useLanguage();

  return (
    <section className="px-4 pt-3 pb-2 hero-reveal bg-background">
      {/* Top rule line — editorial signature */}
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[9px] font-black tracking-[0.22em] text-foreground/45 uppercase">
          Vol. 01
        </span>
        <div className="flex-1 h-px bg-foreground/15" />
        <span className="text-[9px] font-black tracking-[0.22em] text-copper uppercase">
          EST · HEFEI · MMXXVI
        </span>
      </div>

      {/* Logo row — anchored, generous */}
      <div className="flex items-end justify-between gap-3">
        <img
          src={trivaLogo.url}
          alt="TRIVA"
          className="h-11 w-auto object-contain mix-blend-multiply select-none -ml-0.5"
          draggable={false}
        />
        <div className="text-right pb-0.5">
          <p className="font-serif italic text-[12px] leading-tight text-foreground/75">
            {t("精品咖啡 · 现做现送", "Specialty · Freshly Crafted")}
          </p>
          <p className="text-[9px] font-medium tracking-[0.18em] text-foreground/45 uppercase mt-0.5">
            {t("Premium · Daily", "Premium · Daily")}
          </p>
        </div>
      </div>

      {/* Tagline */}
      <div className="flex items-baseline justify-between gap-2 mt-2 pt-2 border-t border-foreground/15">
        <p className="font-serif italic text-[13px] text-foreground/85 leading-snug">
          {t("不贵精品，即刻上瘾。", "Premium taste, instant addiction.")}
        </p>
        <span className="text-[9px] font-black tracking-[0.18em] text-primary uppercase shrink-0">
          № 001
        </span>
      </div>
    </section>
  );
};
