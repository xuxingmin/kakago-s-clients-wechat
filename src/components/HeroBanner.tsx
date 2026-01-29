import heroBg from "@/assets/hero-bg.jpg";

export const HeroBanner = () => {
  return (
    <section className="relative mx-4 mt-4 rounded-2xl overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Espresso"
          className="w-full h-full object-cover opacity-60 blur-[2px]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/50" />
      </div>

      {/* Content */}
      <div className="relative py-8 px-6">
        <h1 className="text-lg font-bold tracking-wide text-foreground">
          KAKAGO
        </h1>
        <p className="text-sm text-muted-foreground mt-1 tracking-wide">
          城市精品咖啡联盟
        </p>
        <p className="text-xs text-muted-foreground/70 mt-0.5 tracking-widest">
          发现城市中的精品咖啡馆
        </p>
      </div>
    </section>
  );
};
