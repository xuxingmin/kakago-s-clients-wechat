import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Plus, MapPin, Phone, Edit2, Trash2, Check } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { AddressForm } from "@/components/AddressForm";
import { useToast } from "@/hooks/use-toast";

export interface Address {
  id: string;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detail: string;
  isDefault: boolean;
}

// Demo addresses
const initialAddresses: Address[] = [
  {
    id: "addr-001",
    name: "张三",
    phone: "13888888888",
    province: "安徽省",
    city: "合肥市",
    district: "蜀山区",
    detail: "天鹅湖CBD · 万达广场3号楼15层1502室",
    isDefault: true,
  },
  {
    id: "addr-002",
    name: "张三",
    phone: "13888888888",
    province: "安徽省",
    city: "合肥市",
    district: "包河区",
    detail: "滨湖新区·银泰城B座2201",
    isDefault: false,
  },
];

const AddressManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const handleAddAddress = (newAddress: Omit<Address, "id">) => {
    const address: Address = {
      ...newAddress,
      id: `addr-${Date.now()}`,
    };

    // If new address is default, update other addresses
    if (address.isDefault) {
      setAddresses((prev) =>
        prev.map((addr) => ({ ...addr, isDefault: false }))
      );
    }

    setAddresses((prev) => [...prev, address]);
    toast({ title: "地址添加成功" });
  };

  const handleEditAddress = (updatedAddress: Omit<Address, "id">) => {
    if (!editingAddress) return;

    // If updated address is default, update other addresses
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
    toast({ title: "地址更新成功" });
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
    toast({ title: "地址已删除" });
  };

  const handleSetDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
    toast({ title: "已设为默认地址" });
  };

  const maskPhone = (phone: string) => {
    return phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border safe-top">
        <div className="flex items-center justify-between px-4 py-3 max-w-md mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-base font-semibold text-foreground">地址管理</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="w-9 h-9 rounded-full bg-primary flex items-center justify-center"
          >
            <Plus className="w-5 h-5 text-primary-foreground" />
          </button>
        </div>
      </header>

      {/* Address List */}
      <section className="px-4 py-4 space-y-3">
        {addresses.length > 0 ? (
          addresses.map((address, index) => (
            <div
              key={address.id}
              className="card-premium p-4 animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Default Badge */}
              {address.isDefault && (
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    默认地址
                  </span>
                </div>
              )}

              {/* Contact Info */}
              <div className="flex items-center gap-3 mb-2">
                <span className="font-semibold text-foreground">{address.name}</span>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Phone className="w-3 h-3" />
                  <span className="text-sm">{maskPhone(address.phone)}</span>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-2 mb-3">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {address.province}{address.city}{address.district} {address.detail}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setEditingAddress(address)}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>编辑</span>
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(address.id)}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>删除</span>
                  </button>
                </div>

                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    <span>设为默认</span>
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
              <MapPin className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm mb-4">暂无收货地址</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-gold px-6 py-3 rounded-xl text-sm font-medium"
            >
              添加新地址
            </button>
          </div>
        )}
      </section>

      {/* Add Address Button (Fixed at bottom when has addresses) */}
      {addresses.length > 0 && (
        <div className="fixed bottom-20 left-0 right-0 px-4 pb-4 max-w-md mx-auto">
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full py-4 rounded-2xl border-2 border-dashed border-primary/50 text-primary font-medium flex items-center justify-center gap-2 bg-card hover:bg-primary/5 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>添加新地址</span>
          </button>
        </div>
      )}

      {/* Add Address Form */}
      <AddressForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleAddAddress}
        mode="add"
      />

      {/* Edit Address Form */}
      {editingAddress && (
        <AddressForm
          isOpen={!!editingAddress}
          onClose={() => setEditingAddress(null)}
          onSubmit={handleEditAddress}
          initialData={editingAddress}
          mode="edit"
        />
      )}

      <BottomNav />
    </div>
  );
};

export default AddressManagement;
