import { useLanguage } from "@/contexts/LanguageContext";
import { useServiceAvailability } from "@/hooks/useServiceAvailability";

interface ServiceStatusBadgeProps {
  variant?: "default" | "capsule";
}

/**
 * TRIVA Service Status
 * 三态：
 *   ▸ 服务中 / N 个节点在线 · Matcha #0F6C5C
 *   ▸ 定位中 · 正在匹配节点     · Citrus #E2B84B
 *   ▸ 当前商圈暂未开放           · Berry  #A8453D
 * 默认不再显示"暂停"。
 */
export const ServiceStatusBadge = ({ variant = "default" }: ServiceStatusBadgeProps) => {
  const { t } = useLanguage();
  const { isAvailable, isLoading, nearbyMerchantCount, refresh } = useServiceAvailability();

  // ── State resolver ──────────────────────────────────────────
  const state: "loading" | "ok" | "off" = isLoading
    ? "loading"
    : isAvailable
    ? "ok"
    : "off";

  const dotClass =
    state === "loading"
      ? "bg-[hsl(var(--citrus))] animate-pulse"
      : state === "ok"
      ? "bg-[hsl(var(--matcha))] animate-pulse"
      : "bg-[hsl(var(--berry))]";

  const textClass =
    state === "loading"
      ? "text-foreground/55"
      : state === "ok"
      ? "text-foreground/85"
      : "text-[hsl(var(--berry))]";

  const zh =
    state === "loading"
      ? "正在匹配节点"
      : state === "ok"
      ? nearbyMerchantCount > 0
        ? `${nearbyMerchantCount} 个节点在线`
        : "服务中"
      : "当前商圈暂未开放";

  const en =
    state === "loading"
      ? "Matching…"
      : state === "ok"
      ? nearbyMerchantCount > 0
        ? `${nearbyMerchantCount} nodes online`
        : "Available"
      : "Not yet in service";

  if (variant === "capsule") {
    return (
      <button
        onClick={refresh}
        className={`flex items-center gap-1 transition-colors ${textClass}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
        <span className="text-[11px] font-medium">{t(zh, en)}</span>
      </button>
    );
  }

  return (
    <button
      onClick={refresh}
      className="flex items-center gap-2 bg-paper/70 border border-foreground/10 px-3 py-1.5 rounded-full"
    >
      <span className={`w-2 h-2 rounded-full ${dotClass}`} />
      <span className={`text-xs font-medium ${textClass}`}>{t(zh, en)}</span>
    </button>
  );
};
