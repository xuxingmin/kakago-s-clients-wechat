import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Plus, FileText, Building2, Trash2, Check, Sparkles } from "lucide-react";
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
    <div className="min-h-screen bg-background pb-24">
      {/* Premium Header with Gradient */}
      <header className="sticky top-0 z-40 safe-top">
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--purple-900)/0.9)] to-transparent" />
        <div className="glass border-b border-white/5">
          <div className="flex items-center justify-between px-4 py-4 max-w-md mx-auto relative">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/15 transition-all duration-300 active:scale-95"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <h1 className="text-lg font-semibold text-foreground">
                {t("发票管理", "Invoice Management")}
              </h1>
            </div>
            <button
              onClick={() => toast({ title: t("添加发票抬头功能开发中", "Add invoice header coming soon") })}
              className="w-10 h-10 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center hover:bg-primary/30 transition-all duration-300 active:scale-95 group"
            >
              <Plus className="w-5 h-5 text-primary group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="px-4 py-4 max-w-md mx-auto">
        <div className="card-premium p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t("已保存抬头", "Saved Headers")}</p>
              <p className="text-xl font-bold text-foreground">{invoices.length}</p>
            </div>
          </div>
          <div className="h-10 w-px bg-white/10" />
          <div className="text-right">
            <p className="text-xs text-muted-foreground">{t("默认抬头", "Default")}</p>
            <p className="text-sm font-medium text-primary">
              {invoices.find(inv => inv.isDefault)?.title || "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Invoice List */}
      <section className="px-4 space-y-3 max-w-md mx-auto">
        {invoices.length > 0 ? (
          <div className="stagger-fade-in">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="group relative mb-3"
              >
                {/* Glow Effect for Default */}
                {invoice.isDefault && (
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 via-primary/10 to-primary/30 rounded-2xl blur-sm opacity-60" />
                )}
                
                <div className={`relative card-premium p-5 transition-all duration-300 ${
                  invoice.isDefault ? 'border-primary/30' : 'hover:border-white/10'
                }`}>
                  {/* Default Badge */}
                  {invoice.isDefault && (
                    <div className="absolute -top-2 left-4">
                      <span className="text-[10px] font-semibold text-primary-foreground bg-gradient-to-r from-primary to-purple-400 px-3 py-1 rounded-full shadow-lg shadow-primary/25">
                        {t("默认", "Default")}
                      </span>
                    </div>
                  )}

                  {/* Invoice Content */}
                  <div className="flex items-start gap-4 pt-1">
                    {/* Icon with Gradient Background */}
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      invoice.type === "company" 
                        ? 'bg-gradient-to-br from-purple-500/20 to-purple-600/10' 
                        : 'bg-gradient-to-br from-white/10 to-white/5'
                    }`}>
                      {invoice.type === "company" ? (
                        <Building2 className="w-7 h-7 text-primary" />
                      ) : (
                        <FileText className="w-7 h-7 text-white/80" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          invoice.type === "company" 
                            ? 'bg-primary/15 text-primary' 
                            : 'bg-white/10 text-white/70'
                        }`}>
                          {invoice.type === "company" 
                            ? t("企业", "Company") 
                            : t("个人", "Personal")}
                        </span>
                      </div>
                      <p className="font-semibold text-foreground text-base truncate mb-1">
                        {invoice.title}
                      </p>
                      {invoice.taxNumber && (
                        <p className="text-xs text-muted-foreground font-mono">
                          {t("税号", "Tax No")}: {invoice.taxNumber}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                    <button
                      onClick={() => handleDeleteInvoice(invoice.id)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200 active:scale-95"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>{t("删除", "Delete")}</span>
                    </button>

                    {!invoice.isDefault && (
                      <button
                        onClick={() => handleSetDefault(invoice.id)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 transition-all duration-200 active:scale-95"
                      >
                        <Check className="w-4 h-4" />
                        <span>{t("设为默认", "Set Default")}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl" />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
                <FileText className="w-10 h-10 text-white/50" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {t("暂无发票抬头", "No Invoice Headers")}
            </h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-[200px]">
              {t("添加发票抬头，下单时快速开票", "Add headers for quick invoicing")}
            </p>
            <button
              onClick={() => toast({ title: t("添加发票抬头功能开发中", "Add invoice header coming soon") })}
              className="btn-gold px-8 py-3.5 rounded-2xl text-sm font-semibold flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              {t("添加发票抬头", "Add Invoice Header")}
            </button>
          </div>
        )}
      </section>

      {/* Floating Add Button */}
      {invoices.length > 0 && (
        <div className="fixed bottom-24 left-0 right-0 px-4 max-w-md mx-auto">
          <button
            onClick={() => toast({ title: t("添加发票抬头功能开发中", "Add invoice header coming soon") })}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-dashed border-primary/40 text-primary font-semibold flex items-center justify-center gap-2 hover:border-primary/60 hover:bg-primary/15 transition-all duration-300 active:scale-[0.98] backdrop-blur-sm"
          >
            <Plus className="w-5 h-5" />
            <span>{t("添加发票抬头", "Add Invoice Header")}</span>
          </button>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default InvoiceManagement;
