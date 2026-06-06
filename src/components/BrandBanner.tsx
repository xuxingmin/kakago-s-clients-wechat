import { useLanguage } from "@/contexts/LanguageContext";
import trivaLogo from "@/assets/triva-logo.png.asset.json";

export const BrandBanner = () => {
  const { t } = useLanguage();

  return (
    <section className="px-5 pt-5 pb-4 hero-reveal bg-background">
      {/* Issue line — very subtle catalogue header */}
      <div className="flex items-center gap-2.5 mb-4">
        <span className="font-mono text-[8.5px] tracking-[0.28em] font-medium text-foreground/40 uppercase tabular-nums">
          Vol·01
        </span>
        <div className="flex-1 h-px bg-foreground/10" />
        <span className="font-mono text-[8.5px] tracking-[0.28em] font-medium text-foreground/40 uppercase">
          EST · HEFEI · MMXXVI
        </span>
      </div>

      {/* Logo as brand mark — flush left, generous breathing room */}
      <div className="flex items-end justify-between gap-4">
        <img
          src={trivaLogo.url}
          alt="TRIVA"
          className="h-[44px] w-auto object-contain mix-blend-multiply select-none -ml-1"
          draggable={false}
        />
        <div className="text-right pb-1.5">
          <p className="font-serif italic text-[11.5px] leading-[1.3] text-foreground/65 tracking-wide">
            {t("精品咖啡", "Specialty Coffee")}
          </p>
          <p className="font-serif italic text-[11.5px] leading-[1.3] text-foreground/65 tracking-wide">
            {t("现做现送", "Freshly Crafted")}
          </p>
        </div>
      </div>

      {/* Slogan — light weight, generous whitespace */}
      <div className="flex items-baseline justify-between gap-3 mt-5">
        <p className="font-serif italic text-[14px] text-foreground/70 leading-snug font-normal">
          {t("不贵精品 · 即刻上瘾", "Premium taste, instant addiction")}
        </p>
        <span className="font-mono text-[8.5px] tracking-[0.28em] font-medium text-copper/75 uppercase shrink-0 tabular-nums">
          № 001
        </span>
      </div>
    </section>
  );
};
