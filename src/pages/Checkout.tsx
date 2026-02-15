import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, ChevronRight, Loader2, MessageSquare, CupSoda, Thermometer, Flame, Snowflake, FlaskConical, Droplets } from "lucide-react";
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

// Product spec data matching homepage catalog exactly
type SpecTag = { icon: string; labelZh: string; labelEn: string };
interface ProductSpec {
  tagZh: string;
  tagEn: string;
  specZh?: string;
  specEn?: string;
  specTags?: SpecTag[];
  isCreative?: boolean;
}

const productSpecs: Record<string, ProductSpec> = {
  "hot-americano": { tagZh: "油脂完整 醇厚回甘", tagEn: "Rich crema, smooth finish", specZh: "360ml 热 中深烘焙", specEn: "360ml Hot Medium-Dark" },
  "iced-americano": { tagZh: "酸质明亮 清脆鲜爽", tagEn: "Bright acidity, crisp & fresh", specZh: "360ml 冰 中深烘焙", specEn: "360ml Iced Medium-Dark" },
  "hot-latte": { tagZh: "奶泡绵密 丝滑平衡", tagEn: "Silky foam, perfectly balanced", specZh: "360ml 热 中深烘焙", specEn: "360ml Hot Medium-Dark" },
  "iced-latte": { tagZh: "坚果韵律 清晰透亮", tagEn: "Nutty notes, crystal clear", specZh: "360ml 冰 中深烘焙", specEn: "360ml Iced Medium-Dark" },
  "cappuccino": { tagZh: "结构蓬松 啡味穿透", tagEn: "Fluffy structure, bold flavor", specZh: "240ml 热 中深烘焙", specEn: "240ml Hot Medium-Dark" },
  "flat-white": { tagZh: "极薄奶沫 致密醇厚", tagEn: "Thin microfoam, rich & dense", specZh: "240ml 热 中深烘焙", specEn: "240ml Hot Medium-Dark" },
  "palo-santo-latte": { tagZh: "秘鲁圣木 · 雪松檀香黑巧克力", tagEn: "Sacred wood · cedar sandalwood dark chocolate", isCreative: true, specTags: [{ icon: "cup", labelZh: "360ml", labelEn: "360ml" }, { icon: "snowflake", labelZh: "冰", labelEn: "Iced" }, { icon: "flask", labelZh: "真空慢煮", labelEn: "Sous-vide" }] },
  "koji-latte": { tagZh: "第五味觉 · 发酵糯米味噌麦芽", tagEn: "Umami · fermented rice miso malt", isCreative: true, specTags: [{ icon: "cup", labelZh: "360ml", labelEn: "360ml" }, { icon: "snowflake", labelZh: "冰", labelEn: "Iced" }, { icon: "flask", labelZh: "恒温发酵", labelEn: "Koji Ferm." }] },
  "rock-salt-fermented": { tagZh: "发酵反叛 · 希腊酸奶海盐芝士", tagEn: "Fermented rebellion · yogurt sea salt cheese", isCreative: true, specTags: [{ icon: "cup", labelZh: "360ml", labelEn: "360ml" }, { icon: "snowflake", labelZh: "冰", labelEn: "Iced" }, { icon: "flask", labelZh: "乳酸发酵", labelEn: "Lacto Ferm." }] },
  "glass-latte": { tagZh: "奶洗澄清 · 丝滑橙花熟成菠萝", tagEn: "Milk-washed · silky orange blossom pineapple", isCreative: true, specTags: [{ icon: "cup", labelZh: "360ml", labelEn: "360ml" }, { icon: "snowflake", labelZh: "冰", labelEn: "Iced" }, { icon: "droplets", labelZh: "奶洗澄清", labelEn: "Milk Wash" }] },
};

