import { Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CouponFlags, Coupon } from "@/components/CouponFlags";

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
      <div className="flex items-center justify-between min-h-[48px]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">KAKAGO</h1>
            <Sparkles className="w-3.5 h-3.5 text-primary/60 float-subtle" />
          </div>
          <p className="text-xs text-white/80 mt-0 font-light">
            {t("不贵精品，即刻上瘾！", "Premium taste, instant addiction!")}
          </p>
        </div>
        {totalCoupons > 0 && <CouponFlags coupons={userCoupons} />}
      </div>
    </section>
  );
};
