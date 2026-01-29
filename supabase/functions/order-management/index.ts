import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface CreateOrderRequest {
  merchant_id: string;
  product_name: string;
  product_image?: string;
  price: number;
  quantity: number;
  delivery_address: string;
  delivery_lat?: number;
  delivery_lng?: number;
  delivery_contact_name: string;
  delivery_contact_phone: string;
}

interface UpdateOrderStatusRequest {
  order_id: string;
  status: string;
  rider_info?: {
    rider_name?: string;
    rider_phone?: string;
    rider_lat?: number;
    rider_lng?: number;
    rider_avatar?: string;
    delivery_platform?: string;
    delivery_order_id?: string;
  };
}

interface SubmitRatingRequest {
  order_id: string;
  taste_rating: number;
  packaging_rating: number;
  timeliness_rating: number;
  comment?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;

  try {
    const authHeader = req.headers.get("Authorization");
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader || "" } },
    });

    const url = new URL(req.url);
    const path = url.pathname.split("/").pop();

    // GET /order-management - List user's orders
    if (req.method === "GET" && !path) {
      const { data: user, error: authError } = await supabase.auth.getUser();
      if (authError || !user?.user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const status = url.searchParams.get("status");
      let query = supabase
        .from("orders")
        .select(`
          *,
          merchants (name, name_en, logo_url, rating),
          order_ratings (taste_rating, packaging_rating, timeliness_rating, overall_rating, comment)
        `)
        .eq("user_id", user.user.id)
        .order("created_at", { ascending: false });

      if (status) {
        query = query.eq("status", status);
      }

      const { data: orders, error } = await query;

      if (error) {
        console.error("Error fetching orders:", error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ orders }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST /order-management/create - Create new order
    if (req.method === "POST" && path === "create") {
      const { data: user, error: authError } = await supabase.auth.getUser();
      if (authError || !user?.user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const body: CreateOrderRequest = await req.json();
      const totalAmount = body.price * body.quantity;

      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          user_id: user.user.id,
          merchant_id: body.merchant_id,
          product_name: body.product_name,
          product_image: body.product_image,
          price: body.price,
          quantity: body.quantity,
          total_amount: totalAmount,
          delivery_address: body.delivery_address,
          delivery_lat: body.delivery_lat,
          delivery_lng: body.delivery_lng,
          delivery_contact_name: body.delivery_contact_name,
          delivery_contact_phone: body.delivery_contact_phone,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating order:", error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Record initial status
      await supabase.from("order_status_history").insert({
        order_id: order.id,
        status: "pending",
        message: "订单已创建，等待咖啡馆接单",
      });

      console.log("Order created:", order.id);

      return new Response(
        JSON.stringify({
          success: true,
          order,
          message: "订单创建成功",
        }),
        {
          status: 201,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // POST /order-management/accept - Merchant accepts order (triggers delivery dispatch)
    if (req.method === "POST" && path === "accept") {
      const { data: user, error: authError } = await supabase.auth.getUser();
      if (authError || !user?.user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { order_id } = await req.json();

      // Verify merchant owns this order's store
      const { data: order } = await supabase
        .from("orders")
        .select("*, merchants!inner(*)")
        .eq("id", order_id)
        .single();

      if (!order) {
        return new Response(JSON.stringify({ error: "Order not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (order.merchants.user_id !== user.user.id) {
        return new Response(JSON.stringify({ error: "Not authorized" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Update order status to accepted
      const { error: updateError } = await supabase
        .from("orders")
        .update({ status: "accepted" })
        .eq("id", order_id);

      if (updateError) {
        return new Response(JSON.stringify({ error: updateError.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // TODO: Here you would call the aggregated delivery platform API
      // to dispatch a rider. For now, we simulate this.
      console.log("Order accepted, dispatching to delivery platform:", order_id);
      console.log("Delivery address:", order.delivery_address);

      // Simulate delivery platform API call
      // In production, replace with actual API call:
      // const deliveryResponse = await fetch('https://delivery-platform.com/api/dispatch', {
      //   method: 'POST',
      //   headers: { 'Authorization': `Bearer ${DELIVERY_API_KEY}` },
      //   body: JSON.stringify({
      //     pickup_address: order.merchants.address,
      //     pickup_lat: order.merchants.latitude,
      //     pickup_lng: order.merchants.longitude,
      //     delivery_address: order.delivery_address,
      //     delivery_lat: order.delivery_lat,
      //     delivery_lng: order.delivery_lng,
      //     contact_name: order.delivery_contact_name,
      //     contact_phone: order.delivery_contact_phone,
      //   }),
      // });

      return new Response(
        JSON.stringify({
          success: true,
          message: "订单已接受，开始制作。已通知配送平台派单。",
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // POST /order-management/update-status - Update order status (for delivery platform webhooks)
    if (req.method === "POST" && path === "update-status") {
      const body: UpdateOrderStatusRequest = await req.json();

      const updateData: Record<string, unknown> = {
        status: body.status,
      };

      // Add rider info if provided
      if (body.rider_info) {
        Object.assign(updateData, {
          rider_name: body.rider_info.rider_name,
          rider_phone: body.rider_info.rider_phone,
          rider_lat: body.rider_info.rider_lat,
          rider_lng: body.rider_info.rider_lng,
          rider_avatar: body.rider_info.rider_avatar,
          delivery_platform: body.rider_info.delivery_platform,
          delivery_order_id: body.rider_info.delivery_order_id,
        });
      }

      const { error } = await supabase
        .from("orders")
        .update(updateData)
        .eq("id", body.order_id);

      if (error) {
        console.error("Error updating order status:", error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      console.log("Order status updated:", body.order_id, "->", body.status);

      return new Response(
        JSON.stringify({
          success: true,
          message: `订单状态已更新为: ${body.status}`,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // POST /order-management/update-rider-location - Update rider location (for real-time tracking)
    if (req.method === "POST" && path === "update-rider-location") {
      const { order_id, rider_lat, rider_lng } = await req.json();

      const { error } = await supabase
        .from("orders")
        .update({
          rider_lat,
          rider_lng,
        })
        .eq("id", order_id);

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST /order-management/rate - Submit rating
    if (req.method === "POST" && path === "rate") {
      const { data: user, error: authError } = await supabase.auth.getUser();
      if (authError || !user?.user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const body: SubmitRatingRequest = await req.json();

      // Validate ratings
      const ratings = [body.taste_rating, body.packaging_rating, body.timeliness_rating];
      for (const rating of ratings) {
        if (rating < 1 || rating > 5) {
          return new Response(
            JSON.stringify({ error: "评分必须在1-5之间" }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }
      }

      // Get order and verify ownership
      const { data: order } = await supabase
        .from("orders")
        .select("*")
        .eq("id", body.order_id)
        .eq("user_id", user.user.id)
        .single();

      if (!order) {
        return new Response(JSON.stringify({ error: "Order not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (order.status !== "delivered") {
        return new Response(
          JSON.stringify({ error: "只能评价已送达的订单" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Insert rating
      const { data: rating, error: ratingError } = await supabase
        .from("order_ratings")
        .insert({
          order_id: body.order_id,
          user_id: user.user.id,
          merchant_id: order.merchant_id,
          taste_rating: body.taste_rating,
          packaging_rating: body.packaging_rating,
          timeliness_rating: body.timeliness_rating,
          comment: body.comment,
        })
        .select()
        .single();

      if (ratingError) {
        console.error("Error creating rating:", ratingError);
        return new Response(JSON.stringify({ error: ratingError.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Update order status to rated
      await supabase.from("orders").update({ status: "rated" }).eq("id", body.order_id);

      console.log("Rating submitted:", rating);

      return new Response(
        JSON.stringify({
          success: true,
          rating,
          message: "评价已提交，感谢您的反馈！",
        }),
        {
          status: 201,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // GET /order-management/:id - Get single order details
    if (req.method === "GET" && path && path !== "order-management") {
      const { data: user, error: authError } = await supabase.auth.getUser();
      if (authError || !user?.user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: order, error } = await supabase
        .from("orders")
        .select(`
          *,
          merchants (name, name_en, logo_url, rating, address, phone, latitude, longitude),
          order_ratings (taste_rating, packaging_rating, timeliness_rating, overall_rating, comment),
          order_status_history (status, message, created_at)
        `)
        .eq("id", path)
        .eq("user_id", user.user.id)
        .single();

      if (error || !order) {
        return new Response(JSON.stringify({ error: "Order not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ order }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Order management error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
