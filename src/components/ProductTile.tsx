import { Plus, LucideIcon, CupSoda, Thermometer, Flame, Snowflake, TreePine, Milk, FlaskConical, Flower2, Droplets } from "lucide-react";
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
  specZh?: string;
  specEn?: string;
  specTags?: { icon: string; labelZh: string; labelEn: string }[];
  isCreative?: boolean;
}

interface ProductTileProps {
  product: ProductTileData;
  estimatedPrice: number;
  quantityInCart: number;
  onAddToCart: (e: React.MouseEvent) => void;
  labIndex?: number;
}

export const ProductTile = ({
  product,
  estimatedPrice,
  quantityInCart,
  onAddToCart,
  labIndex,
}: ProductTileProps) => {
  const { t, language } = useLanguage();
  const Icon = product.icon;
  const isEn = language === "en";

  const specTagIconMap: Record<string, LucideIcon> = {
    snowflake: Snowflake,
    cup: CupSoda,
    tree: TreePine,
    milk: Milk,
    flask: FlaskConical,
    flower: Flower2,
    droplets: Droplets,
    flame: Flame,
  };

  return (
    <div className={`group card-md text-left relative flex flex-col justify-between min-h-0 overflow-hidden ${
      product.isCreative
        ? "py-4 px-3 border-t border-primary/20 bg-gradient-to-br from-primary/10 via-violet-950/30 to-purple-950/20"
        : "py-4 px-3"
    }`}>
      {/* Lab tag for creative */}
      {labIndex !== undefined && (
        <span className="absolute top-2 right-2 text-[7px] font-mono font-bold tracking-widest text-purple-400/40 uppercase">
          LAB {String(labIndex).padStart(2, "0")}
        </span>
      )}
      {/* Top: Icon + Name + Price */}
      <div className="flex items-start gap-2">
        <div className={`w-7 h-7 rounded-md ${product.iconBg} flex items-center justify-center shrink-0`}>
          <Icon className={`w-3.5 h-3.5 ${product.iconColor}`} strokeWidth={1.5} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1">
            <h3 className={`font-semibold text-white leading-tight ${isEn ? "text-[10px]" : "text-[12px]"}`}>
              {t(product.nameZh, product.nameEn)}
            </h3>
            <span className="text-white font-bold text-sm shrink-0">
              ¥{estimatedPrice}
            </span>
          </div>
          {product.tagZh && (
            <p className={`text-violet-300/40 mt-1 leading-snug break-keep ${isEn ? "text-[8px]" : "text-[10px]"}`}>
              {t(product.tagZh, product.tagEn || "")}
            </p>
          )}
          {product.descZh && (
            <p className={`text-purple-300/45 mt-1 leading-snug break-keep ${isEn ? "text-[8px]" : "text-[10px]"}`}>
              {t(product.descZh, product.descEn || "")}
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 mt-auto pt-2">
        {product.specZh && !product.isCreative ? (
          <div className="flex items-center gap-2 text-violet-400/35 text-[9px]">
            <span className="flex items-center gap-0.5"><CupSoda className="w-[9px] h-[9px]" strokeWidth={1.5} />{t(product.specZh, product.specEn || "").split(" ")[0]}</span>
            <span className="flex items-center gap-0.5"><Thermometer className="w-[9px] h-[9px]" strokeWidth={1.5} />{t(product.specZh, product.specEn || "").split(" ")[1]}</span>
            <span className="flex items-center gap-0.5"><Flame className="w-[9px] h-[9px]" strokeWidth={1.5} />{t(product.specZh, product.specEn || "").split(" ")[2]}</span>
          </div>
        ) : product.isCreative && product.specTags ? (
          <div className="flex items-center gap-1.5 text-purple-300/40 text-[9px] flex-wrap">
            {product.specTags.map((tag, i) => {
              const TagIcon = specTagIconMap[tag.icon];
              return (
                <span key={i} className="flex items-center gap-0.5">
                  {TagIcon && <TagIcon className="w-[9px] h-[9px]" strokeWidth={1.5} />}
                  {t(tag.labelZh, tag.labelEn)}
                </span>
              );
            })}
          </div>
        ) : <span />}
        <button
          onClick={onAddToCart}
          className={`rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 shrink-0 ${
            quantityInCart > 0
              ? "bg-gradient-to-br from-primary via-purple-500 to-violet-600 text-white shadow-[0_0_20px_rgba(127,0,255,0.5)] ring-2 ring-primary/30"
              : "bg-gradient-to-br from-primary/80 to-violet-600 text-white hover:shadow-[0_0_15px_rgba(127,0,255,0.4)] hover:scale-105"
          }`}
          style={{ width: '24px', height: '24px', minWidth: '24px', minHeight: '24px' }}
        >
          {quantityInCart > 0 ? (
            <span className="text-[10px] font-bold">{quantityInCart}</span>
          ) : (
            <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
          )}
        </button>
      </div>
    </div>
  );
};
