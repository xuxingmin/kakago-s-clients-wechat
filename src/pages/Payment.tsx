import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Loader2, Shield, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/hooks/use-toast";

const WeChatIcon = ({ size = 20 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="#07C160">
    <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89l-.002-.002-.404-.04zm-2.086 2.672c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.97.983.976.976 0 0 1-.968-.983c0-.542.433-.982.969-.982z" />
  </svg>
);

const AlipayIcon = ({ size = 20 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="#1677FF">
    <path d="M21.422 14.763c-1.512-.534-3.56-1.215-5.281-1.768.603-1.158 1.079-2.44 1.381-3.807h-3.67V7.766h4.596V6.96h-4.596V4.5h-2.163c-.272 0-.272.272-.272.272V6.96H6.74v.806h4.677v1.422H7.354v.806h7.753c-.244.98-.586 1.897-1.01 2.715-2.596-.77-5.574-1.367-7.702-.45-2.226.96-3.266 3.07-2.754 4.888.512 1.818 2.524 2.936 4.7 2.528 2.438-.457 4.294-2.386 5.67-4.937 2.088.87 4.804 1.939 4.804 1.939l.607-1.914zM9.07 18.715c-1.794.39-3.362-.395-3.661-1.574-.3-1.178.663-2.636 2.614-3.12 1.45-.36 3.053-.14 4.68.357-1.17 2.44-2.544 4.098-3.633 4.337z" />
  </svg>
);

type PaymentMethod = "wechat" | "alipay";
type PaymentState = "selecting" | "processing" | "success" | "failed";

const COUNTDOWN_SECONDS = 300; // 5 minutes

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCart();
  const { t } = useLanguage();

  const paymentInfo = (location.state as {
    totalPrice: number;
    beansDeduction: number;
    beansUsed: number;
    itemCount: number;
  }) || { totalPrice: 0, beansDeduction: 0, beansUsed: 0, itemCount: 0 };

  const cashToPay = Math.max(0, paymentInfo.totalPrice - paymentInfo.beansDeduction);

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("wechat");
  const [paymentState, setPaymentState] = useState<PaymentState>("selecting");
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);

  // Countdown timer
  useEffect(() => {
    if (paymentState !== "selecting") return;
    if (countdown <= 0) {
      navigate(-1);
      toast({ title: t("订单超时", "Order Timeout"), description: t("支付超时，请重新下单", "Payment timed out, please reorder"), variant: "destructive" });
      return;
    }
    const timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown, paymentState, navigate, t]);

  const formatCountdown = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const handleConfirmPay = useCallback(async () => {
    setPaymentState("processing");

    // Simulate payment gateway
    await new Promise(r => setTimeout(r, 2500));

    const isSuccess = Math.random() > 0.1;
    if (isSuccess) {
      setPaymentState("success");
      await new Promise(r => setTimeout(r, 1500));
      clearCart();
      navigate("/order-tracking", { replace: true });
    } else {
      setPaymentState("failed");
    }
  }, [clearCart, navigate]);

  if (paymentInfo.totalPrice === 0) {
    navigate("/");
    return null;
  }

  const methods: { id: PaymentMethod; icon: React.ReactNode; nameZh: string; nameEn: string; descZh: string; descEn: string }[] = [
    {
      id: "wechat",
      icon: <WeChatIcon size={24} />,
      nameZh: "微信支付",
      nameEn: "WeChat Pay",
      descZh: "推荐 · 免手续费",
      descEn: "Recommended · No fees",
    },
    {
      id: "alipay",
      icon: <AlipayIcon size={24} />,
      nameZh: "支付宝",
      nameEn: "Alipay",
      descZh: "花呗 · 余额 · 银行卡",
      descEn: "Balance · Bank card",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border safe-top flex-shrink-0">
        <div className="flex items-center px-4 py-3">
          <button
            onClick={() => paymentState === "selecting" ? navigate(-1) : undefined}
            className="p-1.5 -ml-1 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
            disabled={paymentState !== "selecting"}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="flex-1 text-center font-semibold text-foreground text-sm">
            {t("收银台", "Cashier")}
          </h1>
          <div className="w-8" />
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {paymentState === "selecting" && (
          <div className="px-4 py-4 space-y-4">
            {/* Amount Display */}
            <div className="text-center py-6">
              <p className="text-muted-foreground/60 text-xs mb-2">{t("支付金额", "Amount to Pay")}</p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-muted-foreground/60 text-lg">¥</span>
                <span className="text-4xl font-bold text-foreground tracking-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                  {cashToPay.toFixed(2)}
                </span>
              </div>
              {paymentInfo.beansUsed > 0 && (
                <p className="text-primary/60 text-[10px] mt-2">
                  {t(`已使用 ${paymentInfo.beansUsed.toLocaleString()} KAKA豆抵扣 ¥${paymentInfo.beansDeduction.toFixed(2)}`, `${paymentInfo.beansUsed.toLocaleString()} beans deducted ¥${paymentInfo.beansDeduction.toFixed(2)}`)}
                </p>
              )}
              {/* Countdown */}
              <div className="flex items-center justify-center gap-1.5 mt-3">
                <Clock className="w-3 h-3 text-muted-foreground/40" />
                <span className="text-[11px] text-muted-foreground/50 font-mono">
                  {t(`请在 ${formatCountdown(countdown)} 内完成支付`, `Pay within ${formatCountdown(countdown)}`)}
                </span>
              </div>
            </div>

            {/* Payment Methods */}
            <div>
              <h3 className="text-[11px] text-muted-foreground/50 mb-2 px-1">
                {t("选择支付方式", "Payment Method")}
              </h3>
              <div className="space-y-2">
                {methods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border transition-all ${
                      selectedMethod === method.id
                        ? "border-primary/40 bg-primary/5"
                        : "border-white/8 bg-white/[0.04] hover:bg-white/[0.06]"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center shrink-0">
                      {method.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <span className="text-sm font-medium text-foreground">{t(method.nameZh, method.nameEn)}</span>
                      <p className="text-[10px] text-muted-foreground/40 mt-0.5">{t(method.descZh, method.descEn)}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      selectedMethod === method.id
                        ? "border-primary bg-primary"
                        : "border-white/20"
                    }`}>
                      {selectedMethod === method.id && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Security Notice */}
            <div className="flex items-center justify-center gap-1.5 py-2">
              <Shield className="w-3 h-3 text-muted-foreground/30" />
              <span className="text-[9px] text-muted-foreground/30">
                {t("支付环境安全 · 数据加密传输", "Secure payment · Encrypted connection")}
              </span>
            </div>
          </div>
        )}

        {/* Processing State */}
        {paymentState === "processing" && (
          <div className="flex flex-col items-center justify-center py-24 px-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 animate-pulse">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
            <h2 className="text-foreground font-semibold text-base mb-2">
              {t("正在处理支付...", "Processing payment...")}
            </h2>
            <p className="text-muted-foreground/50 text-xs text-center">
              {t("请勿关闭页面，等待支付结果", "Please wait, do not close this page")}
            </p>
          </div>
        )}

        {/* Success State */}
        {paymentState === "success" && (
          <div className="flex flex-col items-center justify-center py-24 px-8">
            <div className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center mb-6">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-foreground font-semibold text-base mb-2">
              {t("支付成功", "Payment Successful")}
            </h2>
            <p className="text-muted-foreground/50 text-xs text-center">
              {t("正在跳转到订单详情...", "Redirecting to order details...")}
            </p>
          </div>
        )}

        {/* Failed State */}
        {paymentState === "failed" && (
          <div className="flex flex-col items-center justify-center py-24 px-8">
            <div className="w-16 h-16 rounded-full bg-destructive/15 flex items-center justify-center mb-6">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-foreground font-semibold text-base mb-2">
              {t("支付失败", "Payment Failed")}
            </h2>
            <p className="text-muted-foreground/50 text-xs text-center mb-6">
              {t("支付未完成，请重试或更换支付方式", "Payment incomplete, please retry or change method")}
            </p>
            <div className="flex gap-3 w-full max-w-xs">
              <button
                onClick={() => {
                  setPaymentState("selecting");
                  setCountdown(COUNTDOWN_SECONDS);
                }}
                className="flex-1 py-3 rounded-2xl text-xs font-semibold border border-white/10 text-foreground/80 hover:bg-white/5 transition-colors"
              >
                {t("重新选择", "Change Method")}
              </button>
              <button
                onClick={handleConfirmPay}
                className="flex-1 py-3 rounded-2xl text-xs font-semibold bg-gradient-to-r from-primary to-violet-600 text-white hover:shadow-[0_0_20px_rgba(127,0,255,0.4)] transition-all"
              >
                {t("重试支付", "Retry")}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Pay Button - only in selecting state */}
      {paymentState === "selecting" && (
        <div className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-border safe-bottom">
          <div className="px-4 py-3 max-w-md mx-auto">
            <button
              onClick={handleConfirmPay}
              className="w-full py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-violet-600 text-white hover:shadow-[0_0_20px_rgba(127,0,255,0.4)] transition-all active:scale-[0.98]"
            >
              {t(`确认支付 ¥${cashToPay.toFixed(2)}`, `Confirm ¥${cashToPay.toFixed(2)}`)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
