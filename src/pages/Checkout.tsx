import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, ChevronRight, Loader2, Clock, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAddress } from "@/contexts/AddressContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/hooks/use-toast";

// Mock user beans balance
const userBeansBalance = 124050;

const WeChatIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#07C160">
    <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89l-.002-.002-.404-.04zm-2.086 2.672c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.97.983.976.976 0 0 1-.968-.983c0-.542.433-.982.969-.982z" />
  </svg>
);

const BeansIcon = () => (
  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary/80 to-violet-600 flex items-center justify-center">
    <span className="text-[10px] font-bold text-white">K</span>
  </div>
);

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart, totalItems } = useCart();
  const { selectedAddress } = useAddress();
  const { t } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<"idle" | "redirecting" | "processing" | "verifying">("idle");
  const [remark, setRemark] = useState("");

  const deliveryFee = 2;
  const couponDiscount = 3;
  const finalPrice = totalPrice - couponDiscount + deliveryFee;

  const totalBeansNeeded = finalPrice * 100;
  const hasEnoughBeans = userBeansBalance >= totalBeansNeeded;

  const maskPhone = (phone: string) =>
    phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");

  if (totalItems === 0) {
    navigate("/");
    return null;
  }

  const handlePayment = async (method: "wechat" | "beans") => {
    setIsProcessing(true);

    if (method === "beans") {
      setProcessingStep("processing");
      await new Promise(r => setTimeout(r, 1500));
      if (hasEnoughBeans) {
        setProcessingStep("verifying");
        await new Promise(r => setTimeout(r, 800));
        toast({
          title: t("支付成功", "Payment Successful"),
          description: t(`已扣除 ${totalBeansNeeded.toLocaleString()} KAKA豆`, `${totalBeansNeeded.toLocaleString()} KAKA Beans deducted`),
        });
        clearCart();
        navigate("/order-tracking");
      } else {
        setIsProcessing(false);
        setProcessingStep("idle");
        toast({ title: t("支付失败", "Payment Failed"), description: t("KAKA豆余额不足", "Insufficient KAKA Beans"), variant: "destructive" });
      }
    } else {
      setProcessingStep("redirecting");
      await new Promise(r => setTimeout(r, 1200));
      setProcessingStep("processing");
      await new Promise(r => setTimeout(r, 2000));
      const isSuccess = Math.random() > 0.1;
      if (isSuccess) {
        setProcessingStep("verifying");
        await new Promise(r => setTimeout(r, 800));
        toast({
          title: t("支付成功", "Payment Successful"),
          description: t("微信支付完成", "WeChat payment completed"),
        });
        clearCart();
        navigate("/order-tracking");
      } else {
        setIsProcessing(false);
        setProcessingStep("idle");
        toast({ title: t("支付失败", "Payment Failed"), description: t("支付已取消或超时，请重试", "Payment cancelled or timed out"), variant: "destructive" });
      }
    }
  };

  const getProcessingText = () => {
    switch (processingStep) {
      case "redirecting": return t("正在跳转微信...", "Redirecting to WeChat...");
      case "processing": return t("正在处理支付...", "Processing payment...");
      case "verifying": return t("验证支付结果...", "Verifying payment...");
      default: return "";
    }
  };

  const address = selectedAddress;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border safe-top flex-shrink-0">
        <div className="flex items-center px-4 py-3">
          <button onClick={() => navigate(-1)} className="p-1.5 -ml-1 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="flex-1 text-center font-semibold text-foreground text-base">
            {t("确认订单", "Confirm Order")}
          </h1>
          <div className="w-8" />
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-32 scrollbar-hide">
        {/* Delivery Address - clickable to address management */}
        <section
          className="p-4 rounded-2xl bg-white/[0.04] border border-white/8 cursor-pointer active:bg-white/[0.08] transition-colors"
          onClick={() => navigate("/address")}
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
              <MapPin className="w-4 h-4 text-primary" />
            </div>
            {address ? (
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground text-sm">{address.name}</span>
                  <span className="text-muted-foreground text-sm">{maskPhone(address.phone)}</span>
                </div>
                <p className="text-muted-foreground text-xs mt-1 leading-relaxed">
                  {t(
                    `${address.district}${address.detail}`,
                    `${address.detailEn}, ${address.districtEn}`
                  )}
                </p>
              </div>
            ) : (
              <div className="flex-1 min-w-0">
                <span className="text-muted-foreground text-sm">{t("请选择收货地址", "Select delivery address")}</span>
              </div>
            )}
            <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
          </div>
        </section>

        {/* Product Cards - compact with tags only, no image, no detailed specs */}
        {items.map((item) => (
          <section key={item.id} className="rounded-2xl bg-white/[0.04] border border-white/8 overflow-hidden">
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-sm">{t(item.nameZh, item.nameEn)}</h3>
                  <p className="text-muted-foreground text-xs uppercase tracking-wide">{item.nameEn}</p>
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    <span className="text-[10px] px-2 py-0.5 bg-primary/15 text-primary rounded-full font-medium">
                      {t("中杯 360ml", "Medium 360ml")}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 bg-secondary text-muted-foreground rounded-full">
                      {t("冰", "Iced")}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 bg-secondary text-muted-foreground rounded-full">
                      {t("标准糖", "Normal Sugar")}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between flex-shrink-0 ml-3">
                  <span className="text-primary font-bold text-sm">¥{item.price}</span>
                  <span className="text-muted-foreground text-xs mt-2">x{item.quantity}</span>
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* Order Remark */}
        <section className="p-4 rounded-2xl bg-white/[0.04] border border-white/8">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">{t("订单备注", "Order Remark")}</span>
          </div>
          <textarea
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder={t("如需特殊要求请在此备注，如：少冰、加浓等", "Add special requests here, e.g. less ice, extra shot...")}
            className="w-full bg-white/[0.03] border border-white/8 rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:border-primary/30 transition-colors"
            rows={2}
            maxLength={200}
          />
          <div className="text-right mt-1">
            <span className="text-[10px] text-muted-foreground">{remark.length}/200</span>
          </div>
        </section>

        {/* Price Breakdown */}
        <section className="p-4 rounded-2xl bg-white/[0.04] border border-white/8 space-y-2.5">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t("商品金额", "Subtotal")}</span>
            <span className="text-foreground">¥{totalPrice}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t("优惠券", "Coupon")}</span>
            <span className="text-primary">-¥{couponDiscount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t("配送费", "Delivery")}</span>
            <span className="text-foreground">¥{deliveryFee}</span>
          </div>
          <div className="h-px bg-border" />
          <div className="flex justify-between items-center">
            <span className="font-semibold text-foreground">{t("实付", "Total")}</span>
            <span className="text-xl font-bold text-primary">¥{finalPrice}</span>
          </div>
        </section>
      </div>

      {/* Fixed Bottom Payment Buttons */}
      <div className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-border safe-bottom">
        <div className="px-4 py-3 max-w-md mx-auto">
          {isProcessing ? (
            <button disabled className="w-full py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 bg-muted text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              {getProcessingText()}
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => handlePayment("beans")}
                disabled={!hasEnoughBeans}
                className="flex-1 py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <BeansIcon />
                {t("KAKA豆支付", "KAKA Beans")}
              </button>
              <button
                onClick={() => handlePayment("wechat")}
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
  );
};

export default Checkout;
