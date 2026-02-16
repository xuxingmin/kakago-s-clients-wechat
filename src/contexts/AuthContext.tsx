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

interface UserProfile {
  display_name: string | null;
  avatar_url: string | null;
  phone: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  merchantInfo: MerchantInfo | null;
  isMerchant: boolean;
  profile: UserProfile | null;
  signOut: () => Promise<void>;
  refreshMerchantInfo: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [merchantInfo, setMerchantInfo] = useState<MerchantInfo | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

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

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("display_name, avatar_url, phone")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        setProfile(null);
        return;
      }
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setProfile(null);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          setTimeout(() => {
            fetchMerchantInfo();
            fetchProfile(session.user.id);
          }, 0);
        } else {
          setMerchantInfo(null);
          setProfile(null);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        fetchMerchantInfo();
        fetchProfile(session.user.id);
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
    setProfile(null);
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
        profile,
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
