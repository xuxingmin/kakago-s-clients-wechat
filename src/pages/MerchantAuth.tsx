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
  const [storeFeatures, setStoreFeatures] = useState("");
  const [coffeeMachine, setCoffeeMachine] = useState("");
  const [dailyPeakCups, setDailyPeakCups] = useState("");
  const [businessHoursOpen, setBusinessHoursOpen] = useState("09:00");
  const [businessHoursClose, setBusinessHoursClose] = useState("22:00");
  const [businessLicense, setBusinessLicense] = useState<File | null>(null);
  const [foodPermit, setFoodPermit] = useState<File | null>(null);

  const businessLicenseRef = useRef<HTMLInputElement>(null);
  const foodPermitRef = useRef<HTMLInputElement>(null);

  const benefits = [
    {
      icon: TrendingUp,
      title: t("精准流量", "Targeted Traffic"),
      desc: t("盲盒模式带来高质量咖啡爱好者", "Mystery box attracts quality coffee lovers"),
      stat: "85%",
      statLabel: t("转化率", "Conversion"),
    },
    {
      icon: Shield,
      title: t("品质保障", "Quality Assurance"),
      desc: t("严选合作，维护高端品牌调性", "Curated partners, premium positioning"),
      stat: "A+",
      statLabel: t("品牌评级", "Brand Grade"),
    },
    {
      icon: Users,
      title: t("社群赋能", "Community Power"),
      desc: t("精品咖啡联盟，共享行业资源", "Specialty coffee alliance, shared resources"),
      stat: "10K+",
      statLabel: t("活跃用户", "Active Users"),
    },
    {
      icon: Zap,
      title: t("智能调度", "Smart Dispatch"),
      desc: t("AI驱动订单分配，平衡产能", "AI-powered order distribution"),
      stat: "< 3min",
      statLabel: t("平均响应", "Avg Response"),
    },
  ];

  const stats = [
    { value: "200+", label: t("合作商户", "Partners") },
    { value: "50K+", label: t("日均订单", "Daily Orders") },
    { value: "4.9", label: t("平均评分", "Avg Rating") },
  ];

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
    if (!ownerName || !storeFeatures || !coffeeMachine || !dailyPeakCups || !businessLicense || !foodPermit) {
      toast({ title: t("请填写完整信息", "Please complete all fields"), variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const [licenseUrl, permitUrl] = await Promise.all([
        uploadFile(businessLicense, "licenses"),
        uploadFile(foodPermit, "permits"),
      ]);
      const { error } = await supabase.from("merchant_applications").insert({
        phone,
        owner_name: ownerName,
        store_features: storeFeatures,
        coffee_machine_model: coffeeMachine,
        daily_peak_cups: parseInt(dailyPeakCups),
        business_hours: { open: businessHoursOpen, close: businessHoursClose },
        business_license_url: licenseUrl,
        food_permit_url: permitUrl,
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
  // STEP: INTRO — Why Join KAKAGO
  // ══════════════════════════════════════════
  if (step === "intro") {
    return (
      <div className="h-screen flex flex-col overflow-hidden">
        {/* Back button */}
        <div className="absolute top-3 left-4 z-50 safe-top">
          <button onClick={() => navigate(-1)} className="w-8 h-8 rounded-full bg-secondary/80 backdrop-blur flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Hero - compact */}
        <div className="flex-shrink-0 relative bg-gradient-to-b from-primary/20 via-background to-background pt-12 pb-3 px-5 text-center">
          <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto mb-2">
            <Coffee className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-lg font-bold text-white mb-1">
            {t("成为 KAKAGO 合作商家", "Become a KAKAGO Partner")}
          </h1>
          <p className="text-[11px] text-white/50 leading-snug max-w-[250px] mx-auto">
            {t("与精品咖啡盲盒平台携手，让更多咖啡爱好者发现您的独特风味", "Partner with our mystery coffee platform")}
          </p>
          <div className="flex justify-center gap-8 mt-3">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-base font-black text-primary">{s.value}</p>
                <p className="text-[9px] text-white/40">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits - compact list */}
        <div className="flex-1 flex flex-col px-4 pt-1 pb-2 space-y-1.5 overflow-hidden">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <div key={i} className="flex items-center gap-3 rounded-xl bg-secondary/60 px-3 py-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-semibold text-white">{b.title}</h3>
                  <p className="text-[10px] text-white/45 leading-tight">{b.desc}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-black text-primary">{b.stat}</span>
                  <p className="text-[8px] text-white/35">{b.statLabel}</p>
                </div>
              </div>
            );
          })}

          {/* Testimonial - inline compact */}
          <div className="flex items-start gap-2 rounded-xl bg-secondary/60 border border-primary/15 px-3 py-2.5">
            <Sparkles className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
            <div className="min-w-0">
              <div className="flex items-center gap-0.5 mb-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-2.5 h-2.5 text-primary fill-primary" />
                ))}
              </div>
              <p className="text-[10px] text-white/60 leading-snug italic">
                {t("\"加入KAKAGO三个月，日均订单增长了40%，品牌曝光度大幅提升。\"", '"3 months: 40% order growth, massive brand exposure."')}
              </p>
              <p className="text-[9px] text-white/35 mt-0.5">— {t("合肥某精品咖啡馆主理人", "Hefei café owner")}</p>
            </div>
          </div>
        </div>

        {/* CTA - fixed bottom */}
        <div className="flex-shrink-0 px-4 pb-2 pt-1">
          <button
            onClick={() => setStep("verify")}
            className="w-full py-3 rounded-xl btn-gold text-sm font-semibold flex items-center justify-center gap-2"
          >
            <Coffee className="w-4 h-4" />
            {t("立即入驻", "Apply Now")}
            <ChevronRight className="w-4 h-4" />
          </button>
          <p className="text-center text-[9px] text-white/30 mt-1.5">
            {t("提交申请后，24小时内将有工作人员与您联系", "Our team will contact you within 24 hours")}
          </p>
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
          <div className="absolute top-3 left-4 z-50 safe-top">
            <button onClick={() => setStep("intro")} className="w-8 h-8 rounded-full bg-secondary/80 backdrop-blur flex items-center justify-center">
              <ArrowLeft className="w-4 h-4 text-white" />
            </button>
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
  if (step === "info") {
    return (
      <div className="h-screen flex flex-col overflow-hidden">
        <div className="flex-shrink-0">
          <div className="absolute top-3 left-4 z-50 safe-top">
            <button onClick={() => setStep("verify")} className="w-8 h-8 rounded-full bg-secondary/80 backdrop-blur flex items-center justify-center">
              <ArrowLeft className="w-4 h-4 text-white" />
            </button>
          </div>

          <div className="pt-14 pb-3 px-5">
            <h2 className="text-lg font-bold text-white">{t("填写商户信息", "Merchant Info")}</h2>
            <p className="text-[11px] text-white/50 mt-0.5">{t("完善以下信息，加速审核流程", "Complete info to expedite review")}</p>
          </div>
          <div className="fog-divider mx-4" />
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-3 space-y-2">
          {/* Document Upload */}
          <div className="card-md">
            <h3 className="text-xs font-semibold text-white mb-3">{t("证件上传", "Documents")}</h3>
            <div className="grid grid-cols-2 gap-2">
              <div
                className={`aspect-[4/3] rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
                  businessLicense ? "border-primary bg-primary/10" : "border-white/20 hover:border-white/40"
                }`}
                onClick={() => businessLicenseRef.current?.click()}
              >
                <input ref={businessLicenseRef} type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => setBusinessLicense(e.target.files?.[0] || null)} />
                {businessLicense ? (
                  <>
                    <Check className="w-5 h-5 text-primary mb-1" />
                    <span className="text-[10px] text-primary">{t("已上传", "Uploaded")}</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 text-white/40 mb-1" />
                    <span className="text-[10px] text-white/40">{t("营业执照", "License")}</span>
                  </>
                )}
              </div>
              <div
                className={`aspect-[4/3] rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
                  foodPermit ? "border-primary bg-primary/10" : "border-white/20 hover:border-white/40"
                }`}
                onClick={() => foodPermitRef.current?.click()}
              >
                <input ref={foodPermitRef} type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => setFoodPermit(e.target.files?.[0] || null)} />
                {foodPermit ? (
                  <>
                    <Check className="w-5 h-5 text-primary mb-1" />
                    <span className="text-[10px] text-primary">{t("已上传", "Uploaded")}</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 text-white/40 mb-1" />
                    <span className="text-[10px] text-white/40">{t("食品许可证", "Food Permit")}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Owner Info */}
          <div className="card-md space-y-3">
            <h3 className="text-xs font-semibold text-white">{t("主理人信息", "Owner Info")}</h3>
            <div>
              <label className="text-[10px] text-white/50 mb-1 block">{t("主理人名称", "Name")} *</label>
              <input
                placeholder={t("您的称呼", "Your name")}
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-secondary text-white text-xs placeholder:text-white/30 outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="text-[10px] text-white/50 mb-1 block">{t("本店特色", "Features")} *</label>
              <textarea
                placeholder={t("介绍您的咖啡馆特色...", "Describe your café...")}
                value={storeFeatures}
                onChange={(e) => setStoreFeatures(e.target.value)}
                rows={3}
                className="w-full px-3 py-2.5 rounded-xl bg-secondary text-white text-xs placeholder:text-white/30 outline-none focus:ring-1 focus:ring-primary/50 resize-none"
              />
            </div>
          </div>

          {/* Equipment */}
          <div className="card-md space-y-3">
            <h3 className="text-xs font-semibold text-white">{t("设备与产能", "Equipment")}</h3>
            <div>
              <label className="text-[10px] text-white/50 mb-1 block">{t("咖啡机型号", "Machine")} *</label>
              <input
                placeholder="La Marzocco Linea PB"
                value={coffeeMachine}
                onChange={(e) => setCoffeeMachine(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-secondary text-white text-xs placeholder:text-white/30 outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="text-[10px] text-white/50 mb-1 block">{t("日峰值杯数", "Peak Cups")} *</label>
              <input
                type="number"
                placeholder={t("预估每日最大产能", "Max daily capacity")}
                value={dailyPeakCups}
                onChange={(e) => setDailyPeakCups(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-secondary text-white text-xs placeholder:text-white/30 outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>
          </div>

          {/* Hours */}
          <div className="card-md space-y-3">
            <h3 className="text-xs font-semibold text-white">{t("营业时间", "Hours")}</h3>
            <div className="flex items-center gap-2">
              <input
                type="time"
                value={businessHoursOpen}
                onChange={(e) => setBusinessHoursOpen(e.target.value)}
                className="flex-1 px-3 py-2.5 rounded-xl bg-secondary text-white text-xs outline-none focus:ring-1 focus:ring-primary/50"
              />
              <span className="text-white/40 text-xs">{t("至", "to")}</span>
              <input
                type="time"
                value={businessHoursClose}
                onChange={(e) => setBusinessHoursClose(e.target.value)}
                className="flex-1 px-3 py-2.5 rounded-xl bg-secondary text-white text-xs outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3.5 rounded-xl btn-gold text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-40 mt-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t("提交审核", "Submit for Review")}
          </button>

          <p className="text-center text-[10px] text-white/30 pb-4">
            {t("审核通常需要1-3个工作日", "Review typically takes 1-3 business days")}
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
                "24小时内将有 KAKAGO 的 Fellow 伙伴与您联系，请保持手机畅通",
                "A KAKAGO Fellow will contact you within 24 hours"
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
