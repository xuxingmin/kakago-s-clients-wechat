import { Plus, LucideIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export interface ProductTileData {
  id: string;
  nameZh: string;
  nameEn: string;
  price: number;
  image: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  tagZh?: string;
  tagEn?: string;
  descZh?: string;
  descEn?: string;
  isCreative?: boolean;
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
  const { t } = useLanguage();
  const Icon = product.icon;

  return (
    <div className={`group card-md text-left relative flex flex-col justify-between py-2.5 px-3 min-h-[72px] overflow-hidden ${
      product.isCreative ? "border-primary/20 bg-gradient-to-br from-primary/10 via-violet-950/30 to-purple-950/20" : ""
    }`}>
      {/* Top: Icon + Name + Price */}
      <div className="flex items-start gap-2">
        <div className={`w-10 h-10 rounded-xl ${product.iconBg} flex items-center justify-center shrink-0`}>
          <Icon className={`w-5 h-5 ${product.iconColor}`} strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1">
            <h3 className="font-semibold text-white text-sm leading-tight">
              {t(product.nameZh, product.nameEn)}
            </h3>
            <span className="text-white font-bold text-base shrink-0 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
              ¥{estimatedPrice}
            </span>
          </div>
          {product.tagZh && (
            <p className="text-muted-foreground text-[10px] mt-0.5 line-clamp-1">
              {t(product.tagZh, product.tagEn || "")}
            </p>
          )}
          {product.descZh && (
            <p className="text-muted-foreground text-[10px] mt-0.5 line-clamp-1">
              {t(product.descZh, product.descEn || "")}
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 mt-auto pt-1">
        <span className="text-white/30 text-[9px]">
          原价 <span className="line-through">¥{product.price}</span>
        </span>
        <button
          onClick={onAddToCart}
          className={`rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 shrink-0 ${
            quantityInCart > 0
              ? "bg-gradient-to-br from-primary via-purple-500 to-violet-600 text-white shadow-[0_0_20px_rgba(127,0,255,0.5)] ring-2 ring-primary/30"
              : "bg-gradient-to-br from-primary/80 to-violet-600 text-white hover:shadow-[0_0_15px_rgba(127,0,255,0.4)] hover:scale-105"
          }`}
          style={{ width: '28px', height: '28px', minWidth: '28px', minHeight: '28px' }}
        >
          {quantityInCart > 0 ? (
            <span className="text-xs font-bold">{quantityInCart}</span>
          ) : (
            <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
          )}
        </button>
      </div>
    </div>
  );
};
