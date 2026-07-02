import { useLanguage } from "@/contexts/LanguageContext";
import { useServiceAvailability } from "@/hooks/useServiceAvailability";

interface ServiceNodeBarProps {
  /** Optional override — if provided, overrides live data (used in details/checkout pages). */
  nodeCode?: string;
  distanceKm?: number;
  etaMin?: number;
}

/**
 * TRIVA 认证节点服务状态条
 * 位置：首页 BrandBanner 下方、商品菜单上方
 * 无数据时降级：正在匹配附近认证节点
 */
export const ServiceNodeBar = ({ nodeCode, distanceKm, etaMin }: ServiceNodeBarProps) => {
  const { t } = useLanguage();
  const { isLoading, isAvailable, nearestMerchant } = useServiceAvailability();

  const distMeters = nearestMerchant?.distanceMeters;
  const km =
    distanceKm ?? (typeof distMeters === "number" ? +(distMeters / 1000).toFixed(1) : undefined);
  const eta = etaMin ?? (typeof km === "number" ? Math.max(15, Math.round(km * 8 + 10)) : undefined);
  // Placeholder node code — real code will come from backend match.
  const code = nodeCode ?? "HF-017";

  const hasNode = !isLoading && isAvailable && typeof km === "number";

  return (
    <div className="mx-3 mb-2 rounded-xl bg-paper border border-foreground/10 px-3 py-2 flex items-center gap-2 shadow-[0_2px_10px_-6px_hsla(24,13%,9%,0.12)]">
      <span
        className={`w-1.5 h-1.5 rounded-full shrink-0 ${
          hasNode
            ? "bg-[hsl(var(--matcha))] animate-pulse"
            : "bg-[hsl(var(--citrus))] animate-pulse"
        }`}
      />
      {hasNode ? (
        <div className="flex-1 min-w-0 flex items-center gap-1.5 flex-wrap">
          <span className="font-mono text-[10.5px] font-bold tracking-[0.08em] text-primary tabular-nums">
            {code}
          </span>
          <span className="text-foreground/25">·</span>
          <span className="font-mono text-[10.5px] text-foreground/70 tabular-nums">
            {km}km
          </span>
          <span className="text-foreground/25">·</span>
          <span className="font-mono text-[10.5px] text-foreground/70 tabular-nums">
            {t(`预计${eta}min`, `≈ ${eta}min`)}
          </span>
          <span className="text-foreground/25">·</span>
          <span className="text-[11px] text-[hsl(var(--matcha))] font-medium">
            {t("今日履约正常", "On-time today")}
          </span>
        </div>
      ) : (
        <span className="flex-1 text-[11px] text-foreground/60">
          {t("正在匹配附近认证节点", "Matching nearby certified node…")}
        </span>
      )}
    </div>
  );
};
