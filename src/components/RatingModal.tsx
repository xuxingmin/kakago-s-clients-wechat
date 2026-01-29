import * as React from "react";
import { useState } from "react";
import { X, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeName: string;
  onSubmit: (rating: number, tags: string[], note: string) => void;
}

const getTagsConfig = (t: (zh: string, en: string) => string) => ({
  negative: [
    { id: "watery", label: t("口感偏淡", "Too Watery") },
    { id: "cold", label: t("温度偏低", "Too Cold") },
    { id: "spilled", label: t("洒漏", "Spilled") },
    { id: "late", label: t("送达较慢", "Late Delivery") },
    { id: "bitter", label: t("过于苦涩", "Too Bitter") },
    { id: "packaging", label: t("包装问题", "Packaging Issue") },
  ],
  positive: [
    { id: "crema", label: t("完美油脂", "Perfect Crema") },
    { id: "silky", label: t("丝滑顺口", "Silky Smooth") },
    { id: "packaging", label: t("包装精美", "Nice Packaging") },
    { id: "fast", label: t("配送迅速", "Fast Delivery") },
    { id: "temperature", label: t("温度适宜", "Perfect Temp") },
    { id: "art", label: t("拉花精致", "Beautiful Art") },
  ],
});

export const RatingModal = React.forwardRef<HTMLDivElement, RatingModalProps>(
  ({ isOpen, onClose, storeName, onSubmit }, ref) => {
    const { t } = useLanguage();
    const [rating, setRating] = useState(0);
    const [hoveredStar, setHoveredStar] = useState(0);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [note, setNote] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const tagsConfig = getTagsConfig(t);
    const displayRating = hoveredStar || rating;
    const isNegative = rating >= 1 && rating <= 3;
    const isPositive = rating >= 4;
    const availableTags = isNegative ? tagsConfig.negative : isPositive ? tagsConfig.positive : [];

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
      if (displayRating === 0) return t("点击星星评分", "Tap to rate");
      if (displayRating === 1) return t("非常不满意", "Very Disappointed");
      if (displayRating === 2) return t("不太满意", "Disappointed");
      if (displayRating === 3) return t("一般般", "Average");
      if (displayRating === 4) return t("比较满意", "Satisfied");
      if (displayRating === 5) return t("非常满意", "Very Satisfied");
      return "";
    };

    return (
      <>
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-black/70 backdrop-blur-md z-50 transition-opacity duration-300 ${
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
            className="w-full max-w-sm bg-card rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative px-6 pt-6 pb-4">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white/60 hover:text-white transition-colors min-h-[48px]"
              >
                <X className="w-4 h-4" />
              </button>
              <h2 className="text-lg font-bold text-white text-center pr-8">
                {t(`${storeName} 的咖啡如何？`, `How was ${storeName}'s coffee?`)}
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
                    className="p-1 min-h-[48px] min-w-[48px] flex items-center justify-center transition-transform duration-200 hover:scale-110 active:scale-95"
                  >
                    <Star
                      className={`w-10 h-10 transition-all duration-200 ${
                        star <= displayRating
                          ? "fill-primary text-primary scale-110"
                          : "text-white/20 hover:text-primary/50"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p
                className={`text-center text-sm mt-3 transition-colors ${
                  displayRating === 0 ? "text-white/50" : "text-white font-medium"
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
              <p className="text-xs text-white/50 mb-3">
                {isNegative 
                  ? t("请告诉我们哪里需要改进：", "What could be improved?") 
                  : t("分享您喜欢的地方：", "What did you like?")}
              </p>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => toggleTag(tag.id)}
                    className={`px-3 py-1.5 min-h-[36px] rounded-full text-xs font-medium transition-all duration-200 ${
                      selectedTags.includes(tag.id)
                        ? isNegative
                          ? "bg-destructive/20 text-destructive border border-destructive/30"
                          : "bg-primary/20 text-primary border border-primary/30"
                        : "bg-secondary text-white/60 hover:bg-white/10"
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
                placeholder={t("添加备注（可选）...", "Add a note (optional)...")}
                className="w-full h-20 px-4 py-3 bg-secondary rounded-xl text-sm text-white placeholder:text-white/40 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                maxLength={200}
              />
              <p className="text-xs text-white/40 text-right mt-1">
                {note.length}/200
              </p>
            </div>

            {/* Submit Button */}
            <div className="px-6 py-5">
              <button
                onClick={handleSubmit}
                disabled={rating === 0 || isSubmitting}
                className={`w-full py-4 min-h-[56px] rounded-2xl text-base font-semibold transition-all duration-200 ${
                  rating === 0
                    ? "bg-secondary text-white/40 cursor-not-allowed"
                    : "btn-gold"
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t("提交中...", "Submitting...")}
                  </span>
                ) : (
                  t("提交评价", "Submit Review")
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
