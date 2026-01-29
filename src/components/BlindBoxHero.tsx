import { Gift } from "lucide-react";
import blindBoxImage from "@/assets/blind-box.jpg";

interface BlindBoxHeroProps {
  onExplore: () => void;
}

export const BlindBoxHero = ({ onExplore }: BlindBoxHeroProps) => {
  return (
    <section className="relative overflow-hidden rounded-3xl mx-4 mt-4 border border-border">
      {/* 背景图片 */}
      <div className="absolute inset-0">
        <img
          src={blindBoxImage}
          alt="神秘咖啡盲盒"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/60" />
      </div>

      {/* Content */}
      <div className="relative px-6 py-8 flex flex-col justify-center min-h-[200px]">
        <div className="flex items-center gap-2 mb-2">
          <Gift className="w-5 h-5 text-primary" />
          <span className="text-primary text-sm font-medium">咖啡盲盒</span>
        </div>
        
        <h2 className="text-2xl font-bold text-white leading-tight mb-2">
          来自神秘咖啡馆的
          <br />
          <span className="text-gold-gradient">精选好咖啡</span>
        </h2>
        
        <p className="text-white/70 text-sm mb-4 max-w-[200px]">
          下单后揭晓为您匹配的专属咖啡馆
        </p>

        <button
          onClick={onExplore}
          className="btn-gold px-6 py-3 rounded-full text-sm font-semibold w-fit pulse-glow"
        >
          立即探索
        </button>
      </div>
    </section>
  );
};
