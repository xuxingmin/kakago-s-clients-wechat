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
    <div className={`group card-md text-left relative flex flex-col overflow-hidden ${
      product.isCreative
        ? "py-2.5 px-3 border-t border-primary/20 bg-gradient-to-br from-primary/10 via-violet-950/30 to-purple-950/20"
        : "py-2 px-3"
    }`}>
      {/* Lab tag for creative */}
      {labIndex !== undefined && (
        <span className="absolute top-1.5 right-2 text-[7px] font-mono font-bold tracking-widest text-purple-400/40 uppercase">
          LAB {String(labIndex).padStart(2, "0")}
        </span>
      )}

      {/* Row 1: Icon + Name + Price */}
      <div className="flex items-center gap-2">
        <div className={`w-7 h-7 rounded-md ${product.iconBg} flex items-center justify-center shrink-0`}>
          <Icon className={`w-3.5 h-3.5 ${product.iconColor}`} strokeWidth={1.5} />
        </div>
        <h3 className={`font-semibold text-white leading-tight flex-1 min-w-0 truncate ${isEn ? "text-[11px]" : "text-sm"}`}>
          {t(product.nameZh, product.nameEn)}
        </h3>
        <span className="text-white font-bold text-base shrink-0">
          ¥{estimatedPrice}
        </span>
      </div>

      {/* Row 2: Tag / Description */}
      <div className="mt-1 pl-9">
        {product.tagZh && (
          <p className={`text-violet-300/40 truncate ${isEn ? "text-[8px]" : "text-[10px]"}`}>
            {t(product.tagZh, product.tagEn || "")}
          </p>
        )}
        {product.descZh && (
          <p className={`text-purple-300/45 truncate ${isEn ? "text-[8px]" : "text-[10px]"}`}>
            {t(product.descZh, product.descEn || "")}
          </p>
        )}
      </div>

      {/* Row 3: Specs + Add Button */}
      <div className="flex items-center justify-between mt-1.5 pl-9">
        {product.specZh && !product.isCreative ? (
          <div className="flex items-center gap-1.5 text-violet-400/35 text-[9px]">
            <span className="flex items-center gap-0.5"><CupSoda className="w-[9px] h-[9px]" strokeWidth={1.5} />{t(product.specZh, product.specEn || "").split(" ")[0]}</span>
            <span className="flex items-center gap-0.5"><Thermometer className="w-[9px] h-[9px]" strokeWidth={1.5} />{t(product.specZh, product.specEn || "").split(" ")[1]}</span>
            <span className="flex items-center gap-0.5"><Flame className="w-[9px] h-[9px]" strokeWidth={1.5} />{t(product.specZh, product.specEn || "").split(" ")[2]}</span>
          </div>
        ) : product.isCreative && product.specTags ? (
          <div className="flex items-center gap-1.5 text-purple-300/40 text-[9px]">
            {product.specTags.map((tag, i) => {
              const TagIcon = specTagIconMap[tag.icon];
              return (
                <span key={i} className="flex items-center gap-0.5 whitespace-nowrap">
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
