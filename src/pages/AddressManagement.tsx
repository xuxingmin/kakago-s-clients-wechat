import { useNavigate, useLocation } from "react-router-dom";
import { Plus, MapPin, Edit2 } from "lucide-react";
import { Header } from "@/components/Header";
import { BrandBanner } from "@/components/BrandBanner";
import { BottomNav } from "@/components/BottomNav";
import { useAddress, Address } from "@/contexts/AddressContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { CheckCircle2 } from "lucide-react";

const AddressManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { addresses, selectedAddress, setSelectedAddress } = useAddress();
  const returnTo = (location.state as { from?: string })?.from || "/";

  const maskPhone = (phone: string) =>
    phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");

  const getShortAddress = (a: Address) =>
    t(
      `${a.city}${a.detail}`,
      `${a.detailEn}, ${a.cityEn}`
    );

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Fixed Header */}
      <div className="flex-shrink-0">
        <Header />
        <BrandBanner />
        <div className="fog-divider mx-4" />
      </div>

      {/* Section Title */}
      <div className="flex-shrink-0 px-4 pt-3 pb-1">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-white/60">
            {t("收货地址管理", "Delivery Addresses")}
          </h2>
          <span className="text-[11px] text-white/30">
            {t(`${addresses.length}个地址`, `${addresses.length} addresses`)}
          </span>
        </div>
      </div>

      {/* Address List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-40">
        {addresses.length > 0 ? (
          <div className="space-y-2 stagger-fade-in">
            {addresses.map((address) => {
              const isSelected = selectedAddress?.id === address.id;
              return (
                <div
                  key={address.id}
                  onClick={() => {
                    setSelectedAddress(address);
                    navigate(returnTo);
                  }}
                  className={`card-md relative cursor-pointer transition-all ${
                    isSelected ? "ring-1 ring-primary/60 bg-primary/5" : "hover:bg-white/5"
                  }`}
                >
                  {/* Top row: Tag + Address + Selected indicator */}
                  <div className="flex items-start gap-2 pr-8">
                    {address.tag && (
                      <span className="text-[10px] font-medium text-primary bg-primary/15 px-2 py-0.5 rounded-full shrink-0 mt-0.5">
                        {address.tag}
                      </span>
                    )}
                    <p className="text-sm text-white/90 font-medium leading-snug flex-1">
                      {getShortAddress(address)}
                    </p>
                    {isSelected && (
                      <CheckCircle2 className="absolute top-3 right-3 w-4 h-4 text-primary shrink-0" />
                    )}
                    {!isSelected && address.isDefault && (
                      <span className="absolute top-0 right-0 text-[9px] font-semibold text-white bg-primary/80 px-2 py-0.5 rounded-bl-xl rounded-tr-2xl">
                        {t("默认", "Default")}
                      </span>
                    )}
                  </div>

                  {/* Bottom row: Name + Phone + Edit */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                    <div className="flex items-center gap-3 text-white/40">
                      <span className="text-xs">{address.name}</span>
                      <span className="text-xs">{maskPhone(address.phone)}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/address/edit/${address.id}`);
                      }}
                      className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <MapPin className="w-8 h-8 text-primary/40" />
            </div>
            <p className="text-white/30 text-sm mb-6">
              {t("暂无收货地址", "No delivery addresses")}
            </p>
            <button
              onClick={() => navigate("/address/new")}
              className="btn-gold px-6 py-3 text-sm"
            >
              {t("添加新地址", "Add New Address")}
            </button>
          </div>
        )}
      </div>

      {/* Bottom: Add Button */}
      <div className="fixed bottom-[68px] left-0 right-0 z-40 px-4 pb-3">
        <div className="w-[393px] mx-auto">
          <button
            onClick={() => navigate("/address/new")}
            className="btn-gold w-full py-3.5 flex items-center justify-center gap-2 text-sm pulse-glow"
          >
            <Plus className="w-4 h-4" />
            {t("新建收货地址", "New Address")}
          </button>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="flex-shrink-0">
        <BottomNav />
      </div>
    </div>
  );
};

export default AddressManagement;
