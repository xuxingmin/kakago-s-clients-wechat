import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft, ChevronDown, ChevronUp, Phone, MessageSquare,
  Send, HelpCircle, Coffee, ShieldCheck, Truck, CreditCard, Gift, Info
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { BrandBanner } from "@/components/BrandBanner";
import { Header } from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useOrders } from "@/hooks/useOrders";
import { useAuth } from "@/contexts/AuthContext";

interface FAQItem {
  questionZh: string;
  questionEn: string;
  answerZh: string;
  answerEn: string;
  icon: React.ReactNode;
}

const faqSections: { titleZh: string; titleEn: string; items: FAQItem[] }[] = [
  {
    titleZh: "咖啡盲盒",
    titleEn: "Coffee Blind Box",
    items: [
      {
        questionZh: "什么是咖啡盲盒？",
        questionEn: "What is a Coffee Blind Box?",
        answerZh: "TRIVA咖啡盲盒是一种全新的咖啡体验方式。您选择想喝的咖啡品类（如拿铁、美式等），系统会从附近合作的精品咖啡馆中随机匹配一家来为您制作，直到商家接单后才会揭晓是哪家咖啡馆，给您带来惊喜体验！",
        answerEn: "TRIVA Coffee Blind Box is a new way to enjoy coffee. You choose the coffee type (like Latte, Americano), and the system randomly matches a nearby boutique café to prepare it. The café's identity is revealed only after the merchant accepts the order — a delightful surprise!",
        icon: <Gift className="w-3.5 h-3.5 text-primary" />,
      },
      {
        questionZh: "盲盒咖啡的品质有保障吗？",
        questionEn: "Is the quality of blind box coffee guaranteed?",
        answerZh: "绝对有保障！所有合作商家都经过严格审核，包括咖啡机型号、食品许可证、日均出杯量等多维度筛选。我们还有多维度评分系统（口味、时效、包装），持续监控品质。",
        answerEn: "Absolutely! All partner merchants undergo strict verification including coffee machine models, food permits, and daily cup capacity. We also use a multi-dimensional rating system (taste, timeliness, packaging) for continuous quality monitoring.",
        icon: <ShieldCheck className="w-3.5 h-3.5 text-primary" />,
      },
      {
        questionZh: "我可以选择特定的咖啡馆吗？",
        questionEn: "Can I choose a specific café?",
        answerZh: "盲盒模式下不可以指定咖啡馆，这正是盲盒的乐趣所在！系统会根据您的位置、商家评分和忙碌程度智能匹配最佳商家。",
        answerEn: "You cannot specify a café in blind box mode — that's the fun! The system intelligently matches the best merchant based on your location, merchant ratings, and availability.",
        icon: <Coffee className="w-3.5 h-3.5 text-primary" />,
      },
    ],
  },
  {
    titleZh: "订单与配送",
    titleEn: "Orders & Delivery",
    items: [
      {
        questionZh: "下单后多久能收到？",
        questionEn: "How long until delivery after ordering?",
        answerZh: "通常在20-40分钟内送达，具体时间取决于商家制作速度和配送距离。您可以在订单追踪页面实时查看订单状态和骑手位置。",
        answerEn: "Usually delivered within 20-40 minutes, depending on preparation time and delivery distance. You can track order status and rider location in real-time on the order tracking page.",
        icon: <Truck className="w-3.5 h-3.5 text-primary" />,
      },
      {
        questionZh: "如何取消订单？",
        questionEn: "How to cancel an order?",
        answerZh: "商家接单前可免费取消；商家接单后、骑手取餐前可申请取消（可能收取部分费用）；骑手取餐后无法取消。请在订单详情页操作。",
        answerEn: "Free cancellation before merchant accepts; cancellation may incur partial charges after acceptance but before pickup; no cancellation after rider pickup. Manage this in order details.",
        icon: <HelpCircle className="w-3.5 h-3.5 text-primary" />,
      },
      {
        questionZh: "配送范围是多少？",
        questionEn: "What is the delivery radius?",
        answerZh: "目前配送范围为您所在位置5公里内的合作商家。如果附近暂无可用商家，系统会提示您服务暂不可用。",
        answerEn: "Currently we deliver from partner merchants within 5km of your location. If no merchants are available nearby, the system will notify you that service is temporarily unavailable.",
        icon: <Truck className="w-3.5 h-3.5 text-primary" />,
      },
    ],
  },
  {
    titleZh: "支付与退款",
    titleEn: "Payment & Refunds",
    items: [
      {
        questionZh: "支持哪些支付方式？",
        questionEn: "What payment methods are supported?",
        answerZh: "目前支持微信支付。咖啡钱包余额也可用于支付订单，享受额外折扣。",
        answerEn: "Currently WeChat Pay is supported. Coffee Wallet balance can also be used for orders with additional discounts.",
        icon: <CreditCard className="w-3.5 h-3.5 text-primary" />,
      },
      {
        questionZh: "如何申请退款？",
        questionEn: "How to request a refund?",
        answerZh: "如遇品质问题，可在订单完成后24小时内通过订单详情页申请退款，客服会在1-3个工作日内处理。退款将原路返回。",
        answerEn: "For quality issues, request a refund within 24 hours of order completion via order details. Customer service will process within 1-3 business days. Refunds return to original payment method.",
        icon: <CreditCard className="w-3.5 h-3.5 text-primary" />,
      },
    ],
  },
  {
    titleZh: "TRIVA豆与优惠",
    titleEn: "TRIVA Beans & Offers",
    items: [
      {
        questionZh: "TRIVA豆怎么获得和使用？",
        questionEn: "How to earn and use TRIVA Beans?",
        answerZh: "每笔订单完成后自动获得TRIVA豆奖励；邀请好友、参与活动也可获得额外豆子。TRIVA豆可用于兑换优惠券、抵扣订单金额等。",
        answerEn: "Earn TRIVA Beans automatically after each completed order; also from inviting friends and events. Use them to redeem coupons or offset order amounts.",
        icon: <Gift className="w-3.5 h-3.5 text-primary" />,
      },
      {
        questionZh: "优惠券怎么使用？",
        questionEn: "How to use coupons?",
        answerZh: "在结算页面选择可用优惠券即可自动抵扣。优惠券有使用期限和最低消费门槛，请在有效期内使用。",
        answerEn: "Select available coupons at checkout for automatic deduction. Coupons have expiry dates and minimum spend thresholds — use them before they expire!",
        icon: <Gift className="w-3.5 h-3.5 text-primary" />,
      },
    ],
  },
];

