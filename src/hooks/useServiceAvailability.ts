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
  locationName: string;
  locationLoading: boolean;
}

const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=zh&zoom=16`,
      { headers: { "User-Agent": "KAKAGO-App/1.0" } }
    );
    if (!res.ok) return "";
    const data = await res.json();
    const addr = data.address;
    // Try to build a short, meaningful name
    const parts = [
      addr?.neighbourhood,
      addr?.commercial,
      addr?.suburb,
      addr?.city_district,
      addr?.town,
      addr?.city,
    ].filter(Boolean);
    // Return first meaningful part, or display_name truncated
    if (parts.length > 0) {
      // Prefer neighbourhood/commercial + suburb combo
      const short = parts.slice(0, 2).join(" · ");
      return short;
    }
    return data.display_name?.split(",").slice(0, 2).join(" ") || "";
  } catch {
    return "";
  }
};

export const useServiceAvailability = () => {
  const [status, setStatus] = useState<ServiceStatus>({
    isAvailable: false,
    isLoading: true,
    error: null,
    nearbyMerchantCount: 0,
    locationName: "",
    locationLoading: true,
  });

  const checkAvailability = useCallback(async (lat: number, lng: number) => {
    setStatus((prev) => ({ ...prev, isLoading: true, error: null, locationLoading: true }));

    // Run service check and reverse geocoding in parallel
    const [serviceResult, locationName] = await Promise.all([
      supabase.functions.invoke("check-service", {
        body: { latitude: lat, longitude: lng, radius: 2000 },
      }).then(({ data, error }) => {
        if (error) throw error;
        return data;
      }).catch((err) => {
        console.error("Failed to check service availability:", err);
        return null;
      }),
      reverseGeocode(lat, lng),
    ]);

    if (serviceResult) {
      setStatus({
        isAvailable: serviceResult.isAvailable,
        isLoading: false,
        error: null,
        nearbyMerchantCount: serviceResult.nearbyMerchantCount,
        nearestMerchant: serviceResult.nearestMerchant,
        userLocation: { latitude: lat, longitude: lng },
        locationName: locationName || "当前位置",
        locationLoading: false,
      });
    } else {
      setStatus((prev) => ({
        ...prev,
        isLoading: false,
        error: "Failed to check service",
        locationName: locationName || "当前位置",
        locationLoading: false,
      }));
    }
  }, []);

  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      checkAvailability(31.8206, 117.2272);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        checkAvailability(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.warn("Geolocation error:", error.message);
        checkAvailability(31.8206, 117.2272);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
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
