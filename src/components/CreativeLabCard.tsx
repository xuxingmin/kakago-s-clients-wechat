import { Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { type LucideIcon } from "lucide-react";

export interface CreativeLabCardData {
  id: string;
  nameZh: string;
  nameEn: string;
  price: number;
  image: string;
  icon: LucideIcon;
  volume: string;
  tempZh: string;
  tempEn: string;
  beanZh: string;
  beanEn: string;
  flavorNotes: string; // pipe-separated: "Cedar | Coconut | Dark Choc"
  labIndex: number;
}

interface CreativeLabCardProps {
  product: CreativeLabCardData;
  quantityInCart: number;
  onAddToCart: (e: React.MouseEvent) => void;
}

export const CreativeLabCard = ({ product, quantityInCart, onAddToCart }: CreativeLabCardProps) => {
  const { t, language } = useLanguage();
  const Icon = product.icon;
  const isEn = language === "en";

  return (
    <div className="group relative flex flex-col rounded-2xl overflow-hidden border border-primary/15 bg-gradient-to-b from-primary/[0.08] via-card/80 to-card/60 transition-all hover:border-primary/30">
      {/* Purple accent bar */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />

      <div className="flex flex-col gap-1.5 p-3">
        {/* Top: Badge + Lab */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[9px] font-semibold text-primary tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            WBC INSPIRED
          </span>
          <span className="text-[8px] font-mono font-bold tracking-widest text-muted-foreground/60 uppercase">
            LAB {String(product.labIndex).padStart(2, "0")}
          </span>
        </div>

        {/* Icon + Title */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
            <Icon className="w-4.5 h-4.5 text-foreground/70 group-hover:text-primary transition-colors" strokeWidth={1.5} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`font-bold text-foreground leading-tight ${isEn ? "text-xs" : "text-sm"}`} style={{ fontFamily: "'Playfair Display', serif" }}>
              {t(product.nameZh, product.nameEn)}
            </h3>
          </div>
        </div>

        {/* Tech Spec Pills */}
        <div className="flex flex-wrap items-center gap-1">
          <span className="inline-flex items-center rounded-full border border-primary/20 px-1.5 py-px text-[9px] text-primary/80 font-medium">
            {product.volume}
          </span>
          <span className="inline-flex items-center rounded-full border border-primary/20 px-1.5 py-px text-[9px] text-primary/80 font-medium">
            {t(product.tempZh, product.tempEn)}
          </span>
          <span className="inline-flex items-center rounded-full border border-primary/20 px-1.5 py-px text-[9px] text-primary/80 font-medium">
            {t(product.beanZh, product.beanEn)}
          </span>
        </div>

        {/* Flavor Notes */}
        <p className={`text-muted-foreground leading-snug ${isEn ? "text-[9px]" : "text-[10px]"}`}>
          {product.flavorNotes}
        </p>

        {/* Price + Add */}
        <div className="flex items-center justify-between pt-0.5">
          <span className="text-foreground font-extrabold text-xl leading-none drop-shadow-[0_0_10px_hsla(271,81%,56%,0.3)]">
            ¥{product.price}
          </span>
          <button
            onClick={onAddToCart}
            className={`rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 shrink-0 ${
              quantityInCart > 0
                ? "bg-gradient-to-br from-primary via-purple-500 to-violet-600 text-primary-foreground shadow-[var(--shadow-purple)] ring-2 ring-primary/30"
                : "bg-primary/20 text-primary hover:bg-primary hover:text-primary-foreground hover:shadow-[var(--shadow-purple-sm)]"
            }`}
            style={{ width: "30px", height: "30px", minWidth: "30px" }}
          >
            {quantityInCart > 0 ? (
              <span className="text-xs font-bold">{quantityInCart}</span>
            ) : (
              <Plus className="w-4 h-4" strokeWidth={2.5} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
