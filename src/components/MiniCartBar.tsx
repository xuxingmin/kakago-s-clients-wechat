import { useState } from "react";
import { ShoppingCart, Minus, Plus, CreditCard, X, Trash2 } from "lucide-react";
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

  // 购物车为空时不显示
  if (totalItems === 0) return null;

  const handleCheckout = () => {
    toast.success(t("正在跳转结算...", "Redirecting to checkout..."), {
      duration: 1500,
    });
  };

  return (
    <>
      {/* 底部 Mini Cart Bar */}
      <div className="fixed bottom-16 left-4 right-4 z-40 animate-in slide-in-from-bottom duration-300">
        <div className="bg-gradient-to-r from-[#1a1a1d] via-[#1f1f23] to-[#1a1a1d] rounded-2xl border border-white/10 shadow-2xl px-4 py-3 flex items-center justify-between backdrop-blur-xl">
          {/* 左侧：购物车图标 + 数量 */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-3 group"
          >
            <div className="relative w-11 h-11 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
              <ShoppingCart className="w-5 h-5 text-primary" />
              {/* 数量角标 */}
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-purple">
                {totalItems}
              </span>
            </div>
            <div className="text-left">
              <p className="text-[10px] text-white/40">{t("预估到手", "Est. Total")}</p>
              <p className="text-white font-bold text-lg">¥{estimatedTotal}</p>
            </div>
          </button>

          {/* 右侧：去结算按钮 */}
          <button
            onClick={handleCheckout}
            className="h-11 px-6 bg-gradient-to-r from-primary via-purple-500 to-violet-600 rounded-xl flex items-center gap-2 text-white font-semibold text-sm shadow-purple transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {t("去结算", "Checkout")}
            <CreditCard className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 购物车抽屉 */}
      {isCartOpen && (
        <>
          {/* 遮罩 */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => setIsCartOpen(false)}
          />

          {/* 购物车面板 */}
          <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-300">
            <div className="bg-gradient-to-t from-black via-[#1a1a1d] to-[#1a1a1d]/95 rounded-t-3xl border-t border-white/10 shadow-2xl max-h-[70vh] overflow-hidden">
              {/* 顶部把手 */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 bg-white/20 rounded-full" />
              </div>

              {/* 头部 */}
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

              {/* 商品列表 */}
              <div className="px-5 py-4 space-y-3 overflow-y-auto max-h-[40vh]">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-white/5 rounded-xl p-3"
                  >
                    {/* 商品信息 */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <img
                        src={item.image}
                        alt={item.nameZh}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="min-w-0">
                        <h4 className="text-white font-medium text-sm truncate">
                          {t(item.nameZh, item.nameEn)}
                        </h4>
                        <p className="text-primary text-sm font-semibold mt-0.5">
                          ¥{item.price}
                        </p>
                      </div>
                    </div>

                    {/* 数量控制 */}
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
                ))}
              </div>

              {/* 底部结算 */}
              <div className="px-5 py-4 border-t border-white/5 bg-black/30">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white/50 text-sm">{t("预估到手", "Est. Total")}</span>
                  <span className="text-white font-bold text-xl">¥{estimatedTotal}</span>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    handleCheckout();
                  }}
                  className="w-full h-12 bg-gradient-to-r from-primary via-purple-500 to-violet-600 rounded-xl flex items-center justify-center gap-2 text-white font-semibold shadow-purple transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  {t("去结算", "Checkout")}
                  <CreditCard className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
