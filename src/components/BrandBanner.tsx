import { Sparkles, Coffee, Package, UserCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export type BannerVariant = "home" | "orders" | "profile";

interface BrandBannerProps {
  variant?: BannerVariant;
}

/** Animated coffee beans floating — Home page */
const HomeMosaic = () => (
  <div className="relative w-16 h-10 flex items-center justify-end">
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="absolute"
        style={{
          right: `${i * 14}px`,
          top: `${i === 1 ? 2 : 8}px`,
          animation: `floatSubtle ${3 + i * 0.6}s ease-in-out infinite`,
          animationDelay: `${i * 0.3}s`,
        }}
      >
        <div
          className="rounded-full flex items-center justify-center"
          style={{
            width: i === 1 ? 28 : 22,
            height: i === 1 ? 28 : 22,
            background: `linear-gradient(135deg, hsl(271 81% 56% / ${0.25 + i * 0.1}), hsl(271 81% 46% / ${0.15 + i * 0.05}))`,
            boxShadow: `0 0 ${8 + i * 4}px hsl(271 81% 56% / 0.2)`,
          }}
        >
          <Coffee
            className="text-primary"
            style={{ width: i === 1 ? 14 : 11, height: i === 1 ? 14 : 11 }}
            strokeWidth={2}
          />
        </div>
      </div>
    ))}
  </div>
);

/** Stacked delivery boxes — Orders page */
const OrdersMosaic = () => (
  <div className="relative w-16 h-10 flex items-center justify-end">
    {[0, 1, 2].map((i) => {
      const sizes = [18, 24, 20];
      const offsets = [{ r: 28, t: 10 }, { r: 8, t: 0 }, { r: 0, t: 14 }];
      return (
        <div
          key={i}
          className="absolute"
          style={{
            right: `${offsets[i].r}px`,
            top: `${offsets[i].t}px`,
            animation: `floatSubtle ${3.5 + i * 0.4}s ease-in-out infinite`,
            animationDelay: `${i * 0.25}s`,
          }}
        >
          <div
            className="rounded-lg flex items-center justify-center"
            style={{
              width: sizes[i],
              height: sizes[i],
              background: `linear-gradient(135deg, hsl(271 81% 56% / ${0.3 - i * 0.05}), hsl(271 81% 46% / ${0.15}))`,
              boxShadow: `0 0 ${6 + i * 3}px hsl(271 81% 56% / 0.15)`,
              transform: `rotate(${i * 8 - 8}deg)`,
            }}
          >
            <Package
              className="text-primary"
              style={{ width: sizes[i] * 0.55, height: sizes[i] * 0.55 }}
              strokeWidth={2}
            />
          </div>
        </div>
      );
    })}
  </div>
);

/** Orbiting avatar rings — Profile page */
const ProfileMosaic = () => (
  <div className="relative w-16 h-10 flex items-center justify-end">
    <div
      className="absolute right-1 top-1"
      style={{ animation: "floatSubtle 4s ease-in-out infinite" }}
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, hsl(271 81% 56% / 0.3), hsl(271 81% 46% / 0.15))",
          boxShadow: "0 0 12px hsl(271 81% 56% / 0.25)",
        }}
      >
        <UserCircle className="w-4 h-4 text-primary" strokeWidth={1.8} />
      </div>
    </div>
    {[0, 1].map((i) => (
      <div
        key={i}
        className="absolute"
        style={{
          right: `${24 + i * 16}px`,
          top: `${i === 0 ? 12 : 4}px`,
          animation: `floatSubtle ${3.2 + i * 0.8}s ease-in-out infinite`,
          animationDelay: `${0.4 + i * 0.3}s`,
        }}
      >
        <div
          className="rounded-full"
          style={{
            width: 16 - i * 2,
            height: 16 - i * 2,
            background: `linear-gradient(135deg, hsl(271 81% 56% / ${0.2 - i * 0.05}), hsl(271 81% 46% / 0.1))`,
            boxShadow: `0 0 6px hsl(271 81% 56% / 0.15)`,
          }}
        />
      </div>
    ))}
  </div>
);

const mosaicMap: Record<BannerVariant, () => JSX.Element> = {
  home: HomeMosaic,
  orders: OrdersMosaic,
  profile: ProfileMosaic,
};

export const BrandBanner = ({ variant = "home" }: BrandBannerProps) => {
  const { t } = useLanguage();
  const Mosaic = mosaicMap[variant];

  return (
    <section className="px-4 pt-1 pb-0.5 hero-reveal bg-background">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">KAKAGO</h1>
            <Sparkles className="w-3.5 h-3.5 text-primary/60 float-subtle" />
          </div>
          <p className="text-xs text-white/80 mt-0 font-light">
            {t("不贵精品，即刻上瘾！", "Premium taste, instant addiction!")}
          </p>
        </div>
        <Mosaic />
      </div>
    </section>
  );
};
