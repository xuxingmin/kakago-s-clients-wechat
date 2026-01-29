import { useState } from "react";
import { X, Store, Coffee, Heart, Upload, CheckCircle2, Shield } from "lucide-react";

type IdentityType = "fan" | "barista" | "owner";

interface IdentityOption {
  id: IdentityType;
  icon: typeof Store;
  title: string;
  description: string;
  requirement?: string;
  isDefault?: boolean;
}

interface IdentityVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentIdentity: IdentityType;
  onSelectIdentity: (identity: IdentityType) => void;
}

const identityOptions: IdentityOption[] = [
  {
    id: "owner",
    icon: Store,
    title: "店主",
    description: "我经营一家精品咖啡馆",
    requirement: "上传营业执照",
  },
  {
    id: "barista",
    icon: Coffee,
    title: "咖啡师",
    description: "我在咖啡馆工作",
    requirement: "上传工作证明",
  },
  {
    id: "fan",
    icon: Heart,
    title: "咖啡爱好者",
    description: "我只是热爱咖啡",
    isDefault: true,
  },
];

export const IdentityVerificationModal = ({
  isOpen,
  onClose,
  currentIdentity,
  onSelectIdentity,
}: IdentityVerificationModalProps) => {
  const [selectedIdentity, setSelectedIdentity] = useState<IdentityType>(currentIdentity);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (selectedIdentity === "fan") {
      onSelectIdentity(selectedIdentity);
      onClose();
      return;
    }
    
    // For owner/barista, would need file upload verification
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onSelectIdentity(selectedIdentity);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-md z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center transition-all duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`w-full max-w-md bg-card rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl transition-transform duration-300 ${
            isOpen ? "translate-y-0" : "translate-y-full sm:translate-y-8"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative px-6 pt-6 pb-4">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">选择您的身份</h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              认证身份解锁专属徽章和特权
            </p>
          </div>

          {/* Identity Options */}
          <div className="px-6 py-2 space-y-3">
            {identityOptions.map((option) => {
              const IconComponent = option.icon;
              const isSelected = selectedIdentity === option.id;
              const isCurrent = currentIdentity === option.id;
              
              return (
                <button
                  key={option.id}
                  onClick={() => setSelectedIdentity(option.id)}
                  className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border bg-secondary/30 hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isSelected ? "bg-primary/10" : "bg-secondary"
                    }`}>
                      <IconComponent className={`w-6 h-6 ${
                        isSelected ? "text-primary" : "text-muted-foreground"
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${
                          isSelected ? "text-foreground" : "text-foreground"
                        }`}>
                          {option.title}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                            当前
                          </span>
                        )}
                        {option.isDefault && (
                          <span className="text-[10px] font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                            默认
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {option.description}
                      </p>
                      {option.requirement && (
                        <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{option.requirement}</span>
                        </div>
                      )}
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Benefit Text */}
          <div className="px-6 py-4">
            <div className="bg-gradient-to-r from-primary/10 to-lavender/50 rounded-xl p-4">
              <p className="text-sm text-foreground">
                🎁 <span className="font-medium">认证福利</span>：所有用户邀请好友均可获得 <span className="text-primary font-bold">2%</span> 返佣！
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="px-6 pb-6 pt-2 safe-bottom">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl text-base font-semibold btn-gold transition-all duration-200"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  提交中...
                </span>
              ) : selectedIdentity === currentIdentity ? (
                "确认身份"
              ) : selectedIdentity === "fan" ? (
                "切换身份"
              ) : (
                "提交认证"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Export identity badge helper
export const getIdentityBadge = (identity: IdentityType) => {
  switch (identity) {
    case "owner":
      return { icon: Store, label: "店主", color: "text-amber-600 bg-amber-100 border-amber-200" };
    case "barista":
      return { icon: Coffee, label: "咖啡师", color: "text-primary bg-primary/10 border-primary/20" };
    case "fan":
    default:
      return { icon: Heart, label: "咖啡爱好者", color: "text-muted-foreground bg-secondary border-border" };
  }
};

export type { IdentityType };
