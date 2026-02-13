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
}

interface ProductTileProps {
  product: ProductTileData;
  estimatedPrice: number;
  quantityInCart: number;
  onAddToCart: (e: React.MouseEvent) => void;
  variant: "image-tall" | "image-wide" | "image-square" | "compact" | "compact-highlight";
}

export const ProductTile = ({
  product,
  estimatedPrice,
  quantityInCart,
  onAddToCart,
  variant,
}: ProductTileProps) => {
  const { t } = useLanguage();
  const [imgLoaded, setImgLoaded] = useState(false);
  const isImageVariant = variant.startsWith("image");

  const addBtn = (
    <button
      onClick={onAddToCart}
      className={`rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 shrink-0 ${
        quantityInCart > 0
          ? "bg-gradient-to-br from-primary via-purple-500 to-violet-600 text-white shadow-[0_0_20px_rgba(127,0,255,0.5)] ring-2 ring-primary/30"
          : "bg-gradient-to-br from-primary/80 to-violet-600 text-white hover:shadow-[0_0_15px_rgba(127,0,255,0.4)] hover:scale-105"
      }`}
      style={{
        width: isImageVariant ? '32px' : '28px',
        height: isImageVariant ? '32px' : '28px',
        minWidth: isImageVariant ? '32px' : '28px',
        minHeight: isImageVariant ? '32px' : '28px',
      }}
    >
      {quantityInCart > 0 ? (
        <span className="text-xs font-bold">{quantityInCart}</span>
      ) : (
        <Plus className={isImageVariant ? "w-4 h-4" : "w-3.5 h-3.5"} strokeWidth={2.5} />
      )}
    </button>
  );

  // ═══════════════ IMAGE VARIANTS ═══════════════
  if (isImageVariant) {
    const heightMap = {
      "image-tall": "min-h-[180px]",
      "image-wide": "min-h-[130px]",
      "image-square": "min-h-[155px]",
    };

    return (
      <div className={`group relative rounded-2xl overflow-hidden ${heightMap[variant as keyof typeof heightMap]}`}>
        <img
          src={product.image}
          alt={t(product.nameZh, product.nameEn)}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImgLoaded(true)}
        />
        {!imgLoaded && <div className="absolute inset-0 shimmer bg-secondary" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

        <div className="relative h-full flex flex-col justify-end p-2.5">
          <div className="flex items-end justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white text-[15px] leading-tight drop-shadow-lg">
                {t(product.nameZh, product.nameEn)}
              </h3>
              {product.descZh && (
                <p className="text-white/55 text-[10px] mt-0.5 line-clamp-1">
                  {t(product.descZh, product.descEn || "")}
                </p>
              )}
              {product.tagZh && (
                <p className="text-white/70 text-[10px] mt-0.5">
                  {t(product.tagZh, product.tagEn || "")}
                </p>
              )}
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-white font-bold text-[15px] drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                  ¥{estimatedPrice}
                </span>
                <span className="text-white/30 text-[9px] line-through">¥{product.price}</span>
              </div>
            </div>
            {addBtn}
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════ COMPACT VARIANTS ═══════════════
  const isHighlight = variant === "compact-highlight";

  return (
    <div className={`group card-md text-left relative flex flex-col justify-between py-2 px-2.5 ${
      isHighlight ? "min-h-[80px]" : "min-h-[68px]"
    }`}>
      {/* Name + Price */}
      <div className="flex items-start justify-between gap-1.5">
        <h3 className={`font-semibold text-white leading-tight ${isHighlight ? "text-[15px]" : "text-sm"}`}>
          {t(product.nameZh, product.nameEn)}
        </h3>
        <span className="text-white font-bold text-lg shrink-0 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
          ¥{estimatedPrice}
        </span>
      </div>

      {/* Tag line */}
      {product.tagZh && (
        <p className="text-white/70 text-[10px] mt-0.5">
          {t(product.tagZh, product.tagEn || "")}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 mt-auto">
        <span className="text-white/30 text-[9px]">
          原价 <span className="line-through">¥{product.price}</span>
        </span>
        {addBtn}
      </div>
    </div>
  );
};
