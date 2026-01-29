import { useState } from "react";
import { X, Store, Coffee, Heart, Upload, CheckCircle2, Shield, Users, Crown, Sparkles, Award, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// 三大类身份
type IndustryIdentity = "owner" | "manager" | "barista" | null;
type UserIdentity = "expert" | "newbie" | "master" | null;
type SquadIdentity = "captain" | "leader" | "chief" | null;

interface UserIdentities {
  industry: IndustryIdentity;
  user: UserIdentity;
  squad: SquadIdentity;
}

interface IdentityOption {
  id: string;
  icon: typeof Store;
  titleZh: string;
  titleEn: string;
  descZh: string;
  descEn: string;
  requirement?: string;
}

interface IdentityVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentIdentities: UserIdentities;
  onUpdateIdentities: (identities: UserIdentities) => void;
}

// 咖啡行业类
const industryOptions: IdentityOption[] = [
  {
    id: "owner",
    icon: Store,
    titleZh: "咖啡店主",
    titleEn: "Shop Owner",
    descZh: "我经营一家咖啡馆",
    descEn: "I own a coffee shop",
    requirement: "上传营业执照",
  },
  {
    id: "manager",
    icon: Award,
    titleZh: "咖啡店长",
    titleEn: "Shop Manager",
    descZh: "我管理一家咖啡馆",
    descEn: "I manage a coffee shop",
    requirement: "上传工作证明",
  },
  {
    id: "barista",
    icon: Coffee,
    titleZh: "咖啡师",
    titleEn: "Barista",
    descZh: "我在咖啡馆工作",
    descEn: "I work as a barista",
    requirement: "上传工作证明",
  },
];

// 咖啡用户类
const userOptions: IdentityOption[] = [
  {
    id: "master",
    icon: Crown,
    titleZh: "咖啡大神",
    titleEn: "Coffee Master",
    descZh: "资深咖啡品鉴专家",
    descEn: "Senior coffee connoisseur",
  },
  {
    id: "expert",
    icon: Sparkles,
    titleZh: "精品咖啡狂人",
    titleEn: "Specialty Coffee Enthusiast",
    descZh: "热爱精品咖啡文化",
    descEn: "Passionate about specialty coffee",
  },
  {
    id: "newbie",
    icon: Heart,
    titleZh: "咖啡小白",
    titleEn: "Coffee Newbie",
    descZh: "刚开始探索咖啡世界",
    descEn: "Just starting to explore coffee",
  },
];

// KAKA拉帮结派等级
const squadOptions: IdentityOption[] = [
  {
    id: "chief",
    icon: Crown,
    titleZh: "KAKA总舵主",
    titleEn: "KAKA Chief",
    descZh: "邀请100+队员",
    descEn: "100+ referrals",
  },
  {
    id: "captain",
    icon: Star,
    titleZh: "KAKA舵主",
    titleEn: "KAKA Captain",
    descZh: "邀请50+队员",
    descEn: "50+ referrals",
  },
  {
    id: "leader",
    icon: Users,
    titleZh: "KAKA堂主",
    titleEn: "KAKA Leader",
    descZh: "邀请10+队员",
    descEn: "10+ referrals",
  },
];

