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
    <div className="bg-card rounded-xl p-3 flex flex-col justify-between min-h-[90px] shadow-sm active:scale-[0.98] transition-transform">
      {/* Top: Icon + Name + Desc */}
      <div className="flex items-start gap-2.5">
        <div className={`w-11 h-11 rounded-xl ${product.iconBg} flex items-center justify-center shrink-0`}>
          <Icon className={`w-5.5 h-5.5 ${product.iconColor}`} strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-sm leading-tight">
            {t(product.nameZh, product.nameEn)}
          </h3>
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

      {/* Footer: Price + Add */}
      <div className="flex items-center justify-between gap-2 mt-2">
        <div className="flex items-baseline gap-1">
          <span className="text-primary font-bold text-base">¥{estimatedPrice}</span>
          <span className="text-muted-foreground text-[10px] line-through">¥{product.price}</span>
        </div>
        <button
          onClick={onAddToCart}
          className={`rounded-full flex items-center justify-center transition-all active:scale-90 shrink-0 ${
            quantityInCart > 0
              ? "bg-primary text-white shadow-sm"
              : "bg-primary text-white hover:opacity-90"
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
