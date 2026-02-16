import { useState } from "react";
import { Coffee, User, Phone, ImageIcon, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

interface WeChatAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEMO_EMAIL = "wechat_user@kakago.app";
const DEMO_PASSWORD = "kakago2024secure";

export const WeChatAuthModal = ({ isOpen, onClose }: WeChatAuthModalProps) => {
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  if (!isOpen) return null;

  const handleAllow = async () => {
    setLoading(true);
    try {
      // Try sign in first
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
      });

      if (signInError) {
        // If sign in fails, try sign up
        const { error: signUpError } = await supabase.auth.signUp({
          email: DEMO_EMAIL,
          password: DEMO_PASSWORD,
        });

        if (signUpError) {
          console.error("Auth error:", signUpError.message);
          setLoading(false);
          return;
        }
      }

      // Small delay for profile trigger to complete
      await new Promise((r) => setTimeout(r, 500));
      onClose();
    } catch (err) {
      console.error("Auth error:", err);
    } finally {
      setLoading(false);
    }
  };

  const permissions = [
    { icon: ImageIcon, labelZh: "获取你的头像", labelEn: "Your avatar" },
    { icon: User, labelZh: "获取你的昵称", labelEn: "Your nickname" },
    { icon: Phone, labelZh: "获取你的手机号", labelEn: "Your phone number" },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-[320px] rounded-2xl bg-secondary/95 backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl animate-in zoom-in-95 fade-in duration-200">
        {/* Header */}
        <div className="flex flex-col items-center pt-8 pb-4 px-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-3">
            <Coffee className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-base font-bold text-foreground">KAKAGO</h3>
          <p className="text-xs text-muted-foreground mt-1">
            {t("申请获取以下权限", "Requesting the following permissions")}
          </p>
        </div>

        {/* Permission List */}
        <div className="px-6 pb-4">
          <div className="rounded-xl bg-background/30 border border-white/5">
            {permissions.map((perm, index) => {
              const IconComp = perm.icon;
              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 px-4 py-3 ${
                    index !== permissions.length - 1
                      ? "border-b border-white/5"
                      : ""
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <IconComp className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm text-foreground/80">
                    {t(perm.labelZh, perm.labelEn)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 h-11 rounded-xl bg-muted/50 text-sm font-medium text-muted-foreground hover:bg-muted/70 transition-colors"
          >
            {t("拒绝", "Deny")}
          </button>
          <button
            onClick={handleAllow}
            disabled={loading}
            className="flex-1 h-11 rounded-xl bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t("授权中...", "Authorizing...")}
              </>
            ) : (
              t("允许", "Allow")
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
