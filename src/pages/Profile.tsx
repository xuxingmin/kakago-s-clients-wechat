import { useNavigate } from "react-router-dom";
import { 
  Ticket, 
  Wallet, 
  Coffee, 
  ClipboardList, 
  Share2, 
  HelpCircle, 
  Store, 
  ChevronRight,
  Crown
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BottomNav } from "@/components/BottomNav";

const Profile = () => {
  const navigate = useNavigate();

  const assetItems = [
    { 
      icon: Ticket, 
      value: "3", 
      label: "张优惠券",
      onClick: () => navigate("/wallet"),
    },
    { 
      icon: Wallet, 
      value: "¥0.00", 
      label: "余额",
      onClick: () => {},
    },
    { 
      icon: Coffee, 
      value: "12", 
      label: "杯咖啡",
      onClick: () => navigate("/orders"),
    },
  ];

  const menuItems = [
    { 
      icon: ClipboardList, 
      label: "订单历史", 
      description: "查看订单与评价状态",
      onClick: () => navigate("/orders"),
    },
    { 
      icon: Share2, 
      label: "分享赚佣金", 
      description: "邀请好友，享1%返佣",
      badge: "热门",
      onClick: () => navigate("/share-earn"),
    },
    { 
      icon: HelpCircle, 
      label: "帮助与支持", 
      description: "常见问题与联系客服",
      onClick: () => {},
    },
    {
      icon: Store, 
      label: "成为合作商家", 
      description: "加入我们，一起成长",
      onClick: () => {},
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header with Avatar */}
      <header className="relative safe-top">
        <div className="h-36 bg-gradient-to-br from-primary/20 via-lavender to-background" />
        
        {/* User Card */}
        <div className="px-4 -mt-16 max-w-md mx-auto">
          <div className="card-premium p-6">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <Avatar className="w-18 h-18 border-3 border-primary/30 shadow-lg">
                <AvatarImage src="/placeholder.svg" alt="用户头像" />
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground text-xl font-bold">
                  咖
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                {/* Nickname */}
                <h2 className="text-xl font-bold text-foreground">
                  咖啡探索家
                </h2>
                
                {/* Member Level Badge */}
                <div className="flex items-center gap-1.5 mt-1.5">
                  <Badge 
                    variant="secondary" 
                    className="bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 border border-amber-200/50 gap-1 px-2 py-0.5"
                  >
                    <Crown className="w-3 h-3" />
                    <span className="text-xs font-medium">Coffee Explorer</span>
                  </Badge>
                </div>
                
                <p className="text-muted-foreground text-xs mt-2">
                  已探索 8 家咖啡馆
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Asset Bar */}
      <section className="px-4 mt-4 max-w-md mx-auto">
        <div className="card-premium p-4">
          <div className="flex items-center justify-around">
            {assetItems.map((item, index) => (
              <button
                key={item.label}
                onClick={item.onClick}
                className={`flex-1 flex flex-col items-center gap-1.5 py-2 hover:scale-105 transition-transform ${
                  index !== assetItems.length - 1 ? "border-r border-border" : ""
                }`}
              >
                <div className="flex items-center gap-1">
                  <item.icon className="w-4 h-4 text-primary" />
                  <span className="text-lg font-bold text-foreground">{item.value}</span>
                </div>
                <span className="text-xs text-muted-foreground">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Menu List */}
      <section className="px-4 mt-4 max-w-md mx-auto">
        <div className="card-premium overflow-hidden">
          {menuItems.map((item, index) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className={`w-full flex items-center gap-4 px-4 py-4 hover:bg-secondary/50 transition-colors ${
                index !== menuItems.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground">{item.label}</p>
                  {item.badge && (
                    <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          ))}
        </div>
      </section>

      {/* Version Footer */}
      <p className="text-center text-xs text-muted-foreground mt-8">
        KAKAGO v1.0.0
      </p>

      <BottomNav />
    </div>
  );
};

export default Profile;
