import { useState, useEffect } from "react";
import { ShoppingCart, Minus, Plus, X, Trash2, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";

interface MiniCartBarProps {
  estimatedTotal: number;
  couponDiscount?: number;
  deliveryFee?: number;
}

export const MiniCartBar = ({ estimatedTotal, couponDiscount = 0 }: MiniCartBarProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { items, totalItems, removeItem, updateQuantity, clearCart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    if (totalItems === 0) setIsCartOpen(false);
  }, [totalItems]);

  if (totalItems === 0) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate("/checkout");
  };

  const closeDrawer = () => setIsCartOpen(false);

  return (
    <>
      {/* Mini Cart Bar — editorial paper ribbon */}
      <div className="fixed bottom-[68px] left-4 right-4 z-40 animate-in slide-in-from-bottom-2 duration-300">
        <div className="relative max-w-md mx-auto bg-paper rounded-2xl border border-foreground/15 shadow-[0_10px_28px_-12px_hsla(24,13%,9%,0.25)] px-3.5 py-2.5 flex items-center justify-between overflow-hidden">
          {/* Top hairline */}
          <div className="absolute top-0 left-4 right-4 h-px bg-foreground/10" />

          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-3 group min-h-[44px]"
          >
            <div className="relative w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <ShoppingCart className="w-[18px] h-[18px] text-primary-foreground" />
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-copper-500 text-logo-cream text-[10px] font-bold rounded-full flex items-center justify-center border border-paper">
                {totalItems}
              </span>
            </div>
            <div className="text-left">
              <p className="font-mono text-[9px] tracking-[0.22em] uppercase text-foreground/55">
                {t("预估到手", "Est. Total")}
              </p>
              <p className="font-serif text-espresso font-bold text-[18px] leading-tight tabular-nums">
                <span className="text-copper-500 mr-0.5">¥</span>
                {estimatedTotal}
              </p>
            </div>
          </button>

          <button
            onClick={handleCheckout}
            className="h-10 px-4 bg-primary rounded-xl flex items-center gap-1.5 text-primary-foreground font-medium text-[13px] tracking-wide transition-all active:scale-[0.97] hover:bg-purple-600"
          >
            <span>{t("立即结算", "Checkout")}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Cart Drawer — paper sheet */}
      {isCartOpen && (
        <>
          <div
            className="fixed inset-0 bg-espresso/40 backdrop-blur-[2px] z-[60] animate-in fade-in duration-200"
            onClick={closeDrawer}
          />
          <div className="fixed bottom-0 left-0 right-0 z-[60] animate-in slide-in-from-bottom duration-300">
            <div className="bg-paper rounded-t-3xl max-w-md mx-auto max-h-[65vh] flex flex-col border-t border-foreground/10 shadow-[0_-12px_40px_-12px_hsla(24,13%,9%,0.25)]">
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1.5">
                <div className="w-10 h-1 bg-foreground/15 rounded-full" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 pb-3 border-b border-dashed border-foreground/15">
                <div>
                  <p className="font-mono text-[9px] tracking-[0.22em] uppercase text-foreground/55">
                    {t("购物车", "Selection")} · {totalItems}
                  </p>
                  <h3 className="font-serif text-espresso font-bold text-[17px] mt-0.5">
                    {t("已选购商品", "Selected Items")}
                  </h3>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => { clearCart(); closeDrawer(); }}
                    className="text-foreground/50 text-[11px] hover:text-destructive transition-colors flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-foreground/5"
                  >
                    <Trash2 className="w-3 h-3" />
                    {t("清空", "Clear")}
                  </button>
                  <button
                    onClick={closeDrawer}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-foreground/50 hover:text-foreground hover:bg-foreground/5 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-card rounded-xl border border-foreground/8 px-3 py-2.5"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-11 h-11 rounded-lg bg-oat border border-foreground/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {item.image ? (
                          <img src={item.image} alt={item.nameZh} className="w-full h-full object-cover" />
                        ) : (
                          <span className="font-mono text-[10px] font-bold text-primary">
                            {item.nameEn.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-espresso font-medium text-[14px] truncate">
                          {t(item.nameZh, item.nameEn)}
                        </h4>
                        <p className="text-[13px] font-serif font-bold mt-0.5 tabular-nums">
                          <span className="text-copper-500 mr-0.5">¥</span>
                          <span className="text-espresso">{item.price}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => item.quantity === 1 ? removeItem(item.id) : updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-full border border-foreground/15 flex items-center justify-center text-foreground/60 hover:bg-foreground/5 active:scale-95 transition-all"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-espresso font-semibold w-5 text-center text-sm tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:bg-purple-600 active:scale-95 transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-5 py-3.5 pb-6 border-t border-foreground/10 bg-oat/40 safe-bottom">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-[9px] tracking-[0.22em] uppercase text-foreground/55">
                      {t("预计到手", "Estimated")}
                    </p>
                    <p className="font-serif font-bold text-[22px] leading-tight tabular-nums">
                      <span className="text-copper-500 mr-0.5">¥</span>
                      <span className="text-espresso">{estimatedTotal}</span>
                    </p>
                    {couponDiscount > 0 && (
                      <p className="text-foreground/45 text-[10px] mt-0.5">
                        {t(`已享优惠 -¥${couponDiscount}`, `Saved ¥${couponDiscount}`)}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="h-11 px-7 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-[14px] tracking-wide hover:bg-purple-600 active:scale-[0.97] transition-all"
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
