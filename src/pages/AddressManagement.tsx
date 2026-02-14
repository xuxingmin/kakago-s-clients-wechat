import { useNavigate } from "react-router-dom";
import { ChevronLeft, Plus, MapPin, Edit2 } from "lucide-react";
import { useAddress, Address } from "@/contexts/AddressContext";
import { useLanguage } from "@/contexts/LanguageContext";

const AddressManagement = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { addresses, deleteAddress, setDefault } = useAddress();

  const maskPhone = (phone: string) =>
    phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");

  const getShortAddress = (a: Address) =>
    t(
      `${a.city}${a.detail}`,
      `${a.detailEn}, ${a.cityEn}`
    );

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border flex-shrink-0">
        <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center">
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-base font-semibold text-foreground">
          {t("收货地址管理", "Delivery Addresses")}
        </h1>
        <div className="w-8" />
      </div>

      {/* Address List */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-24">
        {addresses.length > 0 ? (
          <div className="space-y-3">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="bg-card rounded-xl border border-border px-4 py-3 relative"
              >
                {/* Default badge */}
                {address.isDefault && (
                  <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-medium px-2 py-0.5 rounded-bl-lg rounded-tr-xl">
                    {t("默认", "Default")}
                  </span>
                )}

                {/* Tag + Address */}
                <div className="flex items-start gap-2 pr-8">
                  {address.tag && (
                    <span className="text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded shrink-0 mt-0.5">
                      {address.tag}
                    </span>
                  )}
                  <p className="text-sm text-foreground font-medium leading-snug">
                    {getShortAddress(address)}
                  </p>
                </div>

                {/* Name + Phone + Edit */}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <span className="text-sm">{address.name}</span>
                    <span className="text-sm">{maskPhone(address.phone)}</span>
                  </div>
                  <button
                    onClick={() => navigate(`/address/edit/${address.id}`)}
                    className="w-8 h-8 flex items-center justify-center text-muted-foreground"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mb-3">
              <MapPin className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              {t("暂无收货地址", "No delivery addresses")}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Buttons */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <div className="w-[393px] mx-auto bg-card border-t border-border px-4 py-3 flex gap-3">
          <button
            onClick={() => navigate("/address/new")}
            className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {t("新建收货地址", "New Address")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressManagement;
