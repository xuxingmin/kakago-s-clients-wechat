import { Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

export interface ProductTileData {
  id: string;
  nameZh: string;
  nameEn: string;
  price: number;
  image: string;
  tagZh?: string;
  tagEn?: string;
  descZh?: string;
  descEn?: string;
  isCreative?: boolean;
  tagsZh?: string[];
  tagsEn?: string[];
}

interface ProductTileProps {
  product: ProductTileData;
  estimatedPrice: number;
  quantityInCart: number;
  onAddToCart: (e: React.MouseEvent) => void;
}

export const ProductTile = ({
  product,
  estimatedPrice,
  quantityInCart,
  onAddToCart,
}: ProductTileProps) => {
  const { t, language } = useLanguage();
  const [imageLoaded, setImageLoaded] = useState(false);
  const isEn = language === "en";

  const tags = isEn ? (product.tagsEn || []) : (product.tagsZh || []);
  const flavorText = product.descZh
    ? t(product.descZh, product.descEn || "")
    : product.tagZh
      ? t(product.tagZh, product.tagEn || "")
      : "";

  return (
    <div className="flex items-stretch gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] overflow-hidden">
      {/* Left: Square Image */}
      <div className="relative w-[72px] shrink-0 bg-secondary">
        <img
          src={product.image}
          alt={t(product.nameZh, product.nameEn)}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 shimmer bg-secondary" />
        )}
      </div>

      {/* Right: Info Stack */}
      <div className="flex-1 min-w-0 py-2 pr-2.5 flex flex-col justify-between gap-1">
        {/* Row 1: Name + Price */}
        <div className="flex items-baseline justify-between gap-2">
          <h3 className={`font-semibold text-white leading-tight truncate ${isEn ? "text-xs" : "text-sm"}`}>
            {t(product.nameZh, product.nameEn)}
          </h3>
          <span className={`shrink-0 text-white tabular-nums ${
            product.isCreative ? "font-extrabold text-base" : "font-bold text-sm"
          }`}>
            ¥{estimatedPrice}
          </span>
        </div>

        {/* Row 2: Pill Tags */}
        {tags.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="inline-block px-1.5 py-[1px] rounded text-[9px] font-medium bg-white/[0.07] text-white/50 leading-tight"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Row 3: Flavor description + Add button */}
        <div className="flex items-end justify-between gap-2">
          {flavorText && (
            <p className={`text-muted-foreground line-clamp-1 ${isEn ? "text-[9px]" : "text-[10px]"}`}>
              {flavorText}
            </p>
          )}
          <button
            onClick={onAddToCart}
            className={`rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 shrink-0 ${
              quantityInCart > 0
                ? "bg-primary text-white shadow-[0_0_12px_hsla(271,81%,56%,0.4)] ring-1 ring-primary/30"
                : "bg-white/[0.08] text-white/60 hover:bg-white/[0.14]"
            }`}
            style={{ width: '26px', height: '26px', minWidth: '26px', minHeight: '26px' }}
          >
            {quantityInCart > 0 ? (
              <span className="text-[10px] font-bold">{quantityInCart}</span>
            ) : (
              <Plus className="w-3 h-3" strokeWidth={2} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
