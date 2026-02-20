import { useState, useEffect } from "react";
import { Coffee, Loader2, ShieldCheck, ChevronRight, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

interface PhoneAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthStep = "privacy" | "phone";

export const PhoneAuthModal = ({ isOpen, onClose }: PhoneAuthModalProps) => {
  const [step, setStep] = useState<AuthStep>("privacy");
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [agreed, setAgreed] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (!isOpen) {
      // Reset on close
      setStep("privacy");
      setPhone("");
      setCode("");
      setCodeSent(false);
      setCountdown(0);
      setAgreed(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  if (!isOpen) return null;

  const handleAgree = () => {
    setAgreed(true);
    setStep("phone");
  };

  const handleSendCode = async () => {
    if (!phone || phone.length !== 11) {
      toast.error(t("请输入正确的11位手机号", "Please enter a valid 11-digit phone number"));
      return;
    }
    setLoading(true);
    // Simulate SMS sending
    await new Promise((r) => setTimeout(r, 800));
    setCodeSent(true);
    setCountdown(60);
    setLoading(false);
    toast.success(t("验证码已发送", "Verification code sent"));
  };

  const handleLogin = async () => {
    if (code.length !== 6) {
      toast.error(t("请输入6位验证码", "Please enter the 6-digit code"));
      return;
    }
    setLoading(true);
    try {
      // Use phone-based email pattern for Supabase auth
      const email = `phone_${phone}@kakago.app`;
      const password = `kakago_phone_${phone}_2024`;

      // Try sign in first
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        // If sign in fails, sign up (new user)
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) {
          console.error("Auth error:", signUpError.message);
          toast.error(t("登录失败，请重试", "Login failed, please try again"));
          setLoading(false);
          return;
        }

        // Update profile with phone number
        if (signUpData.user) {
          await new Promise((r) => setTimeout(r, 600));
          await supabase
            .from("profiles")
            .update({ phone, display_name: `用户${phone.slice(-4)}` })
            .eq("user_id", signUpData.user.id);
        }
      } else {
        // Existing user - update phone if needed
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (currentUser) {
          await supabase
            .from("profiles")
            .update({ phone })
            .eq("user_id", currentUser.id);
        }
      }

      await new Promise((r) => setTimeout(r, 300));
      toast.success(t("登录成功", "Login successful"));
      onClose();
    } catch (err) {
      console.error("Auth error:", err);
      toast.error(t("登录失败", "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  // ═══ STEP: Privacy Agreement ═══
  if (step === "privacy") {
    return (
      <div className="fixed inset-0 z-[100] flex items-end justify-center">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-[393px] rounded-t-3xl bg-secondary/95 backdrop-blur-xl border-t border-white/10 overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
          {/* Close */}
          <button onClick={onClose} className="absolute right-4 top-4 w-7 h-7 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground z-10">
            <X className="w-4 h-4" />
          </button>

          <div className="px-6 pt-8 pb-6">
            {/* Title */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
                <Coffee className="w-4 h-4 text-primary" />
              </div>
              <h3 className="text-base font-bold text-foreground">KAKAGO {t("温馨提示", "Notice")}</h3>
            </div>

            {/* Content */}
            <div className="text-[12px] text-muted-foreground leading-relaxed space-y-3 max-h-[280px] overflow-y-auto scrollbar-hide">
              <p>
                {t(
                  "尊敬的用户，为了向您提供更优质的服务，在您使用KAKAGO咖啡盲盒小程序前，您需要通过点击\\\"我已阅读并同意本温馨提示内容及相关协议\\\"以表示您充分知悉、理解并同意本温馨提示一级相关协议的各项规则，包括：",
                  "Dear user, to provide better service, before using KAKAGO Coffee Blind Box, please read and agree to the following terms and policies:"
                )}
              </p>
              <p>
                {t(
                  "我们会在您开启位置权限后访问获取您的位置信息，根据您的位置信息提供更契合您需求的页面展示、产品或服务，比如首页向您推荐附近门店售卖中的商品及排行榜，菜单页向您推荐附近门店售卖商品及相应优惠信息。",
                  "We will access your location (with your permission) to show nearby stores, products, rankings, and offers tailored to your area."
                )}
              </p>
              <p>
                {t(
                  "我们会收集您的手机号用于账户注册和登录验证。您的个人信息将严格按照隐私政策进行保护。",
                  "We collect your phone number for account registration and login verification. Your personal information will be strictly protected per our privacy policy."
                )}
              </p>
              <button className="text-primary text-[12px] font-medium">
                {t("《KAKAGO隐私权政策》", "《KAKAGO Privacy Policy》")}
              </button>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-5">
              <button
                onClick={onClose}
                className="flex-1 h-11 rounded-xl bg-muted/50 text-sm font-medium text-muted-foreground hover:bg-muted/70 transition-colors"
              >
                {t("不同意", "Disagree")}
              </button>
              <button
                onClick={handleAgree}
                className="flex-1 h-11 rounded-xl bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                {t("同意", "Agree")}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═══ STEP: Phone Login ═══
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-[340px] rounded-2xl bg-secondary/95 backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl animate-in zoom-in-95 fade-in duration-200">
        {/* Close */}
        <button onClick={onClose} className="absolute right-3 top-3 w-7 h-7 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground z-10">
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center pt-8 pb-4 px-6">
          <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-3">
            <Coffee className="w-7 h-7 text-primary" />
          </div>
          <h3 className="text-base font-bold text-foreground">
            {t("手机号登录", "Phone Login")}
          </h3>
          <p className="text-[11px] text-muted-foreground mt-1">
            {t("未注册手机号将自动创建账号", "Unregistered numbers will auto-create an account")}
          </p>
        </div>

        {/* Form */}
        <div className="px-6 pb-6 space-y-3">
          {/* Phone */}
          <div>
            <label className="text-[10px] text-muted-foreground mb-1.5 block">
              {t("手机号", "Phone Number")}
            </label>
            <div className="flex gap-2">
              <div className="flex items-center gap-1 px-3 py-2.5 rounded-xl bg-background/30 border border-white/5 text-xs text-muted-foreground">
                +86
              </div>
              <input
                type="tel"
                placeholder={t("请输入11位手机号", "Enter 11-digit phone")}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
                maxLength={11}
                className="flex-1 px-3 py-2.5 rounded-xl bg-background/30 border border-white/5 text-foreground text-xs placeholder:text-muted-foreground/50 outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>
          </div>

          {/* SMS Code */}
          <div>
            <label className="text-[10px] text-muted-foreground mb-1.5 block">
              {t("验证码", "Verification Code")}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={t("6位验证码", "6-digit code")}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                maxLength={6}
                className="flex-1 px-3 py-2.5 rounded-xl bg-background/30 border border-white/5 text-foreground text-sm text-center tracking-[0.2em] font-mono placeholder:text-muted-foreground/50 placeholder:tracking-normal placeholder:font-sans outline-none focus:ring-1 focus:ring-primary/50"
              />
              <button
                onClick={handleSendCode}
                disabled={loading || countdown > 0 || phone.length !== 11}
                className="px-3 py-2.5 rounded-xl text-[11px] font-medium bg-primary/10 text-primary border border-primary/30 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {loading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : countdown > 0 ? (
                  `${countdown}s`
                ) : codeSent ? (
                  t("重新发送", "Resend")
                ) : (
                  t("获取验证码", "Get Code")
                )}
              </button>
            </div>
          </div>

          {/* Login button */}
          <button
            onClick={handleLogin}
            disabled={!codeSent || code.length !== 6 || loading}
            className="w-full h-11 rounded-xl bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed mt-1"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t("登录中...", "Logging in...")}
              </>
            ) : (
              <>
                {t("登录 / 注册", "Login / Register")}
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Agreement */}
          <div className="flex items-start gap-1.5 pt-1">
            <ShieldCheck className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-[9px] text-muted-foreground/60 leading-relaxed">
              {t(
                "登录即表示您已同意《KAKAGO用户协议》和《隐私政策》",
                "By logging in, you agree to KAKAGO Terms of Service and Privacy Policy"
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
