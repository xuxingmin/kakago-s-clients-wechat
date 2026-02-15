import { Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { type LucideIcon } from "lucide-react";

export interface StandardCardData {
  id: string;
  nameZh: string;
  nameEn: string;
  price: number;
  image: string;
  icon: LucideIcon;
  tagZh?: string;
  tagEn?: string;
  volume: string;
  roastZh: string;
  roastEn: string;
  tempZh: string;
  tempEn: string;
}

interface StandardCardProps {
  product: StandardCardData;
  quantityInCart: number;
  onAddToCart: (e: React.MouseEvent) => void;
}

export const StandardCard = ({ product, quantityInCart, onAddToCart }: StandardCardProps) => {
  const { t, language } = useLanguage();
  const Icon = product.icon;
  const isEn = language === "en";

  return (
    <div className="group flex items-stretch gap-2.5 rounded-xl bg-card/60 border border-border p-2 transition-all hover:border-muted-foreground/20">
      {/* Left: Icon area */}
      <div className="flex items-center justify-center w-14 shrink-0 rounded-lg bg-secondary/50">
        <Icon className="w-6 h-6 text-foreground/70" strokeWidth={1.5} />
      </div>

      {/* Right: Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between gap-1">
        {/* Title row */}
        <h3 className={`font-bold text-foreground leading-tight truncate ${isEn ? "text-xs" : "text-sm"}`}>
          {t(product.nameZh, product.nameEn)}
        </h3>

        {/* Pill badges */}
        <div className="flex flex-wrap items-center gap-1">
          <span className="inline-flex items-center rounded-full border border-muted-foreground/20 px-1.5 py-px text-[9px] text-muted-foreground">
            {product.volume}
          </span>
          <span className="inline-flex items-center rounded-full border border-muted-foreground/20 px-1.5 py-px text-[9px] text-muted-foreground">
            {t(product.roastZh, product.roastEn)}
          </span>
          <span className="inline-flex items-center rounded-full border border-muted-foreground/20 px-1.5 py-px text-[9px] text-muted-foreground">
            {t(product.tempZh, product.tempEn)}
          </span>
        </div>

        {/* Description */}
        {product.tagZh && (
          <p className={`text-muted-foreground truncate ${isEn ? "text-[9px]" : "text-[10px]"}`}>
            {t(product.tagZh, product.tagEn || "")}
          </p>
        )}

        {/* Price + Add */}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-foreground font-extrabold text-lg leading-none">
            ¥{product.price}
          </span>
          <button
            onClick={onAddToCart}
            className={`rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 shrink-0 ${
              quantityInCart > 0
                ? "bg-primary text-primary-foreground shadow-[var(--shadow-purple-sm)] ring-2 ring-primary/30"
                : "bg-secondary text-foreground/70 hover:bg-primary hover:text-primary-foreground"
            }`}
            style={{ width: "26px", height: "26px", minWidth: "26px" }}
          >
            {quantityInCart > 0 ? (
              <span className="text-[10px] font-bold">{quantityInCart}</span>
            ) : (
              <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
