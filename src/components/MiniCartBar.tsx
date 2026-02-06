import { useState, useEffect } from "react";
import { ShoppingCart, Minus, Plus, X, Trash2, Coffee, Coins, MapPin, ChevronRight, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface MiniCartBarProps {
  estimatedTotal: number;
  couponDiscount?: number;
  deliveryFee?: number;
}

const defaultAddress = {
  name: "张三",
  phone: "138****8888",
  address: "朝阳区建国路88号SOHO现代城A座",
};

export const MiniCartBar = ({ estimatedTotal, couponDiscount = 3, deliveryFee = 2 }: MiniCartBarProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { items, totalItems, totalPrice, removeItem, updateQuantity, clearCart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (totalItems === 0) {
      setIsCartOpen(false);
      setIsPaymentOpen(false);
    }
  }, [totalItems]);

  if (totalItems === 0) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsPaymentOpen(true);
  };

  const handlePayment = async (method: string) => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const success = Math.random() > 0.1;
    
    if (success) {
      toast.success(t("支付成功", "Payment successful"));
      clearCart();
      setIsPaymentOpen(false);
      setIsProcessing(false);
      navigate("/order-tracking");
    } else {
      toast.error(t("支付失败，请重试", "Payment failed, please retry"));
      setIsProcessing(false);
    }
  };

  return (
    <>
      {/* 喜茶风格 Mini Cart Bar - 干净简约 */}
      <div className="fixed bottom-16 left-4 right-4 z-40 animate-in slide-in-from-bottom duration-300">
        <div className="bg-background rounded-2xl border border-border shadow-lg px-4 py-3 flex items-center justify-between">
          <button onClick={() => setIsCartOpen(true)} className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-all duration-300">
              <ShoppingCart className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            </div>
            <div className="text-left">
              <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-wider">{t("预估到手", "Est. Total")}</p>
              <p className="text-foreground font-bold text-lg tracking-tight">¥{estimatedTotal}</p>
            </div>
          </button>

          <button
            onClick={handleCheckout}
            className="h-11 px-6 bg-primary rounded-xl flex items-center gap-2 text-white font-bold text-sm shadow-sm transition-all duration-300 hover:bg-primary/90 active:scale-[0.97]"
          >
            <span>{t("立即结算", "Checkout")}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 购物车抽屉 - 喜茶风格 */}
      {isCartOpen && (
        <>
          <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50" onClick={() => setIsCartOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-300">
            <div className="bg-background rounded-t-2xl border-t border-border shadow-2xl max-h-[60vh] overflow-hidden">
              <div className="flex justify-center pt-2 pb-1">
                <div className="w-8 h-1 bg-muted-foreground/30 rounded-full" />
              </div>

              <div className="flex items-center justify-between px-4 pb-2 border-b border-border">
                <h3 className="text-foreground font-medium text-sm">{t("购物车", "Cart")} ({totalItems})</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { clearCart(); setIsCartOpen(false); }}
                    className="text-muted-foreground text-[11px] hover:text-destructive transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    {t("清空", "Clear")}
                  </button>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* 商品列表 */}
              <div className="px-4 py-2 space-y-1.5 overflow-y-auto max-h-[30vh]">
                {items.map((item) => {
                  const initials = item.nameEn.split(" ").map(word => word[0]).join("").toUpperCase().slice(0, 2);
                  return (
                    <div key={item.id} className="flex items-center justify-between bg-secondary/50 rounded-lg px-2.5 py-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 relative">
                          <Coffee className="w-4 h-4 text-primary/30 absolute" />
                          <span className="text-[8px] font-bold text-primary relative z-10">{initials}</span>
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-foreground font-medium text-xs truncate">{t(item.nameZh, item.nameEn)}</h4>
                          <p className="text-primary text-xs font-semibold">¥{item.price}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => item.quantity === 1 ? removeItem(item.id) : updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-all active:scale-95"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-foreground font-semibold w-5 text-center text-xs">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-all active:scale-95"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 底部：价格明细 + 结算按钮 */}
              <div className="px-4 py-3 pb-6 border-t border-border bg-background sticky bottom-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[11px]">
                    <span className="text-muted-foreground">¥{totalPrice}</span>
                    <span className="text-green-600">-{couponDiscount}</span>
                    <span className="text-muted-foreground">+{deliveryFee}</span>
                    <span className="text-muted-foreground/50">=</span>
                    <span className="text-foreground font-bold text-base">¥{estimatedTotal}</span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="h-10 px-6 bg-primary rounded-xl flex items-center justify-center text-white font-semibold text-sm shadow-sm transition-all hover:bg-primary/90 active:scale-[0.98]"
                  >
                    {t("结算", "Pay")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 支付确认弹窗 - 喜茶风格 */}
      {isPaymentOpen && (
        <>
          <div className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-[60]" onClick={() => !isProcessing && setIsPaymentOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 z-[60] animate-in slide-in-from-bottom duration-200">
            <div className="bg-background rounded-t-2xl border-t border-border px-4 py-4">
              <div className="flex justify-center mb-3">
                <div className="w-8 h-1 bg-muted-foreground/30 rounded-full" />
              </div>
              
              {/* 配送地址 */}
              <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-secondary/50 mb-3 text-left">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-foreground text-sm">
                    <span className="font-medium">{defaultAddress.name}</span>
                    <span className="text-muted-foreground">{defaultAddress.phone}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate mt-0.5">{defaultAddress.address}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </button>

              {/* 价格明细 */}
              <div className="bg-secondary/50 rounded-xl p-3 mb-3 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{t("商品金额", "Subtotal")}</span>
                  <span className="text-foreground">¥{totalPrice}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{t("优惠券", "Coupon")}</span>
                  <span className="text-green-600">-¥{couponDiscount}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{t("配送费", "Delivery")}</span>
                  <span className="text-foreground">¥{deliveryFee}</span>
                </div>
                <div className="flex justify-between pt-1.5 border-t border-border">
                  <span className="text-foreground font-medium text-sm">{t("实付", "Total")}</span>
                  <span className="text-primary font-bold text-lg">¥{estimatedTotal}</span>
                </div>
              </div>
              
              {/* 支付方式 */}
              <div className="flex gap-3">
                <button
                  onClick={() => handlePayment("KAKA豆")}
                  disabled={isProcessing}
                  className="flex-1 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center gap-2 text-primary font-semibold text-sm hover:bg-primary/15 transition-colors active:scale-95 disabled:opacity-50"
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Coins className="w-4 h-4" />}
                  {t("KAKA豆", "Beans")}
                </button>
                <button
                  onClick={() => handlePayment("微信支付")}
                  disabled={isProcessing}
                  className="flex-1 h-12 rounded-xl bg-green-50 border border-green-200 flex items-center justify-center gap-2 text-green-600 font-semibold text-sm hover:bg-green-100 transition-colors active:scale-95 disabled:opacity-50"
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <span className="text-base">💬</span>}
                  {t("微信", "WeChat")}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
