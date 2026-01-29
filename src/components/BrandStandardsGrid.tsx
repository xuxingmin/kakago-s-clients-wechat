import { CheckCircle2, Rocket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const standards = [
  { labelZh: "精品咖啡", labelEn: "Specialty" },
  { labelZh: "蛋白4.0", labelEn: "4.0 Protein" },
  { labelZh: "食品安全", labelEn: "Food Safe" },
  { labelZh: "有机认证", labelEn: "Organic" },
  { labelZh: "专业设备", labelEn: "Pro Gear" },
  { labelZh: "100% SOP", labelEn: "100% SOP" },
  { labelZh: "快速送达", labelEn: "Fast Ship" },
];

export const BrandStandardsGrid = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <section className="px-4 py-3">
      <div className="grid grid-cols-4 gap-2">
        {/* Standard Cards */}
        {standards.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center p-2 rounded-lg bg-white/5 backdrop-blur-md border border-white/10"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-primary mb-1" />
            <span className="text-[10px] font-mono text-[#CCCCCC] text-center leading-tight">
              {t(item.labelZh, item.labelEn)}
            </span>
          </div>
        ))}

        {/* Special CTA Card - Growth Engine */}
        <button
          onClick={() => navigate("/my-squad")}
          className="flex flex-col items-center justify-center p-2 rounded-lg bg-gradient-to-br from-primary to-purple-dark border border-primary/30 pulse-glow"
        >
          <Rocket className="w-3.5 h-3.5 text-white mb-1" />
          <span className="text-[10px] font-mono text-white text-center font-semibold leading-tight">
            {t("拉帮结派", "Squad")}
          </span>
        </button>
      </div>
    </section>
  );
};
