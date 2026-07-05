import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PhoneAuthModal } from "@/components/PhoneAuthModal";
import { useAuth } from "@/contexts/AuthContext";

// Minimal typed wrapper for the beta supabase.auth.oauth namespace.
type OAuthApi = {
  getAuthorizationDetails: (id: string) => Promise<{ data: any; error: any }>;
  approveAuthorization: (id: string) => Promise<{ data: any; error: any }>;
  denyAuthorization: (id: string) => Promise<{ data: any; error: any }>;
};
const oauthApi = (supabase.auth as unknown as { oauth: OAuthApi }).oauth;

export default function OAuthConsent() {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const { user, loading } = useAuth();
  const [details, setDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!authorizationId) {
      setError("Missing authorization_id");
      return;
    }
    if (!user) {
      setAuthOpen(true);
      return;
    }
    let active = true;
    (async () => {
      const { data, error } = await oauthApi.getAuthorizationDetails(authorizationId);
      if (!active) return;
      if (error) return setError(error.message);
      const immediate = data?.redirect_url ?? data?.redirect_to;
      if (immediate && !data?.client) {
        window.location.href = immediate;
        return;
      }
      setDetails(data);
    })();
    return () => {
      active = false;
    };
  }, [authorizationId, user, loading]);

  async function decide(approve: boolean) {
    setBusy(true);
    const { data, error } = approve
      ? await oauthApi.approveAuthorization(authorizationId)
      : await oauthApi.denyAuthorization(authorizationId);
    if (error) {
      setBusy(false);
      return setError(error.message);
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      return setError("No redirect returned by the authorization server.");
    }
    window.location.href = target;
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 text-center">
        <div>
          <h1 className="text-lg font-semibold mb-2 text-espresso">无法加载授权请求</h1>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <>
        <main className="min-h-screen flex items-center justify-center p-6 text-center bg-oat">
          <div>
            <h1 className="text-lg font-semibold mb-2 text-espresso">请先登录 TRIVA</h1>
            <p className="text-sm text-muted-foreground">登录后即可继续授权外部应用连接您的账号。</p>
          </div>
        </main>
        <PhoneAuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      </>
    );
  }

  if (!details) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 text-espresso">
        Loading…
      </main>
    );
  }

  const clientName = details.client?.name ?? "外部应用";

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-oat">
      <div className="max-w-sm w-full bg-cream rounded-2xl p-6 border border-soft-gray">
        <h1 className="text-xl font-semibold text-espresso mb-2">
          允许 {clientName} 连接您的 TRIVA 账号？
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          该应用将以您的身份读取 TRIVA 数据（订单、资料等）。您可以随时撤销授权。
        </p>
        <div className="flex gap-3">
          <button
            disabled={busy}
            onClick={() => decide(false)}
            className="flex-1 py-3 rounded-xl border border-soft-gray text-espresso disabled:opacity-50"
          >
            拒绝
          </button>
          <button
            disabled={busy}
            onClick={() => decide(true)}
            className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground disabled:opacity-50"
          >
            允许
          </button>
        </div>
      </div>
    </main>
  );
}
