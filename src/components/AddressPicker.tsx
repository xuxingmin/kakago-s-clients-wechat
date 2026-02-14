import { useState } from "react";
import { MapPin, Check, Plus, X, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAddress, Address } from "@/contexts/AddressContext";
import { AddressForm } from "@/components/AddressForm";

interface AddressPickerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddressPicker = ({ isOpen, onClose }: AddressPickerProps) => {
  const { t } = useLanguage();
  const { addresses, selectedAddress, setSelectedAddress, addAddress } = useAddress();
  const [showAddForm, setShowAddForm] = useState(false);

  if (!isOpen) return null;

  const handleSelect = (address: Address) => {
    setSelectedAddress(address);
    onClose();
  };

  const getShortAddress = (addr: Address) => {
    return t(
      `${addr.district} ${addr.detail}`,
      `${addr.detailEn}, ${addr.districtEn}`
    );
  };

  const handleAddAddress = (newAddr: Omit<Address, "id">) => {
    addAddress(newAddr);
    setShowAddForm(false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70]" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-[70] animate-in slide-in-from-bottom duration-300">
        <div className="bg-card rounded-t-2xl border-t border-white/10 max-h-[60vh] flex flex-col">
          {/* Handle */}
          <div className="flex justify-center pt-2 pb-1">
            <div className="w-8 h-1 bg-white/20 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-4 pb-2 border-b border-white/5">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <h3 className="text-white font-medium text-sm">
                {t("选择配送地址", "Select Delivery Address")}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          {/* Address list */}
          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1.5">
            {addresses.length === 0 ? (
              <div className="py-8 text-center">
                <MapPin className="w-8 h-8 text-white/20 mx-auto mb-2" />
                <p className="text-white/40 text-xs">{t("暂无保存的地址", "No saved addresses")}</p>
              </div>
            ) : (
              addresses.map((addr) => {
                const isSelected = selectedAddress?.id === addr.id;
                return (
                  <button
                    key={addr.id}
                    onClick={() => handleSelect(addr)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                      isSelected
                        ? "bg-primary/10 border border-primary/30"
                        : "bg-white/5 border border-transparent hover:bg-white/10"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isSelected ? "bg-primary" : "bg-white/10"
                    }`}>
                      {isSelected ? (
                        <Check className="w-4 h-4 text-white" />
                      ) : (
                        <MapPin className="w-4 h-4 text-white/40" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-white text-sm font-medium">{addr.name}</span>
                        {addr.isDefault && (
                          <span className="text-[9px] text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
                            {t("默认", "Default")}
                          </span>
                        )}
                      </div>
                      <p className="text-white/50 text-[11px] truncate mt-0.5">
                        {getShortAddress(addr)}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/20 flex-shrink-0" />
                  </button>
                );
              })
            )}
          </div>

          {/* Add new address button */}
          <div className="px-4 py-3 pb-8 border-t border-white/5">
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full py-3 rounded-xl border border-dashed border-primary/40 text-primary font-medium flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors text-xs"
            >
              <Plus className="w-4 h-4" />
              {t("添加新地址", "Add New Address")}
            </button>
          </div>
        </div>
      </div>

      <AddressForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleAddAddress}
        mode="add"
      />
    </>
  );
};
