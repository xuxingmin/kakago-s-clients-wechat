import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface MerchantInfo {
  merchant_id: string;
  merchant_name: string;
  merchant_name_en: string | null;
  is_online: boolean;
  role: "owner" | "manager" | "staff";
  rating: number | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  merchantInfo: MerchantInfo | null;
  isMerchant: boolean;
  signOut: () => Promise<void>;
  refreshMerchantInfo: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [merchantInfo, setMerchantInfo] = useState<MerchantInfo | null>(null);

  const fetchMerchantInfo = async () => {
    try {
      const { data, error } = await supabase.rpc("get_user_merchant");
      if (error) {
        console.error("Error fetching merchant info:", error);
        setMerchantInfo(null);
        return;
      }
      
      if (data && data.length > 0) {
        setMerchantInfo(data[0] as MerchantInfo);
      } else {
        setMerchantInfo(null);
      }
    } catch (error) {
      console.error("Error fetching merchant info:", error);
      setMerchantInfo(null);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer merchant info fetch to avoid deadlock
        if (session?.user) {
          setTimeout(() => {
            fetchMerchantInfo();
          }, 0);
        } else {
          setMerchantInfo(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchMerchantInfo();
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setMerchantInfo(null);
  };

  const refreshMerchantInfo = async () => {
    await fetchMerchantInfo();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        merchantInfo,
        isMerchant: !!merchantInfo,
        signOut,
        refreshMerchantInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
