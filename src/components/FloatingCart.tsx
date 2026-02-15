import { useState } from "react";
import { X, Minus, Plus, Trash2, Loader2, ArrowLeft, MapPin, ChevronRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";

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
  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary/80 to-violet-600 flex items-center justify-center">
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<"idle" | "redirecting" | "processing" | "verifying">("idle");

  // Expose open function globally for BrandStandardsGrid to call
  (window as any).__openCart = () => setIsOpen(true);

  if (totalItems === 0 && !isOpen) return null;

  // Calculate beans needed (100 beans = 1 RMB)
  const totalBeansNeeded = totalPrice * 100;
  const hasEnoughBeans = userBeansBalance >= totalBeansNeeded;

  const handleCheckout = () => {
    setShowPaymentModal(true);
  };

  // Simulate payment process
  const handleConfirmPayment = async () => {
    setIsProcessing(true);

    if (selectedPayment === "beans") {
      // KAKA Beans payment - instant processing
      setProcessingStep("processing");
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (hasEnoughBeans) {
        setProcessingStep("verifying");
        await new Promise(resolve => setTimeout(resolve, 800));
        
        toast({
          title: t("支付成功", "Payment Successful"),
          description: t(
            `已扣除 ${totalBeansNeeded.toLocaleString()} KAKA豆`,
            `${totalBeansNeeded.toLocaleString()} KAKA Beans deducted`
          ),
        });
        
        setIsProcessing(false);
        setProcessingStep("idle");
        setShowPaymentModal(false);
        setIsOpen(false);
        clearCart();
        navigate("/order-tracking");
      } else {
        setIsProcessing(false);
        setProcessingStep("idle");
        toast({
          title: t("支付失败", "Payment Failed"),
          description: t("KAKA豆余额不足", "Insufficient KAKA Beans"),
          variant: "destructive",
        });
      }
    } else {
      // WeChat/Alipay - simulate SDK redirect
      setProcessingStep("redirecting");
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      setProcessingStep("processing");
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 90% success rate for demo
      const isSuccess = Math.random() > 0.1;
      
      if (isSuccess) {
        setProcessingStep("verifying");
        await new Promise(resolve => setTimeout(resolve, 800));
        
        toast({
          title: t("支付成功", "Payment Successful"),
          description: t(
            `${selectedPayment === "wechat" ? "微信" : "支付宝"}支付完成`,
            `${selectedPayment === "wechat" ? "WeChat" : "Alipay"} payment completed`
          ),
        });
        
        setIsProcessing(false);
        setProcessingStep("idle");
        setShowPaymentModal(false);
        setIsOpen(false);
        clearCart();
        navigate("/order-tracking");
      } else {
        setIsProcessing(false);
        setProcessingStep("idle");
        toast({
          title: t("支付失败", "Payment Failed"),
          description: t("支付已取消或超时，请重试", "Payment cancelled or timed out, please retry"),
          variant: "destructive",
        });
      }
    }
  };

  const getProcessingText = () => {
    switch (processingStep) {
      case "redirecting":
        return t(
          `正在跳转${selectedPayment === "wechat" ? "微信" : "支付宝"}...`,
          `Redirecting to ${selectedPayment === "wechat" ? "WeChat" : "Alipay"}...`
        );
      case "processing":
        return t("正在处理支付...", "Processing payment...");
      case "verifying":
        return t("验证支付结果...", "Verifying payment...");
      default:
        return "";
    }
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
      {/* Backdrop - Enhanced blur */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-md z-[70] transition-all duration-400 ${
          isOpen || showPaymentModal ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
        onClick={() => {
          if (showPaymentModal) {
            setShowPaymentModal(false);
          } else {
            setIsOpen(false);
          }
        }}
      />

      {/* Cart Drawer - Spring animation */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-[70] transition-transform duration-400 ${
          isOpen && !showPaymentModal ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
      >
        <div className="bg-card/95 backdrop-blur-xl rounded-t-[28px] max-w-md mx-auto max-h-[70vh] flex flex-col border-t border-white/10 shadow-float">
          {/* Handle - More subtle */}
          <div className="flex justify-center pt-4 pb-2">
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

      {/* Checkout Confirmation Modal */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-[80] transition-transform duration-400 ${
          showPaymentModal ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
      >
        <div className="bg-card/95 backdrop-blur-xl rounded-t-[28px] max-w-md mx-auto border-t border-white/10 shadow-float max-h-[85vh] flex flex-col">
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-9 h-1 bg-white/20 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center px-5 pb-3">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h3 className="flex-1 text-center text-base font-semibold text-foreground">
              {t("确认订单", "Confirm Order")}
            </h3>
            <div className="w-8" />
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-5 space-y-3 pb-2 scrollbar-hide">
            {/* Delivery Address */}
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.04] border border-white/8">
              <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground text-sm">张三</span>
                  <span className="text-muted-foreground text-sm">138****8888</span>
                </div>
                <p className="text-muted-foreground text-xs mt-0.5 truncate">
                  {t("朝阳区建国路88号SOHO现代城A座", "Building A, SOHO Modern City, No.88 Jianguo Rd")}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
            </div>

            {/* Product Details */}
            {items.map((item) => (
              <div key={item.id} className="p-3 rounded-2xl bg-white/[0.04] border border-white/8">
                <div className="flex gap-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
                    <img src={item.image} alt={item.nameZh} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground text-sm truncate">{t(item.nameZh, item.nameEn)}</h4>
                    <p className="text-muted-foreground text-xs mt-0.5">{t(item.nameEn, item.nameEn)}</p>
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      <span className="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary rounded-full">{t("中杯 360ml", "Medium 360ml")}</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-secondary text-muted-foreground rounded-full">{t("冰", "Iced")}</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-secondary text-muted-foreground rounded-full">{t("标准糖", "Normal Sugar")}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between flex-shrink-0">
                    <span className="text-foreground font-semibold text-sm">¥{item.price}</span>
                    <span className="text-muted-foreground text-xs">x{item.quantity}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Price Breakdown */}
            <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/8 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("商品金额", "Subtotal")}</span>
                <span className="text-foreground">¥{totalPrice}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("优惠券", "Coupon")}</span>
                <span className="text-primary">-¥3</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("配送费", "Delivery")}</span>
                <span className="text-foreground">¥2</span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex justify-between items-center">
                <span className="font-medium text-foreground text-sm">{t("实付", "Total")}</span>
                <span className="text-lg font-bold text-primary">¥{totalPrice - 3 + 2}</span>
              </div>
            </div>
          </div>

          {/* Payment Buttons */}
          <div className="px-5 py-3 safe-bottom">
            {isProcessing ? (
              <button
                disabled
                className="btn-gold w-full py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 opacity-70"
              >
                <Loader2 className="w-4 h-4 animate-spin" />
                {getProcessingText()}
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => { setSelectedPayment("beans"); handleConfirmPayment(); }}
                  disabled={!hasEnoughBeans}
                  className="flex-1 py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <BeansIcon />
                  {t("KAKA豆支付", "KAKA Beans")}
                </button>
                <button
                  onClick={() => { setSelectedPayment("wechat"); handleConfirmPayment(); }}
                  className="flex-1 py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 bg-[#07C160] text-white hover:bg-[#06AD56] transition-colors"
                >
                  <WeChatIcon />
                  {t("微信支付", "WeChat Pay")}
                </button>
              </div>
            )}
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
