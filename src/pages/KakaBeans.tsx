import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Bean, TrendingUp, TrendingDown, Gift, Coffee, Users, ShoppingCart, X, Check } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { toast } from "sonner";

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

type PaymentMethod = "wechat" | "alipay" | "beans";

const KakaBeans = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"all" | "earn" | "spend">("all");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>("beans");

  // 计算统计
  const totalBeans = 1680;
  const totalEarned = 175;
  const totalSpent = 300;

  const filteredRecords = activeTab === "all" 
    ? beanRecords 
    : beanRecords.filter(r => r.type === activeTab);

  const handleExchange = () => {
    setShowPaymentModal(false);
    if (selectedPayment === "beans") {
      toast.success("已使用 KAKA豆 兑换成功");
    } else {
      toast.success(`正在跳转${selectedPayment === "wechat" ? "微信" : "支付宝"}支付...`);
    }
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

      {/* Balance Card - Following homepage card-lg style */}
      <section className="px-4 pt-4 pb-3">
        <div className="card-lg bg-gradient-to-br from-amber-700/40 to-amber-900/30 border-amber-600/30">
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
        </div>
      </section>

      {/* Exchange Info Bar */}
      <section className="px-4 pb-3">
        <div className="card-sm flex items-center justify-between">
          <p className="text-xs text-white/50">100豆 = 1杯美式 | 120豆 = 1杯拿铁</p>
          <button 
            onClick={() => setShowPaymentModal(true)}
            className="px-4 py-2 rounded-lg bg-amber-600/80 text-xs font-bold text-white hover:bg-amber-600 transition-colors"
          >
            去兑换
          </button>
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

      {/* Payment Method Modal */}
      {showPaymentModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[80]"
            onClick={() => setShowPaymentModal(false)}
          />
          <div className="fixed inset-x-4 bottom-0 z-[85] max-w-md mx-auto">
            <div className="bg-card rounded-t-2xl overflow-hidden border border-white/10">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <h3 className="text-base font-semibold text-white">选择支付方式</h3>
                <button 
                  onClick={() => setShowPaymentModal(false)}
                  className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-white/60" />
                </button>
              </div>
              
              {/* Payment Options */}
              <div className="p-4 space-y-2">
                {/* Kaka豆 */}
                <button
                  onClick={() => setSelectedPayment("beans")}
                  className={`w-full card-sm flex items-center justify-between ${
                    selectedPayment === "beans" ? "border-amber-500/50 bg-amber-500/10" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                      <Bean className="w-5 h-5 text-amber-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-white">KAKA豆支付</p>
                      <p className="text-[10px] text-white/40">余额 {totalBeans} 豆</p>
                    </div>
                  </div>
                  {selectedPayment === "beans" && (
                    <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>

                {/* WeChat */}
                <button
                  onClick={() => setSelectedPayment("wechat")}
                  className={`w-full card-sm flex items-center justify-between ${
                    selectedPayment === "wechat" ? "border-green-500/50 bg-green-500/10" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                      <span className="text-lg">💬</span>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-white">微信支付</p>
                      <p className="text-[10px] text-white/40">推荐使用</p>
                    </div>
                  </div>
                  {selectedPayment === "wechat" && (
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>

                {/* Alipay */}
                <button
                  onClick={() => setSelectedPayment("alipay")}
                  className={`w-full card-sm flex items-center justify-between ${
                    selectedPayment === "alipay" ? "border-blue-500/50 bg-blue-500/10" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                      <span className="text-lg">🅰️</span>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-white">支付宝支付</p>
                      <p className="text-[10px] text-white/40">快捷支付</p>
                    </div>
                  </div>
                  {selectedPayment === "alipay" && (
                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              </div>

              {/* Confirm Button */}
              <div className="px-4 pb-4 safe-bottom">
                <button
                  onClick={handleExchange}
                  className="w-full py-4 rounded-xl btn-gold font-bold"
                >
                  确认支付
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <BottomNav />
    </div>
  );
};

export default KakaBeans;
