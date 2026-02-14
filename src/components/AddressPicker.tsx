import { useState } from "react";
import { MapPin, Check, Plus, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAddress, Address } from "@/contexts/AddressContext";
import { AddressForm } from "@/components/AddressForm";

interface AddressPickerProps {
  isOpen: boolean;
  onClose: () => void;
}

/** Extract a short keyword from the address detail, e.g. "万达广场3号楼" → "万达广场301" */
const extractKeyword = (detail: string): string => {
  // Remove separator chars and extra whitespace
  const cleaned = detail.replace(/[·．・\s]+/g, ' ').trim();
  // Try to grab the first landmark-like phrase (up to 8 chars)
  const match = cleaned.match(/[\u4e00-\u9fa5A-Za-z0-9]{2,8}/);
  return match ? match[0] : cleaned.slice(0, 6);
};

const extractKeywordEn = (detail: string): string => {
  const parts = detail.split(/[,·．・]+/).map(s => s.trim()).filter(Boolean);
  return parts[0]?.slice(0, 16) || detail.slice(0, 16);
};

export const AddressPicker = ({ isOpen, onClose }: AddressPickerProps) => {
  const { t } = useLanguage();
  const { addresses, selectedAddress, setSelectedAddress, addAddress } = useAddress();
  const [showAddForm, setShowAddForm] = useState(false);

  if (!isOpen) return null;

  const handleSelect = (address: Address) => {
    setSelectedAddress(address);
    onClose();
  };

  const handleAddAddress = (newAddr: Omit<Address, "id">) => {
    addAddress(newAddr);
    setShowAddForm(false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70]" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-[70] animate-in slide-in-from-bottom duration-300">
        <div className="bg-card rounded-t-2xl border-t border-white/10 max-h-[70vh] flex flex-col">
          {/* Handle */}
          <div className="flex justify-center pt-2 pb-1">
            <div className="w-8 h-1 bg-white/20 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-4 pb-2 border-b border-white/5">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <h3 className="text-white font-medium text-sm">
                {t("选择配送地址", "Delivery Address")}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          {/* Address list - compact rows for 10+ addresses */}
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 scrollbar-hide">
            {addresses.length === 0 ? (
              <div className="py-8 text-center">
                <MapPin className="w-8 h-8 text-white/20 mx-auto mb-2" />
                <p className="text-white/40 text-xs">{t("暂无保存的地址", "No saved addresses")}</p>
              </div>
            ) : (
              addresses.map((addr) => {
                const isSelected = selectedAddress?.id === addr.id;
                const keyword = t(extractKeyword(addr.detail), extractKeywordEn(addr.detailEn));
                const area = t(addr.district, addr.districtEn);

                return (
                  <button
                    key={addr.id}
                    onClick={() => handleSelect(addr)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all ${
                      isSelected
                        ? "bg-primary/10 border border-primary/30"
                        : "bg-white/[0.03] border border-transparent hover:bg-white/[0.06]"
                    }`}
                  >
                    {/* Check / Pin icon */}
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                      isSelected ? "bg-primary" : "bg-white/10"
                    }`}>
                      {isSelected ? (
                        <Check className="w-3 h-3 text-white" />
                      ) : (
                        <MapPin className="w-3 h-3 text-white/40" />
                      )}
                    </div>

                    {/* Compact info */}
                    <div className="flex-1 min-w-0 flex items-center gap-2">
                      <span className="text-white text-[13px] font-medium truncate max-w-[120px]">
                        {keyword}
                      </span>
                      <span className="text-white/30 text-[10px] truncate">
                        {area}
                      </span>
                    </div>

                    {/* Tags */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {addr.isDefault && (
                        <span className="text-[9px] text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
                          {t("默认", "Default")}
                        </span>
                      )}
                      <span className="text-white/20 text-[10px]">{addr.name}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Add new address */}
          <div className="px-4 py-2.5 pb-8 border-t border-white/5">
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full py-2.5 rounded-xl border border-dashed border-primary/40 text-primary font-medium flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors text-xs"
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
