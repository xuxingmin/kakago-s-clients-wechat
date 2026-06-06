import { useLanguage } from "@/contexts/LanguageContext";
import trivaLogo from "@/assets/triva-logo.png.asset.json";

export const BrandBanner = () => {
  const { t } = useLanguage();

  const today = new Date();
  const serial = `${String(today.getFullYear()).slice(2)}${String(
    today.getMonth() + 1
  ).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`;

  return (
    <section className="relative mx-3 mt-2 mb-3 rounded-2xl overflow-hidden hero-reveal shadow-[0_8px_24px_-14px_hsl(var(--purple-700)/0.55)]">
      {/* Deep purple field */}
      <div className="bg-[hsl(var(--purple-700))] px-4 pt-3.5 pb-3">
        {/* Receipt header line */}
        <div className="flex items-center gap-2 mb-3">
          <span className="font-mono text-[8.5px] tracking-[0.3em] font-semibold text-[hsl(var(--logo-cream))]/65 uppercase tabular-nums">
            VOL·01
          </span>
          <span className="text-[hsl(var(--logo-cream))]/35">·</span>
          <span className="font-mono text-[8.5px] tracking-[0.3em] font-semibold text-[hsl(var(--logo-cream))]/65 uppercase tabular-nums">
            № {serial}·A
          </span>
          <div className="flex-1 h-px border-t border-dashed border-[hsl(var(--logo-cream))]/25" />
          <span className="font-mono text-[8.5px] tracking-[0.3em] font-semibold text-copper-300 uppercase">
            EST · MMXXVI
          </span>
        </div>

        {/* Logo on cream sleeve patch */}
        <div className="flex items-end justify-between gap-3">
          <div className="bg-[hsl(var(--logo-cream))] rounded-lg px-3 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]">
            <img
              src={trivaLogo.url}
              alt="TRIVA"
              className="h-[34px] w-auto object-contain mix-blend-multiply select-none block"
              draggable={false}
            />
          </div>
          <div className="text-right pb-0.5">
            <p className="font-serif italic text-[11px] leading-[1.35] text-[hsl(var(--logo-cream))]/85 tracking-wide">
              {t("精品咖啡 · 现做现送", "Specialty Coffee")}
            </p>
            <p className="font-mono text-[8px] tracking-[0.28em] uppercase text-[hsl(var(--logo-cream))]/55 mt-0.5 tabular-nums">
              HEFEI · ANHUI · CN
            </p>
          </div>
        </div>

        {/* Tagline */}
        <div className="flex items-center gap-2.5 mt-3 pt-2.5 border-t border-dashed border-[hsl(var(--logo-cream))]/20">
          <span className="font-mono text-[8.5px] tracking-[0.3em] font-semibold text-copper-300 uppercase shrink-0">
            {t("本期主题", "THIS ISSUE")}
          </span>
          <span className="w-1 h-1 rounded-full bg-copper-400/70 shrink-0" />
          <p className="font-serif italic text-[12.5px] text-[hsl(var(--logo-cream))]/90 leading-snug truncate">
            {t("不贵精品 · 即刻上瘾", "Premium taste, instant addiction")}
          </p>
        </div>
      </div>
    </section>
  );
};
