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

// 1元 = 100豆
const beansToRMB = (beans: number) => (beans / 100).toFixed(2);

// 演示数据
const beanRecords: BeanRecord[] = [
  { id: "1", type: "earn", title: "邀请好友奖励", amount: 50, time: "今天 14:32", icon: "squad" },
  { id: "2", type: "spend", title: "兑换冰拿铁", amount: -120, time: "今天 10:15", icon: "coffee" },
  { id: "3", type: "earn", title: "下单返豆", amount: 12, time: "昨天 18:45", icon: "order" },
  { id: "4", type: "earn", title: "新用户注册", amount: 100, time: "昨天 09:00", icon: "gift" },
  { id: "5", type: "spend", title: "兑换美式咖啡", amount: -80, time: "01-27 16:30", icon: "coffee" },
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
          <h1 className="text-base font-semibold text-white">Kaka豆</h1>
          <div className="w-9" />
        </div>
      </header>

      {/* Balance Card - Unified module */}
      <section className="px-4 pt-4 pb-3">
        <div className="card-lg bg-gradient-to-br from-amber-700/40 to-amber-900/30 border-amber-600/30">
          {/* Main Balance Row */}
          <div className="flex items-center gap-4">
            {/* Bean Icon */}
            <div className="w-14 h-14 rounded-2xl bg-amber-500/30 flex items-center justify-center">
              <Bean className="w-7 h-7 text-amber-400" />
            </div>
            
            {/* Balance */}
            <div className="flex-1">
              <p className="text-xs text-white/50 mb-0.5">当前豆豆</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-amber-400">{totalBeans.toLocaleString()}</span>
                <span className="text-sm text-white/40">豆</span>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex flex-col gap-2 text-right">
              <div className="flex items-center gap-1 justify-end">
                <TrendingUp className="w-3.5 h-3.5 text-green-400" />
                <span className="text-sm font-bold text-green-400">+{totalEarned}</span>
                <span className="text-[10px] text-white/40">累计获得</span>
              </div>
              <div className="flex items-center gap-1 justify-end">
                <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                <span className="text-sm font-bold text-red-400">-{totalSpent}</span>
                <span className="text-[10px] text-white/40">累计消费</span>
              </div>
            </div>
          </div>
          
          {/* Divider */}
          <div className="h-px bg-amber-500/20 my-4" />
          
          {/* Exchange Row */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-white/50">100豆 = ¥1</p>
            <button 
              onClick={handleExchange}
              className="px-5 py-2.5 rounded-full bg-amber-600 text-sm font-bold text-white hover:bg-amber-500 transition-colors"
            >
              去兑换
            </button>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="flex px-4 max-w-md mx-auto border-b border-white/10">
        {[
          { id: "all", label: "全部" },
          { id: "earn", label: "获得" },
          { id: "spend", label: "消费" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as "all" | "earn" | "spend")}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? "text-amber-400 border-amber-400"
                : "text-white/40 border-transparent"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Records List */}
      <section className="px-4 py-3 space-y-2">
        {filteredRecords.map((record) => {
          const IconComponent = iconMap[record.icon];
          const isEarn = record.type === "earn";
          
          return (
            <div key={record.id} className="card-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isEarn ? "bg-green-500/20" : "bg-red-500/20"
                }`}>
                  <IconComponent className={`w-5 h-5 ${isEarn ? "text-green-400" : "text-red-400"}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{record.title}</p>
                  <p className="text-[10px] text-white/40">{record.time}</p>
                </div>
              </div>
              <span className={`text-lg font-bold ${isEarn ? "text-green-400" : "text-red-400"}`}>
                {isEarn ? "+" : ""}{record.amount}
              </span>
            </div>
          );
        })}
      </section>

      <BottomNav />
    </div>
  );
};

export default KakaBeans;
