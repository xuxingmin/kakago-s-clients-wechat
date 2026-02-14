import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ChevronLeft, MapPin, Navigation } from "lucide-react";
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
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header bar */}
      <div className="flex-shrink-0 glass">
        <div className="h-11 bg-background flex items-end justify-between px-6 pb-0.5">
          <span className="text-xs font-semibold text-white/90">
            {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
          <div className="flex items-center gap-1">
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none" className="text-white/70">
              <rect x="0" y="8" width="3" height="4" rx="0.5" fill="currentColor" />
              <rect x="4.5" y="5" width="3" height="7" rx="0.5" fill="currentColor" />
              <rect x="9" y="2" width="3" height="10" rx="0.5" fill="currentColor" />
              <rect x="13" y="0" width="3" height="12" rx="0.5" fill="currentColor" />
            </svg>
            <span className="text-[10px] text-white/70 font-medium ml-0.5">5G</span>
            <svg width="22" height="11" viewBox="0 0 22 11" fill="none" className="text-white/70 ml-1">
              <rect x="0.5" y="0.5" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1" />
              <rect x="19.5" y="3" width="2" height="5" rx="1" fill="currentColor" />
              <rect x="2" y="2" width="12" height="7" rx="1" fill="currentColor" />
            </svg>
          </div>
        </div>
        <div className="h-11 flex items-center justify-between px-3">
          <button onClick={() => navigate(-1)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
            <ChevronLeft className="w-4 h-4 text-white/80" />
          </button>
          <h1 className="text-[15px] font-semibold text-white">
            {isEdit ? t("编辑收货地址", "Edit Address") : t("新增收货地址", "New Address")}
          </h1>
          <div className="w-8" />
        </div>
      </div>

      {/* Map area */}
      <div className="relative h-44 flex-shrink-0 overflow-hidden" style={{
        background: 'linear-gradient(135deg, hsla(270, 20%, 10%, 0.8) 0%, hsla(270, 25%, 8%, 0.9) 100%)'
      }}>
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-[0.06]">
          {[...Array(8)].map((_, i) => (
            <div key={`h-${i}`} className="absolute w-full border-t border-white" style={{ top: `${(i + 1) * 12}%` }} />
          ))}
          {[...Array(6)].map((_, i) => (
            <div key={`v-${i}`} className="absolute h-full border-l border-white" style={{ left: `${(i + 1) * 16}%` }} />
          ))}
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          {formData.latitude && formData.longitude ? (
            <div className="flex flex-col items-center gap-2 animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center pulse-glow">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xs text-white/50 font-medium">
                {formData.district || t("已定位", "Located")}
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                <Navigation className="w-5 h-5 text-white/30" />
              </div>
              <span className="text-xs text-white/30">{t("请选择收货地址", "Select address")}</span>
            </div>
          )}
        </div>
      </div>

      {/* Form Card */}
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-28 -mt-3 relative z-10">
        <div className="mx-4">
          <div className="card-premium overflow-hidden divide-y divide-white/5">
            {/* Address Row */}
            <button
              type="button"
              onClick={() => navigate("/address/select", { state: { returnTo: isEdit ? `/address/edit/${id}` : "/address/new" } })}
              className="w-full flex items-start gap-3 px-4 py-4 text-left active:bg-white/5 transition-colors"
            >
              <span className="text-sm text-white/40 shrink-0 pt-0.5 w-12">{t("地址", "Addr")}</span>
              <div className="flex-1 min-w-0">
                {addressDisplay ? (
                  <>
                    <p className="text-sm font-medium text-white/90 leading-snug">{addressDisplay}</p>
                    {addressSubline && (
                      <p className="text-xs text-white/40 mt-0.5">{addressSubline}</p>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-white/30">{t("请选择收货地址", "Select address")}</p>
                )}
              </div>
              <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            </button>

            {/* Door Number */}
            <div className="flex items-center gap-3 px-4 py-4">
              <span className="text-sm text-white/40 shrink-0 w-12">{t("门牌号", "Unit")}</span>
              <input
                type="text"
                value={doorNumber}
                onChange={(e) => setDoorNumber(e.target.value)}
                placeholder={t("例：5号楼508室", "e.g. Bldg 5 Rm 508")}
                className="flex-1 text-sm text-white placeholder:text-white/20 bg-transparent focus:outline-none"
                maxLength={30}
              />
            </div>

            {/* Recipient + Gender */}
            <div className="flex items-center gap-3 px-4 py-4">
              <span className="text-sm text-white/40 shrink-0 w-12">{t("收货人", "Name")}</span>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, name: e.target.value }));
                  if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                }}
                placeholder={t("请填写收货人姓名", "Recipient name")}
                className={`flex-1 text-sm text-white placeholder:text-white/20 bg-transparent focus:outline-none ${errors.name ? "text-red-400" : ""}`}
                maxLength={20}
              />
              <div className="flex items-center gap-3 shrink-0">
                {(["mr", "ms"] as const).map((g) => (
                  <label key={g} className="flex items-center gap-1 cursor-pointer" onClick={() => setGender(g)}>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                      gender === g ? "border-primary bg-primary" : "border-white/20"
                    }`}>
                      {gender === g && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <span className={`text-sm ${gender === g ? "text-primary font-medium" : "text-white/40"}`}>
                      {g === "mr" ? t("先生", "Mr.") : t("女士", "Ms.")}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3 px-4 py-4">
              <span className="text-sm text-white/40 shrink-0 w-12">{t("手机号", "Phone")}</span>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 11);
                  setFormData((prev) => ({ ...prev, phone: val }));
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
                }}
                placeholder={t("请输入11位手机号码", "11-digit phone")}
                className={`flex-1 text-sm text-white placeholder:text-white/20 bg-transparent focus:outline-none ${errors.phone ? "text-red-400" : ""}`}
              />
            </div>

            {/* Tags */}
            <div className="flex items-center gap-3 px-4 py-4">
              <span className="text-sm text-white/40 shrink-0 w-12">{t("标签", "Label")}</span>
              <div className="flex items-center gap-2">
                {TAGS.map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setTag(tag === label ? "" : label)}
                    className={`px-3 py-1 rounded-full text-xs border transition-all ${
                      tag === label
                        ? "border-primary/50 text-primary bg-primary/10 font-medium"
                        : "border-white/10 text-white/40 hover:border-white/20"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Default Toggle */}
            <div className="flex items-center justify-between px-4 py-4">
              <span className="text-sm text-white/40">{t("默认地址", "Default")}</span>
              <button
                onClick={() => setFormData((prev) => ({ ...prev, isDefault: !prev.isDefault }))}
                className={`w-11 h-6 rounded-full transition-colors ${formData.isDefault ? "bg-primary" : "bg-white/10"}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${formData.isDefault ? "translate-x-[22px]" : "translate-x-0.5"}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Errors */}
        {(errors.name || errors.phone || errors.detail) && (
          <div className="mx-4 mt-3 space-y-1 animate-fade-in">
            {errors.detail && <p className="text-xs text-red-400">⚠ {errors.detail}</p>}
            {errors.name && <p className="text-xs text-red-400">⚠ {errors.name}</p>}
            {errors.phone && <p className="text-xs text-red-400">⚠ {errors.phone}</p>}
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <div className="w-[393px] mx-auto glass px-4 py-3 safe-bottom">
          <button
            onClick={handleSubmit}
            className="btn-gold w-full py-3.5 text-base font-semibold"
          >
            {t("保存", "Save")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressFormPage;
