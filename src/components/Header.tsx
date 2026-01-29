import { MapPin } from "lucide-react";

export const Header = () => {
  return (
    <header className="sticky top-0 z-40 glass border-b border-border safe-top">
      <div className="flex items-center justify-between px-4 py-3 max-w-md mx-auto">
        {/* Location */}
        <div className="flex items-center gap-1.5 text-foreground">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">天鹅湖CBD</span>
        </div>

        {/* Network Status */}
        <div className="flex items-center gap-2 bg-secondary px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-muted-foreground font-medium">KAKAGO 网络运行中</span>
        </div>
      </div>
    </header>
  );
};
