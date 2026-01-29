import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Coins, TrendingUp, TrendingDown, Gift, Coffee, Users, ShoppingCart } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { useLanguage } from "@/contexts/LanguageContext";

interface BeanRecord {
  id: string;
  type: "earn" | "spend";
  titleZh: string;
  titleEn: string;
  amount: number;
  time: string;
  icon: "gift" | "coffee" | "squad" | "order";
}

// 1元 = 100豆
const beansToRMB = (beans: number) => (beans / 100).toFixed(2);

// 演示数据
const beanRecords: BeanRecord[] = [
  { id: "1", type: "earn", titleZh: "邀请好友奖励", titleEn: "Referral Bonus", amount: 50, time: "今天 14:32", icon: "squad" },
  { id: "2", type: "spend", titleZh: "兑换冰拿铁", titleEn: "Iced Latte", amount: -120, time: "今天 10:15", icon: "coffee" },
  { id: "3", type: "earn", titleZh: "下单返豆", titleEn: "Order Reward", amount: 12, time: "昨天 18:45", icon: "order" },
  { id: "4", type: "earn", titleZh: "新用户注册", titleEn: "Sign Up Bonus", amount: 100, time: "昨天 09:00", icon: "gift" },
  { id: "5", type: "spend", titleZh: "兑换美式咖啡", titleEn: "Americano", amount: -80, time: "01-27 16:30", icon: "coffee" },
];

const iconMap = {
  gift: Gift,
  coffee: Coffee,
  squad: Users,
  order: ShoppingCart,
};

const KakaBeans = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"all" | "earn" | "spend">("all");

  // 计算统计
  const totalBeans = 1680;
  const totalEarned = 175;
  const totalSpent = 300;

  const filteredRecords = activeTab === "all" 
    ? beanRecords 
    : beanRecords.filter(r => r.type === activeTab);

  const handleExchange = () => {
    navigate("/");
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
          <h1 className="text-base font-semibold text-white">KAKA豆</h1>
          <div className="w-9" />
        </div>
      </header>

      {/* Brand Header - Same as Index */}
      <section className="px-4 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">KAKA豆</h1>
            <p className="text-sm text-white/50 mt-0.5">
              {t("积分奖励中心", "Rewards Center")}
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-primary/20 border border-primary/30 px-3 py-1.5 rounded-full">
            <Coins className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs text-primary font-medium">
              100豆=¥1
            </span>
          </div>
        </div>
      </section>

      {/* Fog Divider */}
      <div className="fog-divider mx-4" />

      {/* Balance Card - Following homepage card-lg style with purple theme */}
      <section className="px-4 py-4">
        <div className="card-lg">
          {/* Main Balance Row */}
          <div className="flex items-center gap-4">
            {/* Bean Icon */}
            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
              <Coins className="w-7 h-7 text-primary" />
            </div>
            
            {/* Balance */}
            <div className="flex-1">
              <p className="text-xs text-white/50 mb-0.5">{t("当前豆豆", "Balance")}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-primary">{totalBeans.toLocaleString()}</span>
                <span className="text-sm text-white/40">{t("豆", "beans")}</span>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex flex-col gap-2 text-right">
              <div className="flex items-center gap-1 justify-end">
                <TrendingUp className="w-3.5 h-3.5 text-green-400" />
                <span className="text-sm font-bold text-green-400">+{totalEarned}</span>
              </div>
              <div className="flex items-center gap-1 justify-end">
                <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                <span className="text-sm font-bold text-red-400">-{totalSpent}</span>
              </div>
            </div>
          </div>
          
          {/* Divider */}
          <div className="h-px bg-white/10 my-4" />
          
          {/* Exchange Row */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-white/40">{t("≈ ¥", "≈ ¥")}{beansToRMB(totalBeans)}</p>
            </div>
            <button 
              onClick={handleExchange}
              className="btn-gold px-6 py-2.5 rounded-xl text-sm font-semibold"
            >
              {t("去兑换", "Redeem")}
            </button>
          </div>
        </div>
      </section>

      {/* Fog Divider */}
      <div className="fog-divider mx-4" />

      {/* Section Header */}
      <section className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-white/70">
            {t("收支记录", "Transaction History")}
          </h2>
        </div>
      </section>

      {/* Tabs - Following homepage style */}
      <div className="flex px-4 gap-2 pb-3">
        {[
          { id: "all", labelZh: "全部", labelEn: "All" },
          { id: "earn", labelZh: "获得", labelEn: "Earned" },
          { id: "spend", labelZh: "消费", labelEn: "Spent" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as "all" | "earn" | "spend")}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === tab.id
                ? "bg-primary text-white"
                : "bg-secondary/50 text-white/50 hover:bg-secondary"
            }`}
          >
            {t(tab.labelZh, tab.labelEn)}
          </button>
        ))}
      </div>

      {/* Records List - Following homepage card-sm style */}
      <section className="px-4 space-y-2">
        {filteredRecords.map((record, index) => {
          const IconComponent = iconMap[record.icon];
          const isEarn = record.type === "earn";
          
          return (
            <div 
              key={record.id} 
              className="card-sm flex items-center justify-between"
              style={{ animationDelay: `${index * 0.03}s` }}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isEarn ? "bg-primary/20" : "bg-secondary"
                }`}>
                  <IconComponent className={`w-5 h-5 ${isEarn ? "text-primary" : "text-white/50"}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{t(record.titleZh, record.titleEn)}</p>
                  <p className="text-[10px] text-white/40">{record.time}</p>
                </div>
              </div>
              <span className={`text-base font-bold ${isEarn ? "text-primary" : "text-white/50"}`}>
                {isEarn ? "+" : ""}{record.amount}
              </span>
            </div>
          );
        })}
      </section>

      {/* Quick Info Footer - Same as Index */}
      <section className="px-4 py-4">
        <div className="flex items-center justify-center text-xs text-white/30">
          <span>{t("💜 KAKA豆不可提现，可兑换咖啡", "💜 Beans are non-withdrawable, redeemable for coffee")}</span>
        </div>
      </section>

      <BottomNav />
    </div>
  );
};

export default KakaBeans;
