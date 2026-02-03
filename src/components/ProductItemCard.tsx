import { Plus, Check } from "lucide-react";
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
    <div className="group relative bg-card/60 backdrop-blur-sm rounded-xl px-3 py-2.5 border border-white/5 hover:border-primary/20 transition-all duration-300">
      {/* 商品名 */}
      <h3 className="font-bold text-white text-base leading-tight">
        {t(nameZh, nameEn)}
      </h3>
      
      {/* 规格信息 */}
      <p className="text-[11px] text-white/40 mt-0.5">
        {isHot ? t("大热杯", "Large Hot") : t("大冰杯", "Large Iced")} 360ml
      </p>

      {/* 负面标签 - 雾灰色 */}
      {tagLine1Negative && tagLine1Negative.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
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

      {/* 正面描述 + 加号按钮 同一行 */}
      <div className="flex items-center justify-between gap-2 mt-1">
        {tagLine2 ? (
          <div className="flex items-center gap-1 text-[11px] text-white/90">
            <span className="font-medium">{t(tagLine2, tagLine2En || tagLine2)}</span>
            <Check className="w-3 h-3 text-primary flex-shrink-0" />
          </div>
        ) : (
          <div />
        )}
        
        {/* 加号按钮 - 缩小版 */}
        <button
          onClick={onAddToCart}
          className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 flex-shrink-0 ${
            quantityInCart > 0
              ? "bg-gradient-to-br from-primary via-purple-500 to-violet-600 text-white shadow-[0_0_16px_rgba(127,0,255,0.5)] ring-2 ring-primary/30"
              : "bg-gradient-to-br from-primary to-violet-600 text-white hover:shadow-[0_0_12px_rgba(127,0,255,0.4)] hover:scale-105"
          }`}
        >
          {quantityInCart > 0 ? (
            <span className="text-xs font-bold">{quantityInCart}</span>
          ) : (
            <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
          )}
        </button>
      </div>

      {/* 价格区 - 底部 */}
      <div className="flex items-baseline gap-1.5 mt-2">
        <span className="text-primary font-bold text-lg leading-none">
          ¥{estimatedPrice}
        </span>
        <span className="text-[10px] text-white/40">
          {t("预估到手价", "Est.")}
        </span>
      </div>
      <div className="flex items-center gap-1.5 mt-0.5">
        <span className="text-[10px] text-white/30 line-through">
          ¥{price} {t("原价", "Orig.")}
        </span>
        {hasCoupon && (
          <span className="text-[9px] text-primary bg-primary/15 px-1 py-0.5 rounded font-medium">
            -{couponDiscount}
          </span>
        )}
      </div>
    </div>
  );
};
