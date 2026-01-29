import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ServiceAvailabilityResponse {
  isAvailable: boolean;
  nearbyMerchantCount: number;
  nearestMerchant?: {
    id: string;
    name: string;
    distanceMeters: number;
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user location from query params or body
    let latitude: number;
    let longitude: number;
    let radiusMeters = 2000; // Default 2km

    if (req.method === "GET") {
      const url = new URL(req.url);
      latitude = parseFloat(url.searchParams.get("lat") || "0");
      longitude = parseFloat(url.searchParams.get("lng") || "0");
      radiusMeters = parseInt(url.searchParams.get("radius") || "2000");
    } else {
      const body = await req.json();
      latitude = body.latitude || body.lat || 0;
      longitude = body.longitude || body.lng || 0;
      radiusMeters = body.radius || 2000;
    }

    // Validate coordinates
    if (!latitude || !longitude) {
      return new Response(
        JSON.stringify({
          error: "Missing coordinates",
          message: "Please provide lat and lng parameters",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(
      `Checking service availability at: ${latitude}, ${longitude} within ${radiusMeters}m`
    );

    // Call the database function
    const { data, error } = await supabase.rpc("check_service_availability", {
      user_lat: latitude,
      user_lng: longitude,
      radius_meters: radiusMeters,
    });

    if (error) {
      console.error("Database error:", error);
      return new Response(
        JSON.stringify({
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

    const response: ServiceAvailabilityResponse = {
      isAvailable: result?.is_available || false,
      nearbyMerchantCount: result?.nearby_merchant_count || 0,
    };

    if (result?.nearest_merchant_id) {
      response.nearestMerchant = {
        id: result.nearest_merchant_id,
        name: result.nearest_merchant_name,
        distanceMeters: Math.round(result.nearest_distance_meters),
      };
    }

    console.log("Service availability result:", response);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("Unexpected error:", errorMessage);
    return new Response(
      JSON.stringify({
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
