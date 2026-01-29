import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Store, 
  Power, 
  ChevronRight, 
  Bell, 
  Star, 
  Package,
  TrendingUp,
  Clock,
  LogOut,
  Settings
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const MerchantDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, merchantInfo, loading, signOut, refreshMerchantInfo } = useAuth();
  const [isOnline, setIsOnline] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [stats, setStats] = useState({
    todayOrders: 0,
    pendingOrders: 0,
    rating: 0,
    totalRatings: 0,
  });

  // Redirect if not logged in or not a merchant
  useEffect(() => {
    if (!loading && !user) {
      navigate("/merchant-auth");
    }
  }, [loading, user, navigate]);

  // Set initial online status
  useEffect(() => {
    if (merchantInfo) {
      setIsOnline(merchantInfo.is_online);
    }
  }, [merchantInfo]);

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      if (!merchantInfo?.merchant_id) return;

      // Fetch pending orders count
      const { count: pendingCount } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("merchant_id", merchantInfo.merchant_id)
        .eq("status", "pending");

      // Fetch today's orders
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { count: todayCount } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("merchant_id", merchantInfo.merchant_id)
        .gte("created_at", today.toISOString());

      // Fetch rating stats
      const { data: ratingStats } = await supabase
        .from("merchant_rating_stats")
        .select("*")
        .eq("merchant_id", merchantInfo.merchant_id)
        .single();

      setStats({
        todayOrders: todayCount || 0,
        pendingOrders: pendingCount || 0,
        rating: ratingStats?.avg_overall_rating || merchantInfo.rating || 5,
        totalRatings: ratingStats?.total_ratings || 0,
      });
    };

    fetchStats();
  }, [merchantInfo]);

  const handleToggleOnline = async () => {
    if (!merchantInfo) return;
    
    setToggling(true);
    try {
      const { data, error } = await supabase.rpc("toggle_my_merchant_status", {
        new_status: !isOnline,
      });

      if (error) throw error;

      const result = data as { success: boolean; is_online: boolean; message: string }[] | null;
      
      if (result && result[0]?.success) {
        setIsOnline(result[0].is_online);
        toast({
          title: result[0].is_online ? "已上线" : "已下线",
          description: result[0].is_online ? "您的店铺现在可以接单了" : "您的店铺暂停接单",
        });
        await refreshMerchantInfo();
      }
    } catch (error) {
      toast({
        title: "操作失败",
        description: error instanceof Error ? error.message : "请稍后重试",
        variant: "destructive",
      });
    } finally {
      setToggling(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/merchant-auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!merchantInfo) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <Store className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-bold text-foreground mb-2">未找到商户信息</h2>
        <p className="text-muted-foreground text-center mb-6">
          您的账号尚未关联商户，请完成商户注册
        </p>
        <button
          onClick={() => navigate("/merchant-auth")}
          className="px-6 py-3 btn-gold rounded-xl font-semibold"
        >
          注册商户
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <header className="bg-gradient-to-b from-primary/20 to-transparent pt-12 pb-6 px-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-muted-foreground">欢迎回来</p>
              <h1 className="text-xl font-bold text-foreground">
                {merchantInfo.merchant_name}
              </h1>
              {merchantInfo.merchant_name_en && (
                <p className="text-sm text-muted-foreground">
                  {merchantInfo.merchant_name_en}
                </p>
              )}
            </div>
            <button
              onClick={handleSignOut}
              className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
            >
              <LogOut className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Online Toggle */}
          <button
            onClick={handleToggleOnline}
            disabled={toggling}
            className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-semibold transition-all ${
              isOnline
                ? "bg-green-500 text-white"
                : "bg-secondary text-muted-foreground"
            }`}
          >
            {toggling ? (
              <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Power className="w-5 h-5" />
            )}
            <span>{isOnline ? "营业中 · 点击下线" : "已下线 · 点击上线"}</span>
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <section className="px-4 -mt-2">
        <div className="max-w-md mx-auto grid grid-cols-2 gap-3">
          <div className="bg-card rounded-2xl p-4 border border-border">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Package className="w-4 h-4" />
              <span className="text-xs">待处理订单</span>
            </div>
            <p className="text-2xl font-bold text-primary">{stats.pendingOrders}</p>
          </div>
          
          <div className="bg-card rounded-2xl p-4 border border-border">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs">今日订单</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.todayOrders}</p>
          </div>
          
          <div className="bg-card rounded-2xl p-4 border border-border">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Star className="w-4 h-4" />
              <span className="text-xs">店铺评分</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {Number(stats.rating).toFixed(1)}
              <span className="text-sm text-muted-foreground ml-1">
                ({stats.totalRatings}条)
              </span>
            </p>
          </div>
          
          <div className="bg-card rounded-2xl p-4 border border-border">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-xs">角色</span>
            </div>
            <p className="text-lg font-bold text-foreground capitalize">
              {merchantInfo.role === "owner" && "店主"}
              {merchantInfo.role === "manager" && "经理"}
              {merchantInfo.role === "staff" && "员工"}
            </p>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="px-4 mt-6">
        <div className="max-w-md mx-auto space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">快捷操作</h3>
          
          <button className="w-full bg-card rounded-xl p-4 flex items-center justify-between border border-border hover:bg-secondary/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">订单管理</p>
                <p className="text-xs text-muted-foreground">查看和处理订单</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          <button className="w-full bg-card rounded-xl p-4 flex items-center justify-between border border-border hover:bg-secondary/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">消息通知</p>
                <p className="text-xs text-muted-foreground">订单提醒和系统消息</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          <button className="w-full bg-card rounded-xl p-4 flex items-center justify-between border border-border hover:bg-secondary/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Settings className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">店铺设置</p>
                <p className="text-xs text-muted-foreground">修改店铺信息和营业时间</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default MerchantDashboard;
