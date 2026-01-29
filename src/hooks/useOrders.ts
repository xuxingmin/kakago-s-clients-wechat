import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type OrderStatusEnum = Database["public"]["Enums"]["order_status"];

interface Order {
  id: string;
  user_id: string;
  merchant_id: string;
  product_name: string;
  product_image: string | null;
  price: number;
  quantity: number;
  total_amount: number;
  status: OrderStatusEnum;
  delivery_address: string;
  delivery_lat: number | null;
  delivery_lng: number | null;
  delivery_contact_name: string;
  delivery_contact_phone: string;
  rider_name: string | null;
  rider_phone: string | null;
  rider_lat: number | null;
  rider_lng: number | null;
  rider_avatar: string | null;
  delivery_platform: string | null;
  delivery_order_id: string | null;
  created_at: string;
  accepted_at: string | null;
  rider_assigned_at: string | null;
  picked_up_at: string | null;
  delivered_at: string | null;
  updated_at: string;
  merchants?: {
    name: string;
    name_en: string | null;
    logo_url: string | null;
    rating: number | null;
    address?: string;
    phone?: string | null;
    latitude?: number;
    longitude?: number;
  } | null;
  order_ratings?: {
    taste_rating: number;
    packaging_rating: number;
    timeliness_rating: number;
    overall_rating: number;
    comment: string | null;
  } | null;
  order_status_history?: {
    status: OrderStatusEnum;
    message: string | null;
    created_at: string;
  }[];
}

interface UseOrdersOptions {
  status?: OrderStatusEnum;
  realtime?: boolean;
}

export function useOrders(options: UseOrdersOptions = {}) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) {
        setOrders([]);
        return;
      }

      let query = supabase
        .from("orders")
        .select(`
          *,
          merchants (name, name_en, logo_url, rating),
          order_ratings (taste_rating, packaging_rating, timeliness_rating, overall_rating, comment)
        `)
        .eq("user_id", user.user.id)
        .order("created_at", { ascending: false });

      if (options.status) {
        query = query.eq("status", options.status);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      // Transform the data to match our Order interface
      const transformedOrders: Order[] = (data || []).map((item) => ({
        ...item,
        merchants: Array.isArray(item.merchants) ? item.merchants[0] : item.merchants,
        order_ratings: Array.isArray(item.order_ratings) ? item.order_ratings[0] : item.order_ratings,
      }));

      setOrders(transformedOrders);
      setError(null);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, [options.status]);

  // Subscribe to realtime updates
  useEffect(() => {
    fetchOrders();

    if (options.realtime) {
      const channel = supabase
        .channel("orders-changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "orders",
          },
          (payload) => {
            console.log("Order change received:", payload);
            fetchOrders(); // Refetch on any change
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [fetchOrders, options.realtime]);

  return { orders, loading, error, refetch: fetchOrders };
}

export function useOrder(orderId: string | null) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = useCallback(async () => {
    if (!orderId) {
      setOrder(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) {
        setOrder(null);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("orders")
        .select(`
          *,
          merchants (name, name_en, logo_url, rating, address, phone, latitude, longitude),
          order_ratings (taste_rating, packaging_rating, timeliness_rating, overall_rating, comment),
          order_status_history (status, message, created_at)
        `)
        .eq("id", orderId)
        .eq("user_id", user.user.id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      // Transform the data to match our Order interface
      const transformedOrder: Order = {
        ...data,
        merchants: Array.isArray(data.merchants) ? data.merchants[0] : data.merchants,
        order_ratings: Array.isArray(data.order_ratings) ? data.order_ratings[0] : data.order_ratings,
      };

      setOrder(transformedOrder);
      setError(null);
    } catch (err) {
      console.error("Error fetching order:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch order");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  // Subscribe to realtime updates for this specific order
  useEffect(() => {
    fetchOrder();

    if (orderId) {
      const channel = supabase
        .channel(`order-${orderId}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "orders",
            filter: `id=eq.${orderId}`,
          },
          (payload) => {
            console.log("Order update received:", payload);
            fetchOrder();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [orderId, fetchOrder]);

  return { order, loading, error, refetch: fetchOrder };
}

export async function submitOrderRating(
  orderId: string,
  tasteRating: number,
  packagingRating: number,
  timelinessRating: number,
  comment?: string
) {
  const { data: user } = await supabase.auth.getUser();
  if (!user?.user) {
    throw new Error("Unauthorized");
  }

  // Get order to get merchant_id
  const { data: order } = await supabase
    .from("orders")
    .select("merchant_id")
    .eq("id", orderId)
    .single();

  if (!order) {
    throw new Error("Order not found");
  }

  // Insert rating
  const { data: rating, error } = await supabase
    .from("order_ratings")
    .insert({
      order_id: orderId,
      user_id: user.user.id,
      merchant_id: order.merchant_id,
      taste_rating: tasteRating,
      packaging_rating: packagingRating,
      timeliness_rating: timelinessRating,
      comment: comment || null,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  // Update order status to rated
  await supabase.from("orders").update({ status: "rated" }).eq("id", orderId);

  return rating;
}
