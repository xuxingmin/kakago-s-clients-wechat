import { useState } from "react";

interface ProductCardProps {
  id: string;
  name: string;
  nameEn: string;
  price: number;
  image: string;
  isHot?: boolean;
  onSelect: (id: string) => void;
}

export const ProductCard = ({
  id,
  name,
  nameEn,
  price,
  image,
  isHot,
  onSelect,
}: ProductCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <button
      onClick={() => onSelect(id)}
      className="card-premium p-4 flex gap-4 w-full text-left transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group"
    >
      {/* Image */}
      <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-secondary">
        <img
          src={image}
          alt={name}
          className={`w-full h-full object-cover transition-all duration-500 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 shimmer bg-secondary" />
        )}
        {isHot && (
          <span className="absolute top-1 left-1 bg-primary text-primary-foreground text-[10px] font-semibold px-2 py-0.5 rounded-full">
            热销
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between flex-1 min-w-0 py-1">
        <div>
          <h3 className="font-semibold text-foreground text-base group-hover:text-primary transition-colors">
            {name}
          </h3>
          <p className="text-muted-foreground text-xs mt-0.5 uppercase tracking-wide">
            {nameEn}
          </p>
        </div>
        <div className="flex items-end justify-between">
          <p className="text-primary font-bold text-xl">
            ¥{price.toFixed(0)}
          </p>
          <span className="text-muted-foreground text-xs opacity-0 group-hover:opacity-100 transition-opacity">
            点击选购 →
          </span>
        </div>
      </div>
    </button>
  );
};
