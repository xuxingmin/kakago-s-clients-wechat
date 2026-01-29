import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Coffee, Shield, TrendingUp, Users, Upload, Check, Phone, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type Step = "intro" | "verify" | "info" | "success";

const benefits = [
  {
    icon: TrendingUp,
    title: "精准流量",
    description: "盲盒模式带来高质量咖啡爱好者，转化率远超传统平台",
  },
  {
    icon: Shield,
    title: "品质保障",
    description: "严选合作商户，维护高端品牌调性，拒绝价格战",
  },
  {
    icon: Users,
    title: "社群赋能",
    description: "加入精品咖啡联盟，共享行业资源与用户洞察",
  },
  {
    icon: Coffee,
    title: "智能调度",
    description: "AI驱动订单分配，平衡产能与用户体验",
  },
];

const MerchantAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("intro");
  const [loading, setLoading] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  
  // Phone verification state
  const [phone, setPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  // Merchant info state
  const [ownerName, setOwnerName] = useState("");
  const [storeFeatures, setStoreFeatures] = useState("");
  const [coffeeMachine, setCoffeeMachine] = useState("");
  const [dailyPeakCups, setDailyPeakCups] = useState("");
  const [businessHoursOpen, setBusinessHoursOpen] = useState("09:00");
  const [businessHoursClose, setBusinessHoursClose] = useState("22:00");
  const [businessLicense, setBusinessLicense] = useState<File | null>(null);
  const [foodPermit, setFoodPermit] = useState<File | null>(null);
  
  const businessLicenseRef = useRef<HTMLInputElement>(null);
  const foodPermitRef = useRef<HTMLInputElement>(null);

  // Send verification code
  const handleSendCode = async () => {
    if (!phone || phone.length !== 11) {
      toast({ title: "请输入正确的手机号", variant: "destructive" });
      return;
    }
    
    setLoading(true);
    // Simulate sending SMS (in production, use actual SMS service)
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCodeSent(true);
    setCountdown(60);
    setLoading(false);
    
    toast({ title: "验证码已发送", description: "请查看您的短信" });
    
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Verify code
  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      toast({ title: "请输入6位验证码", variant: "destructive" });
      return;
    }
    
    setLoading(true);
    // Simulate verification (in production, verify with SMS service)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // For demo, accept any 6-digit code
    setLoading(false);
    setStep("info");
  };

  // Upload file to storage
  const uploadFile = async (file: File, path: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${path}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('merchant-documents')
      .upload(fileName, file);
    
    if (error) throw error;
    
    const { data: urlData } = supabase.storage
      .from('merchant-documents')
      .getPublicUrl(data.path);
    
    return urlData.publicUrl;
  };

  // Submit application
  const handleSubmit = async () => {
    if (!ownerName || !storeFeatures || !coffeeMachine || !dailyPeakCups || !businessLicense || !foodPermit) {
      toast({ title: "请填写完整信息", variant: "destructive" });
      return;
    }
    
    setLoading(true);
    
    try {
      // Upload documents
      const [licenseUrl, permitUrl] = await Promise.all([
        uploadFile(businessLicense, 'licenses'),
        uploadFile(foodPermit, 'permits'),
      ]);
      
      // Submit application
      const { error } = await supabase
        .from('merchant_applications')
        .insert({
          phone,
          owner_name: ownerName,
          store_features: storeFeatures,
          coffee_machine_model: coffeeMachine,
          daily_peak_cups: parseInt(dailyPeakCups),
          business_hours: { open: businessHoursOpen, close: businessHoursClose },
          business_license_url: licenseUrl,
          food_permit_url: permitUrl,
        });
      
      if (error) throw error;
      
      setSuccessDialogOpen(true);
    } catch (error) {
      console.error("Submit error:", error);
      toast({ title: "提交失败，请重试", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Intro page - Why Join KAKA
  if (step === "intro") {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-40 glass safe-top">
          <div className="px-4 py-4 max-w-md mx-auto flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-secondary/50 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-lg font-medium text-white">成为合作商家</h1>
          </div>
        </header>

        <div className="fog-divider" />

        {/* Hero Section */}
        <section className="px-6 py-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6">
            <Coffee className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            为什么加入 KAKA?
          </h2>
          <p className="text-white/60 text-sm leading-relaxed max-w-xs mx-auto">
            与精品咖啡盲盒平台携手，让更多咖啡爱好者发现您的独特风味
          </p>
        </section>

        {/* Benefits Grid */}
        <section className="px-4 pb-8 space-y-3">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className="card-premium p-5 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">{benefit.title}</h3>
                  <p className="text-sm text-white/60 leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* CTA Button */}
        <section className="px-4 pb-8">
          <Button
            className="w-full h-14 rounded-2xl text-base font-medium"
            onClick={() => setStep("verify")}
          >
            立即入驻
          </Button>
          <p className="text-center text-xs text-white/40 mt-4">
            提交申请后，24小时内将有工作人员与您联系
          </p>
        </section>
      </div>
    );
  }

  // Phone verification page
  if (step === "verify") {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-40 glass safe-top">
          <div className="px-4 py-4 max-w-md mx-auto flex items-center gap-3">
            <button onClick={() => setStep("intro")} className="p-2 -ml-2 rounded-full hover:bg-secondary/50 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-lg font-medium text-white">验证手机号</h1>
          </div>
        </header>

        <div className="fog-divider" />

        <section className="px-4 py-8">
          <div className="card-premium p-6 space-y-6">
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Phone className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-white mb-2">输入您的手机号</h2>
              <p className="text-sm text-white/60">我们将发送验证码到您的手机</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white/80">手机号</Label>
                <div className="flex gap-2">
                  <Input
                    type="tel"
                    placeholder="请输入11位手机号"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                    className="flex-1 h-12 bg-secondary border-white/10 text-white rounded-xl"
                    maxLength={11}
                  />
                  <Button
                    variant="outline"
                    onClick={handleSendCode}
                    disabled={loading || countdown > 0 || phone.length !== 11}
                    className="h-12 px-4 rounded-xl border-primary/50 text-primary hover:bg-primary/10"
                  >
                    {countdown > 0 ? `${countdown}s` : "发送"}
                  </Button>
                </div>
              </div>

              {codeSent && (
                <div className="space-y-2 animate-fade-in">
                  <Label className="text-white/80">验证码</Label>
                  <Input
                    type="text"
                    placeholder="请输入6位验证码"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="h-12 bg-secondary border-white/10 text-white rounded-xl text-center text-lg tracking-widest"
                    maxLength={6}
                  />
                </div>
              )}
            </div>

            <Button
              className="w-full h-12 rounded-xl"
              onClick={handleVerifyCode}
              disabled={!codeSent || verificationCode.length !== 6 || loading}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "下一步"}
            </Button>
          </div>
        </section>
      </div>
    );
  }

  // Merchant info page
  if (step === "info") {
    return (
      <div className="min-h-screen bg-background pb-8">
        <header className="sticky top-0 z-40 glass safe-top">
          <div className="px-4 py-4 max-w-md mx-auto flex items-center gap-3">
            <button onClick={() => setStep("verify")} className="p-2 -ml-2 rounded-full hover:bg-secondary/50 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-lg font-medium text-white">填写商户信息</h1>
          </div>
        </header>

        <div className="fog-divider" />

        <section className="px-4 py-4 space-y-3">
          {/* Document Upload Cards */}
          <div className="card-premium p-5">
            <h3 className="font-medium text-white mb-4">证件上传</h3>
            <div className="grid grid-cols-2 gap-3">
              {/* Business License */}
              <div 
                className={`aspect-[4/3] rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
                  businessLicense ? 'border-primary bg-primary/10' : 'border-white/20 hover:border-white/40'
                }`}
                onClick={() => businessLicenseRef.current?.click()}
              >
                <input
                  ref={businessLicenseRef}
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) => setBusinessLicense(e.target.files?.[0] || null)}
                />
                {businessLicense ? (
                  <>
                    <Check className="w-6 h-6 text-primary mb-1" />
                    <span className="text-xs text-primary">已上传</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-white/40 mb-1" />
                    <span className="text-xs text-white/40">营业执照</span>
                  </>
                )}
              </div>

              {/* Food Permit */}
              <div 
                className={`aspect-[4/3] rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
                  foodPermit ? 'border-primary bg-primary/10' : 'border-white/20 hover:border-white/40'
                }`}
                onClick={() => foodPermitRef.current?.click()}
              >
                <input
                  ref={foodPermitRef}
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) => setFoodPermit(e.target.files?.[0] || null)}
                />
                {foodPermit ? (
                  <>
                    <Check className="w-6 h-6 text-primary mb-1" />
                    <span className="text-xs text-primary">已上传</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-white/40 mb-1" />
                    <span className="text-xs text-white/40">食品经营许可证</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Owner Info Card */}
          <div className="card-premium p-5 space-y-4">
            <h3 className="font-medium text-white">主理人信息</h3>
            <div className="space-y-3">
              <div>
                <Label className="text-white/60 text-xs">主理人名称</Label>
                <Input
                  placeholder="您的称呼"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="mt-1 h-11 bg-secondary border-white/10 text-white rounded-xl"
                />
              </div>
              <div>
                <Label className="text-white/60 text-xs">本店特色</Label>
                <Textarea
                  placeholder="介绍您的咖啡馆特色、理念..."
                  value={storeFeatures}
                  onChange={(e) => setStoreFeatures(e.target.value)}
                  className="mt-1 bg-secondary border-white/10 text-white rounded-xl min-h-[80px] resize-none"
                />
              </div>
            </div>
          </div>

          {/* Equipment Card */}
          <div className="card-premium p-5 space-y-4">
            <h3 className="font-medium text-white">设备与产能</h3>
            <div className="space-y-3">
              <div>
                <Label className="text-white/60 text-xs">咖啡机型号</Label>
                <Input
                  placeholder="如: La Marzocco Linea PB"
                  value={coffeeMachine}
                  onChange={(e) => setCoffeeMachine(e.target.value)}
                  className="mt-1 h-11 bg-secondary border-white/10 text-white rounded-xl"
                />
              </div>
              <div>
                <Label className="text-white/60 text-xs">日峰值出品杯数</Label>
                <Input
                  type="number"
                  placeholder="预估每日最大产能"
                  value={dailyPeakCups}
                  onChange={(e) => setDailyPeakCups(e.target.value)}
                  className="mt-1 h-11 bg-secondary border-white/10 text-white rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Business Hours Card */}
          <div className="card-premium p-5 space-y-4">
            <h3 className="font-medium text-white">营业时间</h3>
            <div className="flex items-center gap-3">
              <Input
                type="time"
                value={businessHoursOpen}
                onChange={(e) => setBusinessHoursOpen(e.target.value)}
                className="flex-1 h-11 bg-secondary border-white/10 text-white rounded-xl"
              />
              <span className="text-white/40">至</span>
              <Input
                type="time"
                value={businessHoursClose}
                onChange={(e) => setBusinessHoursClose(e.target.value)}
                className="flex-1 h-11 bg-secondary border-white/10 text-white rounded-xl"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            className="w-full h-14 rounded-2xl text-base font-medium mt-4"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "提交审核"}
          </Button>
        </section>

        {/* Success Dialog */}
        <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
          <DialogContent className="bg-card border-white/10 rounded-2xl max-w-sm mx-auto">
            <DialogHeader className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-primary" />
              </div>
              <DialogTitle className="text-xl text-white">申请已提交</DialogTitle>
              <DialogDescription className="text-white/60 mt-2">
                24小时内将有 KAKAGO 的 Fellow 伙伴与您联系，请保持手机畅通
              </DialogDescription>
            </DialogHeader>
            <Button
              className="w-full h-12 rounded-xl mt-4"
              onClick={() => navigate("/")}
            >
              返回首页
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return null;
};

export default MerchantAuth;
