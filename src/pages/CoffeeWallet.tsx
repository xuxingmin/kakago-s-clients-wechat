import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Wallet, Gift } from "lucide-react";
import { CouponCard, CouponType } from "@/components/CouponCard";
import { BottomNav } from "@/components/BottomNav";

interface Coupon {
  id: string;
  type: CouponType;
  title: string;
  value: number;
  minSpend?: number;
  expiryDate: string;
  isUsed: boolean;
  isExpired: boolean;
}

// Demo coupons
const demoCoupons: Coupon[] = [
  {
    id: "coupon-001",
    type: "universal",
    title: "新用户专享礼券",
    value: 15,
    expiryDate: "2026-03-31",
    isUsed: false,
    isExpired: false,
  },
  {
    id: "coupon-002",
    type: "americano",
    title: "美式咖啡免单券",
    value: 12,
    expiryDate: "2026-02-28",
    isUsed: false,
    isExpired: false,
  },
  {
    id: "coupon-003",
    type: "latte",
    title: "拿铁立减券",
    value: 5,
    minSpend: 15,
    expiryDate: "2026-01-31",
    isUsed: false,
    isExpired: false,
  },
  {
    id: "coupon-004",
    type: "universal",
    title: "会员周年礼券",
    value: 20,
    expiryDate: "2025-12-31",
    isUsed: true,
    isExpired: false,
  },
  {
    id: "coupon-005",
    type: "americano",
    title: "限时体验券",
    value: 8,
    expiryDate: "2025-01-15",
    isUsed: false,
    isExpired: true,
  },
];

const tabs = [
  { id: "available", label: "可使用" },
  { id: "history", label: "历史记录" },
];

const CoffeeWallet = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("available");
  const [coupons] = useState<Coupon[]>(demoCoupons);

  const availableCoupons = coupons.filter((c) => !c.isUsed && !c.isExpired);
  const historyCoupons = coupons.filter((c) => c.isUsed || c.isExpired);
  
  const filteredCoupons = activeTab === "available" ? availableCoupons : historyCoupons;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border safe-top">
        <div className="flex items-center justify-between px-4 py-3 max-w-md mx-auto">
          <button 
            onClick={() => navigate("/profile")}
            className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-base font-semibold text-foreground">我的咖啡资产</h1>
          <div className="w-9" />
        </div>
      </header>

      {/* Summary Card */}
      <div className="px-4 py-4">
        <div className="bg-gradient-to-br from-primary via-purple-500 to-primary-foreground/20 rounded-2xl p-5 text-white relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <Wallet className="w-5 h-5" />
              <span className="text-sm font-medium opacity-90">咖啡钱包</span>
            </div>
            
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black">{availableCoupons.length}</span>
              <span className="text-sm opacity-80">张可用券</span>
            </div>
            
            <div className="mt-4 flex items-center gap-4 text-sm opacity-80">
              <span>总价值 ¥{availableCoupons.reduce((sum, c) => sum + c.value, 0)}</span>
              <span>·</span>
              <span>已节省 ¥{historyCoupons.filter(c => c.isUsed).reduce((sum, c) => sum + c.value, 0)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-4 max-w-md mx-auto border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? "text-primary border-primary"
                : "text-muted-foreground border-transparent hover:text-foreground"
            }`}
          >
            {tab.label}
            {tab.id === "available" && (
              <span className="ml-1 text-xs">({availableCoupons.length})</span>
            )}
          </button>
        ))}
      </div>

      {/* Coupons List */}
      <section className="px-4 py-4 space-y-3">
        {filteredCoupons.length > 0 ? (
          filteredCoupons.map((coupon, index) => (
            <div
              key={coupon.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <CouponCard
                id={coupon.id}
                type={coupon.type}
                title={coupon.title}
                value={coupon.value}
                minSpend={coupon.minSpend}
                expiryDate={coupon.expiryDate}
                isUsed={coupon.isUsed}
                isExpired={coupon.isExpired}
              />
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
              <Gift className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">
              {activeTab === "available" ? "暂无可用优惠券" : "暂无历史记录"}
            </p>
          </div>
        )}
      </section>

      <BottomNav />
    </div>
  );
};

export default CoffeeWallet;
