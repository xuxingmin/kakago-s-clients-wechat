import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Plus, FileText, Building2, Trash2, Check } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface Invoice {
  id: string;
  type: "personal" | "company";
  title: string;
  taxNumber?: string;
  isDefault: boolean;
}

const initialInvoices: Invoice[] = [
  {
    id: "inv-001",
    type: "personal",
    title: "个人",
    isDefault: true,
  },
  {
    id: "inv-002",
    type: "company",
    title: "合肥某某科技有限公司",
    taxNumber: "91340100MA2XXXXXXX",
    isDefault: false,
  },
];

const InvoiceManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);

  const handleDeleteInvoice = (id: string) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    toast({ title: t("发票抬头已删除", "Invoice header deleted") });
  };

  const handleSetDefault = (id: string) => {
    setInvoices((prev) =>
      prev.map((inv) => ({
        ...inv,
        isDefault: inv.id === id,
      }))
    );
    toast({ title: t("已设为默认抬头", "Set as default header") });
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* 固定顶部区域 */}
      <div className="flex-shrink-0">
        <header className="glass safe-top">
          <div className="flex items-center justify-between px-4 py-2 max-w-md mx-auto">
            <button
              onClick={() => navigate(-1)}
              className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center"
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
            <h1 className="text-sm font-semibold text-white">
              {t("发票管理", "Invoice Management")}
            </h1>
            <button
              onClick={() => toast({ title: t("添加发票抬头功能开发中", "Add invoice header coming soon") })}
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center"
            >
              <Plus className="w-4 h-4 text-primary-foreground" />
            </button>
          </div>
        </header>

        {/* Stats Bar */}
        <section className="px-4 pt-3 pb-2">
          <div className="card-md flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center">
                <FileText className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-[10px] text-white/50">{t("已保存抬头", "Saved Headers")}</p>
                <p className="text-lg font-bold text-white">{invoices.length}</p>
              </div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-right">
              <p className="text-[10px] text-white/50">{t("默认抬头", "Default")}</p>
              <p className="text-xs font-medium text-primary">
                {invoices.find(inv => inv.isDefault)?.title || "-"}
              </p>
            </div>
          </div>
        </section>

        <div className="fog-divider mx-4" />
      </div>

      {/* 可滚动中间区域 */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <section className="px-4 py-3 space-y-2">
          {invoices.length > 0 ? (
            invoices.map((invoice, index) => (
              <div
                key={invoice.id}
                className={`card-md animate-fade-in ${invoice.isDefault ? 'border-primary/30' : ''}`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {invoice.isDefault && (
                  <div className="mb-2">
                    <span className="text-[9px] font-semibold text-primary-foreground bg-primary px-2 py-0.5 rounded-full">
                      {t("默认", "Default")}
                    </span>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    invoice.type === "company" 
                      ? 'bg-primary/20' 
                      : 'bg-secondary'
                  }`}>
                    {invoice.type === "company" ? (
                      <Building2 className="w-5 h-5 text-primary" />
                    ) : (
                      <FileText className="w-5 h-5 text-white/60" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${
                        invoice.type === "company" 
                          ? 'bg-primary/15 text-primary' 
                          : 'bg-white/10 text-white/70'
                      }`}>
                        {invoice.type === "company" 
                          ? t("企业", "Company") 
                          : t("个人", "Personal")}
                      </span>
                    </div>
                    <p className="font-semibold text-white text-sm truncate mb-0.5">
                      {invoice.title}
                    </p>
                    {invoice.taxNumber && (
                      <p className="text-[10px] text-white/50 font-mono">
                        {t("税号", "Tax No")}: {invoice.taxNumber}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/10">
                  <button
                    onClick={() => handleDeleteInvoice(invoice.id)}
                    className="flex items-center gap-1 text-[10px] text-white/50 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>{t("删除", "Delete")}</span>
                  </button>

                  {!invoice.isDefault && (
                    <button
                      onClick={() => handleSetDefault(invoice.id)}
                      className="flex items-center gap-1 text-[10px] font-medium text-primary bg-primary/10 px-2 py-1 rounded-lg hover:bg-primary/20 transition-colors"
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
                <FileText className="w-7 h-7 text-white/30" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">
                {t("暂无发票抬头", "No Invoice Headers")}
              </h3>
              <p className="text-white/40 text-[10px] mb-4">
                {t("添加发票抬头，下单时快速开票", "Add headers for quick invoicing")}
              </p>
              <button
                onClick={() => toast({ title: t("添加发票抬头功能开发中", "Add invoice header coming soon") })}
                className="btn-gold px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                {t("添加发票抬头", "Add Invoice Header")}
              </button>
            </div>
          )}
        </section>

        {invoices.length > 0 && (
          <div className="px-4 pb-4">
            <button
              onClick={() => toast({ title: t("添加发票抬头功能开发中", "Add invoice header coming soon") })}
              className="w-full py-3 rounded-xl border-2 border-dashed border-primary/40 text-primary font-medium flex items-center justify-center gap-2 hover:border-primary/60 hover:bg-primary/5 transition-all text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>{t("添加发票抬头", "Add Invoice Header")}</span>
            </button>
          </div>
        )}
      </div>

      {/* 固定底部区域 */}
      <div className="flex-shrink-0">
        <BottomNav />
      </div>
    </div>
  );
};

export default InvoiceManagement;
