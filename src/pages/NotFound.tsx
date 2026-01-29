import { useNavigate, useLocation } from "react-router-dom";
import { Coffee } from "lucide-react";
import { useEffect } from "react";

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-8 text-center">
      <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-6">
        <Coffee className="w-12 h-12 text-muted-foreground" />
      </div>
      <h1 className="text-2xl font-bold text-foreground mb-2">页面未找到</h1>
      <p className="text-muted-foreground mb-8">
        抱歉，您访问的页面不存在
      </p>
      <button
        onClick={() => navigate("/")}
        className="btn-gold px-8 py-3 rounded-full text-sm font-semibold"
      >
        返回首页
      </button>
    </div>
  );
};

export default NotFound;
