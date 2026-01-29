import * as React from "react";
import { useState } from "react";
import { X, Star } from "lucide-react";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeName: string;
  onSubmit: (rating: number, tags: string[], note: string) => void;
}

const negativeTags = [
  { id: "watery", label: "口感偏淡" },
  { id: "cold", label: "温度偏低" },
  { id: "spilled", label: "洒漏" },
  { id: "late", label: "送达较慢" },
  { id: "bitter", label: "过于苦涩" },
  { id: "packaging", label: "包装问题" },
];

const positiveTags = [
  { id: "crema", label: "完美油脂" },
  { id: "silky", label: "丝滑顺口" },
  { id: "packaging", label: "包装精美" },
  { id: "fast", label: "配送迅速" },
  { id: "temperature", label: "温度适宜" },
  { id: "art", label: "拉花精致" },
];

export const RatingModal = React.forwardRef<HTMLDivElement, RatingModalProps>(
  ({ isOpen, onClose, storeName, onSubmit }, ref) => {
    const [rating, setRating] = useState(0);
    const [hoveredStar, setHoveredStar] = useState(0);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [note, setNote] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const displayRating = hoveredStar || rating;
    const isNegative = rating >= 1 && rating <= 3;
    const isPositive = rating >= 4;
    const availableTags = isNegative ? negativeTags : isPositive ? positiveTags : [];

    const toggleTag = (tagId: string) => {
      setSelectedTags((prev) =>
        prev.includes(tagId)
          ? prev.filter((t) => t !== tagId)
          : [...prev, tagId]
      );
    };

    const handleSubmit = async () => {
      if (rating === 0) return;

      setIsSubmitting(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      onSubmit(rating, selectedTags, note);

      // Reset state
      setRating(0);
      setSelectedTags([]);
      setNote("");
      setIsSubmitting(false);
      onClose();
    };

    const getRatingText = () => {
      if (displayRating === 0) return "点击星星评分";
      if (displayRating === 1) return "非常不满意";
      if (displayRating === 2) return "不太满意";
      if (displayRating === 3) return "一般般";
      if (displayRating === 4) return "比较满意";
      if (displayRating === 5) return "非常满意";
      return "";
    };

    return (
      <>
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-black/60 backdrop-blur-md z-50 transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={onClose}
        />

        {/* Modal */}
        <div
          ref={ref}
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
            isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <div
            className="w-full max-w-sm bg-card rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative px-6 pt-6 pb-4">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <h2 className="text-lg font-bold text-foreground text-center pr-8">
                {storeName} 的咖啡如何？
              </h2>
            </div>

            {/* Star Rating */}
            <div className="px-6 py-4">
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => {
                      setRating(star);
                      setSelectedTags([]); // Reset tags when rating changes
                    }}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    className="p-1 transition-transform duration-200 hover:scale-110 active:scale-95"
                  >
                    <Star
                      className={`w-10 h-10 transition-all duration-200 ${
                        star <= displayRating
                          ? "fill-primary text-primary scale-110"
                          : "text-border hover:text-primary/50"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p
                className={`text-center text-sm mt-3 transition-colors ${
                  displayRating === 0 ? "text-muted-foreground" : "text-foreground font-medium"
                }`}
              >
                {getRatingText()}
              </p>
            </div>

            {/* Tags Section */}
            <div
              className={`px-6 overflow-hidden transition-all duration-300 ${
                availableTags.length > 0 ? "max-h-40 opacity-100 py-2" : "max-h-0 opacity-0 py-0"
              }`}
            >
              <p className="text-xs text-muted-foreground mb-3">
                {isNegative ? "请告诉我们哪里需要改进：" : "分享您喜欢的地方："}
              </p>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => toggleTag(tag.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                      selectedTags.includes(tag.id)
                        ? isNegative
                          ? "bg-destructive/10 text-destructive border border-destructive/30"
                          : "bg-primary/10 text-primary border border-primary/30"
                        : "bg-secondary text-muted-foreground hover:bg-mist-light"
                    }`}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Note Input */}
            <div
              className={`px-6 transition-all duration-300 ${
                rating > 0 ? "max-h-32 opacity-100 py-3" : "max-h-0 opacity-0 py-0"
              }`}
            >
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="添加备注（可选）..."
                className="w-full h-20 px-4 py-3 bg-secondary rounded-xl text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                maxLength={200}
              />
              <p className="text-xs text-muted-foreground text-right mt-1">
                {note.length}/200
              </p>
            </div>

            {/* Submit Button */}
            <div className="px-6 py-5">
              <button
                onClick={handleSubmit}
                disabled={rating === 0 || isSubmitting}
                className={`w-full py-4 rounded-2xl text-base font-semibold transition-all duration-200 ${
                  rating === 0
                    ? "bg-secondary text-muted-foreground cursor-not-allowed"
                    : "btn-gold"
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    提交中...
                  </span>
                ) : (
                  "提交评价"
                )}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
);

RatingModal.displayName = "RatingModal";
