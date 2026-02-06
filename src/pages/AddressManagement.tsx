import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Plus, MapPin, Phone, Edit2, Trash2, Check } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { BrandBanner } from "@/components/BrandBanner";
import { Header } from "@/components/Header";
import { AddressForm } from "@/components/AddressForm";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export interface Address {
  id: string;
  name: string;
  phone: string;
  province: string;
  provinceEn: string;
  city: string;
  cityEn: string;
  district: string;
  districtEn: string;
  detail: string;
  detailEn: string;
  isDefault: boolean;
}

// Demo addresses
const initialAddresses: Address[] = [
  {
    id: "addr-001",
    name: "张三",
    phone: "13888888888",
    province: "安徽省",
    provinceEn: "Anhui Province",
    city: "合肥市",
    cityEn: "Hefei City",
    district: "蜀山区",
    districtEn: "Shushan District",
    detail: "天鹅湖CBD · 万达广场3号楼15层1502室",
    detailEn: "Swan Lake CBD · Wanda Plaza Building 3, 15F, Unit 1502",
    isDefault: true,
  },
  {
    id: "addr-002",
    name: "张三",
    phone: "13888888888",
    province: "安徽省",
    provinceEn: "Anhui Province",
    city: "合肥市",
    cityEn: "Hefei City",
    district: "包河区",
    districtEn: "Baohe District",
    detail: "滨湖新区·银泰城B座2201",
    detailEn: "Binhu New District · Yintai City Tower B, Unit 2201",
    isDefault: false,
  },
];

const AddressManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const handleAddAddress = (newAddress: Omit<Address, "id">) => {
    const address: Address = {
      ...newAddress,
      id: `addr-${Date.now()}`,
    };

    if (address.isDefault) {
      setAddresses((prev) =>
        prev.map((addr) => ({ ...addr, isDefault: false }))
      );
    }

    setAddresses((prev) => [...prev, address]);
    toast({ title: t("地址添加成功", "Address added successfully") });
  };

  const handleEditAddress = (updatedAddress: Omit<Address, "id">) => {
    if (!editingAddress) return;

    if (updatedAddress.isDefault) {
      setAddresses((prev) =>
        prev.map((addr) =>
          addr.id === editingAddress.id
            ? { ...updatedAddress, id: addr.id }
            : { ...addr, isDefault: false }
        )
      );
    } else {
      setAddresses((prev) =>
        prev.map((addr) =>
          addr.id === editingAddress.id
            ? { ...updatedAddress, id: addr.id }
            : addr
        )
      );
    }

    setEditingAddress(null);
    toast({ title: t("地址更新成功", "Address updated successfully") });
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
    toast({ title: t("地址已删除", "Address deleted") });
  };

  const handleSetDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
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
      {/* 固定顶部区域 */}
      <div className="flex-shrink-0">
        {/* Back & Add Buttons */}
        <div className="absolute top-3 left-4 z-50 safe-top">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 rounded-full bg-secondary backdrop-blur flex items-center justify-center"
          >
            <ChevronLeft className="w-4 h-4 text-foreground" />
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

      {/* 可滚动中间区域 */}
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

      {/* 固定底部区域 */}
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
