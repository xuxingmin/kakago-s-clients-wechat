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
          <h1 className="text-base font-semibold text-foreground">
            {t("发票管理", "Invoice Management")}
          </h1>
          <button
            onClick={() => toast({ title: t("添加发票抬头功能开发中", "Add invoice header coming soon") })}
            className="w-9 h-9 rounded-full bg-primary flex items-center justify-center"
          >
            <Plus className="w-5 h-5 text-primary-foreground" />
          </button>
        </div>
      </header>

      {/* Invoice List */}
      <section className="px-4 py-4 space-y-3">
        {invoices.length > 0 ? (
          invoices.map((invoice, index) => (
            <div
              key={invoice.id}
              className="card-premium p-4 animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Default Badge */}
              {invoice.isDefault && (
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    {t("默认抬头", "Default")}
                  </span>
                </div>
              )}

              {/* Invoice Info */}
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  {invoice.type === "company" ? (
                    <Building2 className="w-5 h-5 text-primary" />
                  ) : (
                    <FileText className="w-5 h-5 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">{invoice.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {invoice.type === "company" 
                      ? t("企业发票", "Company Invoice") 
                      : t("个人发票", "Personal Invoice")}
                  </p>
                  {invoice.taxNumber && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {t("税号", "Tax No")}: {invoice.taxNumber}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <button
                  onClick={() => handleDeleteInvoice(invoice.id)}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{t("删除", "Delete")}</span>
                </button>

                {!invoice.isDefault && (
                  <button
                    onClick={() => handleSetDefault(invoice.id)}
                    className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    <span>{t("设为默认", "Set Default")}</span>
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              {t("暂无发票抬头", "No invoice headers")}
            </p>
            <button
              onClick={() => toast({ title: t("添加发票抬头功能开发中", "Add invoice header coming soon") })}
              className="btn-gold px-6 py-3 rounded-xl text-sm font-medium"
            >
              {t("添加发票抬头", "Add Invoice Header")}
            </button>
          </div>
        )}
      </section>

      {/* Add Invoice Button */}
      {invoices.length > 0 && (
        <div className="fixed bottom-20 left-0 right-0 px-4 pb-4 max-w-md mx-auto">
          <button
            onClick={() => toast({ title: t("添加发票抬头功能开发中", "Add invoice header coming soon") })}
            className="w-full py-4 rounded-2xl border-2 border-dashed border-primary/50 text-primary font-medium flex items-center justify-center gap-2 bg-card hover:bg-primary/5 transition-colors"
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
