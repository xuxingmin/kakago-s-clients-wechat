import { MapPin, ChevronDown } from "lucide-react";

interface HeaderProps {
  location?: string;
}

export const Header = ({ location = "定位中..." }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-40 glass border-b border-border safe-top">
      <div className="flex items-center justify-between px-4 py-3 max-w-md mx-auto">
        {/* Logo */}
        <h1 className="text-xl font-bold tracking-tight">
          <span className="text-gold-gradient">KAKAGO</span>
        </h1>

        {/* Location */}
        <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-sm max-w-[120px] truncate">{location}</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
