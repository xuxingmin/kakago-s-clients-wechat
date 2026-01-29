import { useState } from "react";
import { X, Minus, Plus, Trash2, Check } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Mock user beans balance
const userBeansBalance = 124050;

// Convert beans to RMB
const beansToRMB = (beans: number) => (beans / 100).toFixed(2);

// Payment method icons (inline SVG for WeChat and Alipay)
const WeChatIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#07C160">
    <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89l-.002-.002-.404-.04zm-2.086 2.672c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.97.983.976.976 0 0 1-.968-.983c0-.542.433-.982.969-.982z"/>
  </svg>
);

const AlipayIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#1677FF">
    <path d="M21.422 15.358c-.746-.326-1.588-.694-2.538-1.104a21.192 21.192 0 0 0 1.715-4.933h-4.32V7.478h5.104V6.342h-5.104V3.478h-2.31s.012 2.067 0 2.864h-4.907v1.136h4.907v1.843H9.048v1.252h8.398a17.392 17.392 0 0 1-1.17 3.263c-2.381-.741-4.912-1.334-7.053-1.334-3.605 0-5.932 1.695-5.932 4.156 0 2.46 2.327 4.156 5.932 4.156 2.6 0 5.15-1.078 7.222-2.923 2.097 1.194 4.534 2.51 6.969 3.659l.586-2.192zm-12.199 4.042c-2.584 0-3.783-1.16-3.783-2.544 0-1.384 1.2-2.544 3.783-2.544 1.746 0 3.835.49 5.897 1.308-1.681 2.188-3.778 3.78-5.897 3.78z"/>
  </svg>
);

const BeansIcon = () => (
  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
    <span className="text-[10px] font-bold text-white">K</span>
  </div>
);

export const FloatingCart = () => {
  const { items, totalItems, totalPrice, updateQuantity, clearCart } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<"wechat" | "alipay" | "beans">("wechat");

  // Expose open function globally for BrandStandardsGrid to call
  (window as any).__openCart = () => setIsOpen(true);

  if (totalItems === 0 && !isOpen) return null;

  // Calculate beans needed (100 beans = 1 RMB)
  const totalBeansNeeded = totalPrice * 100;
  const hasEnoughBeans = userBeansBalance >= totalBeansNeeded;

  const handleCheckout = () => {
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = () => {
    setShowPaymentModal(false);
    setIsOpen(false);
    navigate("/order-tracking");
    clearCart();
  };

  const paymentMethods = [
    {
      id: "wechat" as const,
      nameZh: "微信支付",
      nameEn: "WeChat Pay",
      icon: <WeChatIcon />,
      available: true,
    },
    {
      id: "alipay" as const,
      nameZh: "支付宝",
      nameEn: "Alipay",
      icon: <AlipayIcon />,
      available: true,
    },
    {
      id: "beans" as const,
      nameZh: "KAKA豆支付",
      nameEn: "KAKA Beans",
      icon: <BeansIcon />,
      available: hasEnoughBeans,
      balance: userBeansBalance,
      needed: totalBeansNeeded,
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-[70] transition-opacity duration-300 ${
          isOpen || showPaymentModal ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => {
          if (showPaymentModal) {
            setShowPaymentModal(false);
          } else {
            setIsOpen(false);
          }
        }}
      />

      {/* Cart Drawer */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-[70] transition-transform duration-300 ease-out ${
          isOpen && !showPaymentModal ? "translate-y-0" : "translate-y-full"
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

      {/* Payment Method Modal */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-[80] transition-transform duration-300 ease-out ${
          showPaymentModal ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="bg-card rounded-t-3xl max-w-md mx-auto">
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 bg-border rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-6 pb-4 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">
              {t("选择支付方式", "Select Payment")}
            </h3>
            <button
              onClick={() => setShowPaymentModal(false)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Payment Methods */}
          <div className="px-6 py-4 space-y-3">
            <RadioGroup
              value={selectedPayment}
              onValueChange={(value) => setSelectedPayment(value as typeof selectedPayment)}
            >
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedPayment === method.id
                      ? "border-primary bg-primary/5"
                      : "border-border bg-secondary/30 hover:bg-secondary/50"
                  } ${!method.available ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="flex-shrink-0">{method.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">
                        {t(method.nameZh, method.nameEn)}
                      </span>
                      {method.id === "beans" && !method.available && (
                        <span className="text-xs text-destructive">
                          {t("余额不足", "Insufficient")}
                        </span>
                      )}
                    </div>
                    {method.id === "beans" && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {t(
                          `需 ${method.needed?.toLocaleString()} 豆 · 余额 ${method.balance?.toLocaleString()} 豆`,
                          `Need ${method.needed?.toLocaleString()} · Balance ${method.balance?.toLocaleString()}`
                        )}
                      </p>
                    )}
                  </div>
                  <RadioGroupItem
                    value={method.id}
                    disabled={!method.available}
                    className="flex-shrink-0"
                  />
                </label>
              ))}
            </RadioGroup>
          </div>

          {/* Order Summary */}
          <div className="px-6 py-3 border-t border-border">
            <div className="flex justify-between items-center mb-1">
              <span className="text-muted-foreground text-sm">{t("订单金额", "Total")}</span>
              <span className="text-xl font-bold text-primary">¥{totalPrice}</span>
            </div>
            {selectedPayment === "beans" && (
              <p className="text-xs text-amber-500 text-right">
                ≈ {(totalPrice * 100).toLocaleString()} KAKA豆
              </p>
            )}
          </div>

          {/* Confirm Button */}
          <div className="px-6 py-4 safe-bottom">
            <button
              onClick={handleConfirmPayment}
              disabled={selectedPayment === "beans" && !hasEnoughBeans}
              className="btn-gold w-full py-4 rounded-2xl text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("确认支付", "Confirm Payment")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Export a function to open cart from outside
export const openCart = () => {
  if ((window as any).__openCart) {
    (window as any).__openCart();
  }
};
