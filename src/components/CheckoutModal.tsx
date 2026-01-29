import { X, MapPin, Clock } from "lucide-react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    tag: string;
  } | null;
  onConfirm: (productId: string) => void;
}

export const CheckoutModal = ({
  isOpen,
  onClose,
  product,
  onConfirm,
}: CheckoutModalProps) => {
  if (!product) return null;

  const handleConfirm = () => {
    onConfirm(product.id);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="bg-card rounded-t-3xl max-w-md mx-auto safe-bottom">
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 bg-border rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-start justify-between px-6 pb-4">
            <div className="flex gap-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-secondary">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {product.name}
                </h3>
                <p className="text-muted-foreground text-xs mt-0.5">
                  {product.tag}
                </p>
                <p className="text-primary font-bold text-xl mt-2">
                  ¥{product.price}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery Info */}
          <div className="px-6 py-4 border-t border-border space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">配送至</p>
                <p className="text-xs text-muted-foreground">天鹅湖CBD · 默认地址</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                <Clock className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">预计送达</p>
                <p className="text-xs text-muted-foreground">下单后 15-25 分钟</p>
              </div>
            </div>
          </div>

          {/* Blind Box Hint */}
          <div className="mx-6 p-3 bg-lavender rounded-xl">
            <p className="text-xs text-center text-muted-foreground">
              🎁 下单后将随机匹配一家精品咖啡馆为您制作
            </p>
          </div>

          {/* Price Summary */}
          <div className="px-6 py-4 border-t border-border mt-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-muted-foreground text-sm">商品金额</span>
              <span className="text-foreground font-medium">¥{product.price}</span>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-muted-foreground text-sm">配送费</span>
              <span className="text-foreground font-medium">¥0</span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <span className="text-foreground font-semibold">合计</span>
              <span className="text-primary font-bold text-xl">¥{product.price}</span>
            </div>
          </div>

          {/* Confirm Button */}
          <div className="px-6 py-4">
            <button
              onClick={handleConfirm}
              className="btn-gold w-full py-4 rounded-2xl text-base font-semibold"
            >
              立即下单
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
