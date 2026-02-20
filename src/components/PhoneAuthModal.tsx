import { useState, useEffect } from "react";
import { Coffee, Loader2, ChevronLeft, X, MessageCircle, Smartphone } from "lucide-react";
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
      const email = `phone_${phoneNum}@kakago.app`;
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
              "欢迎使用KAKAGO咖啡盲盒。我们深知个人信息对您的重要性，我们将按相关法律法规要求，尽力保护您的个人信息安全可控。",
              "Welcome to KAKAGO Coffee Blind Box. We understand the importance of your personal information and will protect it in accordance with applicable laws."
            )}</p>
            <p>{t(
              "在使用KAKAGO服务前，请您务必审慎阅读《隐私协议》和《用户协议》，并充分理解相关协议条款。为便于理解协议条款，特向您说明如下：",
              "Before using KAKAGO services, please carefully read the Privacy Policy and User Agreement. Key points include:"
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
            <h1 className="text-3xl font-black text-foreground tracking-tight">KAKAGO</h1>
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
                handleWeChatLogin();
              }}
              disabled={loading}
              className="w-full h-12 rounded-full bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageCircle className="w-4 h-4" />}
              {t("一键登录", "One-click Login")}
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

  // ═══ STEP 3a: WeChat permission popup (handled in choose step directly) ═══

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
          {t("未注册过的手机号验证后将自动创建 KAKAGO 账号", "Unregistered numbers will auto-create a KAKAGO account")}
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
