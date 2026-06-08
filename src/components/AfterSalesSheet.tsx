import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Camera, Minus, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AfterSalesItem {
  name: string;
  nameEn?: string;
  qty: number;
  unitPrice?: number;
}

interface AfterSalesSheetProps {
  open: boolean;
  onClose: () => void;
  orderNumber: string;
  items: AfterSalesItem[];
  t: (zh: string, en: string) => string;
  onSubmit?: (payload: {
    orderNumber: string;
    items: { name: string; qty: number }[];
    reason: string;
    note: string;
    photoCount: number;
  }) => void;
}

const REASONS = [
  { id: "spill", zh: "外卖泼洒/漏饮", en: "Spilled / Leaking", requirePhoto: true },
  { id: "package", zh: "外包装破损/污染", en: "Damaged / Soiled package", requirePhoto: true },
  { id: "wrong", zh: "商品错漏/做错", en: "Wrong / Missing item", requirePhoto: true },
  { id: "other", zh: "其他异常情况", en: "Other", requirePhoto: false },
] as const;

export const AfterSalesSheet: React.FC<AfterSalesSheetProps> = ({
  open,
  onClose,
  orderNumber,
  items,
  t,
  onSubmit,
}) => {
  const { toast } = useToast();
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [reasonId, setReasonId] = useState<typeof REASONS[number]["id"] | null>(null);
  const [note, setNote] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      const init: Record<number, number> = {};
      items.forEach((it, idx) => (init[idx] = it.qty));
      setSelected(init);
      setReasonId(null);
      setNote("");
      setPhotos([]);
    }
  }, [open, items]);

  const reason = useMemo(() => REASONS.find((r) => r.id === reasonId) || null, [reasonId]);
  const totalClaimed = Object.values(selected).reduce((a, b) => a + b, 0);

  const photoRequired = !!reason?.requirePhoto;
  const otherWithNote = reason?.id === "other" && note.trim().length > 0;
  const canSubmit =
    !!reason &&
    totalClaimed > 0 &&
    (photoRequired ? photos.length > 0 : otherWithNote);

  const handlePickPhoto = () => {
    // mock — append a placeholder thumbnail
    setPhotos((prev) => [...prev, `photo-${Date.now()}`]);
  };

  const handleSubmit = () => {
    if (!canSubmit || !reason) return;
    onSubmit?.({
      orderNumber,
      items: items
        .map((it, idx) => ({ name: it.name, qty: selected[idx] || 0 }))
        .filter((x) => x.qty > 0),
      reason: t(reason.zh, reason.en),
      note,
      photoCount: photos.length,
    });
    toast({
      title: t("售后申请已提交", "Request submitted"),
      description: t("客服将在 24 小时内处理", "Support will reply within 24h"),
    });
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="bottom"
        className="bg-paper border-t border-foreground/10 rounded-t-3xl p-0 max-h-[88vh] flex flex-col"
      >
        {/* Header */}
        <SheetHeader className="px-5 pt-5 pb-3 border-b border-dashed border-foreground/15 text-left space-y-1 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="font-mono text-[9px] tracking-[0.22em] uppercase text-foreground/55">
              {t("申请售后", "After-sales Request")} · {orderNumber}
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 -mr-1 rounded-full flex items-center justify-center hover:bg-foreground/5"
            >
              <X className="w-4 h-4 text-foreground/60" />
            </button>
          </div>
          <SheetTitle className="font-serif text-lg text-espresso">
            {t("选择需要理赔的商品", "Select items to claim")}
          </SheetTitle>
        </SheetHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {/* Items list */}
          <section className="space-y-2">
            {items.map((it, idx) => {
              const max = it.qty;
              const qty = selected[idx] ?? 0;
              const checked = qty > 0;
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg bg-oat border border-foreground/8"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(v) =>
                        setSelected((s) => ({ ...s, [idx]: v ? max : 0 }))
                      }
                    />
                    <div className="min-w-0">
                      <div className="text-sm text-espresso truncate">
                        {t(it.name, it.nameEn || it.name)}
                      </div>
                      <div className="text-[10px] font-mono text-foreground/45">
                        {t("已购", "Bought")} ×{it.qty}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() =>
                        setSelected((s) => ({ ...s, [idx]: Math.max(0, (s[idx] ?? 0) - 1) }))
                      }
                      disabled={qty <= 0}
                      className="w-7 h-7 rounded-full border border-foreground/15 flex items-center justify-center text-foreground/70 disabled:opacity-30"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-5 text-center text-sm font-mono text-espresso">{qty}</span>
                    <button
                      onClick={() =>
                        setSelected((s) => ({ ...s, [idx]: Math.min(max, (s[idx] ?? 0) + 1) }))
                      }
                      disabled={qty >= max}
                      className="w-7 h-7 rounded-full border border-foreground/15 flex items-center justify-center text-foreground/70 disabled:opacity-30"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </section>

          {/* Reason */}
          <section className="space-y-2">
            <div className="font-mono text-[9px] tracking-[0.22em] uppercase text-foreground/55">
              {t("异常原因", "Reason")}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {REASONS.map((r) => {
                const active = reasonId === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => setReasonId(r.id)}
                    className={`px-3 py-1.5 rounded-full text-[11px] border transition-colors ${
                      active
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-oat text-foreground/70 border-foreground/12 hover:border-foreground/25"
                    }`}
                  >
                    {t(r.zh, r.en)}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Photo upload */}
          {reason && (
            <section className="space-y-2">
              <div className="font-mono text-[9px] tracking-[0.22em] uppercase text-foreground/55">
                {t("现场凭证", "Evidence")}{photoRequired && <span className="text-copper"> *</span>}
              </div>

              {reason.requirePhoto && (
                <p className="text-[11px] leading-snug text-copper">
                  {reason.id === "wrong"
                    ? t(
                        "请拍摄收到的实物或外包装杯贴小票照片，以便总部为您快速补发或理赔。",
                        "Please photograph the received items or the cup label so we can refund or resend quickly."
                      )
                    : t(
                        "为了帮您加急处理并追究骑手责任，请拍摄并上传洒漏/破损照片。",
                        "To escalate and hold the courier accountable, please upload photos of the spill/damage."
                      )}
                </p>
              )}

              <div className="flex flex-wrap gap-2">
                {photos.map((p, i) => (
                  <div
                    key={p}
                    className="relative w-16 h-16 rounded-lg bg-oat border border-foreground/15 flex items-center justify-center"
                  >
                    <Camera className="w-5 h-5 text-foreground/35" />
                    <button
                      onClick={() => setPhotos((arr) => arr.filter((_, j) => j !== i))}
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-espresso text-paper flex items-center justify-center"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                ))}
                {photos.length < 6 && (
                  <button
                    onClick={handlePickPhoto}
                    className="w-16 h-16 rounded-lg border border-dashed border-foreground/25 flex flex-col items-center justify-center gap-0.5 text-foreground/45 hover:border-primary/40 hover:text-primary"
                  >
                    <Camera className="w-4 h-4" />
                    <span className="text-[9px]">{t("拍照", "Photo")}</span>
                  </button>
                )}
              </div>
            </section>
          )}

          {/* Note */}
          <section className="space-y-2">
            <div className="font-mono text-[9px] tracking-[0.22em] uppercase text-foreground/55">
              {t("补充说明", "Notes")}{reason?.id === "other" && <span className="text-copper"> *</span>}
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={200}
              rows={3}
              placeholder={t("可选，最多 200 字", "Optional, up to 200 chars")}
              className="w-full px-3 py-2 rounded-lg bg-oat border border-foreground/12 text-sm text-espresso placeholder:text-foreground/35 focus:outline-none focus:border-primary/40 resize-none"
            />
          </section>
        </div>

        {/* Footer CTA */}
        <div className="flex-shrink-0 px-5 py-3 border-t border-dashed border-foreground/15 bg-paper">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`w-full py-3 rounded-full text-sm font-semibold tracking-wide transition-colors ${
              canSubmit
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-foreground/10 text-foreground/35 cursor-not-allowed"
            }`}
          >
            {t("提交售后申请", "Submit Request")}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
