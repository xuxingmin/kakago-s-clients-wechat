import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Coffee, Shield, TrendingUp, Users, Upload, Check, Phone, Loader2, Sparkles, ChevronRight, Zap, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { BottomNav } from "@/components/BottomNav";

type Step = "intro" | "verify" | "info" | "success";

const MerchantAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [step, setStep] = useState<Step>("intro");
  const [loading, setLoading] = useState(false);

  // Phone verification state
  const [phone, setPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Merchant info state
  const [ownerName, setOwnerName] = useState("");
  const [ownerNameEn, setOwnerNameEn] = useState("");
  const [storeName, setStoreName] = useState("");
  const [storeNameEn, setStoreNameEn] = useState("");
  const [storeAddress, setStoreAddress] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [greetingMessage, setGreetingMessage] = useState("");
  const [storeFeatures, setStoreFeatures] = useState("");
  const [coffeeMachine, setCoffeeMachine] = useState("");
  const [grinderModel, setGrinderModel] = useState("");
  const [dailyPeakCups, setDailyPeakCups] = useState("");
  const [businessHoursOpen, setBusinessHoursOpen] = useState("09:00");
  const [businessHoursClose, setBusinessHoursClose] = useState("22:00");
  const [closedDays, setClosedDays] = useState<string[]>([]);
  const [closedDaysOpen, setClosedDaysOpen] = useState(false);
  const [businessLicense, setBusinessLicense] = useState<File | null>(null);
  const [foodPermit, setFoodPermit] = useState<File | null>(null);
  const [storefrontPhoto, setStorefrontPhoto] = useState<File | null>(null);

  const businessLicenseRef = useRef<HTMLInputElement>(null);
  const foodPermitRef = useRef<HTMLInputElement>(null);
  const storefrontPhotoRef = useRef<HTMLInputElement>(null);

  const benefits = [
    {
      emoji: "🛡️",
      title: t("独立咖啡守护", "Defending Independent Coffee"),
      desc: t("抵抗工业化连锁的吞噬，用分布式的力量，捍卫属于独立咖啡馆的生存空间。", "Resist industrial chains. Use distributed power to defend independent café space."),
      accent: true,
    },
    {
      emoji: "🏰",
      title: t("门店绝对独立", "Full Store Autonomy"),
      desc: t("保持原有的价格体系与菜单独立，拒绝平台强制打折。零平台裹挟，无经营负担。", "Keep your pricing & menu. No forced discounts. Zero platform lock-in."),
    },
    {
      emoji: "⚡️",
      title: t("闲置产能变现", "Monetize Idle Capacity"),
      desc: t("告别低谷期打苍蝇。精准填补非高峰期产能，为你带来持续、稳定的额外收入。", "Fill off-peak gaps with steady, stable extra revenue."),
    },
    {
      emoji: "🎯",
      title: t("精准用户引流", "Precision Customer Acquisition"),
      desc: t("拒绝一次性羊毛党。为你精准输送真正懂咖啡的高质量客群，用好风味沉淀出高频复购的死忠粉。", "No one-time bargain hunters. We deliver quality coffee lovers who become loyal repeat customers."),
    },
    {
      emoji: "🤖",
      title: t("AI 智能托管", "AI-Powered Operations"),
      desc: t("统一部署品控与包材。无需操心叫货与营销设置。无入驻门槛，你只管专注萃取出杯。", "Unified QC & packaging. No ordering or marketing hassle. Just focus on brewing."),
    },
  ];

  const weekDays = [
    { value: "mon", label: t("周一", "Mon") },
    { value: "tue", label: t("周二", "Tue") },
    { value: "wed", label: t("周三", "Wed") },
    { value: "thu", label: t("周四", "Thu") },
    { value: "fri", label: t("周五", "Fri") },
    { value: "sat", label: t("周六", "Sat") },
    { value: "sun", label: t("周日", "Sun") },
  ];

  const toggleClosedDay = (day: string) => {
    setClosedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  // Send verification code
  const handleSendCode = async () => {
    if (!phone || phone.length !== 11) {
      toast({ title: t("请输入正确的手机号", "Please enter a valid phone number"), variant: "destructive" });
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setCodeSent(true);
    setCountdown(60);
    setLoading(false);
    toast({ title: t("验证码已发送", "Code sent") });
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      toast({ title: t("请输入6位验证码", "Please enter 6-digit code"), variant: "destructive" });
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    setStep("info");
  };

  const uploadFile = async (file: File, path: string): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${path}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const { data, error } = await supabase.storage.from("merchant-documents").upload(fileName, file);
    if (error) throw error;
    const { data: urlData } = supabase.storage.from("merchant-documents").getPublicUrl(data.path);
    return urlData.publicUrl;
  };

  const handleSubmit = async () => {
    if (!storeName || !ownerName || !storeAddress || !coffeeMachine || !businessLicense || !foodPermit) {
      toast({ title: t("请填写完整信息", "Please complete all fields"), variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const uploadPromises: Promise<string>[] = [
        uploadFile(businessLicense, "licenses"),
        uploadFile(foodPermit, "permits"),
      ];
      if (storefrontPhoto) {
        uploadPromises.push(uploadFile(storefrontPhoto, "storefronts"));
      }
      const [licenseUrl, permitUrl, storefrontUrl] = await Promise.all(uploadPromises);
      const { error } = await supabase.from("merchant_applications").insert({
        phone,
        owner_name: ownerName,
        store_name: storeName,
        store_name_en: storeNameEn || null,
        store_address: storeAddress,
        store_description: storeDescription || null,
        greeting_message: greetingMessage || null,
        store_features: storeFeatures || "",
        coffee_machine_model: coffeeMachine,
        grinder_model: grinderModel || null,
        daily_peak_cups: 0,
        business_hours: { open: businessHoursOpen, close: businessHoursClose, closed_days: closedDays },
        business_license_url: licenseUrl,
        food_permit_url: permitUrl,
        storefront_photo_url: storefrontUrl || null,
      });
      if (error) throw error;
      setStep("success");
    } catch (error) {
      console.error("Submit error:", error);
      toast({ title: t("提交失败，请重试", "Submission failed"), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // ══════════════════════════════════════════
  // STEP: INTRO — Why Join TRIVA
  // ══════════════════════════════════════════
  if (step === "intro") {
    return (
      <div className="h-screen flex flex-col overflow-hidden">
        {/* Fixed Header with Back */}
        <div className="flex-shrink-0 px-4 pt-3 pb-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="w-7 h-7 rounded-full bg-secondary/60 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h2 className="text-sm font-medium text-muted-foreground">{t("成为合作商家", "Become a Partner")}</h2>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {/* Hero - compressed */}
          <div className="relative bg-gradient-to-b from-primary/20 via-background to-background pt-5 pb-2 px-5 text-center">
            <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto mb-1.5">
              <Coffee className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-[17px] font-bold text-foreground mb-0.5">
              {t("接入 TRIVA 咖啡网络", "Join the TRIVA Coffee Network")}
            </h1>
            <p className="text-xs text-muted-foreground leading-snug max-w-[300px] mx-auto">
              {t("让闲置产能变现，成为全城精品咖啡基础设施。", "Monetize idle capacity. Become citywide specialty coffee infrastructure.")}
            </p>
            {/* Key Tags */}
            <div className="flex justify-center gap-2 mt-2.5">
              {[
                t("0 入驻门槛", "0 Barrier"),
                t("稳定收入增量", "Steady Revenue"),
                t("保持门店独立", "Stay Independent"),
              ].map((tag, i) => (
                <span key={i} className="text-[10px] font-medium text-primary bg-primary/10 border border-primary/20 rounded-full px-2.5 py-0.5">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Benefits — 5 cards */}
          <div className="px-4 pt-1 pb-2 space-y-2">
            {benefits.map((b, i) => (
              <div
                key={i}
                className={`rounded-xl px-4 py-3.5 border transition-all ${
                  (b as any).accent
                    ? "bg-primary/10 border-primary/30"
                    : "bg-secondary/50 border-transparent"
                }`}
                style={(b as any).accent ? { boxShadow: '0 0 20px hsl(271 81% 56% / 0.15)' } : undefined}
              >
                <h3 className="text-sm font-bold text-foreground mb-1 tracking-tight">
                  <span className="mr-1.5">{b.emoji}</span>{b.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed pl-6">{b.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="px-4 pb-24 pt-2">
            <button
              onClick={() => setStep("verify")}
              className="w-full py-3 rounded-xl btn-gold text-sm font-semibold flex items-center justify-center gap-2"
            >
              <Coffee className="w-4 h-4" />
              {t("立即申请接入网络", "Apply to Join Network")}
              <ChevronRight className="w-4 h-4" />
            </button>
            <p className="text-center text-[9px] text-muted-foreground/50 mt-1.5">
              {t("提交申请后，24小时内将有工作人员与您联系", "Our team will contact you within 24 hours")}
            </p>
          </div>
        </div>

        <div className="flex-shrink-0">
          <BottomNav />
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════
  // STEP: VERIFY — Phone Verification
  // ══════════════════════════════════════════
  if (step === "verify") {
    return (
      <div className="h-screen flex flex-col overflow-hidden">
        <div className="flex-shrink-0">
          <div className="px-4 pt-3 pb-1">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setStep("intro")}
                className="w-7 h-7 rounded-full bg-secondary/60 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h2 className="text-sm font-medium text-muted-foreground">{t("验证手机号", "Verify Phone")}</h2>
            </div>
          </div>

          <div className="pt-14 pb-4 px-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-3">
              <Phone className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-lg font-bold text-white mb-1">{t("验证手机号", "Verify Phone")}</h2>
            <p className="text-[11px] text-white/50">{t("我们将发送验证码到您的手机", "We'll send a code to your phone")}</p>
          </div>
          <div className="fog-divider mx-4" />
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4">
          <div className="card-md space-y-4">
            {/* Phone input */}
            <div>
              <label className="text-[10px] text-white/50 mb-1.5 block">{t("手机号", "Phone")}</label>
              <div className="flex gap-2">
                <input
                  type="tel"
                  placeholder={t("请输入11位手机号", "11-digit phone")}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
                  maxLength={11}
                  className="flex-1 px-3 py-2.5 rounded-xl bg-secondary text-white text-xs placeholder:text-white/30 outline-none focus:ring-1 focus:ring-primary/50"
                />
                <button
                  onClick={handleSendCode}
                  disabled={loading || countdown > 0 || phone.length !== 11}
                  className="px-4 py-2.5 rounded-xl text-xs font-medium bg-primary/10 text-primary border border-primary/30 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {countdown > 0 ? `${countdown}s` : t("发送", "Send")}
                </button>
              </div>
            </div>

            {/* Code input */}
            {codeSent && (
              <div className="animate-fade-in">
                <label className="text-[10px] text-white/50 mb-1.5 block">{t("验证码", "Code")}</label>
                <input
                  type="text"
                  placeholder={t("请输入6位验证码", "6-digit code")}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  maxLength={6}
                  className="w-full px-3 py-2.5 rounded-xl bg-secondary text-white text-sm text-center tracking-[0.3em] placeholder:text-white/30 placeholder:tracking-normal outline-none focus:ring-1 focus:ring-primary/50 font-mono"
                />
              </div>
            )}

            <button
              onClick={handleVerifyCode}
              disabled={!codeSent || verificationCode.length !== 6 || loading}
              className="w-full py-3 rounded-xl btn-gold text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t("下一步", "Next")}
            </button>
          </div>
        </div>

        <div className="flex-shrink-0">
          <BottomNav />
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════
  // STEP: INFO — Merchant Information
  // ══════════════════════════════════════════
  // Progress indicator for info step
  const infoFields = [storeName, storeAddress, ownerName, coffeeMachine];
  const optionalFilled = [storeNameEn, storeDescription, grinderModel, greetingMessage].filter(Boolean).length;
  const requiredFilled = infoFields.filter(Boolean).length;
  const docsUploaded = [businessLicense, foodPermit].filter(Boolean).length;
  const totalProgress = Math.round(((requiredFilled + docsUploaded + Math.min(optionalFilled, 3)) / (4 + 2 + 3)) * 100);

  const encourageText = totalProgress < 30
    ? t("🚀 开始吧！几分钟搞定", "🚀 Let's go! Just a few minutes")
    : totalProgress < 60
    ? t("⚡ 太棒了，继续保持！", "⚡ Awesome, keep going!")
    : totalProgress < 90
    ? t("🔥 马上就好！胜利在望", "🔥 Almost there! Victory ahead")
    : t("✨ 就差最后一步了！", "✨ One last step!");

  const inputCls = "w-full px-3 py-2.5 rounded-xl bg-secondary text-white text-xs placeholder:text-white/25 outline-none focus:ring-1 focus:ring-primary/50 transition-all";

  if (step === "info") {
    return (
      <div className="h-screen flex flex-col overflow-hidden">
        <div className="flex-shrink-0">
          <div className="px-4 pt-3 pb-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStep("verify")}
                  className="w-7 h-7 rounded-full bg-secondary/60 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h2 className="text-sm font-medium text-muted-foreground">{t("接入信息", "Setup")}</h2>
              </div>
              <span className="text-[10px] text-primary font-semibold">{totalProgress}%</span>
            </div>
            {/* Progress bar */}
            <div className="mt-1.5 h-1 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500"
                style={{ width: `${totalProgress}%` }}
              />
            </div>
            <p className="text-[10px] text-primary/80 mt-1 text-center font-medium">{encourageText}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-3 pb-24 space-y-2.5">

          {/* ── 1. Store Identity ── */}
          <div className="card-md space-y-2.5">
            <div className="flex items-center gap-1.5">
              <span className="text-sm">☕</span>
              <h3 className="text-xs font-bold text-white">{t("你的咖啡馆", "Your Café")}</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input placeholder={t("店名 *", "Café name *")} value={storeName} onChange={(e) => setStoreName(e.target.value)} className={inputCls} />
              <input placeholder={t("英文名/拼音", "English/Pinyin")} value={storeNameEn} onChange={(e) => setStoreNameEn(e.target.value)} className={inputCls} />
            </div>
            <input placeholder={t("门店地址 *  如：朝阳区建国路88号SOHO现代城B座1层", "Address *  e.g. B1, SOHO, 88 Jianguo Rd")} value={storeAddress} onChange={(e) => setStoreAddress(e.target.value)} className={inputCls} />
            <textarea
              placeholder={t("一句话介绍  如：藏在胡同里的手冲实验室", "Bio  e.g. A pour-over lab hidden in a hutong")}
              value={storeDescription}
              onChange={(e) => setStoreDescription(e.target.value)}
              rows={2}
              className={`${inputCls} resize-none`}
            />
          </div>

          {/* ── 2. Owner ── */}
          <div className="card-md space-y-2.5">
            <div className="flex items-center gap-1.5">
              <span className="text-sm">👤</span>
              <h3 className="text-xs font-bold text-white">{t("主理人", "Owner")}</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input placeholder={t("中文名 *  如：韩梅梅", "Chinese *  e.g. 韩梅梅")} value={ownerName} onChange={(e) => setOwnerName(e.target.value)} className={inputCls} />
              <input placeholder={t("拼音/英文  MEIMEI HAN", "Pinyin  MEIMEI HAN")} value={ownerNameEn} onChange={(e) => setOwnerNameEn(e.target.value)} className={inputCls} />
            </div>
            <input
              placeholder={t("店家寄语  如：愿这杯带来今日份好心情", "Greeting  e.g. May this cup bring joy")}
              value={greetingMessage}
              onChange={(e) => setGreetingMessage(e.target.value)}
              className={inputCls}
            />
            <p className="text-[9px] text-white/20 pl-1">{t("用户收到订单时看到这句话 ☕", "Shown when customers receive orders ☕")}</p>
          </div>

          {/* ── 3. Equipment ── */}
          <div className="card-md space-y-2.5">
            <div className="flex items-center gap-1.5">
              <span className="text-sm">⚙️</span>
              <h3 className="text-xs font-bold text-white">{t("设备", "Equipment")}</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input placeholder={t("咖啡机 *  La Marzocco", "Machine *  La Marzocco")} value={coffeeMachine} onChange={(e) => setCoffeeMachine(e.target.value)} className={inputCls} />
              <input placeholder={t("磨豆机  Mahlkönig EK43", "Grinder  EK43")} value={grinderModel} onChange={(e) => setGrinderModel(e.target.value)} className={inputCls} />
            </div>
          </div>

          {/* ── 4. Hours ── */}
          <div className="card-md space-y-2.5">
            <div className="flex items-center gap-1.5">
              <span className="text-sm">🕐</span>
              <h3 className="text-xs font-bold text-white">{t("营业时间", "Hours")}</h3>
            </div>
            <div className="flex items-center gap-2">
              <input type="time" value={businessHoursOpen} onChange={(e) => setBusinessHoursOpen(e.target.value)} className={`flex-1 ${inputCls}`} />
              <span className="text-white/30 text-xs">—</span>
              <input type="time" value={businessHoursClose} onChange={(e) => setBusinessHoursClose(e.target.value)} className={`flex-1 ${inputCls}`} />
            </div>
            <div>
              <label className="text-[10px] text-white/30 mb-1.5 block">{t("店休日", "Days off")}</label>
              <div className="flex flex-wrap gap-1.5">
                {weekDays.map((day) => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => toggleClosedDay(day.value)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                      closedDays.includes(day.value)
                        ? "bg-primary/20 text-primary border border-primary/40"
                        : "bg-secondary text-white/40 border border-transparent"
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── 5. Documents ── */}
          <div className="card-md">
            <div className="flex items-center gap-1.5 mb-2.5">
              <span className="text-sm">📋</span>
              <h3 className="text-xs font-bold text-white">{t("证件上传", "Documents")}</h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { ref: businessLicenseRef, file: businessLicense, set: setBusinessLicense, label: t("营业执照 *", "License *"), accept: "image/*,.pdf" },
                { ref: foodPermitRef, file: foodPermit, set: setFoodPermit, label: t("食品许可 *", "Permit *"), accept: "image/*,.pdf" },
                { ref: storefrontPhotoRef, file: storefrontPhoto, set: setStorefrontPhoto, label: t("门头照", "Storefront"), accept: "image/*" },
              ].map((doc, i) => (
                <div
                  key={i}
                  className={`aspect-[4/3] rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all active:scale-95 ${
                    doc.file ? "border-primary bg-primary/10" : "border-white/15 hover:border-white/30"
                  }`}
                  onClick={() => doc.ref.current?.click()}
                >
                  <input ref={doc.ref} type="file" accept={doc.accept} className="hidden" onChange={(e) => doc.set(e.target.files?.[0] || null)} />
                  {doc.file ? (
                    <>
                      <Check className="w-5 h-5 text-primary mb-0.5" />
                      <span className="text-[9px] text-primary">✓</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 text-white/25 mb-0.5" />
                      <span className="text-[9px] text-white/25">{doc.label}</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── Submit ── */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3.5 rounded-xl btn-gold text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-40 mt-1"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
              <>
                <Sparkles className="w-4 h-4" />
                {t("提交，加入网络！", "Submit & Join!")}
              </>
            )}
          </button>
          <p className="text-center text-[9px] text-white/20 pb-4">
            {t("提交后 24h 内 Fellow 伙伴联系你 🤝", "A Fellow will reach out within 24h 🤝")}
          </p>
        </div>

        <div className="flex-shrink-0">
          <BottomNav />
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════
  // STEP: SUCCESS
  // ══════════════════════════════════════════
  if (step === "success") {
    return (
      <div className="h-screen flex flex-col overflow-hidden">
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-5">
              <Check className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              {t("申请已提交", "Application Submitted")}
            </h2>
            <p className="text-xs text-white/50 leading-relaxed max-w-[260px] mx-auto mb-8">
              {t(
                "24小时内将有 TRIVA 的 Fellow 伙伴与您联系，请保持手机畅通",
                "A TRIVA Fellow will contact you within 24 hours"
              )}
            </p>
            <button
              onClick={() => navigate("/")}
              className="w-full py-3 rounded-xl btn-gold text-sm font-semibold"
            >
              {t("返回首页", "Back to Home")}
            </button>
          </div>
        </div>

        <div className="flex-shrink-0">
          <BottomNav />
        </div>
      </div>
    );
  }

  return null;
};

export default MerchantAuth;
