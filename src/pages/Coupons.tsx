import { ArrowLeft, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { BottomNav } from "@/components/BottomNav";

interface CouponItem {
  id: string;
  nameZh: string;
  nameEn: string;
  value: number;
  type: "universal" | "americano" | "latte" | "cappuccino";
  minSpend?: number;
  expiresAt?: string;
}

const mockCoupons: CouponItem[] = [
  { id: "c1", nameZh: "通用优惠券", nameEn: "Universal Coupon", value: 3, type: "universal", minSpend: 0, expiresAt: "2026-03-31" },
  { id: "c2", nameZh: "拿铁专属券", nameEn: "Latte Coupon", value: 2, type: "latte", minSpend: 10, expiresAt: "2026-03-15" },
  { id: "c3", nameZh: "美式专属券", nameEn: "Americano Coupon", value: 2, type: "americano", minSpend: 10, expiresAt: "2026-04-01" },
];

const typeColor: Record<string, string> = {
  universal: "from-primary via-purple-500 to-violet-600",
  americano: "from-amber-500 via-orange-500 to-red-500",
  latte: "from-sky-400 via-blue-500 to-indigo-500",
  cappuccino: "from-rose-400 via-pink-500 to-fuchsia-500",
};

const Coupons = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Section Title with Back */}
      <div className="flex-shrink-0 px-4 pt-3 pb-1 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="w-7 h-7 rounded-full bg-secondary/60 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h2 className="text-sm font-medium text-muted-foreground">{t("我的卡券包", "My Coupons")}</h2>
          </div>
          <span className="text-[11px] text-muted-foreground/50">{mockCoupons.length} {t("张可用", "available")}</span>
        </div>
      </div>

      {/* Coupon List */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 pb-20">
        {mockCoupons.map((coupon) => (
          <div
            key={coupon.id}
            className="relative flex overflow-hidden rounded-xl border border-white/5 bg-white/[0.03]"
          >
            {/* Left: value badge */}
            <div className={`w-24 shrink-0 bg-gradient-to-br ${typeColor[coupon.type]} flex flex-col items-center justify-center py-4`}>
              <span className="text-2xl font-black text-white">¥{coupon.value}</span>
              <span className="text-[10px] text-white/70 mt-0.5">{t("立减", "OFF")}</span>
            </div>

            {/* Serrated edge */}
            <div className="absolute left-[95px] top-0 bottom-0 flex flex-col justify-between py-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-background" />
              ))}
            </div>

            {/* Right: details */}
            <div className="flex-1 pl-5 pr-3 py-3 flex flex-col justify-center min-w-0">
              <span className="text-sm font-semibold text-white truncate">
                {t(coupon.nameZh, coupon.nameEn)}
              </span>
              {coupon.minSpend !== undefined && (
                <span className="text-[11px] text-white/40 mt-0.5">
                  {coupon.minSpend === 0
                    ? t("无门槛", "No minimum")
                    : t(`满¥${coupon.minSpend}可用`, `Min. ¥${coupon.minSpend}`)}
                </span>
              )}
              {coupon.expiresAt && (
                <span className="text-[10px] text-white/30 mt-1">
                  {t("有效期至 ", "Expires ")}
                  {coupon.expiresAt}
                </span>
              )}
            </div>

            {/* Use button */}
            <div className="flex items-center pr-3">
              <button
                onClick={() => navigate("/")}
                className="px-3 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-[11px] font-bold text-primary hover:bg-primary/25 transition-colors"
              >
                {t("去使用", "Use")}
              </button>
            </div>
          </div>
        ))}

        {/* Empty hint */}
        {mockCoupons.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-white/30">
            <Ticket className="w-10 h-10 mb-2" />
            <span className="text-sm">{t("暂无可用卡券", "No coupons available")}</span>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Coupons;
