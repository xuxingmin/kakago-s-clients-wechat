import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, Gift, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

const OrderConfirm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product, options } = location.state || {};
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!product) {
      navigate("/");
    }
  }, [product, navigate]);

  if (!product) return null;

  const temperatureLabel = options?.temperature === "iced" ? "冰" : "热";
  const totalPrice = product.price * (options?.quantity || 1);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate order submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    navigate("/orders");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border safe-top">
        <div className="flex items-center px-4 py-3 max-w-md mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="flex-1 text-center font-semibold text-foreground">
            确认订单
          </h1>
          <div className="w-9" /> {/* Spacer */}
        </div>
      </header>

      {/* Content */}
      <div className="px-4 py-6 max-w-md mx-auto space-y-4">
        {/* Delivery Address */}
        <section className="card-premium p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">配送地址</span>
                <button className="text-primary text-sm">修改</button>
              </div>
              <p className="text-muted-foreground text-sm mt-1">
                上海市浦东新区张江高科技园区
              </p>
              <p className="text-muted-foreground text-xs mt-0.5">
                张先生 138****8888
              </p>
            </div>
          </div>
        </section>

        {/* Product Info */}
        <section className="card-premium p-4">
          <div className="flex gap-4">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-secondary">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{product.name}</h3>
              <p className="text-muted-foreground text-xs uppercase tracking-wide">
                {product.nameEn}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs px-2 py-1 bg-secondary rounded-full text-muted-foreground">
                  {temperatureLabel}
                </span>
                <span className="text-xs px-2 py-1 bg-secondary rounded-full text-muted-foreground">
                  x{options?.quantity || 1}
                </span>
              </div>
            </div>
            <p className="text-primary font-bold">¥{totalPrice}</p>
          </div>
        </section>

        {/* Blind Box Info */}
        <section className="card-premium p-4">
          <div className="flex items-center gap-3 mb-3">
            <Gift className="w-5 h-5 text-primary" />
            <span className="font-medium text-foreground">盲盒体验</span>
          </div>
          <div className="bg-secondary rounded-xl p-4">
            <div className="flex items-center gap-2 text-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">
                下单后将随机匹配附近优质咖啡馆
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm mt-2">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">
                商家接单后即刻揭晓专属咖啡馆
              </span>
            </div>
          </div>
        </section>

        {/* Price Summary */}
        <section className="card-premium p-4">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">商品金额</span>
              <span className="text-foreground">¥{totalPrice}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">配送费</span>
              <span className="text-foreground">¥5</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">优惠</span>
              <span className="text-primary">-¥0</span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex justify-between items-center">
              <span className="font-medium text-foreground">合计</span>
              <span className="text-xl font-bold text-primary">
                ¥{totalPrice + 5}
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* Submit Button */}
      <div className="fixed bottom-0 left-0 right-0 glass border-t border-border safe-bottom">
        <div className="px-4 py-4 max-w-md mx-auto">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="btn-gold w-full py-4 rounded-2xl text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                提交中...
              </span>
            ) : (
              `立即支付 · ¥${totalPrice + 5}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirm;
