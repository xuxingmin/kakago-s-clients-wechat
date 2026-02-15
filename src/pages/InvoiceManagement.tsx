import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, FileText, Eye, Download, X, QrCode } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { BrandBanner } from "@/components/BrandBanner";
import { Header } from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";

interface InvoiceRecord {
  id: string;
  orderNumber: string;
  title: string;
  type: "personal" | "corporate";
  amount: number;
  status: "pending" | "issued";
  issuedAt?: string;
  items: { name: string; qty: number; unitPrice: number }[];
}

const demoInvoices: InvoiceRecord[] = [
  {
    id: "inv-r-001",
    orderNumber: "HF001-260214-0003",
    title: "个人",
    type: "personal",
    amount: 30,
    status: "issued",
    issuedAt: "2026-02-14",
    items: [
      { name: "卡布奇诺", qty: 1, unitPrice: 16 },
      { name: "澳白", qty: 1, unitPrice: 14 },
    ],
  },
  {
    id: "inv-r-002",
    orderNumber: "HF001-260213-0004",
    title: "合肥某某科技有限公司",
    type: "corporate",
    amount: 45,
    status: "pending",
    items: [
      { name: "澳白", qty: 3, unitPrice: 15 },
    ],
  },
];

const InvoiceManagement = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [invoices] = useState<InvoiceRecord[]>(demoInvoices);
  const [viewingInvoice, setViewingInvoice] = useState<InvoiceRecord | null>(null);

  const handleSaveToAlbum = () => {
    toast({ title: t("已保存到手机相册", "Saved to Photo Album") });
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-shrink-0">
        <div className="absolute top-3 left-4 z-50 safe-top">
          <button onClick={() => navigate(-1)} className="w-8 h-8 rounded-full bg-secondary/80 backdrop-blur flex items-center justify-center">
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
        </div>
        <Header />
        <BrandBanner />

        <section className="px-4 pt-3 pb-2">
          <div className="card-md flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-[10px] text-white/50">{t("我的发票", "My Invoices")}</p>
              <p className="text-lg font-bold text-white">{invoices.length}</p>
            </div>
          </div>
        </section>
        <div className="fog-divider mx-4" />
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <section className="px-4 py-3 space-y-2">
          {invoices.length > 0 ? (
            invoices.map((inv, index) => (
              <InvoiceCard
                key={inv.id}
                invoice={inv}
                index={index}
                onView={() => setViewingInvoice(inv)}
                t={t}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mb-3">
                <FileText className="w-7 h-7 text-white/30" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">{t("暂无发票", "No Invoices")}</h3>
              <p className="text-white/40 text-[10px]">{t("在订单中申请开票后，发票将在这里显示", "Request invoices from your orders")}</p>
            </div>
          )}
        </section>
      </div>

      <div className="flex-shrink-0">
        <BottomNav />
      </div>

      {/* Invoice Detail Overlay */}
      {viewingInvoice && (
        <InvoiceDetailOverlay
          invoice={viewingInvoice}
          onClose={() => setViewingInvoice(null)}
          onSave={handleSaveToAlbum}
          t={t}
        />
      )}
    </div>
  );
};

/* ─── Invoice Card ─── */
interface InvoiceCardProps {
  invoice: InvoiceRecord;
  index: number;
  onView: () => void;
  t: (zh: string, en: string) => string;
}

const InvoiceCard = ({ invoice, index, onView, t }: InvoiceCardProps) => (
  <div
    className="card-md animate-fade-in"
    style={{ animationDelay: `${index * 0.05}s` }}
  >
    {/* Status badge */}
    <div className="flex items-center justify-between mb-2">
      <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${
        invoice.status === "issued"
          ? "bg-green-500/15 text-green-400"
          : "bg-primary/15 text-primary"
      }`}>
        {invoice.status === "issued" ? t("已开票", "Issued") : t("开票中", "Processing")}
      </span>
      <span className="text-[10px] text-white/30 font-mono">{invoice.orderNumber}</span>
    </div>

    {/* Title & amount */}
    <div className="flex items-start justify-between mb-2">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-white truncate">{invoice.title}</p>
        <p className="text-[10px] text-white/40 mt-0.5">
          {invoice.type === "corporate" ? t("企业发票", "Corporate") : t("个人发票", "Personal")}
        </p>
      </div>
      <p className="text-base font-bold text-primary ml-3">¥{invoice.amount}</p>
    </div>

    {/* Order items */}
    <div className="space-y-1 mb-3">
      {invoice.items.map((item, i) => (
        <div key={i} className="flex items-center justify-between text-[10px] text-white/40">
          <span>{item.name} × {item.qty}</span>
          <span>¥{item.unitPrice * item.qty}</span>
        </div>
      ))}
    </div>

    {/* Actions */}
    <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
      {invoice.issuedAt && (
        <span className="text-[10px] text-white/30">{t("开票日期", "Issued")}: {invoice.issuedAt}</span>
      )}
      {!invoice.issuedAt && <span className="text-[10px] text-white/30">{t("预计1个工作日", "Est. 1 business day")}</span>}
      
      {invoice.status === "issued" ? (
        <button
          onClick={onView}
          className="flex items-center gap-1 text-[10px] font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-lg hover:bg-primary/20 transition-colors"
        >
          <Eye className="w-3 h-3" />
          {t("查看发票", "View Invoice")}
        </button>
      ) : (
        <span className="text-[10px] text-white/20 italic">{t("等待商户开票", "Awaiting merchant")}</span>
      )}
    </div>
  </div>
);

/* ─── Invoice Detail Overlay ─── */
interface InvoiceDetailOverlayProps {
  invoice: InvoiceRecord;
  onClose: () => void;
  onSave: () => void;
  t: (zh: string, en: string) => string;
}

const InvoiceDetailOverlay = ({ invoice, onClose, onSave, t }: InvoiceDetailOverlayProps) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={onClose}>
    <div className="absolute inset-0 bg-black/85 backdrop-blur-sm animate-fade-in" />

    <div
      className="relative z-10 w-[340px] animate-fade-in"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Save button top-right */}
      <div className="flex justify-end mb-3 gap-2">
        <button
          onClick={onSave}
          className="flex items-center gap-1.5 text-[11px] font-medium text-white bg-primary/80 hover:bg-primary px-3 py-1.5 rounded-lg transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          {t("保存到相册", "Save to Album")}
        </button>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <X className="w-3.5 h-3.5 text-white/70" />
        </button>
      </div>

      {/* Invoice "paper" */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
        {/* Header band */}
        <div className="bg-gradient-to-r from-primary to-primary/80 px-5 py-4 text-center">
          <p className="text-[10px] text-white/70 mb-1">{t("电子发票", "Electronic Invoice")}</p>
          <p className="text-xl font-bold text-white">¥{invoice.amount.toFixed(2)}</p>
        </div>

        {/* Invoice body */}
        <div className="px-5 py-4 space-y-3">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">{t("发票抬头", "Title")}</span>
            <span className="text-gray-800 font-medium text-right max-w-[180px] truncate">{invoice.title}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">{t("发票类型", "Type")}</span>
            <span className="text-gray-800">
              {invoice.type === "corporate" ? t("企业", "Corporate") : t("个人", "Personal")}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">{t("订单编号", "Order No")}</span>
            <span className="text-gray-600 font-mono text-[11px]">{invoice.orderNumber}</span>
          </div>
          {invoice.issuedAt && (
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">{t("开票日期", "Date")}</span>
              <span className="text-gray-800">{invoice.issuedAt}</span>
            </div>
          )}

          <div className="border-t border-gray-100 pt-3 space-y-1.5">
            <p className="text-[10px] text-gray-400 mb-1">{t("商品明细", "Items")}</p>
            {invoice.items.map((item, i) => (
              <div key={i} className="flex justify-between text-xs text-gray-600">
                <span>{item.name} × {item.qty}</span>
                <span>¥{(item.unitPrice * item.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* QR Code area */}
          <div className="flex flex-col items-center pt-3 border-t border-gray-100">
            <div className="w-24 h-24 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center mb-2">
              <QrCode className="w-16 h-16 text-gray-300" />
            </div>
            <p className="text-[9px] text-gray-400">{t("扫码验证发票真伪", "Scan to verify invoice")}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-5 py-3 text-center">
          <p className="text-[9px] text-gray-400">KAKAGO · {t("电子发票", "Electronic Invoice")}</p>
        </div>
      </div>
    </div>
  </div>
);

export default InvoiceManagement;
