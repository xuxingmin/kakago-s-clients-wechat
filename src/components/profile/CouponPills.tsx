import { Ticket } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

interface CouponPill {
  id: string;
  labelZh: string;
  labelEn: string;
  value: number;
}

const coupons: CouponPill[] = [
  { id: "c1", labelZh: "通用券", labelEn: "All", value: 3 },
  { id: "c2", labelZh: "拿铁券", labelEn: "Latte", value: 2 },
  { id: "c3", labelZh: "美式券", labelEn: "Americano", value: 2 },
  { id: "c4", labelZh: "新人券", labelEn: "New User", value: 5 },
];

export const CouponPills = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 py-2">
      {coupons.map((coupon) => (
        <button
          key={coupon.id}
          onClick={() => navigate("/wallet")}
          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 hover:bg-primary/15 active:scale-95 transition-all"
        >
          <Ticket className="w-3 h-3 text-primary" />
          <span className="text-[11px] font-semibold text-primary whitespace-nowrap">
            ¥{coupon.value}
          </span>
          <span className="text-[10px] text-white/50 whitespace-nowrap">
            {t(coupon.labelZh, coupon.labelEn)}
          </span>
        </button>
      ))}
    </div>
  );
};
