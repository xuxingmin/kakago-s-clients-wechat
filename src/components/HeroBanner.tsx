import heroBg from "@/assets/hero-bg.jpg";

export const HeroBanner = () => {
  return (
    <section className="relative mx-4 mt-4 rounded-2xl overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="浓缩咖啡"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative py-8 px-6">
        <h1 className="text-xl font-bold tracking-wide text-white">
          KAKAGO
        </h1>
        <p className="text-sm text-white/80 mt-1 tracking-wide">
          可负担的精品咖啡
        </p>
        <p className="text-xs text-white/60 mt-0.5 tracking-widest">
          发现城市中的精品咖啡馆
        </p>
      </div>
    </section>
  );
};
