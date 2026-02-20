import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, Upload, CheckCircle2 } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import { BrandBanner } from "@/components/BrandBanner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";

type InvoiceType = "personal" | "corporate";

const InvoiceRequest = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
  const { toast } = useToast();

  const orderNumber = searchParams.get("orderNumber") || "";
  const price = Number(searchParams.get("price") || 0);

  const [invoiceType, setInvoiceType] = useState<InvoiceType>("personal");
  const [title, setTitle] = useState("");
  const [taxId, setTaxId] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [bankInfo, setBankInfo] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = invoiceType === "personal"
    ? title.trim().length > 0
    : title.trim().length > 0 && taxId.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSubmitted(true);
  };

  const handleDone = () => {
    toast({
      title: t("开票申请已提交", "Invoice Request Submitted"),
      description: t("商户将在1个工作日内开具发票", "Merchant will issue within 1 business day"),
    });
    navigate("/orders");
  };

  const handleImportWechat = () => {
    setTitle(t("个人", "Personal"));
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-shrink-0">
        <Header />
        <BrandBanner />
        <div className="fog-divider mx-4" />

        {/* Section Title with Back */}
        <div className="px-4 pt-3 pb-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="w-7 h-7 rounded-full bg-secondary/60 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h2 className="text-sm font-medium text-muted-foreground">{t("申请发票", "Invoice Request")}</h2>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {!submitted ? (
          <div className="px-4 py-4 space-y-4">
            {/* Order info */}
            <div className="card-md">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/40">{t("订单编号", "Order No")}: {orderNumber}</span>
                <span className="text-primary font-semibold text-base">¥{price}</span>
              </div>
            </div>

            {/* Invoice type tabs */}
            <div className="flex gap-2">
              {(["personal", "corporate"] as InvoiceType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setInvoiceType(type)}
                  className={`flex-1 py-2.5 text-xs font-medium rounded-lg border transition-all ${
                    invoiceType === type
                      ? "bg-primary/15 border-primary/30 text-primary"
                      : "bg-white/[0.03] border-white/[0.06] text-white/40"
                  }`}
                >
                  {type === "personal" ? t("个人发票", "Personal") : t("企业发票", "Corporate")}
                </button>
              ))}
            </div>

            {/* WeChat import */}
            <button
              onClick={handleImportWechat}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-dashed border-primary/30 bg-primary/5 text-xs text-primary hover:bg-primary/10 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              {t("从微信导入发票抬头", "Import from WeChat")}
            </button>

            {/* Form fields */}
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-white/40 mb-1 block">
                  {invoiceType === "personal" ? t("个人姓名 *", "Name *") : t("企业名称 *", "Company Name *")}
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value.slice(0, 100))}
                  placeholder={invoiceType === "personal" ? t("请输入姓名", "Enter name") : t("请输入企业名称", "Enter company name")}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-primary/40"
                />
              </div>

              {invoiceType === "corporate" && (
                <>
                  <div>
                    <label className="text-[10px] text-white/40 mb-1 block">{t("税号 *", "Tax ID *")}</label>
                    <input
                      value={taxId}
                      onChange={(e) => setTaxId(e.target.value.slice(0, 30))}
                      placeholder={t("请输入纳税人识别号", "Enter tax ID")}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-primary/40"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-white/40 mb-1 block">{t("企业地址/电话", "Address/Phone")}</label>
                    <input
                      value={companyAddress}
                      onChange={(e) => setCompanyAddress(e.target.value.slice(0, 200))}
                      placeholder={t("选填", "Optional")}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-primary/40"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-white/40 mb-1 block">{t("开户行及账号", "Bank Info")}</label>
                    <input
                      value={bankInfo}
                      onChange={(e) => setBankInfo(e.target.value.slice(0, 100))}
                      placeholder={t("选填", "Optional")}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-primary/40"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${
                canSubmit
                  ? "bg-primary text-white hover:bg-primary/80 active:scale-[0.98]"
                  : "bg-white/[0.06] text-white/20 cursor-not-allowed"
              }`}
            >
              {t("提交开票申请", "Submit Invoice Request")}
            </button>
          </div>
        ) : (
          /* Success state */
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-20">
            <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">
              {t("开票申请已提交", "Invoice Request Submitted")}
            </h4>
            <p className="text-xs text-white/50 text-center leading-relaxed">
              {t(
                "商户会在1个工作日内开具发票，请在 我的 → 发票管理 中查看发票。",
                "The merchant will issue the invoice within 1 business day. Check My Profile → Invoice Management."
              )}
            </p>
            <button
              onClick={handleDone}
              className="mt-6 px-8 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/80 active:scale-[0.98] transition-all"
            >
              {t("知道了", "Got it")}
            </button>
          </div>
        )}
      </div>

      <div className="flex-shrink-0">
        <BottomNav />
      </div>
    </div>
  );
};

export default InvoiceRequest;
