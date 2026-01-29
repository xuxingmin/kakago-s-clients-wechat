import { User, MapPin, Gift, Settings, ChevronRight, LogOut } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";

const menuItems = [
  { icon: MapPin, label: "收货地址", description: "管理您的配送地址" },
  { icon: Gift, label: "我的优惠券", description: "查看可用优惠" },
  { icon: Settings, label: "设置", description: "账号与偏好设置" },
];

const Profile = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="relative safe-top">
        <div className="h-32 bg-gradient-to-b from-charcoal to-background" />
        
        {/* User Info */}
        <div className="px-4 -mt-12 max-w-md mx-auto">
          <div className="card-premium p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center border-2 border-primary">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-foreground">
                  咖啡爱好者
                </h2>
                <p className="text-muted-foreground text-sm">
                  点击登录，享受专属优惠
                </p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex justify-around mt-6 pt-6 border-t border-border">
              <div className="text-center">
                <p className="text-2xl font-bold text-gold-gradient">12</p>
                <p className="text-xs text-muted-foreground mt-1">累计订单</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gold-gradient">3</p>
                <p className="text-xs text-muted-foreground mt-1">优惠券</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gold-gradient">8</p>
                <p className="text-xs text-muted-foreground mt-1">探索咖啡馆</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Menu Items */}
      <section className="px-4 mt-6 max-w-md mx-auto">
        <div className="card-premium overflow-hidden">
          {menuItems.map((item, index) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-4 px-4 py-4 hover:bg-secondary/50 transition-colors ${
                index !== menuItems.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          ))}
        </div>
      </section>

      {/* Logout */}
      <section className="px-4 mt-6 max-w-md mx-auto">
        <button className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-secondary text-muted-foreground hover:text-destructive transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">退出登录</span>
        </button>
      </section>

      {/* Version */}
      <p className="text-center text-xs text-muted-foreground mt-8">
        KAKAGO v1.0.0
      </p>

      <BottomNav />
    </div>
  );
};

export default Profile;
