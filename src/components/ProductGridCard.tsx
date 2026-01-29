import { useState } from "react";
import { Plus } from "lucide-react";

interface ProductGridCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  tag: string;
  onSelect: (id: string) => void;
}

export const ProductGridCard = ({
  id,
  name,
  price,
  image,
  tag,
  onSelect,
}: ProductGridCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      onClick={() => onSelect(id)}
      className="card-md flex flex-col cursor-pointer group relative"
    >
      {/* Image */}
      <div className="relative aspect-square rounded-xl overflow-hidden bg-secondary mb-3">
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
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1">
        <h3 className="font-semibold text-white text-sm group-hover:text-primary transition-colors">
          {name}
        </h3>
        <p className="text-xs text-white/50 mt-0.5 line-clamp-1">
          {tag}
        </p>
        <div className="flex items-end justify-between mt-auto pt-2">
          <p className="text-primary font-bold text-lg">
            ¥{price}
          </p>
        </div>
      </div>

      {/* Add Button - Large touch target */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSelect(id);
        }}
        className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-purple transition-transform hover:scale-110 active:scale-95"
      >
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );
};
