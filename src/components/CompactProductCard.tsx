import { Plus, Flame, Check, CupSoda } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface CompactProductCardProps {
  product: {
    id: string;
    nameZh: string;
    nameEn: string;
    price: number;
    image: string;
    tagLine1Negative?: string[];
    tagLine2?: string;
    tagLine2En?: string;
    isHot?: boolean;
  };
  estimatedPrice: number;
  quantityInCart: number;
  onAddToCart: (e: React.MouseEvent) => void;
}

export const CompactProductCard = ({
  product,
  estimatedPrice,
  quantityInCart,
  onAddToCart,
}: CompactProductCardProps) => {
  const { t } = useLanguage();

  return (
    <div className="group card-md text-left relative flex flex-col justify-between min-h-[72px] py-1.5 px-2.5">
      {/* 顶部：商品名 + 价格 */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-baseline gap-1 flex-1 min-w-0">
          <h3 className="font-semibold text-white text-sm leading-tight">
            {t(product.nameZh, product.nameEn)}
          </h3>
          {product.isHot && (
            <Flame className="w-3 h-3 text-primary/60 flex-shrink-0" />
          )}
        </div>
        <div className="flex items-start gap-1 flex-shrink-0">
          <span className="text-white/60 text-[9px] mt-[5px] font-medium">
            预估到手
          </span>
          <span className="text-white font-bold text-lg drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
            ¥{estimatedPrice}
          </span>
        </div>
      </div>

      {/* 中间：标签 */}
      <div className="space-y-0">
        <div className="flex items-center gap-1.5 text-[10px]">
          {product.tagLine1Negative?.map((tag, idx) => (
            <span key={idx} className="flex items-center gap-0.5 text-muted-foreground/70">
              <span className="text-[8px]">✕</span>{tag}
            </span>
          ))}
        </div>
        {product.tagLine2 && (
          <div className="flex items-center gap-1 text-[10px] text-white/80">
            <span>{t(product.tagLine2, product.tagLine2En || "")}</span>
            <Check className="w-3 h-3 text-primary" />
          </div>
        )}
      </div>

      {/* 底部：交易明细 + 按钮 */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[9px] text-white/40 flex-1 min-w-0">
          <span className="flex items-center gap-0.5 whitespace-nowrap">
            <CupSoda className="w-2.5 h-2.5" />360ml
          </span>
          <span className="whitespace-nowrap">
            原价 <span className="line-through">¥</span>{product.price}
          </span>
        </div>

        <button
          onClick={onAddToCart}
          style={{ width: '28px', height: '28px', minWidth: '28px', minHeight: '28px' }}
          className={`rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 shrink-0 ${
            quantityInCart > 0
              ? "bg-gradient-to-br from-primary via-purple-500 to-violet-600 text-white shadow-[0_0_20px_rgba(127,0,255,0.5)] ring-2 ring-primary/30"
              : "bg-gradient-to-br from-primary/80 to-violet-600 text-white hover:shadow-[0_0_15px_rgba(127,0,255,0.4)] hover:scale-105"
          }`}
        >
          {quantityInCart > 0 ? (
            <span className="text-xs font-bold">{quantityInCart}</span>
          ) : (
            <Plus className="w-4 h-4" strokeWidth={2} />
          )}
        </button>
      </div>
    </div>
  );
};
