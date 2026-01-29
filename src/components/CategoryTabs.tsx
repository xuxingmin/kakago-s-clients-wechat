interface CategoryTabsProps {
  categories: { id: string; name: string }[];
  activeCategory: string;
  onCategoryChange: (id: string) => void;
}

export const CategoryTabs = ({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryTabsProps) => {
  return (
    <div className="flex gap-2 px-4 py-4 overflow-x-auto scrollbar-hide">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
            activeCategory === category.id
              ? "bg-primary text-primary-foreground shadow-gold"
              : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};
