import { useState } from "react";
import { ShoppingCart, Minus, Plus, X, Trash2, Coffee, Coins } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

interface MiniCartBarProps {
  estimatedTotal: number;
}

export const MiniCartBar = ({ estimatedTotal }: MiniCartBarProps) => {
  const { t } = useLanguage();
  const { items, totalItems, removeItem, updateQuantity, clearCart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  if (totalItems === 0) return null;

  const handleCheckout = () => {
    setIsPaymentOpen(true);
  };

  const handlePayment = (method: string) => {
    setIsPaymentOpen(false);
    setIsCartOpen(false);
    toast.success(t(`正在跳转${method}...`, `Redirecting to ${method}...`), {
      duration: 1500,
    });
  };

  return (
    <>
      {/* 底部 Mini Cart Bar */}
      <div className="fixed bottom-16 left-4 right-4 z-40 animate-in slide-in-from-bottom duration-300">
        <div className="bg-gradient-to-r from-[#1a1a1d] via-[#1f1f23] to-[#1a1a1d] rounded-2xl border border-white/10 shadow-2xl px-4 py-3 flex items-center justify-between backdrop-blur-xl">
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-3 group"
          >
            <div className="relative w-11 h-11 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
              <ShoppingCart className="w-5 h-5 text-primary" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-purple">
                {totalItems}
              </span>
            </div>
            <div className="text-left">
              <p className="text-[10px] text-white/40">{t("预估到手", "Est.")}</p>
              <p className="text-white font-bold text-lg">¥{estimatedTotal}</p>
            </div>
          </button>

          <button
            onClick={handleCheckout}
            className="h-11 px-6 bg-gradient-to-r from-primary via-purple-500 to-violet-600 rounded-xl flex items-center gap-2 text-white font-semibold text-sm shadow-purple transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {t("去结算", "Pay")}
          </button>
        </div>
      </div>

      {/* 支付方式选择 - 极简 */}
      {isPaymentOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => setIsPaymentOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-200">
            <div className="bg-[#1a1a1d] rounded-t-2xl border-t border-white/10 px-5 py-4">
              <div className="flex justify-center mb-3">
                <div className="w-8 h-1 bg-white/20 rounded-full" />
              </div>
              <p className="text-white/50 text-xs text-center mb-4">{t("选择支付方式", "Payment")}</p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => handlePayment("微信支付")}
                  className="flex-1 h-12 rounded-xl bg-[#07C160]/10 border border-[#07C160]/30 flex items-center justify-center gap-2 text-[#07C160] font-medium text-sm hover:bg-[#07C160]/20 transition-colors active:scale-95"
                >
                  <span className="text-lg">💬</span>
                  {t("微信", "WeChat")}
                </button>
                <button
                  onClick={() => handlePayment("支付宝")}
                  className="flex-1 h-12 rounded-xl bg-[#1677FF]/10 border border-[#1677FF]/30 flex items-center justify-center gap-2 text-[#1677FF] font-medium text-sm hover:bg-[#1677FF]/20 transition-colors active:scale-95"
                >
                  <span className="text-lg">🔵</span>
                  {t("支付宝", "Alipay")}
                </button>
                <button
                  onClick={() => handlePayment("KAKA豆")}
                  className="flex-1 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center gap-2 text-primary font-medium text-sm hover:bg-primary/20 transition-colors active:scale-95"
                >
                  <Coins className="w-4 h-4" />
                  {t("KAKA豆", "Beans")}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 购物车抽屉 */}
      {isCartOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => setIsCartOpen(false)}
          />

          <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-300">
            <div className="bg-gradient-to-t from-black via-[#1a1a1d] to-[#1a1a1d]/95 rounded-t-3xl border-t border-white/10 shadow-2xl max-h-[70vh] overflow-hidden">
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 bg-white/20 rounded-full" />
              </div>

              <div className="flex items-center justify-between px-5 pb-4 border-b border-white/5">
                <h3 className="text-white font-semibold text-base">
                  {t("购物车", "Cart")} ({totalItems})
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      clearCart();
                      setIsCartOpen(false);
                    }}
                    className="text-white/40 text-xs hover:text-red-400 transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {t("清空", "Clear")}
                  </button>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/20 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="px-5 py-4 space-y-3 overflow-y-auto max-h-[40vh]">
                {items.map((item) => {
                  // 获取英文名首字母缩写
                  const initials = item.nameEn
                    .split(" ")
                    .map(word => word[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2);
                  
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between bg-white/5 rounded-xl p-3"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {/* 咖啡杯图标 + 首字母 */}
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-violet-600/10 flex items-center justify-center flex-shrink-0 border border-primary/20 relative">
                          <Coffee className="w-6 h-6 text-primary/40 absolute" />
                          <span className="text-[10px] font-bold text-primary relative z-10 mt-0.5">
                            {initials}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-white font-medium text-sm truncate">
                            {t(item.nameZh, item.nameEn)}
                          </h4>
                          <p className="text-primary text-sm font-semibold mt-0.5">
                            ¥{item.price}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (item.quantity === 1) {
                              removeItem(item.id);
                            } else {
                              updateQuantity(item.id, item.quantity - 1);
                            }
                          }}
                          className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 hover:text-white transition-all active:scale-95"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-white font-semibold w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary hover:bg-primary/30 transition-all active:scale-95"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="px-5 py-4 border-t border-white/5 bg-black/30">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white/50 text-sm">{t("预估到手", "Est.")}</span>
                  <span className="text-white font-bold text-xl">¥{estimatedTotal}</span>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    handleCheckout();
                  }}
                  className="w-full h-12 bg-gradient-to-r from-primary via-purple-500 to-violet-600 rounded-xl flex items-center justify-center gap-2 text-white font-semibold shadow-purple transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  {t("去结算", "Pay")}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
