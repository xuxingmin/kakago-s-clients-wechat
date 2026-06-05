import { useState, useEffect } from "react";
import { Coffee, Loader2, ChevronLeft, X, Smartphone, MapPin, Info } from "lucide-react";

// WeChat icon SVG component
const WeChatIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-7.062-6.122zm-2.036 2.87c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.072 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982z"/>
  </svg>
);
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

interface PhoneAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthStep = "privacy" | "choose" | "wechat" | "phone";

export const PhoneAuthModal = ({ isOpen, onClose }: PhoneAuthModalProps) => {
  const [step, setStep] = useState<AuthStep>("privacy");
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [agreedCheck, setAgreedCheck] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (!isOpen) {
      setStep("privacy");
      setPhone("");
      setCode("");
      setCodeSent(false);
      setCountdown(0);
      setAgreedCheck(false);
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

  const doLogin = async (phoneNum: string) => {
    setLoading(true);
    try {
      const email = `phone_${phoneNum}@triva.app`;
      const password = `kakago_phone_${phoneNum}_2024`;

      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

      if (signInError) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) {
          toast.error(t("登录失败，请重试", "Login failed, please try again"));
          setLoading(false);
          return;
        }
        if (signUpData.user) {
          await new Promise((r) => setTimeout(r, 600));
          await supabase.from("profiles").update({ phone: phoneNum, display_name: `用户${phoneNum.slice(-4)}` }).eq("user_id", signUpData.user.id);
        }
      } else {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (currentUser) {
          await supabase.from("profiles").update({ phone: phoneNum }).eq("user_id", currentUser.id);
        }
      }
      await new Promise((r) => setTimeout(r, 300));
      toast.success(t("登录成功", "Login successful"));
      onClose();
    } catch {
      toast.error(t("登录失败", "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleWeChatLogin = async () => {
    // Simulate WeChat one-click: generate a random phone
    const randomPhone = "138" + Math.random().toString().slice(2, 10);
    await doLogin(randomPhone);
  };

  const handleSendCode = async () => {
    if (!phone || phone.length !== 11) {
      toast.error(t("请输入正确的11位手机号", "Please enter a valid 11-digit phone number"));
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setCodeSent(true);
    setCountdown(60);
    setLoading(false);
    toast.success(t("验证码已发送", "Verification code sent"));
  };

  const handlePhoneLogin = async () => {
    if (code.length !== 6) {
      toast.error(t("请输入6位验证码", "Please enter the 6-digit code"));
      return;
    }
    await doLogin(phone);
  };

  // Back button for sub-steps
  const BackButton = ({ to }: { to: AuthStep }) => (
    <button
      onClick={() => setStep(to)}
      className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
    >
      <ChevronLeft className="w-5 h-5" />
    </button>
  );

  // ═══ STEP 1: Privacy Disclaimer (Cotti style - full page) ═══
  if (step === "privacy") {
    return (
      <div className="fixed inset-0 z-[100] bg-background flex flex-col animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-4 pt-3 pb-2">
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium text-foreground">{t("温馨提示", "Notice")}</span>
          <div className="w-8" />
        </div>

        {/* Logo */}
        <div className="flex flex-col items-center pt-4 pb-3">
          <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center mb-3">
            <Coffee className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-base font-bold text-foreground">{t("温馨提示", "Warm Reminder")}</h2>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 scrollbar-hide">
          <div className="text-[13px] text-foreground leading-[1.8] space-y-4">
            <p>{t(
              "欢迎使用TRIVA咖啡盲盒。我们深知个人信息对您的重要性，我们将按相关法律法规要求，尽力保护您的个人信息安全可控。",
              "Welcome to TRIVA Coffee Blind Box. We understand the importance of your personal information and will protect it in accordance with applicable laws."
            )}</p>
            <p>{t(
              "在使用TRIVA服务前，请您务必审慎阅读《隐私协议》和《用户协议》，并充分理解相关协议条款。为便于理解协议条款，特向您说明如下：",
              "Before using TRIVA services, please carefully read the Privacy Policy and User Agreement. Key points include:"
            )}</p>
            <ol className="list-decimal list-outside pl-5 space-y-3">
              <li>{t(
                "为了向您提供订单、交易、会员权益相关的基本服务，我们会收集和使用必要的个人信息；",
                "We collect necessary personal information to provide order, transaction, and membership services;"
              )}</li>
              <li>{t(
                "为了向您提供所在位置附近的门店展示、产品及服务，需要授权同意我们获取位置权限，您有权同意或拒绝授权；",
                "To show nearby stores and services, we need your location permission. You may agree or decline;"
              )}</li>
              <li>{t(
                "我们将严格按照您同意的各项条款使用您的个人信息。未经您同意，我们不会从第三方获取、共享或向其提供您的个人信息；",
                "We will strictly use your information per agreed terms. We will not share your data with third parties without consent;"
              )}</li>
              <li>{t(
                "我们提供账户注销的渠道，您可以查询、更正、删除个人信息；",
                "You can query, correct, or delete your personal information, and request account deletion;"
              )}</li>
              <li>{t(
                "如果您是14周岁以下的未成年人，您需要和您的监护人一起仔细阅读《儿童隐私保护声明》，并在征得您的监护人同意后，使用我们的产品、服务或向我们提供信息。",
                "If you are under 14, please read the Children's Privacy Statement with your guardian and obtain their consent."
              )}</li>
            </ol>
          </div>
        </div>

        {/* Bottom buttons */}
        <div className="flex-shrink-0 px-5 pb-6 pt-3 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-12 rounded-full border border-border text-sm font-medium text-muted-foreground hover:bg-accent/50 transition-colors"
          >
            {t("不同意并退出", "Disagree & Exit")}
          </button>
          <button
            onClick={() => setStep("choose")}
            className="flex-1 h-12 rounded-full bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {t("同意", "Agree")}
          </button>
        </div>
      </div>
    );
  }

  // ═══ STEP 2: Choose Login Method (Cotti style) ═══
  if (step === "choose") {
    return (
      <div className="fixed inset-0 z-[100] bg-background flex flex-col animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-4 pt-3 pb-2">
          <BackButton to="privacy" />
          <span className="text-sm font-medium text-foreground">{t("登录", "Login")}</span>
          <div className="w-8" />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center px-6">
          {/* Brand */}
          <div className="mt-12 mb-4">
            <h1 className="text-3xl font-black text-foreground tracking-tight">TRIVA</h1>
          </div>
          <p className="text-sm text-muted-foreground mb-8">{t("立即登录，享受会员权益", "Login now, enjoy member benefits")}</p>

          {/* Benefits icons */}
          <div className="flex gap-10 mb-16">
            {[
              { icon: "🎫", labelZh: "优惠券", labelEn: "Coupons" },
              { icon: "🎁", labelZh: "盲盒", labelEn: "Blind Box" },
              { icon: "💬", labelZh: "专属客服", labelEn: "Support" },
            ].map((item) => (
              <div key={item.labelZh} className="flex flex-col items-center gap-1.5">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-xs text-muted-foreground">{t(item.labelZh, item.labelEn)}</span>
              </div>
            ))}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Buttons */}
          <div className="w-full max-w-[320px] space-y-3 mb-4">
            <button
              onClick={() => {
                if (!agreedCheck) {
                  toast.error(t("请先勾选同意协议", "Please agree to the terms first"));
                  return;
                }
                setStep("wechat");
              }}
              className="w-full h-12 rounded-full bg-[#07C160] text-sm font-semibold text-white hover:bg-[#06AD56] transition-colors flex items-center justify-center gap-2.5"
            >
              <WeChatIcon className="w-5 h-5" />
              {t("微信一键登录", "WeChat Login")}
            </button>
            <button
              onClick={() => {
                if (!agreedCheck) {
                  toast.error(t("请先勾选同意协议", "Please agree to the terms first"));
                  return;
                }
                setStep("phone");
              }}
              className="w-full h-12 rounded-full border border-border text-sm font-medium text-foreground hover:bg-accent/50 transition-colors flex items-center justify-center gap-2"
            >
              <Smartphone className="w-4 h-4" />
              {t("验证码登录", "SMS Login")}
            </button>
            <button
              onClick={onClose}
              className="w-full text-center text-sm text-muted-foreground py-2"
            >
              {t("暂不登录", "Skip for now")}
            </button>
          </div>

          {/* Agreement checkbox */}
          <div className="flex items-center gap-2 pb-8">
            <button
              onClick={() => setAgreedCheck(!agreedCheck)}
              className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${
                agreedCheck ? "bg-primary border-primary" : "border-muted-foreground/40"
              }`}
            >
              {agreedCheck && <span className="text-primary-foreground text-[8px]">✓</span>}
            </button>
            <p className="text-[11px] text-muted-foreground">
              {t("我已阅读并同意", "I have read and agree to ")}
              <span className="text-primary">{t("《用户协议》", "Terms")}</span>
              {t(" 与 ", " and ")}
              <span className="text-primary">{t("《隐私条款》", "Privacy Policy")}</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ═══ STEP 3a: WeChat Authorization (dark overlay like Cotti image 3) ═══
  if (step === "wechat") {
    return (
      <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col justify-end animate-in fade-in duration-200">
        {/* Dark area - tap to go back */}
        <div className="flex-1" onClick={() => setStep("choose")} />

        {/* Authorization panel */}
        <div className="bg-card rounded-t-2xl px-5 pt-5 pb-8 animate-in slide-in-from-bottom duration-300">
          {/* App info row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                <Coffee className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">TRIVA {t("申请", "requests")}</span>
            </div>
            <Info className="w-4 h-4 text-muted-foreground" />
          </div>

          {/* Permission title */}
          <h3 className="text-base font-bold text-foreground mb-2">
            {t("获取你的位置信息", "Access your location")}
          </h3>
          <p className="text-[13px] text-muted-foreground leading-relaxed mb-6">
            {t(
              "将获取你的具体位置信息，用于向您推荐、展示您附近门店的菜单(商品列表)、优惠活动等营销信息",
              "Your location will be used to recommend nearby stores, menus, and promotional offers"
            )}
          </p>

          {/* Action buttons */}
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => setStep("choose")}
              className="flex-1 h-11 rounded-full bg-muted text-sm font-medium text-muted-foreground hover:bg-muted/80 transition-colors"
            >
              {t("拒绝", "Decline")}
            </button>
            <button
              onClick={handleWeChatLogin}
              disabled={loading}
              className="flex-1 h-11 rounded-full bg-[#07C160] text-sm font-semibold text-white hover:bg-[#06AD56] transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t("允许", "Allow")}
            </button>
          </div>

          {/* Privacy note */}
          <div className="flex items-center gap-2 justify-center">
            <button
              onClick={() => setAgreedCheck(!agreedCheck)}
              className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${
                agreedCheck ? "bg-primary border-primary" : "border-muted-foreground/40"
              }`}
            >
              {agreedCheck && <span className="text-primary-foreground text-[8px]">✓</span>}
            </button>
            <p className="text-[10px] text-muted-foreground">
              {t("已阅读并接受《TRIVA小程序隐私保护指引》", "Read and accepted TRIVA Privacy Guidelines")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ═══ STEP 3b: Phone Number Input (Cotti style) ═══
  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 pt-3 pb-2">
        <BackButton to="choose" />
        <span className="text-sm font-medium text-foreground">{t("登录", "Login")}</span>
        <div className="w-8" />
      </div>

      {/* Content */}
      <div className="flex-1 px-5 pt-6">
        <h2 className="text-xl font-bold text-foreground mb-2">{t("您的手机号", "Your Phone Number")}</h2>
        <p className="text-sm text-muted-foreground mb-8">
          {t("未注册过的手机号验证后将自动创建 TRIVA 账号", "Unregistered numbers will auto-create a TRIVA account")}
        </p>

        {/* Phone input */}
        <div className="mb-6">
          <input
            type="tel"
            inputMode="numeric"
            placeholder={t("请输入手机号", "Enter phone number")}
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
            maxLength={11}
            className="w-full text-lg py-3 bg-transparent border-b border-border text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* SMS code - show after sending */}
        {codeSent && (
          <div className="mb-6 animate-in slide-in-from-top-2 duration-200">
            <div className="flex gap-3">
              <input
                type="text"
                inputMode="numeric"
                placeholder={t("请输入验证码", "Enter code")}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                maxLength={6}
                className="flex-1 text-lg py-3 bg-transparent border-b border-border text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary transition-colors tracking-widest"
              />
              <button
                onClick={handleSendCode}
                disabled={loading || countdown > 0}
                className="text-sm text-primary font-medium whitespace-nowrap disabled:text-muted-foreground"
              >
                {countdown > 0 ? `${countdown}s` : t("重新发送", "Resend")}
              </button>
            </div>
          </div>
        )}

        {/* Agreement */}
        <div className="flex items-center gap-2 mb-8">
          <button
            onClick={() => setAgreedCheck(!agreedCheck)}
            className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${
              agreedCheck ? "bg-primary border-primary" : "border-muted-foreground/40"
            }`}
          >
            {agreedCheck && <span className="text-primary-foreground text-[8px]">✓</span>}
          </button>
          <p className="text-[11px] text-muted-foreground">
            {t("我已阅读并同意", "I have read and agree to ")}
            <span className="text-primary">{t("《用户协议》", "Terms")}</span>
            {t(" 与 ", " and ")}
            <span className="text-primary">{t("《隐私条款》", "Privacy Policy")}</span>
          </p>
        </div>

        {/* Action button */}
        <button
          onClick={codeSent ? handlePhoneLogin : handleSendCode}
          disabled={loading || phone.length !== 11 || !agreedCheck}
          className="w-full h-12 rounded-full bg-primary text-sm font-semibold text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : codeSent ? (
            t("登录", "Login")
          ) : (
            t("下一步", "Next")
          )}
        </button>
      </div>
    </div>
  );
};
