import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ChevronLeft, MapPin, Loader2, Navigation } from "lucide-react";
import { useAddress, Address } from "@/contexts/AddressContext";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

const TAGS = ["家", "公司", "学校", "其他"] as const;

const AddressFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { addresses, addAddress, updateAddress } = useAddress();

  const isEdit = !!id;
  const existingAddress = isEdit ? addresses.find((a) => a.id === id) : null;

  const [formData, setFormData] = useState({
    name: existingAddress?.name || "",
    phone: existingAddress?.phone || "",
    province: existingAddress?.province || "",
    provinceEn: existingAddress?.provinceEn || "",
    city: existingAddress?.city || "",
    cityEn: existingAddress?.cityEn || "",
    district: existingAddress?.district || "",
    districtEn: existingAddress?.districtEn || "",
    detail: existingAddress?.detail || "",
    detailEn: existingAddress?.detailEn || "",
    latitude: existingAddress?.latitude,
    longitude: existingAddress?.longitude,
    isDefault: existingAddress?.isDefault || false,
  });
  const [doorNumber, setDoorNumber] = useState("");
  const [gender, setGender] = useState<"mr" | "ms">("mr");
  const [tag, setTag] = useState<string>(existingAddress?.tag || "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Receive selected address from AddressSelectPage via location state
  useEffect(() => {
    const state = location.state as any;
    if (state?.selectedPOI) {
      const poi = state.selectedPOI;
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
      // Clear state so it doesn't re-apply on re-render
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

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
    if (!validateForm()) return;
    const finalDetail = doorNumber ? `${formData.detail} ${doorNumber}` : formData.detail;
    const payload = { ...formData, detail: finalDetail, tag };

    if (isEdit && id) {
      updateAddress(id, payload);
      toast({ title: t("地址更新成功", "Address updated") });
    } else {
      addAddress(payload);
      toast({ title: t("地址添加成功", "Address added") });
    }
    navigate("/address");
  };

  const addressDisplay = formData.detail || "";
  const addressSubline = formData.detail
    ? [formData.province, formData.city, formData.district].filter(Boolean).join("")
    : "";

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border flex-shrink-0">
        <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center">
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-base font-semibold text-foreground">
          {isEdit ? t("编辑收货地址", "Edit Address") : t("新增收货地址", "New Address")}
        </h1>
        <div className="w-8" />
      </div>

      {/* Map area placeholder */}
      <div className="relative h-44 bg-secondary/30 flex-shrink-0 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          {formData.latitude && formData.longitude ? (
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground mt-1">
                {formData.district || t("已定位", "Located")}
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <Navigation className="w-5 h-5 text-muted-foreground" />
              </div>
              <span className="text-xs text-muted-foreground">{t("请选择收货地址", "Select address")}</span>
            </div>
          )}
        </div>
        {/* Fake map grid lines */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div key={`h-${i}`} className="absolute w-full border-t border-foreground" style={{ top: `${(i + 1) * 16}%` }} />
          ))}
          {[...Array(5)].map((_, i) => (
            <div key={`v-${i}`} className="absolute h-full border-l border-foreground" style={{ left: `${(i + 1) * 20}%` }} />
          ))}
        </div>
      </div>

      {/* Scrollable form content */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="mx-4 -mt-2 relative z-10">
          <div className="bg-card rounded-2xl border border-border overflow-hidden divide-y divide-border">
            {/* Address Row - navigates to select page */}
            <button
              type="button"
              onClick={() => navigate("/address/select", { state: { returnTo: isEdit ? `/address/edit/${id}` : "/address/new" } })}
              className="w-full flex items-start gap-3 px-4 py-4 text-left active:bg-secondary/50 transition-colors"
            >
              <span className="text-sm text-muted-foreground shrink-0 pt-0.5 w-12">{t("地址", "Address")}</span>
              <div className="flex-1 min-w-0">
                {addressDisplay ? (
                  <>
                    <p className="text-sm font-medium text-foreground leading-snug">{addressDisplay}</p>
                    {addressSubline && (
                      <p className="text-xs text-muted-foreground mt-0.5">{addressSubline}</p>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">{t("请选择收货地址", "Select address")}</p>
                )}
              </div>
              <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            </button>

            {/* Door Number */}
            <div className="flex items-center gap-3 px-4 py-4">
              <span className="text-sm text-muted-foreground shrink-0 w-12">{t("门牌号", "Unit")}</span>
              <input
                type="text"
                value={doorNumber}
                onChange={(e) => setDoorNumber(e.target.value)}
                placeholder={t("例：5号楼508室", "e.g. Bldg 5 Rm 508")}
                className="flex-1 text-sm text-foreground placeholder:text-muted-foreground/60 bg-transparent focus:outline-none"
                maxLength={30}
              />
            </div>

            {/* Recipient Name + Gender */}
            <div className="flex items-center gap-3 px-4 py-4">
              <span className="text-sm text-muted-foreground shrink-0 w-12">{t("收货人", "Name")}</span>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, name: e.target.value }));
                  if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                }}
                placeholder={t("请填写收货人姓名", "Recipient name")}
                className={`flex-1 text-sm text-foreground placeholder:text-muted-foreground/60 bg-transparent focus:outline-none ${errors.name ? "text-destructive" : ""}`}
                maxLength={20}
              />
              <div className="flex items-center gap-3 shrink-0">
                {(["mr", "ms"] as const).map((g) => (
                  <label key={g} className="flex items-center gap-1 cursor-pointer" onClick={() => setGender(g)}>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${gender === g ? "border-primary bg-primary" : "border-muted-foreground/30"}`}>
                      {gender === g && <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />}
                    </div>
                    <span className={`text-sm ${gender === g ? "text-primary font-medium" : "text-muted-foreground"}`}>
                      {g === "mr" ? t("先生", "Mr.") : t("女士", "Ms.")}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3 px-4 py-4">
              <span className="text-sm text-muted-foreground shrink-0 w-12">{t("手机号", "Phone")}</span>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 11);
                  setFormData((prev) => ({ ...prev, phone: val }));
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
                }}
                placeholder={t("请输入11位手机号码", "11-digit phone number")}
                className={`flex-1 text-sm text-foreground placeholder:text-muted-foreground/60 bg-transparent focus:outline-none ${errors.phone ? "text-destructive" : ""}`}
              />
            </div>

            {/* Tags */}
            <div className="flex items-center gap-3 px-4 py-4">
              <span className="text-sm text-muted-foreground shrink-0 w-12">{t("标签", "Label")}</span>
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
              <span className="text-sm text-muted-foreground">{t("默认地址", "Default")}</span>
              <button
                onClick={() => setFormData((prev) => ({ ...prev, isDefault: !prev.isDefault }))}
                className={`w-11 h-6 rounded-full transition-colors ${formData.isDefault ? "bg-primary" : "bg-secondary"}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${formData.isDefault ? "translate-x-[22px]" : "translate-x-0.5"}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Error messages */}
        {(errors.name || errors.phone || errors.detail) && (
          <div className="mx-4 mt-2 space-y-1">
            {errors.detail && <p className="text-xs text-destructive">{errors.detail}</p>}
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <div className="w-[393px] mx-auto bg-card border-t border-border px-4 py-3">
          <button
            onClick={handleSubmit}
            className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-base"
          >
            {t("保存", "Save")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressFormPage;
