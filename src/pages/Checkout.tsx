import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, ChevronRight, MessageSquare, CupSoda, Thermometer, Flame, Snowflake, FlaskConical, Droplets, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAddress } from "@/contexts/AddressContext";
import { useLanguage } from "@/contexts/LanguageContext";

// Mock user beans balance
const userBeansBalance = 124050;

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
  const { items, totalPrice, totalItems } = useCart();
  const { selectedAddress } = useAddress();
  const { t } = useLanguage();
  const [remark, setRemark] = useState("");
  const [beansToUse, setBeansToUse] = useState(0);

  const deliveryFee = 2;
  const couponDiscount = 3;
  const priceBeforeBeans = totalPrice - couponDiscount + deliveryFee;
  const beansDeduction = beansToUse / 100; // 100 beans = 1 RMB
  const finalPrice = Math.max(0, priceBeforeBeans - beansDeduction);
  const maxBeansUsable = Math.min(userBeansBalance, priceBeforeBeans * 100); // can't exceed total

  const maskPhone = (phone: string) =>
    phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");

  if (totalItems === 0) {
    navigate("/");
    return null;
  }

  const handleGoToPay = () => {
    navigate("/payment", {
      state: {
        totalPrice: finalPrice,
        beansDeduction,
        beansUsed: beansToUse,
        itemCount: totalItems,
        cartItems: items,
        address: address,
      },
    });
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

        {/* Product Items - single card, compact rows */}
        <section className="rounded-2xl bg-white/[0.04] border border-white/8 overflow-hidden divide-y divide-white/5">
          {items.map((item) => {
            const spec = productSpecs[item.id];
            return (
              <div key={item.id} className="px-3 py-2">
                {/* Row 1: Name + Price + Qty */}
                <div className="flex items-baseline justify-between gap-2">
                  <div className="flex items-baseline gap-1.5 flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-[13px] leading-tight truncate">
                      {t(item.nameZh, item.nameEn)}
                    </h3>
                    <span className="text-[8px] text-muted-foreground/40 uppercase tracking-wider shrink-0">
                      {item.nameEn}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5 shrink-0">
                    <span className="text-foreground font-bold text-[13px]">¥{item.price}</span>
                    <span className="text-muted-foreground/40 text-[10px]">x{item.quantity}</span>
                  </div>
                </div>
                {/* Row 2: Flavor */}
                {spec && (
                  <p className={`text-[9px] mt-0.5 leading-snug ${spec.isCreative ? "text-purple-300/45" : "text-violet-300/35"}`}>
                    {t(spec.tagZh, spec.tagEn)}
                  </p>
                )}
                {/* Row 3: Spec tags */}
                <div className="mt-1">
                  {renderSpecFooter(item.id)}
                </div>
              </div>
            );
          })}
        </section>

        {/* Price Breakdown with KAKA Beans deduction */}
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

          {/* KAKA Beans deduction row */}
          <div className="pt-1.5 border-t border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <BeansIcon />
                <span className="text-xs text-foreground/80">{t("KAKA豆抵扣", "KAKA Beans")}</span>
              </div>
              {beansToUse > 0 && (
                <span className="text-primary text-xs">-¥{beansDeduction.toFixed(2)}</span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <button
                onClick={() => setBeansToUse(Math.max(0, beansToUse - 100))}
                disabled={beansToUse <= 0}
                className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground hover:bg-white/10 transition-colors disabled:opacity-30"
              >
                <Minus className="w-3 h-3" />
              </button>
              <div className="flex-1 relative">
                <input
                  type="range"
                  min={0}
                  max={maxBeansUsable}
                  step={100}
                  value={beansToUse}
                  onChange={(e) => setBeansToUse(Number(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(127,0,255,0.5)]"
                />
              </div>
              <button
                onClick={() => setBeansToUse(Math.min(maxBeansUsable, beansToUse + 100))}
                disabled={beansToUse >= maxBeansUsable}
                className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground hover:bg-white/10 transition-colors disabled:opacity-30"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
            <div className="flex justify-between mt-1 text-[9px] text-muted-foreground/40">
              <span>{t(`使用 ${beansToUse.toLocaleString()} 豆`, `Use ${beansToUse.toLocaleString()} beans`)}</span>
              <span>{t(`余额 ${userBeansBalance.toLocaleString()} 豆`, `Balance: ${userBeansBalance.toLocaleString()}`)}</span>
            </div>
          </div>

          <div className="h-[0.5px] bg-violet-500/15" />
          <div className="flex justify-between items-center">
            <span className="font-semibold text-foreground text-sm">{t("实付", "Total")}</span>
            <span className="text-lg font-bold text-primary drop-shadow-[0_0_12px_rgba(127,0,255,0.3)]">¥{finalPrice.toFixed(2)}</span>
          </div>
        </section>

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
      </div>

      {/* Fixed Bottom - Single Pay Button */}
      <div className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-border safe-bottom">
        <div className="px-4 py-3 max-w-md mx-auto flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-1">
              <span className="text-muted-foreground/60 text-[10px]">{t("合计", "Total")}</span>
              <span className="text-lg font-bold text-primary drop-shadow-[0_0_12px_rgba(127,0,255,0.3)]">¥{finalPrice.toFixed(2)}</span>
            </div>
            {beansToUse > 0 && (
              <span className="text-[9px] text-primary/60">{t(`含KAKA豆抵扣 ¥${beansDeduction.toFixed(2)}`, `Incl. beans -¥${beansDeduction.toFixed(2)}`)}</span>
            )}
          </div>
          <button
            onClick={handleGoToPay}
            className="px-8 py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-violet-600 text-white hover:shadow-[0_0_20px_rgba(127,0,255,0.4)] transition-all active:scale-95"
          >
            {t("去支付", "Pay Now")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
