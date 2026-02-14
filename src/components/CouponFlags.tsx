import { useLanguage } from "@/contexts/LanguageContext";
import { Ticket } from "lucide-react";

export interface Coupon {
  id: string;
  type: "universal" | "americano" | "latte" | "cappuccino";
  value: number;
  applicableProducts?: string[];
}

interface CouponFlagsProps {
  coupons: Coupon[];
}

export const CouponFlags = ({ coupons }: CouponFlagsProps) => {
  const { t } = useLanguage();

  if (coupons.length === 0) return null;

  const totalValue = coupons.reduce((sum, c) => sum + c.value, 0);

  return (
    <button className="flex items-center gap-1.5 bg-red-50 text-red-500 px-3 py-1.5 rounded-full">
      <Ticket className="w-3.5 h-3.5" />
      <span className="text-xs font-semibold">
        {coupons.length}{t("张券", " coupons")}
      </span>
      <span className="text-[10px] text-red-400">
        ¥{totalValue}
      </span>
    </button>
  );
};
