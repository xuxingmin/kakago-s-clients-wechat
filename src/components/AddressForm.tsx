import { useState } from "react";
import { X, MapPin } from "lucide-react";
import { Address } from "@/contexts/AddressContext";

interface AddressFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (address: Omit<Address, "id">) => void;
  initialData?: Address;
  mode: "add" | "edit";
}

export const AddressForm = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
}: AddressFormProps) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    phone: initialData?.phone || "",
    province: initialData?.province || "",
    provinceEn: initialData?.provinceEn || "",
    city: initialData?.city || "",
    cityEn: initialData?.cityEn || "",
    district: initialData?.district || "",
    districtEn: initialData?.districtEn || "",
    detail: initialData?.detail || "",
    detailEn: initialData?.detailEn || "",
    isDefault: initialData?.isDefault || false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = "请输入收货人姓名";
    if (!formData.phone.trim()) newErrors.phone = "请输入手机号码";
    else if (!/^1[3-9]\d{9}$/.test(formData.phone)) newErrors.phone = "请输入正确的手机号码";
    if (!formData.province.trim()) newErrors.province = "请选择省份";
    if (!formData.city.trim()) newErrors.city = "请选择城市";
    if (!formData.district.trim()) newErrors.district = "请选择区县";
    if (!formData.detail.trim()) newErrors.detail = "请输入详细地址";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
      onClose();
    }
  };

  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ height: "85vh" }}
      >
        <div className="bg-card rounded-t-3xl max-w-md mx-auto h-full flex flex-col safe-bottom overflow-hidden">
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
            <div className="w-10 h-1 bg-border rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 pb-4 flex-shrink-0 border-b border-border">
            <h2 className="text-lg font-bold text-foreground">
              {mode === "add" ? "新增地址" : "编辑地址"}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {/* Name */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                收货人 <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="请输入收货人姓名"
                className={`w-full px-4 py-3 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                  errors.name ? "ring-2 ring-destructive/50" : ""
                }`}
                maxLength={20}
              />
              {errors.name && (
                <p className="text-xs text-destructive mt-1">{errors.name}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                手机号码 <span className="text-destructive">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => updateField("phone", e.target.value.replace(/\D/g, "").slice(0, 11))}
                placeholder="请输入手机号码"
                className={`w-full px-4 py-3 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                  errors.phone ? "ring-2 ring-destructive/50" : ""
                }`}
              />
              {errors.phone && (
                <p className="text-xs text-destructive mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Region Selection */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                所在地区 <span className="text-destructive">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <input
                    type="text"
                    value={formData.province}
                    onChange={(e) => updateField("province", e.target.value)}
                    placeholder="省份"
                    className={`w-full px-3 py-3 bg-secondary rounded-xl text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                      errors.province ? "ring-2 ring-destructive/50" : ""
                    }`}
                    maxLength={10}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    placeholder="城市"
                    className={`w-full px-3 py-3 bg-secondary rounded-xl text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                      errors.city ? "ring-2 ring-destructive/50" : ""
                    }`}
                    maxLength={10}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => updateField("district", e.target.value)}
                    placeholder="区县"
                    className={`w-full px-3 py-3 bg-secondary rounded-xl text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                      errors.district ? "ring-2 ring-destructive/50" : ""
                    }`}
                    maxLength={10}
                  />
                </div>
              </div>
              {(errors.province || errors.city || errors.district) && (
                <p className="text-xs text-destructive mt-1">请填写完整的地区信息</p>
              )}
            </div>

            {/* Detail Address */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                详细地址 <span className="text-destructive">*</span>
              </label>
              <textarea
                value={formData.detail}
                onChange={(e) => updateField("detail", e.target.value)}
                placeholder="请输入详细地址，如街道、门牌号、楼层等"
                className={`w-full px-4 py-3 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground resize-none h-24 focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                  errors.detail ? "ring-2 ring-destructive/50" : ""
                }`}
                maxLength={100}
              />
              {errors.detail && (
                <p className="text-xs text-destructive mt-1">{errors.detail}</p>
              )}
            </div>

            {/* Default Address Toggle */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground">设为默认地址</span>
              </div>
              <button
                onClick={() => updateField("isDefault", !formData.isDefault)}
                className={`w-12 h-7 rounded-full transition-colors ${
                  formData.isDefault ? "bg-primary" : "bg-secondary"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    formData.isDefault ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex-shrink-0 px-5 py-4 border-t border-border">
            <button
              onClick={handleSubmit}
              className="btn-gold w-full py-4 rounded-2xl text-base font-semibold"
            >
              保存地址
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
