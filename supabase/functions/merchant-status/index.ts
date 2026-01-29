import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Get auth header for user authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Unauthorized",
          message: "请先登录商户账号",
        }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Validate JWT and get user
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } =
      await supabase.auth.getClaims(token);

    if (claimsError || !claimsData?.claims) {
      console.error("Auth error:", claimsError);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Unauthorized",
          message: "登录已过期，请重新登录",
        }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const userId = claimsData.claims.sub;
    console.log(`Merchant status request from user: ${userId}`);

    // Handle different HTTP methods
    if (req.method === "GET") {
      // Get merchant info for current user
      const { data, error } = await supabase.rpc("get_my_merchant");

      if (error) {
        console.error("Database error:", error);
        return new Response(
          JSON.stringify({
            success: false,
            error: "Database error",
            message: error.message,
          }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      if (!data || data.length === 0) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Not found",
            message: "当前账号未关联商户",
          }),
          {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const merchant = data[0];
      console.log(`Merchant info retrieved: ${merchant.name}`);

      return new Response(
        JSON.stringify({
          success: true,
          merchant: {
            id: merchant.id,
            name: merchant.name,
            nameEn: merchant.name_en,
            address: merchant.address,
            isOnline: merchant.is_online,
            latitude: merchant.latitude,
            longitude: merchant.longitude,
            rating: merchant.rating,
            businessHours: merchant.business_hours,
            updatedAt: merchant.updated_at,
          },
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (req.method === "POST" || req.method === "PUT") {
      // Toggle merchant status
      const body = await req.json();
      const newStatus = body.isOnline ?? body.is_online ?? body.online;

      if (typeof newStatus !== "boolean") {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Invalid request",
            message: "请提供有效的状态值 (isOnline: true/false)",
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      console.log(`Toggling merchant status to: ${newStatus}`);

      const { data, error } = await supabase.rpc("toggle_my_merchant_status", {
        new_status: newStatus,
      });

      if (error) {
        console.error("Database error:", error);
        return new Response(
          JSON.stringify({
            success: false,
            error: "Database error",
            message: error.message,
          }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const result = data?.[0];

      if (!result?.success) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Update failed",
            message: result?.message || "更新失败",
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      console.log(`Merchant ${result.merchant_id} status updated to: ${result.is_online}`);

      return new Response(
        JSON.stringify({
          success: true,
          merchantId: result.merchant_id,
          isOnline: result.is_online,
          message: result.message,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: "Method not allowed",
        message: "不支持的请求方法",
      }),
      {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("Unexpected error:", errorMessage);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Internal server error",
        message: errorMessage,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
