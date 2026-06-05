import heroBg from "@/assets/hero-bg.jpg";

export const HeroBanner = () => {
  return (
    <section className="relative mx-4 mt-4 rounded-2xl overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="浓缩咖啡"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-paper via-paper/85 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative py-8 px-6">
        <h1 className="font-serif text-3xl font-bold text-primary tracking-tight leading-none">
          TRIVA
        </h1>
        <p className="text-sm text-foreground/80 mt-1.5 tracking-wide">
          不贵精品，即刻上瘾！
        </p>
        <p className="text-xs text-copper mt-1 tracking-widest uppercase">
          霸都精品店，全听你调遣
        </p>
      </div>
    </section>
  );
};
