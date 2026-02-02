import { useState, useEffect } from "react";
import { Minus, Plus, CreditCard, X, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

interface QuickCheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    nameZh: string;
    nameEn: string;
    price: number;
    image: string;
  } | null;
  estimatedPrice: number;
  couponDiscount: number;
  deliveryFee: number;
}

export const QuickCheckout = ({
  isOpen,
  onClose,
  product,
  estimatedPrice,
  couponDiscount,
  deliveryFee,
}: QuickCheckoutProps) => {
  const { t } = useLanguage();
  const { items, addItem, removeItem, updateQuantity } = useCart();
  const [quantity, setQuantity] = useState(1);

  // 获取当前商品在购物车中的数量
  const cartItem = product ? items.find(i => i.id === product.id) : null;
  const currentQuantity = cartItem?.quantity || 0;

  useEffect(() => {
    if (isOpen && product) {
      setQuantity(currentQuantity > 0 ? currentQuantity : 1);
    }
  }, [isOpen, product, currentQuantity]);

  if (!isOpen || !product) return null;

  const totalPrice = estimatedPrice * quantity;

  const handleQuantityChange = (delta: number) => {
    const newQty = Math.max(1, quantity + delta);
    setQuantity(newQty);
  };

  const handleQuickPay = () => {
    // 更新购物车数量
    if (currentQuantity === 0) {
      for (let i = 0; i < quantity; i++) {
        addItem({
          id: product.id,
          nameZh: product.nameZh,
          nameEn: product.nameEn,
          price: product.price,
          image: product.image,
        });
      }
    } else if (quantity !== currentQuantity) {
      updateQuantity(product.id, quantity);
    }
    
    toast.success(t("正在跳转支付...", "Redirecting to payment..."), {
      duration: 1500,
    });
    onClose();
    // 这里可以跳转到支付页面
  };

  return (
    <>
      {/* 背景遮罩 */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* 快捷结算面板 */}
      <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-300">
        <div className="bg-gradient-to-t from-black via-[#1a1a1d] to-[#1a1a1d]/95 rounded-t-3xl border-t border-white/10 px-5 pt-4 pb-8 shadow-2xl">
          {/* 顶部把手 */}
          <div className="flex justify-center mb-4">
            <div className="w-10 h-1 bg-white/20 rounded-full" />
          </div>
          
          {/* 关闭按钮 */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/20 transition-all"
          >
            <X className="w-4 h-4" />
          </button>

          {/* 商品信息行 */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-white font-semibold text-lg">
                {t(product.nameZh, product.nameEn)}
              </h3>
              <p className="text-white/40 text-xs mt-0.5">
                {t(`原价 ¥${product.price} · 券-${couponDiscount} · 配送+${deliveryFee}`, 
                   `Original ¥${product.price} · Coupon-${couponDiscount} · Delivery+${deliveryFee}`)}
              </p>
            </div>
            <span className="text-primary font-bold text-xl">
              ¥{estimatedPrice}
            </span>
          </div>

          {/* 数量选择 + 总价 */}
          <div className="flex items-center justify-between bg-white/5 rounded-2xl p-4 mb-5">
            {/* 数量控制 */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/20 transition-all active:scale-95"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-white font-bold text-xl w-8 text-center">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary hover:bg-primary/30 transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* 总价 */}
            <div className="text-right">
              <p className="text-white/40 text-xs">{t("合计", "Total")}</p>
              <p className="text-white font-bold text-2xl">¥{totalPrice}</p>
            </div>
          </div>

          {/* 一键支付按钮 */}
          <button
            onClick={handleQuickPay}
            className="w-full h-14 bg-gradient-to-r from-primary via-purple-500 to-violet-600 rounded-2xl flex items-center justify-center gap-2 text-white font-semibold text-base shadow-purple transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Zap className="w-5 h-5" />
            {t("立即支付", "Pay Now")}
            <CreditCard className="w-5 h-5 ml-1 opacity-70" />
          </button>
          
          {/* 安全提示 */}
          <p className="text-center text-white/25 text-[10px] mt-3">
            {t("安全支付 · 即时出单 · 15分钟送达", "Secure Payment · Instant Order · 15min Delivery")}
          </p>
        </div>
      </div>
    </>
  );
};
