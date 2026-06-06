import { Plus, LucideIcon, CupSoda, Thermometer, Flame, Snowflake, TreePine, Milk, FlaskConical, Flower2, Droplets } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export interface ProductTileData {
  id: string;
  sku?: string;
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
    <div className={`group text-left relative flex flex-col justify-between min-h-0 overflow-hidden rounded-[12px] transition-all duration-300 hover:-translate-y-0.5 ${
      product.isCreative
        ? "py-2 px-2.5 border border-primary/15 bg-[hsl(33,65%,97%)] shadow-[0_1px_0_hsl(var(--primary)/0.03),0_3px_10px_-8px_hsl(var(--primary)/0.2)]"
        : "py-2 px-2.5 border border-[hsl(38,12%,82%)] bg-[hsl(33,65%,97%)] shadow-[0_1px_0_hsl(var(--foreground)/0.02),0_2px_6px_-6px_hsl(var(--foreground)/0.14)]"
    }`}>
      {/* Creative tiles: thin copper hairline */}
      {product.isCreative && (
        <span className="absolute top-0 left-3 right-3 h-px bg-gradient-to-r from-transparent via-copper/35 to-transparent pointer-events-none" />
      )}

      {/* Top row: SKU code + optional LAB index */}
      <div className="flex items-center justify-between gap-1.5 mb-1">
        <span className="font-mono text-[7.5px] tracking-[0.18em] font-bold text-foreground/35 uppercase">
          {product.sku || ""}
        </span>
        {labIndex !== undefined && (
          <span className="flex items-center gap-0.5 px-1 py-[1px] rounded-[3px] border border-primary/25 bg-primary/[0.04]">
            <FlaskConical className="w-[8px] h-[8px] text-primary/65" strokeWidth={1.75} />
            <span className="text-[7px] font-mono font-bold tracking-[0.15em] text-primary/70 uppercase tabular-nums">
              LAB·{String(labIndex).padStart(2, "0")}
            </span>
          </span>
        )}
      </div>

      {/* Name + Price */}
      <div className="flex items-start gap-1.5">
        <div className={`w-[22px] h-[22px] rounded-[5px] ${product.iconBg} flex items-center justify-center shrink-0 mt-px`}>
          <Icon className={`w-3 h-3 ${product.iconColor}`} strokeWidth={1.5} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-1">
            <h3 className={`font-serif font-bold text-espresso tracking-tight leading-tight ${isEn ? "text-[11px]" : "text-[15px]"}`}>
              {t(product.nameZh, product.nameEn)}
            </h3>
            <span className="font-serif text-copper font-semibold text-[14px] shrink-0 tabular-nums leading-none">
              <span className="text-[9px] font-normal mr-px opacity-75">¥</span>{estimatedPrice}
            </span>
          </div>
          {product.tagZh && (
            <p className={`text-foreground/60 mt-1 leading-snug break-keep ${isEn ? "text-[8px]" : "text-[10px]"}`}>
              {t(product.tagZh, product.tagEn || "")}
            </p>
          )}
          {product.descZh && (
            <p className={`text-primary/75 mt-1 leading-snug break-keep font-serif italic ${isEn ? "text-[8px]" : "text-[10px]"}`}>
              {t(product.descZh, product.descEn || "")}
            </p>
          )}
        </div>
      </div>

      {/* Footer: dotted divider + spec + add */}
      <div className="mt-1.5 pt-1.5 border-t border-dashed border-foreground/12 flex items-center justify-between gap-2">
        {product.specZh && !product.isCreative ? (
          <div className="flex items-center gap-1 text-foreground/50 text-[9px] whitespace-nowrap">
            <span className="flex items-center gap-0.5"><CupSoda className="w-[9px] h-[9px]" strokeWidth={1.5} />{t(product.specZh, product.specEn || "").split(" ")[0]}</span>
            <span className="text-foreground/25">/</span>
            <span className="flex items-center gap-0.5"><Thermometer className="w-[9px] h-[9px]" strokeWidth={1.5} />{t(product.specZh, product.specEn || "").split(" ")[1]}</span>
            <span className="text-foreground/25">/</span>
            <span className="flex items-center gap-0.5"><Flame className="w-[9px] h-[9px]" strokeWidth={1.5} />{t(product.specZh, product.specEn || "").split(" ")[2]}</span>
          </div>
        ) : product.isCreative && product.specTags ? (
          <div className="flex items-center gap-1 text-primary/60 text-[9px] flex-wrap">
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
              ? "bg-primary text-oat ring-1 ring-copper/40 shadow-[0_1px_4px_-1px_hsl(var(--primary)/0.4)]"
              : "bg-primary text-oat hover:shadow-[0_2px_6px_-2px_hsl(var(--primary)/0.5)] hover:scale-110"
          }`}
          style={{ width: '22px', height: '22px', minWidth: '22px', minHeight: '22px' }}
          aria-label="Add to cart"
        >
          {quantityInCart > 0 ? (
            <span className="text-[10px] font-bold tabular-nums leading-none">{quantityInCart}</span>
          ) : (
            <Plus className="w-3 h-3" strokeWidth={2.5} />
          )}
        </button>
      </div>
    </div>
  );
};
