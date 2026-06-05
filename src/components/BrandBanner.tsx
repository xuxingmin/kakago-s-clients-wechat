import { Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CouponFlags, Coupon } from "@/components/CouponFlags";
import trivaLogo from "@/assets/triva-logo.png.asset.json";

// 用户可用优惠券（测试数据）
const userCoupons: Coupon[] = [
  { id: "c1", type: "universal", value: 3 },
  { id: "c2", type: "latte", value: 2, applicableProducts: ["hot-latte", "iced-latte"] },
  { id: "c3", type: "americano", value: 2, applicableProducts: ["hot-americano", "iced-americano"] },
];

export const BrandBanner = () => {
  const { t } = useLanguage();
  const totalCoupons = userCoupons.length;

  return (
    <section className="px-4 pt-1 pb-0.5 hero-reveal bg-background">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <img
              src={trivaLogo.url}
              alt="TRIVA"
              className="h-8 w-auto object-contain mix-blend-multiply select-none"
              draggable={false}
            />
            <Sparkles className="w-3.5 h-3.5 text-copper float-subtle" />
          </div>
          <p className="text-xs text-foreground/70 mt-1 font-light">
            {t("不贵精品，即刻上瘾！", "Premium taste, instant addiction!")}
          </p>
        </div>
        {totalCoupons > 0 && <CouponFlags coupons={userCoupons} />}
      </div>
    </section>
  );
};
