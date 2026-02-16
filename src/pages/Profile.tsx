import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { CouponPills } from "@/components/profile/CouponPills";
import { UserInfoCard } from "@/components/profile/UserInfoCard";
import { AssetsGrid } from "@/components/profile/AssetsGrid";
import { FunctionsList } from "@/components/profile/FunctionsList";
import { BrandShowcase } from "@/components/profile/BrandShowcase";
import {
  IdentityVerificationModal,
  type UserIdentities,
} from "@/components/IdentityVerificationModal";
import { useLanguage } from "@/contexts/LanguageContext";

const Profile = () => {
  const { t } = useLanguage();
  const [identityModalOpen, setIdentityModalOpen] = useState(false);
  const [currentIdentities, setCurrentIdentities] = useState<UserIdentities>({
    industry: null,
    user: "expert",
    squad: "leader",
  });

  const userName = "微信用户_8K3nF";

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Fixed header */}
      <div className="flex-shrink-0">
        <Header />
        {/* Brand tagline */}
        <div className="px-4 pt-1.5 pb-1 bg-background">
          <div className="flex items-center gap-1.5">
            <h1 className="text-lg font-bold text-foreground tracking-tight">KAKAGO</h1>
            <Sparkles className="w-3 h-3 text-primary/60 float-subtle" />
          </div>
          <p className="text-[11px] text-muted-foreground font-light">
            {t("精品咖啡·尽在咖卡购", "Premium Coffee · KAKAGO")}
          </p>
        </div>
        {/* Coupon pills */}
        <CouponPills />
        <div className="fog-divider mx-4" />
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-20">
        <div className="max-w-md mx-auto stagger-fade-in">
          <UserInfoCard
            userName={userName}
            identities={currentIdentities}
            onAvatarClick={() => setIdentityModalOpen(true)}
          />
          <AssetsGrid />
          <FunctionsList />
          <BrandShowcase />
          {/* Version */}
          <p className="text-center text-[10px] text-muted-foreground mt-4 pb-4">
            KAKAGO v1.0.0
          </p>
        </div>
      </div>

      {/* Fixed bottom nav */}
      <div className="flex-shrink-0">
        <BottomNav />
      </div>

      <IdentityVerificationModal
        isOpen={identityModalOpen}
        onClose={() => setIdentityModalOpen(false)}
        currentIdentities={currentIdentities}
        onUpdateIdentities={setCurrentIdentities}
      />
    </div>
  );
};

export default Profile;
