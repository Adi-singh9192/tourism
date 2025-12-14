import { useEffect, useState } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  timeout: 10000,
});

export default function InternationalPage({ onBack }) {
  const state = localStorage.getItem("state") || "Rajasthan";
  const district = localStorage.getItem("district") || "";

  const [countryCode, setCountryCode] = useState("");
  const [phone, setPhone] = useState("");
  const [visitors, setVisitors] = useState("");
  const [country, setCountry] = useState("");

  const [city, setCity] = useState("");
  const [place, setPlace] = useState("");

  const [lowCrowd, setLowCrowd] = useState([]);
  const [highCrowd, setHighCrowd] = useState([]);
  const [loading, setLoading] = useState(true);

  /* FETCH CROWD DATA */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [lowRes, highRes] = await Promise.all([
          api.get("/dashboard/low-crowd", { params: { state, district } }),
          api.get("/dashboard/high-crowd", { params: { state, district } }),
        ]);

        if (lowRes.data.success) setLowCrowd(lowRes.data.recommendations);
        if (highRes.data.success) setHighCrowd(highRes.data.recommendations);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [state, district]);

  const allPlaces = [...lowCrowd, ...highCrowd];
  const cities = [...new Set(allPlaces.map((p) => p.city))];
  const placesInCity = allPlaces.filter((p) => p.city === city);
  const selectedPlace = allPlaces.find((p) => p.name === place);

  const crowdStatus =
    selectedPlace?.crowdCount >= 25000
      ? "Critical"
      : selectedPlace?.crowdCount >= 15000
        ? "High"
        : "Low";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPlace) return;

    try {
      // 1️⃣ Save ticket + update footfall in DB
      await api.post("/api/tickets/create", {
        touristType: "international",
        phone,
        countryCode,
        visitors: Number(visitors),
        country,
        state,
        city: selectedPlace.city,
        place: selectedPlace.name,
        crowdStatus,
        crowdCountAtBooking: selectedPlace.crowdCount,
      });

      // 2️⃣ WhatsApp message
      const message = `
🌍 International Tourist Ticket

📞 Phone: ${countryCode} ${phone}
👥 Visitors: ${visitors}
🌎 Country: ${country}

📍 City: ${selectedPlace.city}
🏛 Place: ${selectedPlace.name}
🚦 Crowd: ${crowdStatus}
👣 Visitors: ${selectedPlace.crowdCount}
`;

      // 3️⃣ Redirect to WhatsApp
      window.location.href =
        `https://wa.me/${countryCode}${phone}?text=` +
        encodeURIComponent(message);

    } catch (error) {
      console.error("International ticket creation failed:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 px-4">

      <div
        className="
          w-full max-w-lg
          bg-white/70 backdrop-blur-xl
          rounded-3xl shadow-2xl
          border border-white/40
          p-8 sm:p-10
          space-y-6
        "
      >
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            🌍 International Tourist
          </h1>
          <button
            onClick={onBack}
            className="text-sm text-gray-500 hover:text-gray-900 transition"
          >
            ← Back
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500 py-10">
            Loading crowd insights…
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* PHONE */}
            <div className="flex gap-3">
              <input
                className="w-1/3 rounded-2xl border bg-white/80 px-4 py-3 outline-none focus:ring-2 ring-indigo-500"
                placeholder="+1"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                required
              />
              <input
                className="flex-1 rounded-2xl border bg-white/80 px-4 py-3 outline-none focus:ring-2 ring-indigo-500"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <input
              type="number"
              placeholder="Number of visitors"
              className="w-full rounded-2xl border bg-white/80 px-4 py-3 outline-none focus:ring-2 ring-indigo-500"
              value={visitors}
              onChange={(e) => setVisitors(e.target.value)}
              required
            />

            <input
              placeholder="Country"
              className="w-full rounded-2xl border bg-white/80 px-4 py-3 outline-none focus:ring-2 ring-indigo-500"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />

            {/* CITY */}
            <select
              className="w-full rounded-2xl border bg-white/80 px-4 py-3 focus:ring-2 ring-indigo-500"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setPlace("");
              }}
              required
            >
              <option value="">Select Rajasthan City</option>
              {cities.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            {/* PLACE */}
            {city && (
              <select
                className="w-full rounded-2xl border bg-white/80 px-4 py-3 focus:ring-2 ring-indigo-500"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                required
              >
                <option value="">Select Tourist Place</option>
                {placesInCity.map((p) => (
                  <option key={p.name}>{p.name}</option>
                ))}
              </select>
            )}

            {/* CROWD STATUS */}
            {selectedPlace && (
              <div
                className={`rounded-2xl px-4 py-2 text-sm font-medium
                  ${crowdStatus === "Critical"
                    ? "bg-red-100 text-red-700"
                    : crowdStatus === "High"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-green-100 text-green-700"
                  }`}
              >
                Crowd Status: {crowdStatus} · {selectedPlace.crowdCount} visitors
              </div>
            )}

            <button
              type="submit"
              className="
                w-full py-4 rounded-2xl
                bg-indigo-600 text-white
                font-semibold
                hover:bg-indigo-700
                hover:shadow-lg
                transition
              "
            >
              Generate Ticket
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
