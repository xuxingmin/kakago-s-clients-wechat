import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Wallet, Gift, Ticket } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { useLanguage } from "@/contexts/LanguageContext";

interface Coupon {
  id: string;
  title: string;
  titleEn: string;
  value: number;
  minSpend?: number;
  expiryDate: string;
  expiryDateEn: string;
  isUsed: boolean;
  isExpired: boolean;
}

// Demo coupons with bilingual data
const demoCoupons: Coupon[] = [
  { 
    id: "1", 
    title: "新用户专享", 
    titleEn: "New User Exclusive",
    value: 15, 
    expiryDate: "03-31", 
    expiryDateEn: "Mar 31",
    isUsed: false, 
    isExpired: false 
  },
  { 
    id: "2", 
    title: "美式免单券", 
    titleEn: "Free Americano",
    value: 12, 
    expiryDate: "02-28", 
    expiryDateEn: "Feb 28",
    isUsed: false, 
    isExpired: false 
  },
  { 
    id: "3", 
    title: "拿铁立减", 
    titleEn: "Latte Discount",
    value: 5, 
    minSpend: 15, 
    expiryDate: "01-31", 
    expiryDateEn: "Jan 31",
    isUsed: false, 
    isExpired: false 
  },
  { 
    id: "4", 
    title: "会员周年礼", 
    titleEn: "Anniversary Gift",
    value: 20, 
    expiryDate: "12-31", 
    expiryDateEn: "Dec 31",
    isUsed: true, 
    isExpired: false 
  },
  { 
    id: "5", 
    title: "限时体验券", 
    titleEn: "Limited Trial",
    value: 8, 
    expiryDate: "01-15", 
    expiryDateEn: "Jan 15",
    isUsed: false, 
    isExpired: true 
  },
];

const CoffeeWallet = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"available" | "history">("available");
  const [coupons] = useState<Coupon[]>(demoCoupons);

  const availableCoupons = coupons.filter((c) => !c.isUsed && !c.isExpired);
  const historyCoupons = coupons.filter((c) => c.isUsed || c.isExpired);
  const filteredCoupons = activeTab === "available" ? availableCoupons : historyCoupons;
  
  const totalValue = availableCoupons.reduce((sum, c) => sum + c.value, 0);
  const savedValue = historyCoupons.filter(c => c.isUsed).reduce((sum, c) => sum + c.value, 0);

  const getCouponStatus = (coupon: Coupon) => {
    if (coupon.isUsed) return t("已使用", "Used");
    if (coupon.isExpired) return t("已过期", "Expired");
    return t(`${coupon.expiryDate}到期`, `Expires ${coupon.expiryDateEn}`);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 glass safe-top">
        <div className="flex items-center justify-between px-4 py-3 max-w-md mx-auto">
          <button 
            onClick={() => navigate("/profile")}
            className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-base font-semibold text-white">
            {t("咖啡资产", "Coffee Wallet")}
          </h1>
          <div className="w-9" />
        </div>
      </header>

      {/* Compact Summary */}
      <section className="px-4 pt-4 pb-3">
        <div className="card-lg bg-gradient-to-br from-primary/20 to-purple-dark/20 border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/30 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">{availableCoupons.length}</span>
                  <span className="text-sm text-white/50">{t("张券", "coupons")}</span>
                </div>
                <p className="text-xs text-white/40">
                  {t(`价值 ¥${totalValue}`, `Worth ¥${totalValue}`)}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-xs text-white/40">{t("已省", "Saved")}</p>
              <p className="text-lg font-bold text-primary">¥{savedValue}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="flex px-4 max-w-md mx-auto">
        <button
          onClick={() => setActiveTab("available")}
          className={`flex-1 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "available"
              ? "text-primary border-primary"
              : "text-white/40 border-transparent"
          }`}
        >
          {t(`可用 (${availableCoupons.length})`, `Available (${availableCoupons.length})`)}
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex-1 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "history"
              ? "text-primary border-primary"
              : "text-white/40 border-transparent"
          }`}
        >
          {t("历史", "History")}
        </button>
      </div>

      {/* Fog Divider */}
      <div className="fog-divider mx-4" />

      {/* Coupons List - Compact */}
      <section className="px-4 py-3">
        {filteredCoupons.length > 0 ? (
          <div className="space-y-2">
            {filteredCoupons.map((coupon) => {
              const isDisabled = coupon.isUsed || coupon.isExpired;
              return (
                <div
                  key={coupon.id}
                  className={`card-sm flex items-center justify-between ${isDisabled ? "opacity-50" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDisabled ? "bg-secondary" : "bg-primary/20"}`}>
                      <Ticket className={`w-4 h-4 ${isDisabled ? "text-white/40" : "text-primary"}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {t(coupon.title, coupon.titleEn)}
                      </p>
                      <p className="text-[10px] text-white/40">
                        {coupon.minSpend ? t(`满¥${coupon.minSpend}可用 · `, `Min. ¥${coupon.minSpend} · `) : ""}
                        {getCouponStatus(coupon)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xl font-black ${isDisabled ? "text-white/30" : "text-primary"}`}>
                      ¥{coupon.value}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-3">
              <Gift className="w-6 h-6 text-white/30" />
            </div>
            <p className="text-white/40 text-sm">
              {activeTab === "available" 
                ? t("暂无可用券", "No available coupons") 
                : t("暂无记录", "No history")}
            </p>
          </div>
        )}
      </section>

      <BottomNav />
    </div>
  );
};

export default CoffeeWallet;
