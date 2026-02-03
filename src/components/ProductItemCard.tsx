import { Plus, Flame, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProductItemCardProps {
  id: string;
  nameZh: string;
  nameEn: string;
  price: number;
  estimatedPrice: number;
  isHot?: boolean;
  tagLine1Negative?: string[];
  tagLine2?: string;
  tagLine2En?: string;
  quantityInCart: number;
  hasCoupon: boolean;
  couponDiscount: number;
  onAddToCart: (e: React.MouseEvent) => void;
}

export const ProductItemCard = ({
  id,
  nameZh,
  nameEn,
  price,
  estimatedPrice,
  isHot,
  tagLine1Negative,
  tagLine2,
  tagLine2En,
  quantityInCart,
  hasCoupon,
  couponDiscount,
  onAddToCart,
}: ProductItemCardProps) => {
  const { t } = useLanguage();

  return (
    <div className="group relative bg-card/60 backdrop-blur-sm rounded-xl p-3 border border-white/5 hover:border-primary/20 transition-all duration-300">
      {/* 顶部：商品名 + 温度标识 */}
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-semibold text-white text-[15px] leading-tight truncate">
              {t(nameZh, nameEn)}
            </h3>
            {isHot !== undefined && (
              <span className="flex-shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/60">
                {isHot ? t("热", "Hot") : t("冰", "Iced")}
              </span>
            )}
          </div>
          {/* 规格信息 */}
          <p className="text-[11px] text-white/40 mt-0.5">
            {isHot ? t("大热杯", "Large Hot") : t("大冰杯", "Large Iced")} 360ml
          </p>
        </div>
      </div>

      {/* 风味标签区 */}
      <div className="space-y-1 mb-2.5">
        {/* 负面标签 - 雾灰色 */}
        {tagLine1Negative && tagLine1Negative.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {tagLine1Negative.map((tag, idx) => (
              <span 
                key={idx} 
                className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground/60"
              >
                <span className="text-[8px] opacity-70">✕</span>
                {tag}
              </span>
            ))}
          </div>
        )}
        {/* 正面描述 - 白色 + 勾选 */}
        {tagLine2 && (
          <div className="flex items-center gap-1.5 text-[11px] text-white/90">
            <span>{t(tagLine2, tagLine2En || tagLine2)}</span>
            <Check className="w-3 h-3 text-primary flex-shrink-0" />
          </div>
        )}
      </div>

      {/* 底部：价格 + 按钮 */}
      <div className="flex items-end justify-between gap-2">
        {/* 价格区 */}
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
            <span className="text-primary font-bold text-lg leading-none">
              ¥{estimatedPrice}
            </span>
            <span className="text-[10px] text-white/40">
              {t("预估到手价", "Est. price")}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[10px] text-white/30 line-through">
              ¥{price} {t("原价", "Original")}
            </span>
            {hasCoupon && (
              <span className="text-[9px] text-primary/80 bg-primary/10 px-1 py-0.5 rounded">
                -{couponDiscount}
              </span>
            )}
          </div>
        </div>

        {/* 加号按钮 */}
        <button
          onClick={onAddToCart}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 flex-shrink-0 ${
            quantityInCart > 0
              ? "bg-gradient-to-br from-primary via-purple-500 to-violet-600 text-white shadow-[0_0_20px_rgba(127,0,255,0.5)] ring-2 ring-primary/30"
              : "bg-gradient-to-br from-primary/80 to-violet-600 text-white hover:shadow-[0_0_15px_rgba(127,0,255,0.4)] hover:scale-105"
          }`}
        >
          {quantityInCart > 0 ? (
            <span className="text-sm font-bold">{quantityInCart}</span>
          ) : (
            <Plus className="w-4 h-4" strokeWidth={2.5} />
          )}
        </button>
      </div>
    </div>
  );
};
