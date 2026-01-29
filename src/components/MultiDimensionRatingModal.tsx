import * as React from "react";
import { useState } from "react";
import { X, ThumbsUp, MessageSquare, Send } from "lucide-react";

interface MultiDimensionRatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeName: string;
  productName: string;
  onSubmit: (
    tasteRating: number,
    packagingRating: number,
    timelinessRating: number,
    comment: string
  ) => void;
}

interface RatingDimensionProps {
  label: string;
  emoji: string;
  value: number;
  onChange: (value: number) => void;
}

const RatingDimension: React.FC<RatingDimensionProps> = ({
  label,
  emoji,
  value,
  onChange,
}) => {
  const [hoveredValue, setHoveredValue] = useState(0);
  const displayValue = hoveredValue || value;

  const getRatingText = (rating: number) => {
    if (rating === 0) return "";
    if (rating === 1) return "很差";
    if (rating === 2) return "较差";
    if (rating === 3) return "一般";
    if (rating === 4) return "不错";
    if (rating === 5) return "完美";
    return "";
  };

  return (
    <div className="flex items-center gap-4 py-3">
      <div className="w-20 flex items-center gap-2">
        <span className="text-lg">{emoji}</span>
        <span className="text-sm font-medium text-white">{label}</span>
      </div>
      <div className="flex-1 flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            onClick={() => onChange(rating)}
            onMouseEnter={() => setHoveredValue(rating)}
            onMouseLeave={() => setHoveredValue(0)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
              rating <= displayValue
                ? "bg-primary scale-110"
                : "bg-secondary hover:bg-white/10"
            }`}
          >
            <ThumbsUp
              className={`w-5 h-5 transition-colors ${
                rating <= displayValue ? "text-white" : "text-white/30"
              }`}
            />
          </button>
        ))}
      </div>
      <span
        className={`w-12 text-sm font-medium text-right transition-opacity ${
          displayValue > 0 ? "opacity-100 text-primary" : "opacity-0"
        }`}
      >
        {getRatingText(displayValue)}
      </span>
    </div>
  );
};

export const MultiDimensionRatingModal = React.forwardRef<
  HTMLDivElement,
  MultiDimensionRatingModalProps
>(({ isOpen, onClose, storeName, productName, onSubmit }, ref) => {
  const [tasteRating, setTasteRating] = useState(0);
  const [packagingRating, setPackagingRating] = useState(0);
  const [timelinessRating, setTimelinessRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = tasteRating > 0 && packagingRating > 0 && timelinessRating > 0;
  const overallRating = isValid
    ? ((tasteRating + packagingRating + timelinessRating) / 3).toFixed(1)
    : "0.0";

  const handleSubmit = async () => {
    if (!isValid) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    onSubmit(tasteRating, packagingRating, timelinessRating, comment);

    // Reset state
    setTasteRating(0);
    setPackagingRating(0);
    setTimelinessRating(0);
    setComment("");
    setIsSubmitting(false);
    onClose();
  };

  const handleClose = () => {
    setTasteRating(0);
    setPackagingRating(0);
    setTimelinessRating(0);
    setComment("");
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/70 backdrop-blur-md z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        ref={ref}
        className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center transition-all duration-300 ${
          isOpen
            ? "opacity-100"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`w-full max-w-md bg-card rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/10 transition-transform duration-300 ${
            isOpen ? "translate-y-0" : "translate-y-full sm:translate-y-8"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative px-6 pt-6 pb-4 bg-gradient-to-b from-primary/20 to-transparent">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white/60 hover:text-white transition-colors min-h-[48px]"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="text-center pr-8">
              <p className="text-sm text-white/60 mb-1">请为你今天的咖啡评分</p>
              <h2 className="text-lg font-bold text-white">{productName}</h2>
              <p className="text-xs text-primary mt-1">来自 {storeName}</p>
            </div>
          </div>

          {/* Rating Dimensions */}
          <div className="px-6 py-4 space-y-1">
            <RatingDimension
              label="口味"
              emoji="☕"
              value={tasteRating}
              onChange={setTasteRating}
            />
            <RatingDimension
              label="包装"
              emoji="📦"
              value={packagingRating}
              onChange={setPackagingRating}
            />
            <RatingDimension
              label="时效"
              emoji="⏱️"
              value={timelinessRating}
              onChange={setTimelinessRating}
            />
          </div>

          {/* Overall Score Display */}
          <div
            className={`mx-6 py-4 rounded-2xl bg-secondary/50 text-center transition-all duration-300 ${
              isValid ? "opacity-100 scale-100" : "opacity-50 scale-95"
            }`}
          >
            <p className="text-xs text-white/50 mb-1">综合评分</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-4xl font-bold text-primary">{overallRating}</span>
              <div className="flex flex-col items-start">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <ThumbsUp
                      key={i}
                      className={`w-4 h-4 ${
                        i <= Math.round(Number(overallRating))
                          ? "text-primary"
                          : "text-white/20"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-white/50 mt-0.5">/ 5.0</span>
              </div>
            </div>
          </div>

          {/* Comment Input */}
          <div className="px-6 py-4">
            <div className="relative">
              <MessageSquare className="absolute left-4 top-3.5 w-4 h-4 text-white/40" />
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="分享你的体验（选填）..."
                className="w-full h-24 pl-10 pr-4 py-3 bg-secondary rounded-xl text-sm text-white placeholder:text-white/40 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                maxLength={200}
              />
              <p className="text-xs text-white/40 text-right mt-1">
                {comment.length}/200
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="px-6 pb-6 pt-2 safe-bottom">
            <button
              onClick={handleSubmit}
              disabled={!isValid || isSubmitting}
              className={`w-full py-4 min-h-[56px] rounded-2xl text-base font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                !isValid
                  ? "bg-secondary text-white/40 cursor-not-allowed"
                  : "btn-gold"
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  提交中...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  提交评价
                </>
              )}
            </button>
            <p className="text-xs text-white/40 text-center mt-3">
              您的评价将帮助我们优选更好的咖啡馆
            </p>
          </div>
        </div>
      </div>
    </>
  );
});

MultiDimensionRatingModal.displayName = "MultiDimensionRatingModal";
