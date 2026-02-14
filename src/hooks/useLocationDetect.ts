import { useState, useCallback } from "react";

export interface NearbyPOI {
  name: string;
  address: string;
  lat: number;
  lng: number;
  province: string;
  provinceEn: string;
  city: string;
  cityEn: string;
  district: string;
  districtEn: string;
}

interface ReverseGeoResult {
  province: string;
  provinceEn: string;
  city: string;
  cityEn: string;
  district: string;
  districtEn: string;
}

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";

async function reverseGeocode(lat: number, lng: number, lang: string): Promise<any> {
  const res = await fetch(
    `${NOMINATIM_BASE}/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&accept-language=${lang}`,
    { headers: { "User-Agent": "LovableCoffeeApp/1.0" } }
  );
  if (!res.ok) throw new Error("Reverse geocode failed");
  return res.json();
}

async function fetchNearbyPOIs(lat: number, lng: number): Promise<any[]> {
  // Use Overpass API for better POI results within 500m
  const query = `
    [out:json][timeout:10];
    (
      node["name"]["building"](around:500,${lat},${lng});
      node["name"]["amenity"](around:500,${lat},${lng});
      node["name"]["shop"](around:500,${lat},${lng});
      node["name"]["office"](around:500,${lat},${lng});
      way["name"]["building"](around:500,${lat},${lng});
      node["name"]["tourism"](around:500,${lat},${lng});
      node["name"]["leisure"](around:500,${lat},${lng});
    );
    out center 8;
  `;
  
  try {
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: `data=${encodeURIComponent(query)}`,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    if (!res.ok) throw new Error("Overpass failed");
    const data = await res.json();
    return data.elements || [];
  } catch {
    // Fallback: use Nominatim search with bounding box
    const delta = 0.005; // ~500m
    const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`;
    const res = await fetch(
      `${NOMINATIM_BASE}/search?q=*&format=json&accept-language=zh&viewbox=${bbox}&bounded=1&limit=8&addressdetails=1`,
      { headers: { "User-Agent": "LovableCoffeeApp/1.0" } }
    );
    if (!res.ok) return [];
    return res.json();
  }
}

export function useLocationDetect() {
  const [loading, setLoading] = useState(false);
  const [pois, setPois] = useState<NearbyPOI[]>([]);
  const [showList, setShowList] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detect = useCallback(() => {
    if (!navigator.geolocation) {
      setError("您的浏览器不支持定位功能");
      return;
    }

    setLoading(true);
    setError(null);
    setPois([]);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lng } = position.coords;

        try {
          // Parallel: reverse geocode in zh + en, and fetch POIs
          const [zhResult, enResult, rawPois] = await Promise.all([
            reverseGeocode(lat, lng, "zh"),
            reverseGeocode(lat, lng, "en"),
            fetchNearbyPOIs(lat, lng),
          ]);

          const zhAddr = zhResult.address || {};
          const enAddr = enResult.address || {};

          const baseGeo: ReverseGeoResult = {
            province: zhAddr.state || zhAddr.province || "",
            provinceEn: enAddr.state || enAddr.province || "",
            city: zhAddr.city || zhAddr.town || zhAddr.county || "",
            cityEn: enAddr.city || enAddr.town || enAddr.county || "",
            district: zhAddr.suburb || zhAddr.district || zhAddr.borough || zhAddr.neighbourhood || "",
            districtEn: enAddr.suburb || enAddr.district || enAddr.borough || enAddr.neighbourhood || "",
          };

          // Build POI list
          const seen = new Set<string>();
          const poiList: NearbyPOI[] = [];

          // Add current location as first option
          const currentName = zhAddr.building || zhAddr.amenity || zhAddr.shop || zhAddr.road || "当前位置";
          const currentAddr = [baseGeo.district, zhAddr.road, zhAddr.house_number].filter(Boolean).join(" ");
          poiList.push({
            name: currentName,
            address: currentAddr || `${baseGeo.province}${baseGeo.city}${baseGeo.district}`,
            lat, lng,
            ...baseGeo,
          });
          seen.add(currentName);

          // Process Overpass/Nominatim results
          for (const el of rawPois) {
            const name = el.tags?.name || el.display_name?.split(",")[0] || "";
            if (!name || seen.has(name)) continue;
            seen.add(name);

            const poiLat = el.lat || el.center?.lat || lat;
            const poiLng = el.lon || el.center?.lon || lng;

            // Use address from element if available (Nominatim fallback), else use base geo
            const elAddr = el.address || {};
            poiList.push({
              name,
              address: elAddr.road ? `${elAddr.road} ${elAddr.house_number || ""}`.trim() : currentAddr,
              lat: poiLat,
              lng: poiLng,
              province: elAddr.state || baseGeo.province,
              provinceEn: baseGeo.provinceEn,
              city: elAddr.city || elAddr.town || baseGeo.city,
              cityEn: baseGeo.cityEn,
              district: elAddr.suburb || elAddr.district || baseGeo.district,
              districtEn: baseGeo.districtEn,
            });

            if (poiList.length >= 8) break;
          }

          setPois(poiList);
          setShowList(true);
        } catch (e) {
          setError("定位成功但获取地址信息失败，请重试");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setLoading(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError("请在浏览器设置中允许定位权限");
            break;
          case err.POSITION_UNAVAILABLE:
            setError("无法获取位置信息");
            break;
          case err.TIMEOUT:
            setError("定位超时，请重试");
            break;
          default:
            setError("定位失败，请重试");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  return { loading, pois, showList, setShowList, error, detect };
}