const specTagIconMap: Record<string, typeof Snowflake> = {
  snowflake: Snowflake,
  cup: CupSoda,
  flask: FlaskConical,
  droplets: Droplets,
  flame: Flame,
};

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

  const renderSpecFooter = (itemId: string) => {
    const spec = productSpecs[itemId];
    if (!spec) return null;

    if (spec.isCreative && spec.specTags) {
      return (
        <div className="flex items-center gap-2 text-purple-300/50 text-[9px]">
          {spec.specTags.map((tag, i) => {
            const TagIcon = specTagIconMap[tag.icon];
            return (
              <span key={i} className="flex items-center gap-0.5">
                {TagIcon && <TagIcon className="w-[9px] h-[9px]" strokeWidth={1.5} />}
                {t(tag.labelZh, tag.labelEn)}
              </span>
            );
          })}
        </div>
      );
    }

    if (spec.specZh) {
      const partsZh = spec.specZh.split(" ");
      const partsEn = (spec.specEn || "").split(" ");
      return (
        <div className="flex items-center gap-2 text-violet-400/40 text-[9px]">
          <span className="flex items-center gap-0.5">
            <CupSoda className="w-[9px] h-[9px]" strokeWidth={1.5} />
            {t(partsZh[0], partsEn[0])}
          </span>
          <span className="flex items-center gap-0.5">
            <Thermometer className="w-[9px] h-[9px]" strokeWidth={1.5} />
            {t(partsZh[1], partsEn[1])}
          </span>
          <span className="flex items-center gap-0.5">
            <Flame className="w-[9px] h-[9px]" strokeWidth={1.5} />
            {t(partsZh[2], partsEn[2])}
          </span>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border safe-top flex-shrink-0">
        <div className="flex items-center px-4 py-3">
          <button onClick={() => navigate(-1)} className="p-1.5 -ml-1 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="flex-1 text-center font-semibold text-foreground text-sm">
            {t("确认订单", "Confirm Order")}
          </h1>
          <div className="w-8" />
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5 pb-32 scrollbar-hide">
        {/* Delivery Address */}
        <section
          className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/8 cursor-pointer active:bg-white/[0.08] transition-colors"
          onClick={() => navigate("/address", { state: { from: "/checkout" } })}
        >
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-primary" />
            </div>
            {address ? (
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground text-sm">{address.name}</span>
                  <span className="text-muted-foreground text-xs">{maskPhone(address.phone)}</span>
                </div>
                <p className="text-muted-foreground text-[11px] mt-0.5 leading-relaxed">
                  {t(
                    `${address.district}${address.detail}`,
                    `${address.detailEn}, ${address.districtEn}`
                  )}
                </p>
              </div>
            ) : (
              <div className="flex-1 min-w-0 py-1">
                <span className="text-muted-foreground text-sm">{t("请选择收货地址", "Select delivery address")}</span>
              </div>
            )}
            <ChevronRight className="w-4 h-4 text-muted-foreground/50 flex-shrink-0 mt-1" />
          </div>
        </section>

        {/* Product Items */}
        {items.map((item) => {
          const spec = productSpecs[item.id];
          const isCreative = spec?.isCreative;
          return (
            <section
              key={item.id}
              className={`rounded-2xl overflow-hidden border ${
                isCreative
                  ? "border-primary/20 bg-gradient-to-br from-primary/8 via-violet-950/20 to-purple-950/10"
                  : "border-white/8 bg-white/[0.04]"
              }`}
            >
              <div className="p-3.5">
                {/* Name + Price row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-sm leading-tight">
                      {t(item.nameZh, item.nameEn)}
                    </h3>
                    <p className="text-[10px] text-muted-foreground/50 uppercase tracking-wider mt-0.5">
                      {item.nameEn}
                    </p>
                  </div>
                  <div className="flex flex-col items-end shrink-0">
                    <span className="text-foreground font-bold text-base drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                      ¥{item.price}
                    </span>
                    <span className="text-muted-foreground/50 text-[10px] mt-0.5">x{item.quantity}</span>
                  </div>
                </div>

                {/* Flavor tag */}
                {spec && (
                  <p className={`text-[10px] mt-1.5 leading-snug ${
                    isCreative ? "text-purple-300/45" : "text-violet-300/40"
                  }`}>
                    {t(spec.tagZh, spec.tagEn)}
                  </p>
                )}

                {/* Spec tags footer - matching homepage exactly */}
                <div className="mt-2 pt-1.5 border-t border-white/5">
                  {renderSpecFooter(item.id)}
                </div>
              </div>
            </section>
          );
        })}

        {/* Order Remark */}
        <section className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/8">
          <div className="flex items-center gap-1.5 mb-2">
            <MessageSquare className="w-3.5 h-3.5 text-violet-400/50" />
            <span className="text-[11px] font-medium text-foreground/80">{t("订单备注", "Order Remark")}</span>
          </div>
          <textarea
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder={t("如需特殊要求请在此备注，如：少冰、加浓等", "Special requests: less ice, extra shot...")}
            className="w-full bg-white/[0.03] border border-white/6 rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/30 resize-none focus:outline-none focus:border-primary/30 transition-colors"
            rows={2}
            maxLength={200}
          />
          <div className="text-right mt-0.5">
            <span className="text-[9px] text-muted-foreground/30">{remark.length}/200</span>
          </div>
        </section>

        {/* Price Breakdown */}
        <section className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/8 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground/60">{t("商品金额", "Subtotal")}</span>
            <span className="text-foreground/80">¥{totalPrice}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground/60">{t("优惠券", "Coupon")}</span>
            <span className="text-primary">-¥{couponDiscount}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground/60">{t("配送费", "Delivery")}</span>
            <span className="text-foreground/80">¥{deliveryFee}</span>
          </div>
          <div className="h-[0.5px] bg-violet-500/15" />
          <div className="flex justify-between items-center">
            <span className="font-semibold text-foreground text-sm">{t("实付", "Total")}</span>
            <span className="text-lg font-bold text-primary drop-shadow-[0_0_12px_rgba(127,0,255,0.3)]">¥{finalPrice}</span>
          </div>
        </section>
      </div>

      {/* Fixed Bottom Payment Buttons */}
      <div className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-border safe-bottom">
        <div className="px-4 py-3 max-w-md mx-auto">
          {isProcessing ? (
            <button disabled className="w-full py-3 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 bg-muted text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              {getProcessingText()}
            </button>
          ) : (
            <div className="flex gap-2.5">
              <button
                onClick={() => handlePayment("beans")}
                disabled={!hasEnoughBeans}
                className="flex-1 py-3 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <BeansIcon />
                {t("KAKA豆支付", "KAKA Beans")}
              </button>
              <button
                onClick={() => handlePayment("wechat")}
                className="flex-1 py-3 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 bg-[#07C160] text-white hover:bg-[#06AD56] transition-colors"
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
