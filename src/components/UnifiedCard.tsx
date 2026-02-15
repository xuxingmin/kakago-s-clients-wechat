import { Plus, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export interface UnifiedCardData {
  id: string;
  nameZh: string;
  nameEn: string;
  price: number;
  image: string;
  icon: LucideIcon;
  volume: string;
  tagZh: string;
  tagEn: string;
  isCreative?: boolean;
  labIndex?: number;
}

interface UnifiedCardProps {
  product: UnifiedCardData;
  quantityInCart: number;
  onAddToCart: (e: React.MouseEvent) => void;
}

export const UnifiedCard = ({ product, quantityInCart, onAddToCart }: UnifiedCardProps) => {
  const { t, language } = useLanguage();
  const Icon = product.icon;
  const isEn = language === "en";

  return (
    <div className={`group flex items-center gap-2 rounded-lg px-2 py-1.5 transition-all ${
      product.isCreative
        ? "bg-primary/[0.06] border border-primary/15"
        : "bg-card/50 border border-border/50"
    }`}>
      {/* Icon */}
      <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
        product.isCreative ? "bg-primary/10" : "bg-secondary/40"
      }`}>
        <Icon className={`w-3.5 h-3.5 ${product.isCreative ? "text-primary/70" : "text-foreground/50"}`} strokeWidth={1.5} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <h3 className={`font-semibold text-foreground leading-none truncate ${isEn ? "text-[10px]" : "text-xs"}`}>
            {t(product.nameZh, product.nameEn)}
          </h3>
          {product.isCreative && (
            <span className="shrink-0 w-1 h-1 rounded-full bg-primary" />
          )}
        </div>
        <div className="flex items-center gap-1 mt-0.5">
          <span className="text-[8px] text-muted-foreground/60">{product.volume}</span>
          <span className="text-[8px] text-muted-foreground/40">·</span>
          <span className={`text-[8px] text-muted-foreground/60 truncate`}>
            {t(product.tagZh, product.tagEn)}
          </span>
        </div>
      </div>

      {/* Price + Add */}
      <div className="flex items-center gap-1.5 shrink-0">
        <span className={`font-bold leading-none ${product.isCreative ? "text-sm text-foreground" : "text-sm text-foreground"}`}>
          ¥{product.price}
        </span>
        <button
          onClick={onAddToCart}
          className={`rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 ${
            quantityInCart > 0
              ? "bg-primary text-primary-foreground ring-1 ring-primary/30"
              : product.isCreative
                ? "bg-primary/15 text-primary hover:bg-primary hover:text-primary-foreground"
                : "bg-secondary/60 text-foreground/50 hover:bg-primary hover:text-primary-foreground"
          }`}
          style={{ width: "22px", height: "22px", minWidth: "22px" }}
        >
          {quantityInCart > 0 ? (
            <span className="text-[9px] font-bold">{quantityInCart}</span>
          ) : (
            <Plus className="w-3 h-3" strokeWidth={2.5} />
          )}
        </button>
      </div>
    </div>
  );
};
