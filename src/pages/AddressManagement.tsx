import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Plus, MapPin, Phone, Edit2, Trash2, Check } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { BrandBanner } from "@/components/BrandBanner";
import { Header } from "@/components/Header";
import { AddressForm } from "@/components/AddressForm";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAddress, Address } from "@/contexts/AddressContext";

const AddressManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { addresses, addAddress, updateAddress, deleteAddress, setDefault } = useAddress();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const handleAddAddress = (newAddress: Omit<Address, "id">) => {
    addAddress(newAddress);
    toast({ title: t("地址添加成功", "Address added successfully") });
  };

  const handleEditAddress = (updatedAddress: Omit<Address, "id">) => {
    if (!editingAddress) return;
    updateAddress(editingAddress.id, updatedAddress);
    setEditingAddress(null);
    toast({ title: t("地址更新成功", "Address updated successfully") });
  };

  const handleDeleteAddress = (id: string) => {
    deleteAddress(id);
    toast({ title: t("地址已删除", "Address deleted") });
  };

  const handleSetDefault = (id: string) => {
    setDefault(id);
    toast({ title: t("已设为默认地址", "Set as default address") });
  };

  const maskPhone = (phone: string) => {
    return phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
  };

  const getFullAddress = (address: Address) => {
    return t(
      `${address.province}${address.city}${address.district} ${address.detail}`,
      `${address.detailEn}, ${address.districtEn}, ${address.cityEn}, ${address.provinceEn}`
    );
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-shrink-0">
        <div className="absolute top-3 left-4 z-50 safe-top">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 rounded-full bg-secondary/80 backdrop-blur flex items-center justify-center"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
        </div>
        <div className="absolute top-3 right-4 z-50 safe-top">
          <button
            onClick={() => setShowAddForm(true)}
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center"
          >
            <Plus className="w-4 h-4 text-primary-foreground" />
          </button>
        </div>
        <Header />
        <BrandBanner />
        <div className="fog-divider mx-4" />
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <section className="px-4 py-3 space-y-2">
          {addresses.length > 0 ? (
            addresses.map((address, index) => (
              <div
                key={address.id}
                className="card-md animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {address.isDefault && (
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-[9px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
                      {t("默认地址", "Default")}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-semibold text-white text-sm">{address.name}</span>
                  <div className="flex items-center gap-1 text-white/50">
                    <Phone className="w-2.5 h-2.5" />
                    <span className="text-[10px]">{maskPhone(address.phone)}</span>
                  </div>
                </div>

                <div className="flex items-start gap-1.5 mb-2">
                  <MapPin className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-[10px] text-white/60 leading-relaxed">
                    {getFullAddress(address)}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingAddress(address)}
                      className="flex items-center gap-1 text-[10px] text-white/50 hover:text-white transition-colors"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>{t("编辑", "Edit")}</span>
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(address.id)}
                      className="flex items-center gap-1 text-[10px] text-white/50 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>{t("删除", "Delete")}</span>
                    </button>
                  </div>

                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      className="flex items-center gap-1 text-[10px] text-primary hover:text-primary/80 transition-colors"
                    >
                      <Check className="w-3 h-3" />
                      <span>{t("设为默认", "Set Default")}</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mb-3">
                <MapPin className="w-7 h-7 text-white/30" />
              </div>
              <p className="text-white/40 text-xs mb-4">
                {t("暂无收货地址", "No delivery addresses")}
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="btn-gold px-5 py-2.5 rounded-xl text-xs font-medium"
              >
                {t("添加新地址", "Add New Address")}
              </button>
            </div>
          )}
        </section>

        {addresses.length > 0 && (
          <div className="px-4 pb-4">
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full py-3 rounded-xl border-2 border-dashed border-primary/50 text-primary font-medium flex items-center justify-center gap-2 bg-card hover:bg-primary/5 transition-colors text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>{t("添加新地址", "Add New Address")}</span>
            </button>
          </div>
        )}
      </div>

      <div className="flex-shrink-0">
        <BottomNav />
      </div>

      <AddressForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleAddAddress}
        mode="add"
      />

      {editingAddress && (
        <AddressForm
          isOpen={!!editingAddress}
          onClose={() => setEditingAddress(null)}
          onSubmit={handleEditAddress}
          initialData={editingAddress}
          mode="edit"
        />
      )}
    </div>
  );
};

export default AddressManagement;
