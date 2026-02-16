import { useLanguage } from "@/contexts/LanguageContext";

interface CategoryTabsProps {
  categories: { id: string; nameZh: string; nameEn: string; count?: number }[];
  activeCategory: string;
  onCategoryChange: (id: string) => void;
}

export const CategoryTabs = ({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryTabsProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex gap-1.5 px-4 py-1.5 overflow-x-auto scrollbar-hide">
      {categories.map((category) => {
        const isActive = activeCategory === category.id;
        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`relative px-3.5 py-1.5 rounded-full text-[11px] font-medium whitespace-nowrap transition-all duration-300 min-h-[32px] active:scale-95 ${
              isActive
                ? "bg-primary/15 text-primary border border-primary/30 shadow-[0_0_12px_hsla(271,81%,56%,0.2)]"
                : "bg-white/[0.04] text-white/50 border border-white/[0.06] hover:text-white/70 hover:bg-white/[0.06]"
            }`}
          >
            {t(category.nameZh, category.nameEn)}
            {category.count !== undefined && (
              <span className={`ml-1 text-[9px] ${isActive ? "text-primary/60" : "text-white/30"}`}>
                {category.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
