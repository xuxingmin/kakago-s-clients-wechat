import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Bean, TrendingUp, TrendingDown, Gift, Coffee, Users, ShoppingCart } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";

interface BeanRecord {
  id: string;
  type: "earn" | "spend";
  title: string;
  amount: number;
  time: string;
  icon: "gift" | "coffee" | "squad" | "order";
}

// 演示数据
const beanRecords: BeanRecord[] = [
  { id: "1", type: "earn", title: "邀请好友奖励", amount: 50, time: "今天 14:32", icon: "squad" },
  { id: "2", type: "spend", title: "兑换冰拿铁", amount: -120, time: "今天 10:15", icon: "coffee" },
  { id: "3", type: "earn", title: "下单返豆", amount: 12, time: "昨天 18:45", icon: "order" },
  { id: "4", type: "earn", title: "新用户注册", amount: 100, time: "昨天 09:00", icon: "gift" },
  { id: "5", type: "spend", title: "兑换美式咖啡", amount: -80, time: "01-27 16:30", icon: "coffee" },
  { id: "6", type: "earn", title: "队员消费返豆", amount: 8, time: "01-27 14:20", icon: "squad" },
  { id: "7", type: "earn", title: "每日签到", amount: 5, time: "01-26 08:00", icon: "gift" },
  { id: "8", type: "spend", title: "兑换卡布奇诺", amount: -100, time: "01-25 11:45", icon: "coffee" },
];

const iconMap = {
  gift: Gift,
  coffee: Coffee,
  squad: Users,
  order: ShoppingCart,
};

const KakaBeans = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"all" | "earn" | "spend">("all");

  // 计算统计
  const totalBeans = 1680;
  const totalEarned = beanRecords.filter(r => r.type === "earn").reduce((sum, r) => sum + r.amount, 0);
  const totalSpent = Math.abs(beanRecords.filter(r => r.type === "spend").reduce((sum, r) => sum + r.amount, 0));

  const filteredRecords = activeTab === "all" 
    ? beanRecords 
    : beanRecords.filter(r => r.type === activeTab);

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
          <h1 className="text-base font-semibold text-white">Kaka豆</h1>
          <div className="w-9" />
        </div>
      </header>

      {/* Balance Card */}
      <section className="px-4 pt-4 pb-3">
        <div className="card-lg bg-gradient-to-br from-amber-500/20 to-orange-600/20 border-amber-500/20">
          <div className="flex items-center justify-between">
            {/* Bean Balance */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/30 flex items-center justify-center">
                <Bean className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-white/50 mb-0.5">当前豆豆</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-amber-400">{totalBeans.toLocaleString()}</span>
                  <span className="text-sm text-white/40">豆</span>
                </div>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="flex gap-4">
              <div className="text-center">
                <div className="flex items-center gap-1 text-green-400">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span className="text-sm font-bold">+{totalEarned}</span>
                </div>
                <p className="text-[10px] text-white/40">累计获得</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1 text-red-400">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span className="text-sm font-bold">-{totalSpent}</span>
                </div>
                <p className="text-[10px] text-white/40">累计消费</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bean Info */}
      <section className="px-4 pb-3">
        <div className="card-sm flex items-center justify-between">
          <p className="text-xs text-white/50">100豆 = 1杯美式 | 120豆 = 1杯拿铁</p>
          <button className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-xs font-medium text-amber-400">
            去兑换
          </button>
        </div>
      </section>

      {/* Tabs */}
      <div className="flex px-4 max-w-md mx-auto">
        {[
          { id: "all", label: "全部" },
          { id: "earn", label: "获得" },
          { id: "spend", label: "消费" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as "all" | "earn" | "spend")}
            className={`flex-1 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? "text-amber-400 border-amber-400"
                : "text-white/40 border-transparent"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Fog Divider */}
      <div className="fog-divider mx-4" />

      {/* Records List */}
      <section className="px-4 py-3">
        <div className="space-y-2">
          {filteredRecords.map((record) => {
            const IconComponent = iconMap[record.icon];
            const isEarn = record.type === "earn";
            
            return (
              <div key={record.id} className="card-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isEarn ? "bg-green-500/20" : "bg-red-500/20"
                  }`}>
                    <IconComponent className={`w-4 h-4 ${isEarn ? "text-green-400" : "text-red-400"}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{record.title}</p>
                    <p className="text-[10px] text-white/40">{record.time}</p>
                  </div>
                </div>
                <span className={`text-base font-bold ${isEarn ? "text-green-400" : "text-red-400"}`}>
                  {isEarn ? "+" : ""}{record.amount}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <BottomNav />
    </div>
  );
};

export default KakaBeans;
