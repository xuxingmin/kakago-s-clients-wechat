import { useState } from "react";
import { ShoppingCart, X, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

export const FloatingCart = () => {
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  if (totalItems === 0) return null;

  const handleCheckout = () => {
    setIsOpen(false);
    navigate("/order-tracking");
    clearCart();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-[70] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Cart Drawer */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-[70] transition-transform duration-300 ease-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="bg-card rounded-t-3xl max-w-md mx-auto max-h-[70vh] flex flex-col">
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 bg-border rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-6 pb-4 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">
              {t("购物车", "Cart")} ({totalItems})
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={clearCart}
                className="p-2 text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.nameZh}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground truncate">
                    {t(item.nameZh, item.nameEn)}
                  </h4>
                  <p className="text-primary font-semibold">¥{item.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-foreground hover:bg-secondary/80 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-medium text-foreground">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-foreground hover:bg-secondary/80 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border safe-bottom">
            <button
              onClick={handleCheckout}
              className="btn-gold w-full py-4 rounded-2xl text-base font-semibold flex items-center justify-center gap-2"
            >
              {t("去结算", "Checkout")} · ¥{totalPrice}
            </button>
          </div>
        </div>
      </div>

      {/* Floating Button - Matches GO button size, positioned to overlay it */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-[88px] right-4 z-[65] w-[calc((100vw-32px-24px)/4)] h-12 bg-gradient-to-br from-primary to-purple-dark text-white rounded-lg shadow-purple transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5 ${
          isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <ShoppingCart className="w-4 h-4" />
        <span className="text-xs font-mono font-bold">{totalItems}</span>
      </button>
    </>
  );
};
