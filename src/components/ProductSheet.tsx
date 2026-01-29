import { useState } from "react";
import { X, Minus, Plus, Flame, Snowflake } from "lucide-react";

interface ProductSheetProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    nameEn: string;
    price: number;
    image: string;
    description?: string;
    hasIceOption?: boolean;
  } | null;
  onAddToCart: (productId: string, options: { temperature: "hot" | "iced"; quantity: number }) => void;
}

export const ProductSheet = ({
  isOpen,
  onClose,
  product,
  onAddToCart,
}: ProductSheetProps) => {
  const [temperature, setTemperature] = useState<"hot" | "iced">("hot");
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleSubmit = () => {
    onAddToCart(product.id, { temperature, quantity });
    onClose();
    setQuantity(1);
    setTemperature("hot");
  };

  const totalPrice = product.price * quantity;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sheet */}
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
                <p className="text-muted-foreground text-xs uppercase tracking-wide">
                  {product.nameEn}
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

          {/* Options */}
          <div className="px-6 py-4 border-t border-border">
            {/* Temperature */}
            {product.hasIceOption !== false && (
              <div className="mb-6">
                <label className="text-sm font-medium text-muted-foreground mb-3 block">
                  温度选择
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setTemperature("hot")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all duration-200 ${
                      temperature === "hot"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Flame className="w-4 h-4" />
                    热饮
                  </button>
                  <button
                    onClick={() => setTemperature("iced")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all duration-200 ${
                      temperature === "iced"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Snowflake className="w-4 h-4" />
                    冰饮
                  </button>
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-3 block">
                数量
              </label>
              <div className="flex items-center justify-between bg-secondary rounded-xl p-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="w-10 h-10 rounded-lg bg-card flex items-center justify-center text-foreground disabled:opacity-40 transition-opacity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-lg font-semibold text-foreground">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  disabled={quantity >= 10}
                  className="w-10 h-10 rounded-lg bg-card flex items-center justify-center text-foreground disabled:opacity-40 transition-opacity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="px-6 py-4 border-t border-border">
            <button
              onClick={handleSubmit}
              className="btn-gold w-full py-4 rounded-2xl text-base font-semibold"
            >
              立即下单 · ¥{totalPrice.toFixed(0)}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
