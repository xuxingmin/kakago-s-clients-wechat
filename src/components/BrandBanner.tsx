import { useLanguage } from "@/contexts/LanguageContext";
import trivaLogo from "@/assets/triva-logo.png.asset.json";

export const BrandBanner = () => {
  const { t } = useLanguage();

  // Receipt-style serial: TRIVA · 260606 · A
  const today = new Date();
  const serial = `${String(today.getFullYear()).slice(2)}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`;

  return (
    <section className="relative px-5 pt-4 pb-4 hero-reveal">
      {/* Top perforation hairline */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, hsla(24,13%,9%,0.18) 0 4px, transparent 4px 8px)",
        }}
      />

      {/* Receipt header line */}
      <div className="flex items-center gap-2 mb-3.5">
        <span className="font-mono text-[8.5px] tracking-[0.3em] font-semibold text-foreground/55 uppercase tabular-nums">
          VOL·01
        </span>
        <span className="font-mono text-[8.5px] tracking-[0.3em] text-foreground/30">·</span>
        <span className="font-mono text-[8.5px] tracking-[0.3em] font-semibold text-foreground/55 uppercase tabular-nums">
          № {serial}·A
        </span>
        <div className="flex-1 h-px border-t border-dashed border-foreground/25" />
        <span className="font-mono text-[8.5px] tracking-[0.3em] font-semibold text-copper/85 uppercase">
          EST · MMXXVI
        </span>
      </div>

      {/* Brand mark */}
      <div className="flex items-end justify-between gap-4">
        <img
          src={trivaLogo.url}
          alt="TRIVA"
          className="h-[42px] w-auto object-contain mix-blend-multiply select-none -ml-0.5"
          draggable={false}
        />
        <div className="text-right pb-1">
          <p className="font-serif italic text-[11px] leading-[1.35] text-foreground/65 tracking-wide">
            {t("精品咖啡 · 现做现送", "Specialty Coffee")}
          </p>
          <p className="font-mono text-[8.5px] tracking-[0.28em] uppercase text-foreground/40 mt-0.5 tabular-nums">
            HEFEI · ANHUI · CN
          </p>
        </div>
      </div>

      {/* Tagline row — menu sub-headline */}
      <div className="flex items-center gap-2.5 mt-4 pt-3 border-t border-dashed border-foreground/20">
        <span className="font-mono text-[8.5px] tracking-[0.3em] font-semibold text-copper uppercase shrink-0">
          {t("本期主题", "THIS ISSUE")}
        </span>
        <span className="w-1 h-1 rounded-full bg-copper/60 shrink-0" />
        <p className="font-serif italic text-[12.5px] text-foreground/75 leading-snug truncate">
          {t("不贵精品 · 即刻上瘾", "Premium taste, instant addiction")}
        </p>
      </div>

      {/* Bottom perforation hairline */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, hsla(24,13%,9%,0.15) 0 4px, transparent 4px 8px)",
        }}
      />
    </section>
  );
};
