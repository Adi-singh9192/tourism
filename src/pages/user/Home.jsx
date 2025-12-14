import { useState, useEffect } from "react";
import PlaceCard from "../../components/user/PlaceCard";
import {
  FaSearch,
  FaUsers,
  FaClock,
  FaExclamationTriangle,
} from "react-icons/fa";

/* ================= BUILD ALERTS FROM BACKEND DATA ================= */
const buildAlertsFromPlaces = (places, locationLabel) => {
  if (!places || places.length === 0) {
    return [
      {
        id: Date.now(),
        type: "Normal",
        title: "All Clear",
        description: "No abnormal crowd levels detected",
        location: locationLabel,
      },
    ];
  }

  const alerts = [];

  places.forEach((place) => {
    if (place.crowdCount > 12000) {
      alerts.push({
        id: `${place.name}-critical`,
        type: "Critical",
        title: "High Footfall Alert",
        description: `${place.name} is highly crowded (${place.crowdCount.toLocaleString()} visitors)`,
        location: place.city,
      });
    } else if (place.crowdCount > 8000) {
      alerts.push({
        id: `${place.name}-medium`,
        type: "Medium",
        title: "Moderate Crowd Warning",
        description: `${place.name} has moderate crowd (${place.crowdCount.toLocaleString()} visitors)`,
        location: place.city,
      });
    }
  });

  if (alerts.length === 0) {
    alerts.push({
      id: Date.now(),
      type: "Normal",
      title: "Crowd Status Normal",
      description: "Crowd levels are comfortable for visiting",
      location: locationLabel,
    });
  }

  return alerts;
};

const UserHome = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState({ state: "", district: "" });

  const [recommendedPlaces, setRecommendedPlaces] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= GET USER LOCATION ================= */
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`
          );

          const data = await res.json();

          const state = data.address?.state || "Rajasthan";
          const district = data.address?.state_district || "";

          // 🔹 Save in state
          setUserLocation({ state, district });

          // 🔹 Save in localStorage
          localStorage.setItem(
            "userLocation",
            JSON.stringify({ state, district })
          );
        } catch (err) {
          console.warn("Location detection failed", err);
        }
      },
      () => {
        console.warn("Location permission denied");

        // 🔹 Fallback from localStorage
        const savedLocation = localStorage.getItem("userLocation");
        if (savedLocation) {
          setUserLocation(JSON.parse(savedLocation));
        }
      }
    );
  }, []);


  /* ================= FETCH BACKEND DATA ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams({
          state: userLocation.state || "Rajasthan",
          district: userLocation.district || "",
          search: searchQuery || "",
        });

        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/dashboard/low-crowd?${params}`
        );

        const data = await res.json();
        if (!data.success) {
          setError("Failed to load recommendations");
          return;
        }

        setRecommendedPlaces(data.recommendations);

        const label =
          searchQuery ||
          userLocation.district ||
          userLocation.state ||
          "Rajasthan";

        setAlerts(buildAlertsFromPlaces(data.recommendations, label));
      } catch (err) {
        console.error(err);
        setError("Backend server not reachable");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchQuery, userLocation]);

  return (
    <div className="space-y-12 pb-16">

      {/* ================= HERO ================= */}
      <section className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-6 sm:p-10 text-white">
        <h1 className="text-2xl sm:text-4xl font-bold">
          Explore Rajasthan Smarter
        </h1>
        <p className="mt-2 text-primary-100">
          Real-time crowd-aware travel insights
        </p>

        <div className="relative mt-6 max-w-xl">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search place or city"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-4 rounded-full text-gray-800 shadow-lg focus:ring-2 focus:ring-primary-400 outline-none"
          />
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6">
        <StatCard icon={<FaUsers />} label="Low Crowd Places" value={recommendedPlaces.length} />
        <StatCard icon={<FaClock />} label="Best Visit Time" value="8 AM – 11 AM" />
        <StatCard icon={<FaExclamationTriangle />} label="Active Alerts" value={alerts.length} />
      </section>

      {/* ================= ALERTS ================= */}
      <section className="bg-white rounded-2xl border p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">
          Travel Alerts
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      </section>

      {/* ================= RECOMMENDATIONS ================= */}
      <section className="bg-white rounded-2xl border p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">
          {searchQuery
            ? `Results for "${searchQuery}"`
            : userLocation.district
              ? `Low Crowd Places near ${userLocation.district}`
              : "Recommended Low Crowd Places"}
        </h2>

        {loading && <p className="text-gray-500">Loading recommendations…</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recommendedPlaces.map((place, idx) => (
              <PlaceCard
                key={idx}
                place={{
                  name: place.name,
                  city: place.city,
                  crowdLevel: place.crowdCount,
                  lastUpdated: place.lastUpdated,
                  isLowCrowd: true,
                }}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default UserHome;


const AlertCard = ({ alert }) => {
  const styles = {
    Critical: "border-red-500 bg-red-50 text-red-700",
    Medium: "border-yellow-500 bg-yellow-50 text-yellow-700",
    Normal: "border-green-500 bg-green-50 text-green-700",
  };

  return (
    <div className={`border-l-4 p-4 rounded-xl ${styles[alert.type]}`}>
      <h3 className="font-semibold">{alert.title}</h3>
      <p className="text-sm mt-1">{alert.description}</p>
      <p className="text-xs mt-1 opacity-70">📍 {alert.location}</p>
    </div>
  );
};


const StatCard = ({ icon, label, value }) => (
  <div className="bg-white border rounded-xl p-4 flex items-center gap-4">
    <div className="text-xl text-primary-600">{icon}</div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  </div>
);
