import { useState, useEffect } from "react";
import { X, Building2, FileText } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface InvoiceHeader {
  id: string;
  type: "personal" | "company";
  title: string;
  taxNumber?: string;
  companyAddress?: string;
  companyPhone?: string;
  bankName?: string;
  bankAccount?: string;
  email?: string;
  isDefault: boolean;
}

interface InvoiceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (invoice: InvoiceHeader) => void;
  editInvoice?: InvoiceHeader | null;
}

export const InvoiceForm = ({ isOpen, onClose, onSave, editInvoice }: InvoiceFormProps) => {
  const { t } = useLanguage();
  const [type, setType] = useState<"personal" | "company">("personal");
  const [title, setTitle] = useState("");
  const [taxNumber, setTaxNumber] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [email, setEmail] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    if (editInvoice) {
      setType(editInvoice.type);
      setTitle(editInvoice.title);
      setTaxNumber(editInvoice.taxNumber || "");
      setCompanyAddress(editInvoice.companyAddress || "");
      setCompanyPhone(editInvoice.companyPhone || "");
      setBankName(editInvoice.bankName || "");
      setBankAccount(editInvoice.bankAccount || "");
      setEmail(editInvoice.email || "");
      setIsDefault(editInvoice.isDefault);
    } else {
      resetForm();
    }
  }, [editInvoice, isOpen]);

  const resetForm = () => {
    setType("personal");
    setTitle("");
    setTaxNumber("");
    setCompanyAddress("");
    setCompanyPhone("");
    setBankName("");
    setBankAccount("");
    setEmail("");
    setIsDefault(false);
  };

  const handleSave = () => {
    if (!title.trim()) return;
    if (type === "company" && !taxNumber.trim()) return;

    onSave({
      id: editInvoice?.id || `inv-${Date.now()}`,
      type,
      title: title.trim(),
      taxNumber: type === "company" ? taxNumber.trim() : undefined,
      companyAddress: type === "company" ? companyAddress.trim() || undefined : undefined,
      companyPhone: type === "company" ? companyPhone.trim() || undefined : undefined,
      bankName: type === "company" ? bankName.trim() || undefined : undefined,
      bankAccount: type === "company" ? bankAccount.trim() || undefined : undefined,
      email: email.trim() || undefined,
      isDefault,
    });
    resetForm();
    onClose();
  };

  const isValid = title.trim() && (type === "personal" || taxNumber.trim());

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
        style={{ height: "85vh" }}
      >
        <div className="h-full bg-background rounded-t-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <h3 className="text-sm font-semibold text-white">
              {editInvoice ? t("编辑发票抬头", "Edit Invoice Header") : t("添加发票抬头", "Add Invoice Header")}
            </h3>
            <button onClick={onClose} className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
              <X className="w-4 h-4 text-white/60" />
            </button>
          </div>

          {/* Form */}
          <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-3 space-y-4">
            {/* Type Selector */}
            <div>
              <label className="text-[10px] text-white/50 mb-1.5 block">{t("发票类型", "Invoice Type")}</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setType("personal")}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                    type === "personal"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-white/60"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  {t("个人", "Personal")}
                </button>
                <button
                  onClick={() => setType("company")}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                    type === "company"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-white/60"
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  {t("企业", "Company")}
                </button>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="text-[10px] text-white/50 mb-1.5 block">
                {type === "personal" ? t("个人姓名", "Name") : t("企业名称", "Company Name")} *
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={type === "personal" ? t("请输入姓名", "Enter your name") : t("请输入企业全称", "Enter company name")}
                className="w-full px-3 py-2.5 rounded-xl bg-secondary text-white text-xs placeholder:text-white/30 outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>

            {/* Tax Number (Company only) */}
            {type === "company" && (
              <>
                <div>
                  <label className="text-[10px] text-white/50 mb-1.5 block">{t("纳税人识别号", "Tax ID")} *</label>
                  <input
                    value={taxNumber}
                    onChange={(e) => setTaxNumber(e.target.value)}
                    placeholder={t("请输入纳税人识别号", "Enter tax identification number")}
                    className="w-full px-3 py-2.5 rounded-xl bg-secondary text-white text-xs placeholder:text-white/30 outline-none focus:ring-1 focus:ring-primary/50 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-white/50 mb-1.5 block">{t("企业地址", "Company Address")}</label>
                  <input
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    placeholder={t("选填", "Optional")}
                    className="w-full px-3 py-2.5 rounded-xl bg-secondary text-white text-xs placeholder:text-white/30 outline-none focus:ring-1 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-white/50 mb-1.5 block">{t("企业电话", "Company Phone")}</label>
                  <input
                    value={companyPhone}
                    onChange={(e) => setCompanyPhone(e.target.value)}
                    placeholder={t("选填", "Optional")}
                    className="w-full px-3 py-2.5 rounded-xl bg-secondary text-white text-xs placeholder:text-white/30 outline-none focus:ring-1 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-white/50 mb-1.5 block">{t("开户银行", "Bank Name")}</label>
                  <input
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder={t("选填", "Optional")}
                    className="w-full px-3 py-2.5 rounded-xl bg-secondary text-white text-xs placeholder:text-white/30 outline-none focus:ring-1 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-white/50 mb-1.5 block">{t("银行账号", "Bank Account")}</label>
                  <input
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    placeholder={t("选填", "Optional")}
                    className="w-full px-3 py-2.5 rounded-xl bg-secondary text-white text-xs placeholder:text-white/30 outline-none focus:ring-1 focus:ring-primary/50 font-mono"
                  />
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label className="text-[10px] text-white/50 mb-1.5 block">{t("接收邮箱", "Email")}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("用于接收电子发票", "For receiving e-invoices")}
                className="w-full px-3 py-2.5 rounded-xl bg-secondary text-white text-xs placeholder:text-white/30 outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>

            {/* Default toggle */}
            <div
              onClick={() => setIsDefault(!isDefault)}
              className="flex items-center justify-between py-2 cursor-pointer"
            >
              <span className="text-xs text-white/70">{t("设为默认抬头", "Set as Default")}</span>
              <div className={`w-10 h-5 rounded-full transition-colors ${isDefault ? "bg-primary" : "bg-secondary"} relative`}>
                <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${isDefault ? "translate-x-5" : "translate-x-0.5"}`} />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 pb-8 border-t border-white/10">
            <button
              onClick={handleSave}
              disabled={!isValid}
              className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${
                isValid
                  ? "btn-gold"
                  : "bg-secondary text-white/30 cursor-not-allowed"
              }`}
            >
              {t("保存", "Save")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
