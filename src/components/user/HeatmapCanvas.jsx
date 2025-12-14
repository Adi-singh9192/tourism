import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

/* ================= CITY → COORDS MAP ================= */
const CITY_COORDS = {
  Jaipur: { lat: 26.9124, lng: 75.7873 },
  Udaipur: { lat: 24.5854, lng: 73.7125 },
  Jodhpur: { lat: 26.2389, lng: 73.0243 },
  Ajmer: { lat: 26.4499, lng: 74.6399 },
  Bikaner: { lat: 28.0229, lng: 73.3119 },
};

/* ================= HEAT LAYER ================= */
const HeatLayer = ({ points }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !points.length) return;

    const heatData = points.map((p) => [
      p.lat,
      p.lng,
      Math.min(p.intensity, 1),
    ]);

    const layer = L.heatLayer(heatData, {
      radius: 35,
      blur: 25,
      maxZoom: 10,
      gradient: {
        0.3: "green",
        0.6: "yellow",
        0.9: "red",
      },
    });

    layer.addTo(map);
    return () => map.removeLayer(layer);
  }, [map, points]);

  return null;
};

/* ================= AUTO CENTER ================= */
const AutoCenter = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, 9, { animate: true });
    }
  }, [position, map]);

  return null;
};

/* ================= MAIN ================= */
const HeatmapCanvas = () => {
  const [heatPoints, setHeatPoints] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  /* ================= FETCH HIGH CROWD DATA ================= */
  useEffect(() => {
    const state = localStorage.getItem("state") || "Rajasthan";
    const district = localStorage.getItem("district") || "";

    const fetchHeatData = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/dashboard/high-crowd?state=${state}&district=${district}&limit=20`
        );
        const data = await res.json();

        if (!data.success) return;

        const mapped = data.recommendations
          .map((p) => {
            const coords =
              CITY_COORDS[p.city] || CITY_COORDS[p.district];

            if (!coords) return null;

            return {
              lat: coords.lat,
              lng: coords.lng,
              intensity: p.crowdCount / 30000, // normalize
            };
          })
          .filter(Boolean);

        setHeatPoints(mapped);
      } catch (err) {
        console.error("Heatmap fetch error:", err);
      }
    };

    fetchHeatData();
  }, []);

  /* ================= LIVE USER LOCATION ================= */
  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => { },
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const finalPoints = [
    ...heatPoints,
    ...(userLocation
      ? [{ ...userLocation, intensity: 1 }]
      : []),
  ];

  const rajasthanBounds = [
    [23.0, 69.0],
    [29.5, 78.0],
  ];

  return (
    <div className="h-[280px] sm:h-[320px] lg:h-[380px] rounded-xl overflow-hidden border">
      <MapContainer
        bounds={rajasthanBounds}
        maxBounds={rajasthanBounds}
        maxBoundsViscosity={1}
        zoom={7}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        zoomControl={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <HeatLayer points={finalPoints} />

        {userLocation && (
          <AutoCenter
            position={[userLocation.lat, userLocation.lng]}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default HeatmapCanvas;
