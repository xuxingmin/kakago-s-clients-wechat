import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ServiceStatus {
  isAvailable: boolean;
  isLoading: boolean;
  error: string | null;
  nearbyMerchantCount: number;
  nearestMerchant?: {
    id: string;
    name: string;
    distanceMeters: number;
  };
  userLocation?: {
    latitude: number;
    longitude: number;
  };
}

export const useServiceAvailability = () => {
  const [status, setStatus] = useState<ServiceStatus>({
    isAvailable: false,
    isLoading: true,
    error: null,
    nearbyMerchantCount: 0,
  });

  const checkAvailability = useCallback(async (lat: number, lng: number) => {
    setStatus((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const { data, error } = await supabase.functions.invoke("check-service", {
        body: { latitude: lat, longitude: lng, radius: 2000 },
      });

      if (error) {
        throw error;
      }

      setStatus({
        isAvailable: data.isAvailable,
        isLoading: false,
        error: null,
        nearbyMerchantCount: data.nearbyMerchantCount,
        nearestMerchant: data.nearestMerchant,
        userLocation: { latitude: lat, longitude: lng },
      });
    } catch (err) {
      console.error("Failed to check service availability:", err);
      setStatus((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : "Failed to check service",
      }));
    }
  }, []);

  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      // Fallback to default location (Swan Lake CBD, Hefei)
      checkAvailability(31.8206, 117.2272);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        checkAvailability(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.warn("Geolocation error:", error.message);
        // Fallback to default location
        checkAvailability(31.8206, 117.2272);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // Cache for 5 minutes
      }
    );
  }, [checkAvailability]);

  useEffect(() => {
    getUserLocation();
  }, [getUserLocation]);

  const refresh = useCallback(() => {
    getUserLocation();
  }, [getUserLocation]);

  return { ...status, refresh };
};
