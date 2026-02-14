import { useState } from "react";
import { X, MapPin, Navigation, Loader2, Building2 } from "lucide-react";
import { Address } from "@/contexts/AddressContext";
import { useLocationDetect, NearbyPOI } from "@/hooks/useLocationDetect";

interface AddressFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (address: Omit<Address, "id">) => void;
  initialData?: Address;
  mode: "add" | "edit";
}

const TAGS = ["家", "公司", "学校", "其他"] as const;

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
    latitude: initialData?.latitude,
    longitude: initialData?.longitude,
    isDefault: initialData?.isDefault || false,
  });

  const [doorNumber, setDoorNumber] = useState("");
  const [gender, setGender] = useState<"mr" | "ms">("mr");
  const [tag, setTag] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { loading, pois, showList, setShowList, error: locationError, detect } = useLocationDetect();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "请输入收货人姓名";
    if (!formData.phone.trim()) newErrors.phone = "请输入手机号码";
    else if (!/^1[3-9]\d{9}$/.test(formData.phone)) newErrors.phone = "请输入正确的手机号码";
    if (!formData.detail.trim()) newErrors.detail = "请选择收货地址";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const finalDetail = doorNumber
        ? `${formData.detail} ${doorNumber}`
        : formData.detail;
      onSubmit({ ...formData, detail: finalDetail });
      onClose();
    }
  };

  const handleAddressRowClick = () => {
    if (pois.length === 0) {
      detect();
    } else {
      setShowList(true);
    }
  };

  const handlePOISelect = (poi: NearbyPOI) => {
    setFormData((prev) => ({
      ...prev,
      province: poi.province,
      provinceEn: poi.provinceEn,
      city: poi.city,
      cityEn: poi.cityEn,
      district: poi.district,
      districtEn: poi.districtEn,
      detail: poi.name + (poi.address ? `（${poi.address}）` : ""),
      detailEn: poi.name,
      latitude: poi.lat,
      longitude: poi.lng,
    }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next.detail;
      return next;
    });
    setShowList(false);
  };

  const addressDisplay = formData.detail || "";
  const addressSubline = formData.detail
    ? [formData.province, formData.city, formData.district].filter(Boolean).join("")
    : "";

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-[80] transition-transform duration-300 ease-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ height: "92vh" }}
      >
        <div className="bg-card rounded-t-3xl max-w-md mx-auto h-full flex flex-col safe-bottom overflow-hidden">
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
            <div className="w-10 h-1 bg-border rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 pb-3 flex-shrink-0">
            <h2 className="text-lg font-bold text-foreground">
              {mode === "add" ? "新增收货地址" : "编辑收货地址"}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable content — everything in one flat scroll */}
          <div className="flex-1 overflow-y-auto px-5 pb-4">
            {/* Map / Location area */}
            <div className="relative h-36 bg-secondary/50 rounded-2xl mb-3 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                {loading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    <span className="text-xs text-muted-foreground">正在定位...</span>
                  </div>
                ) : formData.latitude && formData.longitude ? (
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">
                      {formData.district || "已定位"}
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={handleAddressRowClick}
                    className="flex flex-col items-center gap-2 active:scale-95 transition-transform"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Navigation className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xs text-muted-foreground">点击定位当前位置</span>
                  </button>
                )}
              </div>
              {locationError && (
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-xs text-destructive text-center bg-background/80 rounded-lg py-1 px-2">{locationError}</p>
                </div>
              )}
            </div>

            {/* Form Card */}
            <div className="bg-card rounded-2xl border border-border overflow-hidden divide-y divide-border">
              {/* Address Row - tappable */}
              <button
                type="button"
                onClick={handleAddressRowClick}
                className="w-full flex items-start gap-3 px-4 py-4 text-left active:bg-secondary/50 transition-colors"
              >
                <span className="text-sm text-muted-foreground shrink-0 pt-0.5 w-12">地址</span>
                <div className="flex-1 min-w-0">
                  {addressDisplay ? (
                    <>
                      <p className="text-sm font-medium text-foreground leading-snug">{addressDisplay}</p>
                      {addressSubline && (
                        <p className="text-xs text-muted-foreground mt-0.5">{addressSubline}</p>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">请选择收货地址</p>
                  )}
                </div>
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              </button>

              {/* Door Number */}
              <div className="flex items-center gap-3 px-4 py-4">
                <span className="text-sm text-muted-foreground shrink-0 w-12">门牌号</span>
                <input
                  type="text"
                  value={doorNumber}
                  onChange={(e) => setDoorNumber(e.target.value)}
                  placeholder="例：5号楼508室"
                  className="flex-1 text-sm text-foreground placeholder:text-muted-foreground/60 bg-transparent focus:outline-none"
                  maxLength={30}
                />
              </div>

              {/* Recipient Name + Gender */}
              <div className="flex items-center gap-3 px-4 py-4">
                <span className="text-sm text-muted-foreground shrink-0 w-12">收货人</span>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, name: e.target.value }));
                    if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                  }}
                  placeholder="请填写收货人姓名"
                  className={`flex-1 text-sm text-foreground placeholder:text-muted-foreground/60 bg-transparent focus:outline-none ${
                    errors.name ? "text-destructive" : ""
                  }`}
                  maxLength={20}
                />
                <div className="flex items-center gap-3 shrink-0">
                  <label className="flex items-center gap-1 cursor-pointer" onClick={() => setGender("mr")}>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      gender === "mr" ? "border-primary bg-primary" : "border-muted-foreground/30"
                    }`}>
                      {gender === "mr" && <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />}
                    </div>
                    <span className={`text-sm ${gender === "mr" ? "text-primary font-medium" : "text-muted-foreground"}`}>先生</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer" onClick={() => setGender("ms")}>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      gender === "ms" ? "border-primary bg-primary" : "border-muted-foreground/30"
                    }`}>
                      {gender === "ms" && <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />}
                    </div>
                    <span className={`text-sm ${gender === "ms" ? "text-primary font-medium" : "text-muted-foreground"}`}>女士</span>
                  </label>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3 px-4 py-4">
                <span className="text-sm text-muted-foreground shrink-0 w-12">手机号</span>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 11);
                    setFormData((prev) => ({ ...prev, phone: val }));
                    if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
                  }}
                  placeholder="请输入11位手机号码"
                  className={`flex-1 text-sm text-foreground placeholder:text-muted-foreground/60 bg-transparent focus:outline-none ${
                    errors.phone ? "text-destructive" : ""
                  }`}
                />
              </div>

              {/* Tags */}
              <div className="flex items-center gap-3 px-4 py-4">
                <span className="text-sm text-muted-foreground shrink-0 w-12">标签</span>
                <div className="flex items-center gap-2">
                  {TAGS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTag(tag === t ? "" : t)}
                      className={`px-3 py-1 rounded-md text-xs border transition-colors ${
                        tag === t
                          ? "border-primary text-primary bg-primary/5 font-medium"
                          : "border-border text-muted-foreground hover:border-muted-foreground/50"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Default Address Toggle */}
              <div className="flex items-center justify-between px-4 py-4">
                <span className="text-sm text-muted-foreground">默认地址</span>
                <button
                  onClick={() => setFormData((prev) => ({ ...prev, isDefault: !prev.isDefault }))}
                  className={`w-11 h-6 rounded-full transition-colors ${
                    formData.isDefault ? "bg-primary" : "bg-secondary"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      formData.isDefault ? "translate-x-[22px]" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Inline POI list — appears below form card, no separate overlay */}
            {(showList || loading) && (
              <div className="mt-3 rounded-2xl border border-border bg-card overflow-hidden">
                <div className="flex items-center justify-between px-4 pt-3 pb-2">
                  <span className="text-sm font-semibold text-foreground">选择地点</span>
                  {showList && (
                    <button
                      onClick={() => setShowList(false)}
                      className="text-xs text-muted-foreground"
                    >
                      收起
                    </button>
                  )}
                </div>

                {/* Search hint */}
                <div className="px-4 pb-2">
                  <div className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-xl">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">搜索地点</span>
                  </div>
                </div>

                {loading && (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="w-4 h-4 animate-spin text-primary mr-2" />
                    <span className="text-sm text-muted-foreground">正在搜索附近地点...</span>
                  </div>
                )}

                {!loading && pois.length > 0 && (
                  <div className="max-h-56 overflow-y-auto divide-y divide-border">
                    {pois.map((poi, i) => (
                      <button
                        key={`${poi.name}-${i}`}
                        type="button"
                        onClick={() => handlePOISelect(poi)}
                        className="w-full flex items-start gap-3 px-4 py-3 hover:bg-secondary/50 active:bg-secondary transition-colors text-left"
                      >
                        <Building2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground">{poi.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {poi.district} {poi.address}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {!loading && showList && pois.length === 0 && (
                  <div className="flex items-center justify-center py-6">
                    <span className="text-sm text-muted-foreground">未找到附近地点</span>
                  </div>
                )}
              </div>
            )}

            {/* Error messages */}
            {(errors.name || errors.phone || errors.detail) && (
              <div className="mt-2 px-1 space-y-1">
                {errors.detail && <p className="text-xs text-destructive">{errors.detail}</p>}
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex-shrink-0 px-5 py-4">
            <button
              onClick={handleSubmit}
              className="btn-gold w-full py-4 rounded-2xl text-base font-semibold"
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
