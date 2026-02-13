import { Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

interface CreativeProductCardProps {
  product: {
    id: string;
    nameZh: string;
    nameEn: string;
    price: number;
    image: string;
    descZh: string;
    descEn: string;
  };
  estimatedPrice: number;
  quantityInCart: number;
  onAddToCart: (e: React.MouseEvent) => void;
  size?: "large" | "medium" | "small";
}

export const CreativeProductCard = ({
  product,
  estimatedPrice,
  quantityInCart,
  onAddToCart,
  size = "medium",
}: CreativeProductCardProps) => {
  const { t } = useLanguage();
  const [imageLoaded, setImageLoaded] = useState(false);

  const heightClass = size === "large" ? "min-h-[200px]" : size === "medium" ? "min-h-[150px]" : "min-h-[120px]";

  return (
    <div className={`group relative rounded-2xl overflow-hidden ${heightClass}`}>
      {/* Background Image */}
      <img
        src={product.image}
        alt={t(product.nameZh, product.nameEn)}
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
          imageLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setImageLoaded(true)}
      />
      {!imageLoaded && (
        <div className="absolute inset-0 shimmer bg-secondary" />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-3">
        <div className="flex items-end justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white text-base leading-tight drop-shadow-lg">
              {t(product.nameZh, product.nameEn)}
            </h3>
            <p className="text-white/60 text-[10px] mt-0.5 line-clamp-1">
              {t(product.descZh, product.descEn)}
            </p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-white/50 text-[9px]">预估到手</span>
              <span className="text-white font-bold text-base drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
                ¥{estimatedPrice}
              </span>
              <span className="text-white/30 text-[9px] line-through ml-1">¥{product.price}</span>
            </div>
          </div>

          <button
            onClick={onAddToCart}
            style={{ width: '32px', height: '32px', minWidth: '32px', minHeight: '32px' }}
            className={`rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 shrink-0 ${
              quantityInCart > 0
                ? "bg-gradient-to-br from-primary via-purple-500 to-violet-600 text-white shadow-[0_0_20px_rgba(127,0,255,0.5)] ring-2 ring-primary/30"
                : "bg-gradient-to-br from-primary/80 to-violet-600 text-white hover:shadow-[0_0_15px_rgba(127,0,255,0.4)] hover:scale-105"
            }`}
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
