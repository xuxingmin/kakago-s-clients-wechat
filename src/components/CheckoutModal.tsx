import { X, MapPin, Phone, Shield } from "lucide-react";

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

// WeChat Pay icon component
const WeChatPayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M9.5 4C5.36 4 2 6.69 2 10c0 1.89 1.08 3.56 2.78 4.66L4 17l2.5-1.5c.89.32 1.89.5 2.94.5.17 0 .33 0 .5-.02-.14-.5-.22-1.03-.22-1.58C9.72 10.86 12.58 8 16.22 8c.17 0 .34.01.5.02C16.08 5.69 13.14 4 9.5 4zm-2.25 4a.75.75 0 110-1.5.75.75 0 010 1.5zm4.5 0a.75.75 0 110-1.5.75.75 0 010 1.5z"/>
    <path d="M22 14.4c0-2.65-2.68-4.8-6-4.8s-6 2.15-6 4.8c0 2.65 2.68 4.8 6 4.8.67 0 1.31-.08 1.91-.23L20 20l-.6-1.8c1.02-.86 1.6-2 1.6-3.3zm-7.75-.65a.65.65 0 110-1.3.65.65 0 010 1.3zm3.5 0a.65.65 0 110-1.3.65.65 0 010 1.3z"/>
  </svg>
);

export const CheckoutModal = ({
  isOpen,
  onClose,
  product,
  onConfirm,
}: CheckoutModalProps) => {
  if (!product) return null;

  const fulfillmentFee = 2.10;
  const totalPrice = product.price + fulfillmentFee;

  const handlePayment = () => {
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

      {/* Modal - 60% height */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ height: "70vh" }}
      >
        <div className="bg-card rounded-t-3xl max-w-md mx-auto h-full flex flex-col safe-bottom overflow-hidden">
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
            <div className="w-10 h-1 bg-border rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 pb-4 flex-shrink-0">
            <h2 className="text-lg font-bold text-foreground">确认订单</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-mist-light transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-5 space-y-4">
            {/* Delivery Info */}
            <div className="bg-secondary rounded-2xl p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">配送地址</p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    天鹅湖CBD · 万达广场3号楼15层1502室
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">联系电话</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    138****8888
                  </p>
                </div>
              </div>
            </div>

            {/* Trust Badge */}
            <div className="border-2 border-primary/30 bg-primary/5 rounded-2xl p-4 flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-primary">KAKAGO 品质保证</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  您的订单将由 KAKAGO 认证精品咖啡师制作，确保每一杯都达到专业标准。
                </p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-secondary rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">订单明细</h3>
              
              {/* Product Item */}
              <div className="flex items-center gap-3 pb-3 border-b border-border">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-card flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.tag}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">¥{product.price.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">x1</p>
                </div>
              </div>

              {/* Fee Breakdown */}
              <div className="pt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">商品金额</span>
                  <span className="text-sm text-foreground">¥{product.price.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">精品履约服务费</span>
                  <span className="text-sm text-foreground">¥{fulfillmentFee.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Fixed at bottom */}
          <div className="flex-shrink-0 px-5 py-4 bg-card border-t border-border">
            {/* Total */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-base font-semibold text-foreground">合计</span>
              <span className="text-2xl font-bold text-primary">¥{totalPrice.toFixed(2)}</span>
            </div>

            {/* WeChat Pay Button */}
            <button
              onClick={handlePayment}
              className="w-full py-4 rounded-2xl text-base font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
              style={{ backgroundColor: "#07C160" }}
            >
              <WeChatPayIcon />
              <span>微信支付 ¥{totalPrice.toFixed(2)}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
