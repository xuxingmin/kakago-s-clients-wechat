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

export const ProductSheet = ({ isOpen, onClose, product, onAddToCart }: ProductSheetProps) => {
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
        className={`fixed inset-0 bg-espresso/45 backdrop-blur-[2px] z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sheet — paper card */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="bg-paper rounded-t-3xl max-w-md mx-auto safe-bottom border-t border-foreground/10 shadow-[0_-12px_40px_-12px_hsla(24,13%,9%,0.25)]">
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1.5">
            <div className="w-10 h-1 bg-foreground/15 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-start justify-between px-5 pt-2 pb-4">
            <div className="flex gap-4 flex-1 min-w-0">
              <div className="w-[72px] h-[72px] rounded-2xl overflow-hidden bg-oat border border-foreground/10 flex-shrink-0">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <p className="font-mono text-[9px] tracking-[0.22em] uppercase text-foreground/55">
                  {product.nameEn}
                </p>
                <h3 className="font-serif text-[18px] font-bold text-espresso mt-0.5 truncate">
                  {product.name}
                </h3>
                <p className="mt-1.5 font-serif font-bold text-[18px] tabular-nums">
                  <span className="text-copper-500 mr-0.5">¥</span>
                  <span className="text-espresso">{product.price}</span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full -mr-1 flex items-center justify-center text-foreground/55 hover:text-foreground hover:bg-foreground/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Options */}
          <div className="px-5 py-4 border-t border-dashed border-foreground/15">
            {product.hasIceOption !== false && (
              <div className="mb-5">
                <label className="font-mono text-[9px] tracking-[0.22em] uppercase text-foreground/60 mb-2.5 block">
                  {/* Temperature */}
                  Temperature · 温度
                </label>
                <div className="flex gap-2.5">
                  <button
                    onClick={() => setTemperature("hot")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[14px] font-medium transition-all duration-200 border ${
                      temperature === "hot"
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-foreground/65 border-foreground/12 hover:border-foreground/25"
                    }`}
                  >
                    <Flame className="w-4 h-4" />
                    热饮 Hot
                  </button>
                  <button
                    onClick={() => setTemperature("iced")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[14px] font-medium transition-all duration-200 border ${
                      temperature === "iced"
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-foreground/65 border-foreground/12 hover:border-foreground/25"
                    }`}
                  >
                    <Snowflake className="w-4 h-4" />
                    冰饮 Iced
                  </button>
                </div>
              </div>
            )}

            <div>
              <label className="font-mono text-[9px] tracking-[0.22em] uppercase text-foreground/60 mb-2.5 block">
                Quantity · 数量
              </label>
              <div className="flex items-center justify-between bg-card border border-foreground/12 rounded-xl p-1.5">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-foreground disabled:opacity-30 hover:bg-foreground/5 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-serif text-[18px] font-bold text-espresso tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  disabled={quantity >= 10}
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-foreground disabled:opacity-30 hover:bg-foreground/5 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="px-5 py-4 pb-6 border-t border-foreground/10 bg-oat/40">
            <button
              onClick={handleSubmit}
              className="w-full h-12 rounded-full bg-primary text-primary-foreground font-semibold text-[15px] tracking-wide hover:bg-purple-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span>立即加入</span>
              <span className="opacity-60">·</span>
              <span className="tabular-nums">
                <span className="opacity-80 mr-0.5">¥</span>
                {totalPrice.toFixed(0)}
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
