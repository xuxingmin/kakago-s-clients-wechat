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
    <section className="px-4 pt-3 pb-2 hero-reveal bg-background">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-primary tracking-tight">KAKAGO</h1>
            <Sparkles className="w-4 h-4 text-primary/60 float-subtle" />
          </div>
          <p className="text-sm text-muted-foreground mt-0.5 font-light">
            {t("不贵精品，即刻上瘾！", "Premium taste, instant addiction!")}
          </p>
        </div>
        {totalCoupons > 0 && <CouponFlags coupons={userCoupons} />}
      </div>
    </section>
  );
};
