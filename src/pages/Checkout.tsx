import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, ChevronRight, Loader2, Sparkles, Clock, Gift } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/hooks/use-toast";

// Mock user beans balance
const userBeansBalance = 124050;
const beansToRMB = (beans: number) => (beans / 100).toFixed(2);

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

// Mock product specs data
const getProductSpecs = (nameZh: string) => {
  const specsMap: Record<string, { origin: string; roast: string; process: string; flavor: string; caffeine: string }> = {
    "经典美式": { origin: "埃塞俄比亚 耶加雪菲", roast: "中度烘焙", process: "水洗处理", flavor: "柑橘 · 花香 · 明亮酸质", caffeine: "~150mg" },
    "拿铁": { origin: "哥伦比亚 慧兰", roast: "中深烘焙", process: "水洗处理", flavor: "焦糖 · 坚果 · 巧克力", caffeine: "~120mg" },
    "卡布奇诺": { origin: "巴西 喜拉多", roast: "中度烘焙", process: "日晒处理", flavor: "坚果 · 可可 · 奶油感", caffeine: "~120mg" },
    "澳白": { origin: "危地马拉 安提瓜", roast: "中深烘焙", process: "水洗处理", flavor: "太妃糖 · 烟草 · 饱满", caffeine: "~130mg" },
    "椰子拿铁": { origin: "印尼 曼特宁", roast: "深度烘焙", process: "湿刨处理", flavor: "椰香 · 黑巧 · 香料", caffeine: "~120mg" },
    "脏脏拿铁": { origin: "巴西+哥伦比亚 拼配", roast: "深度烘焙", process: "日晒拼配", flavor: "浓郁巧克力 · 烟熏 · 厚重", caffeine: "~140mg" },
    "抹茶拿铁": { origin: "日本宇治 一番摘", roast: "—", process: "石磨研磨", flavor: "海苔 · 鲜甜 · 奶香", caffeine: "~70mg" },
    "玫瑰拿铁": { origin: "云南 保山", roast: "浅中烘焙", process: "蜜处理", flavor: "玫瑰 · 蜂蜜 · 柔和", caffeine: "~100mg" },
  };
  return specsMap[nameZh] || { origin: "精选产区", roast: "中度烘焙", process: "精细处理", flavor: "均衡 · 顺滑", caffeine: "~120mg" };
};

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart, totalItems } = useCart();
  const { t } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<"idle" | "redirecting" | "processing" | "verifying">("idle");

  const deliveryFee = 2;
  const couponDiscount = 3;
  const finalPrice = totalPrice - couponDiscount + deliveryFee;

  const totalBeansNeeded = finalPrice * 100;
  const hasEnoughBeans = userBeansBalance >= totalBeansNeeded;

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
        {/* Delivery Address */}
        <section className="p-4 rounded-2xl bg-white/[0.04] border border-white/8">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
              <MapPin className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground text-sm">张三</span>
                <span className="text-muted-foreground text-sm">138****8888</span>
              </div>
              <p className="text-muted-foreground text-xs mt-1 leading-relaxed">
                {t("朝阳区建国路88号SOHO现代城A座 12层1208室", "Building A, SOHO Modern City, No.88 Jianguo Rd, Floor 12, Room 1208")}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
          </div>
        </section>

        {/* Blind Box Info */}
        <section className="p-4 rounded-2xl bg-gradient-to-br from-primary/8 to-violet-600/5 border border-primary/15">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="w-4 h-4 text-primary" />
            <span className="font-semibold text-foreground text-sm">{t("盲盒体验", "Blind Box")}</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="w-3.5 h-3.5 text-primary/70" />
              <span>{t("下单后将随机匹配附近优质咖啡馆", "Randomly matched to a nearby quality café")}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5 text-primary/70" />
              <span>{t("商家接单后即刻揭晓专属咖啡馆", "Your café is revealed once order is accepted")}</span>
            </div>
          </div>
        </section>

        {/* Product Cards with Full Details */}
        {items.map((item) => {
          const specs = getProductSpecs(item.nameZh);
          return (
            <section key={item.id} className="rounded-2xl bg-white/[0.04] border border-white/8 overflow-hidden">
              {/* Product Header */}
              <div className="p-4 flex gap-3">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
                  <img src={item.image} alt={item.nameZh} className="w-full h-full object-cover" />
                </div>
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
                <div className="flex flex-col items-end justify-between flex-shrink-0">
                  <span className="text-primary font-bold text-sm">¥{item.price}</span>
                  <span className="text-muted-foreground text-xs">x{item.quantity}</span>
                </div>
              </div>

              {/* Product Specs */}
              <div className="px-4 pb-4">
                <div className="bg-white/[0.03] rounded-xl p-3 space-y-2">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-1 h-3 bg-primary rounded-full" />
                    <span className="text-xs font-medium text-foreground">{t("产品规格", "Specifications")}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-[11px] text-muted-foreground">{t("产地", "Origin")}</span>
                    </div>
                    <span className="text-[11px] text-foreground text-right">{specs.origin}</span>

                    <div className="flex justify-between">
                      <span className="text-[11px] text-muted-foreground">{t("烘焙", "Roast")}</span>
                    </div>
                    <span className="text-[11px] text-foreground text-right">{specs.roast}</span>

                    <div className="flex justify-between">
                      <span className="text-[11px] text-muted-foreground">{t("处理法", "Process")}</span>
                    </div>
                    <span className="text-[11px] text-foreground text-right">{specs.process}</span>

                    <div className="flex justify-between">
                      <span className="text-[11px] text-muted-foreground">{t("风味", "Flavor")}</span>
                    </div>
                    <span className="text-[11px] text-foreground text-right">{specs.flavor}</span>

                    <div className="flex justify-between">
                      <span className="text-[11px] text-muted-foreground">{t("咖啡因", "Caffeine")}</span>
                    </div>
                    <span className="text-[11px] text-foreground text-right">{specs.caffeine}</span>
                  </div>
                </div>
              </div>
            </section>
          );
        })}

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
