import { useState, useEffect } from "react";
import { ShoppingCart, Minus, Plus, X, Trash2, Coffee, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";

interface MiniCartBarProps {
  estimatedTotal: number;
  couponDiscount?: number;
  deliveryFee?: number;
}

export const MiniCartBar = ({ estimatedTotal, couponDiscount = 3 }: MiniCartBarProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { items, totalItems, totalPrice, removeItem, updateQuantity, clearCart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    if (totalItems === 0) {
      setIsCartOpen(false);
    }
  }, [totalItems]);

  if (totalItems === 0) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate("/checkout");
  };

  const closeDrawer = () => {
    setIsCartOpen(false);
  };

  return (
    <>
      {/* Mini Cart Bar */}
      <div className="fixed bottom-16 left-4 right-4 z-40 animate-in slide-in-from-bottom duration-300">
        <div className="relative bg-gradient-to-r from-black/95 via-[#0d0d10] to-black/95 rounded-2xl border border-primary/30 shadow-[0_0_30px_rgba(127,0,255,0.2)] px-4 py-3 flex items-center justify-between backdrop-blur-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-violet-600/5 pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          
          <button onClick={() => setIsCartOpen(true)} className="flex items-center gap-3 group relative z-10">
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-violet-600/10 flex items-center justify-center group-hover:from-primary/30 group-hover:to-violet-600/20 transition-all duration-300 border border-primary/20">
              <ShoppingCart className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-br from-primary to-violet-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(127,0,255,0.5)] animate-pulse">
                {totalItems}
              </span>
            </div>
            <div className="text-left">
              <p className="text-[9px] text-primary/60 font-medium tracking-wider uppercase">{t("预估到手", "Est. Total")}</p>
              <p className="text-white font-bold text-lg tracking-tight">¥{estimatedTotal}</p>
            </div>
          </button>

          <button
            onClick={handleCheckout}
            className="relative h-11 px-6 bg-gradient-to-r from-primary via-purple-500 to-violet-600 rounded-xl flex items-center gap-2 text-white font-bold text-sm shadow-[0_0_25px_rgba(127,0,255,0.4)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_35px_rgba(127,0,255,0.6)] active:scale-[0.97] overflow-hidden z-10"
          >
            <span className="absolute inset-0 bg-gradient-to-t from-white/0 to-white/20 pointer-events-none" />
            <span className="relative">{t("立即结算", "Checkout")}</span>
            <ChevronRight className="w-4 h-4 relative" />
          </button>
        </div>
      </div>

      {/* Cart Drawer */}
      {isCartOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]" onClick={closeDrawer} />
          <div className="fixed bottom-0 left-0 right-0 z-[60] animate-in slide-in-from-bottom duration-300">
            <div className="bg-gradient-to-t from-black via-[#1a1a1d] to-[#1a1a1d]/95 rounded-t-2xl border-t border-white/10 shadow-2xl max-h-[60vh] overflow-hidden flex flex-col">
              {/* Drag handle */}
              <div className="flex justify-center pt-2 pb-1">
                <div className="w-8 h-1 bg-white/20 rounded-full" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-4 pb-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <ShoppingCart className="w-3 h-3 text-primary" />
                  </div>
                  <h3 className="text-white font-medium text-sm">
                    {t(`已选购商品（${totalItems}件）`, `Selected Items (${totalItems})`)}
                  </h3>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => { clearCart(); closeDrawer(); }}
                    className="text-white/40 text-[11px] hover:text-red-400 transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    {t("清空购物车", "Clear Cart")}
                  </button>
                  <button
                    onClick={closeDrawer}
                    className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/20 transition-all"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1.5">
                {items.map((item) => {
                  const initials = item.nameEn.split(" ").map(word => word[0]).join("").toUpperCase().slice(0, 2);
                  return (
                    <div key={item.id} className="flex items-center justify-between bg-white/5 rounded-lg px-2.5 py-2.5">
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-violet-600/10 flex items-center justify-center flex-shrink-0 border border-primary/20 relative">
                          <Coffee className="w-5 h-5 text-primary/40 absolute" />
                          <span className="text-[9px] font-bold text-primary relative z-10">{initials}</span>
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-white font-medium text-sm truncate">{t(item.nameZh, item.nameEn)}</h4>
                          <p className="text-primary text-sm font-bold mt-0.5">¥{item.price}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => item.quantity === 1 ? removeItem(item.id) : updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:bg-white/10 transition-all active:scale-95"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-white font-bold w-5 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white hover:bg-primary/80 transition-all active:scale-95"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Sticky Bottom - Navigate to checkout */}
              <div className="px-4 py-3 pb-20 border-t border-white/10 bg-black/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center">
                        <ShoppingCart className="w-5 h-5 text-white" />
                      </div>
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {totalItems}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-white/50 text-xs">{t("预计到手", "Est.")}</span>
                        <span className="text-primary font-black text-xl">¥{estimatedTotal}</span>
                      </div>
                      <p className="text-white/30 text-[10px]">
                        {t(`已享优惠，共减免¥${couponDiscount}`, `Saved ¥${couponDiscount} with coupons`)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="h-11 px-8 bg-gradient-to-r from-primary via-purple-500 to-violet-600 rounded-full flex items-center justify-center text-white font-bold text-base shadow-[0_0_25px_rgba(127,0,255,0.4)] transition-all hover:scale-[1.03] active:scale-[0.97]"
                  >
                    {t("去结算", "Checkout")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
