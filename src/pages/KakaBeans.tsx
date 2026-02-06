import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Coins, TrendingUp, TrendingDown, Gift, Coffee, Users, ShoppingCart } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { BrandBanner } from "@/components/BrandBanner";
import { Header } from "@/components/Header";
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
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* 固定顶部区域 */}
      <div className="flex-shrink-0">
        {/* Back Button */}
        <div className="absolute top-3 left-4 z-50 safe-top">
          <button 
            onClick={() => navigate("/profile")}
            className="w-8 h-8 rounded-full bg-secondary backdrop-blur flex items-center justify-center"
          >
            <ChevronLeft className="w-4 h-4 text-foreground" />
          </button>
        </div>
        <Header />
        <BrandBanner />

        {/* Balance Card */}
        <section className="px-4 pt-3 pb-2">
          <div className="bg-card rounded-2xl border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Coins className="w-6 h-6 text-primary" />
              </div>
              
              <div className="flex-1">
                <p className="text-[10px] text-muted-foreground mb-0.5">{t("当前豆豆", "Balance")}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-primary">{totalBeans.toLocaleString()}</span>
                  <span className="text-xs text-muted-foreground">{t("豆", "beans")}</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-1 text-right">
                <div className="flex items-center gap-1 justify-end">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-xs font-bold text-green-600">+{totalEarned}</span>
                </div>
                <div className="flex items-center gap-1 justify-end">
                  <TrendingDown className="w-3 h-3 text-destructive" />
                  <span className="text-xs font-bold text-destructive">-{totalSpent}</span>
                </div>
              </div>
            </div>
            
            <div className="h-px bg-border my-3" />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="text-[10px] text-muted-foreground">≈ ¥{beansToRMB(totalBeans)}</p>
                <span className="text-[9px] text-primary bg-primary/10 px-1.5 py-0.5 rounded">100豆=¥1</span>
              </div>
              <button 
                onClick={handleExchange}
                className="bg-primary text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-primary/90 transition-colors"
              >
                {t("去兑换", "Redeem")}
              </button>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <div className="flex px-4 gap-2 pb-2">
          {[
            { id: "all", labelZh: "全部", labelEn: "All" },
            { id: "earn", labelZh: "获得", labelEn: "Earned" },
            { id: "spend", labelZh: "消费", labelEn: "Spent" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as "all" | "earn" | "spend")}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-white"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
              }`}
            >
              {t(tab.labelZh, tab.labelEn)}
            </button>
          ))}
        </div>

        <div className="h-px bg-border mx-4" />
      </div>

      {/* 可滚动中间区域 */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <section className="px-4 py-2 space-y-2">
          {filteredRecords.map((record, index) => {
            const IconComponent = iconMap[record.icon];
            const isEarn = record.type === "earn";
            
            return (
              <div 
                key={record.id} 
                className="bg-card rounded-2xl border border-border p-3 flex items-center justify-between"
                style={{ animationDelay: `${index * 0.03}s` }}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    isEarn ? "bg-primary/10" : "bg-secondary"
                  }`}>
                    <IconComponent className={`w-4 h-4 ${isEarn ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">{t(record.titleZh, record.titleEn)}</p>
                    <p className="text-[9px] text-muted-foreground">{record.time}</p>
                  </div>
                </div>
                <span className={`text-sm font-bold ${isEarn ? "text-primary" : "text-muted-foreground"}`}>
                  {isEarn ? "+" : ""}{record.amount}
                </span>
              </div>
            );
          })}
        </section>

        <section className="px-4 py-3">
          <div className="flex items-center justify-center text-[10px] text-muted-foreground">
            <span>{t("💜 KAKA豆不可提现，可兑换咖啡", "💜 Beans are non-withdrawable, redeemable for coffee")}</span>
          </div>
        </section>
      </div>

      {/* 固定底部区域 */}
      <div className="flex-shrink-0">
        <BottomNav />
      </div>
    </div>
  );
};

export default KakaBeans;
