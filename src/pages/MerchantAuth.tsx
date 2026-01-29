import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Coffee, Mail, Lock, User, Eye, EyeOff, ArrowLeft, Store } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

// Validation schemas
const emailSchema = z.string().email("请输入有效的邮箱地址");
const passwordSchema = z.string().min(6, "密码至少需要6个字符");

type AuthMode = "login" | "signup" | "merchant-register";

const MerchantAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  // Check if already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Check if user is a merchant
        const { data: merchantData } = await supabase.rpc('get_user_merchant');
        if (merchantData && merchantData.length > 0) {
          navigate("/merchant");
        }
      }
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        // Defer the check to avoid deadlock
        setTimeout(async () => {
          const { data: merchantData } = await supabase.rpc('get_user_merchant');
          if (merchantData && merchantData.length > 0) {
            navigate("/merchant");
          }
        }, 0);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    try {
      emailSchema.parse(email);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.email = e.errors[0].message;
      }
    }
    
    try {
      passwordSchema.parse(password);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.password = e.errors[0].message;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast({
            title: "登录失败",
            description: "邮箱或密码错误",
            variant: "destructive",
          });
        } else {
          toast({
            title: "登录失败",
            description: error.message,
            variant: "destructive",
          });
        }
        return;
      }

      // Check if user is a merchant
      const { data: merchantData } = await supabase.rpc('get_user_merchant');
      
      if (merchantData && merchantData.length > 0) {
        toast({
          title: "登录成功",
          description: `欢迎回来，${merchantData[0].merchant_name}`,
        });
        navigate("/merchant");
      } else {
        // User is not a merchant, prompt to register
        setMode("merchant-register");
        toast({
          title: "需要注册商户",
          description: "您的账号尚未关联商户，请完成商户注册",
        });
      }
    } catch (error) {
      toast({
        title: "登录失败",
        description: "发生未知错误，请稍后重试",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!validateForm()) return;
    
    if (!displayName.trim()) {
      toast({
        title: "请输入显示名称",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/merchant-auth`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            display_name: displayName,
          },
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          toast({
            title: "注册失败",
            description: "该邮箱已被注册，请直接登录",
            variant: "destructive",
          });
          setMode("login");
        } else {
          toast({
            title: "注册失败",
            description: error.message,
            variant: "destructive",
          });
        }
        return;
      }

      toast({
        title: "注册成功",
        description: "请继续完成商户信息注册",
      });
      
      setMode("merchant-register");
    } catch (error) {
      toast({
        title: "注册失败",
        description: "发生未知错误，请稍后重试",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") {
      handleLogin();
    } else if (mode === "signup") {
      handleSignup();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border safe-top">
        <div className="flex items-center justify-between px-4 py-3 max-w-md mx-auto">
          <button 
            onClick={() => navigate("/")}
            className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-base font-semibold text-foreground">商户入驻</h1>
          <div className="w-9" />
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <Store className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            {mode === "login" && "商户登录"}
            {mode === "signup" && "商户注册"}
            {mode === "merchant-register" && "完善商户信息"}
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            {mode === "login" && "登录您的商户账号"}
            {mode === "signup" && "注册成为咖啡合作商户"}
            {mode === "merchant-register" && "填写您的咖啡馆信息"}
          </p>
        </div>

        {/* Auth Form */}
        {mode !== "merchant-register" && (
          <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
            {/* Display Name (signup only) */}
            {mode === "signup" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">显示名称</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="您的名称"
                    className="w-full h-12 pl-12 pr-4 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">邮箱</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  placeholder="your@email.com"
                  className={`w-full h-12 pl-12 pr-4 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 ${
                    errors.email ? "ring-2 ring-destructive" : "focus:ring-primary/30"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">密码</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  placeholder="••••••"
                  className={`w-full h-12 pl-12 pr-12 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 ${
                    errors.password ? "ring-2 ring-destructive" : "focus:ring-primary/30"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 btn-gold rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  处理中...
                </>
              ) : (
                <>
                  <Coffee className="w-5 h-5" />
                  {mode === "login" ? "登录" : "注册"}
                </>
              )}
            </button>

            {/* Toggle Mode */}
            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="text-sm text-primary hover:underline"
              >
                {mode === "login" ? "没有账号？立即注册" : "已有账号？立即登录"}
              </button>
            </div>
          </form>
        )}

        {/* Merchant Registration Form */}
        {mode === "merchant-register" && (
          <MerchantRegisterForm 
            onSuccess={() => navigate("/merchant")} 
            onBack={() => setMode("login")}
          />
        )}
      </div>
    </div>
  );
};

// Merchant Registration Form Component
interface MerchantRegisterFormProps {
  onSuccess: () => void;
  onBack: () => void;
}

const MerchantRegisterForm = ({ onSuccess, onBack }: MerchantRegisterFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    nameEn: "",
    address: "",
    phone: "",
    description: "",
    latitude: 31.2304, // Default to Shanghai
    longitude: 121.4737,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.address.trim()) {
      toast({
        title: "请填写必填项",
        description: "咖啡馆名称和地址为必填项",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('register_merchant', {
        p_name: formData.name,
        p_name_en: formData.nameEn || null,
        p_address: formData.address,
        p_latitude: formData.latitude,
        p_longitude: formData.longitude,
        p_phone: formData.phone || null,
        p_description: formData.description || null,
      });

      if (error) {
        throw error;
      }

      const result = data as { success: boolean; error?: string; message?: string };
      
      if (!result.success) {
        toast({
          title: "注册失败",
          description: result.error || "未知错误",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "商户注册成功！",
        description: "欢迎加入咖啡合作伙伴",
      });
      
      onSuccess();
    } catch (error) {
      toast({
        title: "注册失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">咖啡馆名称 *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="例：静思咖啡工作室"
          className="w-full h-12 px-4 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">英文名称</label>
        <input
          type="text"
          value={formData.nameEn}
          onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
          placeholder="例：Refrain Coffee Studio"
          className="w-full h-12 px-4 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">地址 *</label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          placeholder="例：上海市静安区南京西路1788号"
          className="w-full h-12 px-4 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">联系电话</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="例：021-12345678"
          className="w-full h-12 px-4 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">简介</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="介绍一下您的咖啡馆..."
          className="w-full h-24 px-4 py-3 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 h-12 bg-secondary rounded-xl font-medium text-foreground"
        >
          返回
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 h-12 btn-gold rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              注册中...
            </>
          ) : (
            "完成注册"
          )}
        </button>
      </div>
    </form>
  );
};

export default MerchantAuth;