export const IdentityVerificationModal = ({
  isOpen,
  onClose,
  currentIdentities,
  onUpdateIdentities,
}: IdentityVerificationModalProps) => {
  const { t } = useLanguage();
  const [selectedIdentities, setSelectedIdentities] = useState<UserIdentities>(currentIdentities);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"industry" | "user" | "squad">("user");

  const handleSelect = (category: keyof UserIdentities, id: string | null) => {
    setSelectedIdentities(prev => ({
      ...prev,
      [category]: prev[category] === id ? null : id,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    onUpdateIdentities(selectedIdentities);
    setIsSubmitting(false);
    onClose();
  };

  const tabs = [
    { id: "user" as const, labelZh: "用户类型", labelEn: "User Type" },
    { id: "industry" as const, labelZh: "行业认证", labelEn: "Industry" },
    { id: "squad" as const, labelZh: "KAKA等级", labelEn: "KAKA Level" },
  ];

  const renderOptions = () => {
    let options: IdentityOption[] = [];
    let category: keyof UserIdentities = "user";
    
    switch (activeTab) {
      case "industry":
        options = industryOptions;
        category = "industry";
        break;
      case "user":
        options = userOptions;
        category = "user";
        break;
      case "squad":
        options = squadOptions;
        category = "squad";
        break;
    }

    return (
      <div className="space-y-2">
        {options.map((option) => {
          const IconComponent = option.icon;
          const isSelected = selectedIdentities[category] === option.id;
          
          return (
            <button
              key={option.id}
              onClick={() => handleSelect(category, option.id)}
              className={`w-full p-3 rounded-xl border transition-all duration-200 text-left ${
                isSelected
                  ? "border-primary bg-primary/10"
                  : "border-white/10 bg-secondary/30 hover:border-primary/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isSelected ? "bg-primary/20" : "bg-secondary"
                }`}>
                  <IconComponent className={`w-5 h-5 ${
                    isSelected ? "text-primary" : "text-white/60"
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-sm">
                      {t(option.titleZh, option.titleEn)}
                    </span>
                  </div>
                  <p className="text-xs text-white/50">
                    {t(option.descZh, option.descEn)}
                  </p>
                </div>
                {isSelected && (
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  // Count selected identities
  const selectedCount = [
    selectedIdentities.industry,
    selectedIdentities.user,
    selectedIdentities.squad,
  ].filter(Boolean).length;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/70 backdrop-blur-md z-50 transition-opacity duration-300 ${
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
          className={`w-full max-w-md bg-card rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl transition-transform duration-300 border-t border-white/10 ${
            isOpen ? "translate-y-0" : "translate-y-full sm:translate-y-8"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative px-6 pt-6 pb-4">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white/60 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-white">{t("身份认证", "Identity Verification")}</h2>
            </div>
            <p className="text-sm text-white/60 mt-1">
              {t("每个类别可选择一个身份", "Select one identity per category")}
            </p>
          </div>

          {/* Tabs */}
          <div className="px-6 flex gap-2 pb-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-primary text-white"
                    : "bg-secondary/50 text-white/50 hover:bg-secondary"
                }`}
              >
                {t(tab.labelZh, tab.labelEn)}
                {selectedIdentities[tab.id] && (
                  <span className="ml-1 w-1.5 h-1.5 bg-green-400 rounded-full inline-block" />
                )}
              </button>
            ))}
          </div>

          {/* Options */}
          <div className="px-6 py-2 max-h-[40vh] overflow-y-auto">
            {renderOptions()}
          </div>

          {/* Selected Summary */}
          {selectedCount > 0 && (
            <div className="px-6 py-3">
              <div className="bg-primary/10 rounded-xl p-3 border border-primary/20">
                <p className="text-xs text-white/60 mb-2">{t("已选身份", "Selected")}:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedIdentities.user && (
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                      {userOptions.find(o => o.id === selectedIdentities.user)?.titleZh}
                    </span>
                  )}
                  {selectedIdentities.industry && (
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                      {industryOptions.find(o => o.id === selectedIdentities.industry)?.titleZh}
                    </span>
                  )}
                  {selectedIdentities.squad && (
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                      {squadOptions.find(o => o.id === selectedIdentities.squad)?.titleZh}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="px-6 pb-6 pt-2 safe-bottom">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-4 min-h-[56px] rounded-2xl text-base font-semibold btn-gold transition-all duration-200"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t("保存中...", "Saving...")}
                </span>
              ) : (
                t("保存身份", "Save Identity")
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Export identity badge helper - returns primary display identity
export const getIdentityBadge = (identities: UserIdentities) => {
  // Priority: squad > industry > user
  if (identities.squad) {
    const option = squadOptions.find(o => o.id === identities.squad);
    return { 
      icon: option?.icon || Users, 
      label: option?.titleZh || "KAKA成员",
      color: "text-primary bg-primary/20 border-primary/30" 
    };
  }
  if (identities.industry) {
    const option = industryOptions.find(o => o.id === identities.industry);
    return { 
      icon: option?.icon || Coffee, 
      label: option?.titleZh || "咖啡从业者",
      color: "text-amber-400 bg-amber-500/20 border-amber-500/30" 
    };
  }
  if (identities.user) {
    const option = userOptions.find(o => o.id === identities.user);
    return { 
      icon: option?.icon || Heart, 
      label: option?.titleZh || "咖啡爱好者",
      color: "text-white/60 bg-secondary border-white/10" 
    };
  }
  return { icon: Heart, label: "咖啡爱好者", color: "text-white/60 bg-secondary border-white/10" };
};

// Get all badges for display
export const getAllBadges = (identities: UserIdentities) => {
  const badges: { icon: typeof Store; label: string; color: string }[] = [];
  
  if (identities.user) {
    const option = userOptions.find(o => o.id === identities.user);
    if (option) badges.push({ icon: option.icon, label: option.titleZh, color: "text-primary" });
  }
  if (identities.industry) {
    const option = industryOptions.find(o => o.id === identities.industry);
    if (option) badges.push({ icon: option.icon, label: option.titleZh, color: "text-amber-400" });
  }
  if (identities.squad) {
    const option = squadOptions.find(o => o.id === identities.squad);
    if (option) badges.push({ icon: option.icon, label: option.titleZh, color: "text-green-400" });
  }
  
  return badges;
};

export type { UserIdentities, IndustryIdentity, UserIdentity, SquadIdentity };
