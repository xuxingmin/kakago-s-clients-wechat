import { Sparkles, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

export const BrandShowcase = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <section className="px-4 mt-3">
      <button
        onClick={() => navigate("/")}
        className="w-full card-premium overflow-hidden relative group active:scale-[0.98] transition-transform"
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-800/10 to-transparent pointer-events-none" />
        
        <div className="relative p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                {t("探索精品咖啡", "Explore Premium Coffee")}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {t("不贵精品，即刻上瘾！", "Premium taste, instant addiction!")}
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
        </div>
      </button>
    </section>
  );
};
