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
  onAddToCart,
}: ProductItemCardProps) => {
  const { t } = useLanguage();

  return (
    <div className="group relative bg-gradient-to-br from-[#151518] to-[#0d0d10] rounded-2xl p-4 border border-white/[0.04] hover:border-primary/20 transition-all duration-500 hover:shadow-[0_8px_32px_rgba(127,0,255,0.08)]">
      {/* 商品名 - 大字体醒目 */}
      <h3 className="font-bold text-white text-[17px] tracking-tight leading-tight">
        {t(nameZh, nameEn)}
      </h3>
      
      {/* 规格 - 细腻灰色 */}
      <p className="text-xs text-white/35 mt-1 tracking-wide">
        {isHot ? t("大热杯", "Large Hot") : t("大冰杯", "Large Iced")} 360ml
      </p>

      {/* 负面标签 */}
      {tagLine1Negative && tagLine1Negative.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mt-3">
          {tagLine1Negative.map((tag, idx) => (
            <span 
              key={idx} 
              className="inline-flex items-center gap-0.5 text-[11px] text-white/30"
            >
              <span className="text-[9px]">✕</span>
              <span>{tag}</span>
            </span>
          ))}
        </div>
      )}

      {/* 正面描述 + 加号 */}
      <div className="flex items-center justify-between gap-3 mt-2">
        {tagLine2 ? (
          <div className="flex items-center gap-1.5">
            <span className="text-[12px] text-white/80 font-medium tracking-wide">
              {t(tagLine2, tagLine2En || tagLine2)}
            </span>
            <Check className="w-3.5 h-3.5 text-primary" strokeWidth={2.5} />
          </div>
        ) : (
          <div />
        )}
        
        {/* 加号按钮 */}
        <button
          onClick={onAddToCart}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 flex-shrink-0 ${
            quantityInCart > 0
              ? "bg-gradient-to-br from-primary via-purple-500 to-violet-600 text-white shadow-[0_0_20px_rgba(127,0,255,0.6)] scale-105"
              : "bg-gradient-to-br from-primary/90 to-violet-600 text-white shadow-[0_4px_16px_rgba(127,0,255,0.3)] hover:shadow-[0_4px_24px_rgba(127,0,255,0.5)] hover:scale-110"
          }`}
        >
          {quantityInCart > 0 ? (
            <span className="text-sm font-bold">{quantityInCart}</span>
          ) : (
            <Plus className="w-4 h-4" strokeWidth={2.5} />
          )}
        </button>
      </div>

      {/* 价格区 - 简洁优雅 */}
      <div className="mt-4 pt-3 border-t border-white/[0.04]">
        <div className="flex items-baseline gap-2">
          <span className="text-primary font-bold text-xl tracking-tight">
            ¥{estimatedPrice}
          </span>
          <span className="text-[11px] text-white/30">
            {t("预估到手价", "Est. price")}
          </span>
        </div>
        <span className="text-[11px] text-white/20 line-through mt-0.5 block">
          ¥{price} {t("原价", "Original")}
        </span>
      </div>
    </div>
  );
};
