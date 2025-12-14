import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const FootfallAnalytics = () => {
  const [cities, setCities] = useState({});
  const [city, setCity] = useState("");
  const [place, setPlace] = useState("");

  const [chartData, setChartData] = useState([]);
  const [topCrowded, setTopCrowded] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH CITY + PLACE DATA ================= */
  const fetchCities = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/footfall`
      );
      const json = await res.json();

      if (json.success) {
        setCities(json.cities);

        const firstCity = Object.keys(json.cities)[0];
        const firstPlace = json.cities[firstCity].places[0].name;

        setCity(firstCity);
        setPlace(firstPlace);

        // Set top crowded initially
        setTopCrowded(
          [...json.cities[firstCity].places]
            .sort((a, b) => b.total - a.total)
            .map((p) => ({
              name: p.name,
              visitors: p.total,
            }))
        );
      }
    } catch (err) {
      console.error("Failed to fetch cities", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FETCH TIME SERIES ================= */
  const fetchSeries = async () => {
    if (!city || !place) return;

    try {
      const params = new URLSearchParams({
        city,
        tourist_place: place,
      });

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/footfall/series?${params}`
      );

      const json = await res.json();

      if (json.success) {
        setChartData(json.series);
      }
    } catch (err) {
      console.error("Failed to fetch series", err);
    }
  };

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    fetchCities();
  }, []);

  /* ================= UPDATE TOP CROWDED ON CITY CHANGE ================= */
  useEffect(() => {
    if (!city || !cities[city]) return;

    setTopCrowded(
      [...cities[city].places]
        .sort((a, b) => b.total - a.total)
        .map((p) => ({
          name: p.name,
          visitors: p.total,
        }))
    );
  }, [city, cities]);

  /* ================= POLL SERIES EVERY 30s ================= */
  useEffect(() => {
    fetchSeries();
    const interval = setInterval(fetchSeries, 30000);
    return () => clearInterval(interval);
  }, [city, place]);

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8 text-white shadow-lg">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Footfall Analytics
        </h1>
        <p className="text-sm opacity-80 mt-1">
          Live telecom-based visitor analytics
        </p>
      </section>

      {/* FILTERS */}
      <section className="px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* CITY */}
          <select
            value={city}
            onChange={(e) => {
              const newCity = e.target.value;
              setCity(newCity);
              setPlace(cities[newCity].places[0].name);
            }}
            className="w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {Object.keys(cities).map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          {/* PLACE */}
          <select
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {cities[city]?.places.map((p) => (
              <option key={p.name}>{p.name}</option>
            ))}
          </select>
        </div>
      </section>

      {/* GRAPH */}
      <section className="px-4 sm:px-6">
        <div className="bg-white p-4 sm:p-6 rounded-3xl shadow">
          <h2 className="text-lg sm:text-xl font-bold mb-4">
            Footfall Trend – {place}, {city}
          </h2>

          <div className="h-[260px] sm:h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line
                  dataKey="visitors"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* FOOTER / TOP CROWDED */}
      <footer className="px-4 sm:px-6">
        <div className="bg-white p-4 sm:p-6 rounded-3xl shadow">
          <h2 className="text-lg sm:text-xl font-bold mb-4">
            🔥 Top Crowded Attractions – {city}
          </h2>

          {loading && (
            <p className="text-sm text-gray-500 mb-2">
              Loading latest data…
            </p>
          )}

          <div className="space-y-3">
            {topCrowded.map((item, i) => (
              <div
                key={item.name}
                className="flex items-center justify-between gap-4 bg-gray-50 p-4 rounded-2xl"
              >
                <div className="min-w-0">
                  <div className="font-semibold truncate">
                    #{i + 1} {item.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {item.visitors.toLocaleString()} visitors
                  </div>
                </div>

                <span className="shrink-0 px-3 py-1 rounded-full bg-green-100 text-green-600 text-sm font-bold">
                  ↑
                </span>
              </div>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
};

export default FootfallAnalytics;