const HelpSupport = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"faq" | "feedback" | "about">("faq");
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackContact, setFeedbackContact] = useState("");
  const [deleteModal, setDeleteModal] = useState<null | "blocked" | "confirm">(null);
  const { user, signOut } = useAuth();
  const { orders } = useOrders();

  const hasActiveOrder = orders.some((o) =>
    ["pending", "preparing", "delivering", "after_sales", "appealing"].includes(o.status as string)
  );

  const handleDeleteClick = () => {
    if (!user) {
      toast.error(t("请先登录", "Please log in first"));
      return;
    }
    setDeleteModal(hasActiveOrder ? "blocked" : "confirm");
  };

  const handleConfirmDelete = async () => {
    setDeleteModal(null);
    await signOut();
    toast.success(t("账号注销申请已提交", "Account deletion request submitted"));
    navigate("/");
  };

  const toggleFAQ = (key: string) => {
    setOpenFAQ(openFAQ === key ? null : key);
  };

  const handleFeedbackSubmit = () => {
    if (!feedbackText.trim()) {
      toast.error(t("请输入反馈内容", "Please enter feedback"));
      return;
    }
    toast.success(t("感谢您的反馈！我们会尽快处理", "Thanks for your feedback! We'll process it soon"));
    setFeedbackText("");
    setFeedbackContact("");
  };

  const tabs = [
    { key: "faq" as const, labelZh: "常见问题", labelEn: "FAQ" },
    { key: "feedback" as const, labelZh: "意见反馈", labelEn: "Feedback" },
    { key: "about" as const, labelZh: "关于我们", labelEn: "About" },
  ];

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-shrink-0">
        <Header />
        <BrandBanner />
        <div className="fog-divider mx-4" />
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* Title row */}
        <div className="px-4 pt-3 pb-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="w-7 h-7 rounded-full bg-secondary/60 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h2 className="text-sm font-medium text-muted-foreground">
              {t("帮助与支持", "Help & Support")}
            </h2>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 mt-2">
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeTab === tab.key
                    ? "bg-primary text-primary-foreground shadow-[0_0_12px_hsla(271,81%,56%,0.4)]"
                    : "bg-secondary/60 text-muted-foreground hover:text-foreground"
                }`}
              >
                {t(tab.labelZh, tab.labelEn)}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Tab */}
        {activeTab === "faq" && (
          <section className="px-4 mt-3 pb-24 space-y-3 max-w-md mx-auto">
            {faqSections.map((section, sIdx) => (
              <div key={sIdx}>
                <h3 className="text-xs font-semibold text-foreground mb-2">
                  {t(section.titleZh, section.titleEn)}
                </h3>
                <div className="card-lg !p-0 overflow-hidden">
                  {section.items.map((item, iIdx) => {
                    const key = `${sIdx}-${iIdx}`;
                    const isOpen = openFAQ === key;
                    return (
                      <div
                        key={key}
                        className={iIdx !== section.items.length - 1 ? "border-b border-border" : ""}
                      >
                        <button
                          onClick={() => toggleFAQ(key)}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-accent/50 transition-colors"
                        >
                          <div className="w-6 h-6 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                            {item.icon}
                          </div>
                          <span className="flex-1 text-left text-xs font-medium text-foreground">
                            {t(item.questionZh, item.questionEn)}
                          </span>
                          {isOpen ? (
                            <ChevronUp className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="px-3 pb-3 pt-0">
                            <div className="ml-8 text-[11px] leading-relaxed text-muted-foreground bg-secondary/40 rounded-xl p-2.5">
                              {t(item.answerZh, item.answerEn)}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Contact */}
            <div>
              <h3 className="text-xs font-semibold text-foreground mb-2">
                {t("联系客服", "Contact Us")}
              </h3>
              <div className="card-lg !p-3">
                <a
                  href="tel:400-888-KAKA"
                  className="flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 rounded-2xl bg-primary/15 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-foreground">
                      {t("客服热线", "Customer Hotline")}
                    </p>
                    <p className="text-[11px] text-muted-foreground">400-888-KAKA</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {t("工作日 9:00-21:00", "Weekdays 9:00-21:00")}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center group-hover:bg-primary/25 transition-colors">
                    <Phone className="w-4 h-4 text-primary" />
                  </div>
                </a>
                <div className="fog-divider my-2.5" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary/15 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-foreground">
                      {t("微信客服", "WeChat Support")}
                    </p>
                    <p className="text-[11px] text-muted-foreground">TRIVA_Service</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {t("添加微信获取在线支持", "Add WeChat for online support")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account deletion entry */}
            <div className="pt-6 flex justify-center">
              <button
                onClick={handleDeleteClick}
                className="text-[11px] underline underline-offset-4 text-[#b2b2b2] hover:text-muted-foreground transition-colors"
              >
                {t("注销账号", "Delete Account")}
              </button>
            </div>
          </section>
        )}

        {/* Feedback Tab */}
        {activeTab === "feedback" && (
          <section className="px-4 mt-3 pb-24 max-w-md mx-auto space-y-3">
            <div className="card-lg !p-3 space-y-3">
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">
                  {t("反馈内容", "Feedback")}
                </label>
                <Textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder={t(
                    "请描述您遇到的问题或建议（至少10个字）",
                    "Describe your issue or suggestion (min 10 chars)"
                  )}
                  className="min-h-[120px] text-xs bg-secondary/40 border-border/50 resize-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">
                  {t("联系方式（选填）", "Contact (optional)")}
                </label>
                <Input
                  value={feedbackContact}
                  onChange={(e) => setFeedbackContact(e.target.value)}
                  placeholder={t("手机号或微信号", "Phone or WeChat ID")}
                  className="text-xs bg-secondary/40 border-border/50"
                />
              </div>
              <Button
                onClick={handleFeedbackSubmit}
                className="w-full rounded-2xl h-10 text-xs font-semibold"
              >
                <Send className="w-3.5 h-3.5 mr-1.5" />
                {t("提交反馈", "Submit Feedback")}
              </Button>
            </div>

            <div className="card-lg !p-3">
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                {t(
                  "💡 提示：如遇紧急问题（如订单异常、配送延迟），建议直接拨打客服热线 400-888-KAKA 获取更快速的帮助。",
                  "💡 Tip: For urgent issues (order problems, delivery delays), call our hotline 400-888-KAKA for faster help."
                )}
              </p>
            </div>
          </section>
        )}

        {/* About Tab */}
        {activeTab === "about" && (
          <section className="px-4 mt-3 pb-24 max-w-md mx-auto space-y-3">
            <div className="card-lg !p-4 text-center">
              <div className="w-14 h-14 rounded-3xl bg-primary/15 flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_hsla(271,81%,56%,0.2)]">
                <Coffee className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-base font-bold text-foreground">TRIVA</h3>
              <p className="text-[11px] text-primary font-medium mt-0.5">
                {t("咖啡盲盒 · 每一杯都是惊喜", "Coffee Blind Box · Every Cup a Surprise")}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">v1.0.0</p>
            </div>

            <div className="card-lg !p-3 space-y-3">
              <div>
                <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-primary" />
                  {t("品牌故事", "Our Story")}
                </h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed mt-1.5">
                  {t(
                    "TRIVA 诞生于对精品咖啡的热爱与对未知惊喜的追求。我们相信，每一杯咖啡都承载着咖啡师的匠心，而盲盒模式让您有机会发现身边那些隐藏的宝藏咖啡馆。我们严选每一位合作伙伴，确保每一杯都超出期待。",
                    "TRIVA was born from a love for specialty coffee and a pursuit of delightful surprises. We believe every cup carries the barista's craftsmanship, and the blind box model helps you discover hidden gem cafés nearby. We carefully select every partner to ensure every cup exceeds expectations."
                  )}
                </p>
              </div>

              <div className="fog-divider" />

              <div>
                <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                  {t("品质承诺", "Quality Promise")}
                </h4>
                <ul className="mt-1.5 space-y-1">
                  {[
                    { zh: "🔍 严格审核每家合作咖啡馆", en: "🔍 Rigorous café partner verification" },
                    { zh: "⭐ 多维度评分持续监控品质", en: "⭐ Multi-dimensional quality monitoring" },
                    { zh: "🚀 智能匹配最优商家和骑手", en: "🚀 Smart matching for best merchants & riders" },
                    { zh: "💰 不满意可申请退款保障", en: "💰 Satisfaction guarantee with refund support" },
                  ].map((item, i) => (
                    <li key={i} className="text-[11px] text-muted-foreground">
                      {t(item.zh, item.en)}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="fog-divider" />

              <div>
                <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-primary" />
                  {t("我们的愿景", "Our Vision")}
                </h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed mt-1.5">
                  {t(
                    "让每个人都能轻松享受身边的精品咖啡，用惊喜连接咖啡爱好者与独立咖啡馆，打造一个充满温度的咖啡社区。",
                    "Making specialty coffee accessible to everyone, connecting coffee lovers with independent cafés through delightful surprises, and building a warm coffee community."
                  )}
                </p>
              </div>
            </div>

            <p className="text-center text-[10px] text-muted-foreground pb-2">
              © 2025 TRIVA. All rights reserved.
            </p>
          </section>
        )}
      </div>

      <div className="flex-shrink-0">
        <BottomNav />
      </div>
    </div>
  );
};

export default HelpSupport;
