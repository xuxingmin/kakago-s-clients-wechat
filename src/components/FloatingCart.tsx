import { useState } from "react";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

export const FloatingCart = () => {
  const { items, totalItems, totalPrice, updateQuantity, clearCart } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  (window as any).__openCart = () => setIsOpen(true);

  if (totalItems === 0 && !isOpen) return null;

  const handleCheckout = () => {
    setIsOpen(false);
    navigate("/checkout");
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-espresso/45 backdrop-blur-[2px] z-[70] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      <div
        className={`fixed bottom-0 left-0 right-0 z-[70] transition-transform duration-300 ease-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="bg-paper rounded-t-3xl max-w-md mx-auto max-h-[70vh] flex flex-col border-t border-foreground/10 shadow-[0_-12px_40px_-12px_hsla(24,13%,9%,0.25)]">
          <div className="flex justify-center pt-3 pb-1.5">
            <div className="w-10 h-1 bg-foreground/15 rounded-full" />
          </div>

          <div className="flex items-center justify-between px-5 pb-3 border-b border-dashed border-foreground/15">
            <div>
              <p className="font-mono text-[9px] tracking-[0.22em] uppercase text-foreground/55">
                Cart · {totalItems}
              </p>
              <h3 className="font-serif text-[17px] font-bold text-espresso mt-0.5">
                {t("购物车", "Shopping Cart")}
              </h3>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={clearCart}
                className="w-9 h-9 rounded-full flex items-center justify-center text-foreground/55 hover:text-destructive hover:bg-foreground/5 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-foreground/55 hover:text-foreground hover:bg-foreground/5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2.5">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 bg-card border border-foreground/8 rounded-xl p-2.5"
              >
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-oat border border-foreground/10 flex-shrink-0">
                  <img src={item.image} alt={item.nameZh} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-espresso text-[14px] truncate">
                    {t(item.nameZh, item.nameEn)}
                  </h4>
                  <p className="font-serif font-bold text-[14px] mt-0.5 tabular-nums">
                    <span className="text-copper-500 mr-0.5">¥</span>
                    <span className="text-espresso">{item.price}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-7 h-7 rounded-full border border-foreground/15 flex items-center justify-center text-foreground/65 hover:bg-foreground/5 active:scale-95 transition-all"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-5 text-center font-semibold text-espresso text-sm tabular-nums">
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

          <div className="px-5 py-4 pb-6 border-t border-foreground/10 bg-oat/40 safe-bottom">
            <button
              onClick={handleCheckout}
              className="w-full h-12 rounded-full bg-primary text-primary-foreground font-semibold text-[15px] tracking-wide hover:bg-purple-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span>{t("去结算", "Checkout")}</span>
              <span className="opacity-60">·</span>
              <span className="tabular-nums">
                <span className="opacity-80 mr-0.5">¥</span>
                {totalPrice}
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export const openCart = () => {
  if ((window as any).__openCart) (window as any).__openCart();
};
