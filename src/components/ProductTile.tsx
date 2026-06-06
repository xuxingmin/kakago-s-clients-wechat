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
    <div className={`group text-left relative flex flex-col justify-between min-h-0 overflow-hidden rounded-[14px] transition-all duration-300 hover:-translate-y-0.5 ${
      product.isCreative
        ? "py-1.5 px-2 border border-primary/20 bg-paper shadow-[0_1px_0_hsl(var(--primary)/0.04),0_4px_14px_-10px_hsl(var(--primary)/0.25)]"
        : "py-1.5 px-2 border border-foreground/[0.08] bg-paper shadow-[0_1px_0_hsl(var(--foreground)/0.03),0_2px_8px_-6px_hsl(var(--foreground)/0.18)]"
    }`}>
      {/* Creative tiles: thin copper top accent */}
      {product.isCreative && (
        <span className="absolute top-0 left-2 right-2 h-px bg-gradient-to-r from-transparent via-copper/40 to-transparent pointer-events-none" />
      )}

      {/* Lab badge for creative */}
      {labIndex !== undefined && (
        <span className="absolute top-1.5 left-1.5 flex items-center gap-0.5 px-1.5 py-[1px] rounded-sm bg-primary/[0.06] border border-primary/20 z-10">
          <FlaskConical className="w-2 h-2 text-primary/65" strokeWidth={2} />
          <span className="text-[7px] font-mono font-bold tracking-[0.15em] text-primary/65 uppercase">
            LAB {String(labIndex).padStart(2, "0")}
          </span>
        </span>
      )}

      {/* Top: Icon + Name + Price */}
      <div className={`flex items-start gap-1.5 ${labIndex !== undefined ? "mt-3" : ""}`}>
        <div className={`w-7 h-7 rounded-md ${product.iconBg} flex items-center justify-center shrink-0`}>
          <Icon className={`w-3.5 h-3.5 ${product.iconColor}`} strokeWidth={1.5} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-1">
            <h3 className={`font-serif font-bold text-espresso tracking-tight leading-tight ${isEn ? "text-[11px]" : "text-[15px]"}`}>
              {t(product.nameZh, product.nameEn)}
            </h3>
            <span className="font-serif text-copper font-bold text-base shrink-0 tabular-nums">
              <span className="text-[10px] font-normal mr-px">¥</span>{estimatedPrice}
            </span>
          </div>
          {product.tagZh && (
            <p className={`text-foreground/55 mt-0.5 leading-relaxed break-keep ${isEn ? "text-[8px]" : "text-[10px]"}`}>
              {t(product.tagZh, product.tagEn || "")}
            </p>
          )}
          {product.descZh && (
            <p className={`text-primary/70 mt-0.5 leading-relaxed break-keep font-serif italic ${isEn ? "text-[8px]" : "text-[10px]"}`}>
              {t(product.descZh, product.descEn || "")}
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 mt-auto pt-1">
        {product.specZh && !product.isCreative ? (
          <div className="flex items-center gap-1.5 text-foreground/45 text-[9px]">
            <span className="flex items-center gap-0.5"><CupSoda className="w-[9px] h-[9px]" strokeWidth={1.5} />{t(product.specZh, product.specEn || "").split(" ")[0]}</span>
            <span className="w-px h-2 bg-foreground/15" />
            <span className="flex items-center gap-0.5"><Thermometer className="w-[9px] h-[9px]" strokeWidth={1.5} />{t(product.specZh, product.specEn || "").split(" ")[1]}</span>
            <span className="w-px h-2 bg-foreground/15" />
            <span className="flex items-center gap-0.5"><Flame className="w-[9px] h-[9px]" strokeWidth={1.5} />{t(product.specZh, product.specEn || "").split(" ")[2]}</span>
          </div>
        ) : product.isCreative && product.specTags ? (
          <div className="flex items-center gap-1 text-primary/55 text-[9px] flex-wrap">
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
          onClick={(e) => {
            onAddToCart(e);
            const btn = e.currentTarget;
            btn.classList.remove('animate-cart-pop');
            void btn.offsetWidth;
            btn.classList.add('animate-cart-pop');
          }}
          className={`ripple rounded-full flex items-center justify-center transition-all duration-300 active:scale-75 shrink-0 ${
            quantityInCart > 0
              ? "bg-primary text-oat shadow-[0_2px_8px_-2px_hsl(var(--primary)/0.5)] ring-1 ring-copper/40"
              : "bg-primary text-oat hover:shadow-[0_3px_10px_-2px_hsl(var(--primary)/0.55)] hover:scale-110"
          }`}
          style={{ width: '26px', height: '26px', minWidth: '26px', minHeight: '26px' }}
          aria-label="Add to cart"
        >
          {quantityInCart > 0 ? (
            <span className="text-[11px] font-bold tabular-nums">{quantityInCart}</span>
          ) : (
            <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
          )}
        </button>
      </div>
    </div>
  );
};
