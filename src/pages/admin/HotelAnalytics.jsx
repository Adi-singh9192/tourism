import { useEffect, useState, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const LIMIT = 10;

const HotelAnalytics = () => {
  /* ================= STATE ================= */
  const [hotels, setHotels] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [chartData, setChartData] = useState([]);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  /* Filters (ONLY REQUIRED ONES) */
  const [city, setCity] = useState("");
  const [minRating, setMinRating] = useState("");

  const [loading, setLoading] = useState(false);

  /* ================= FETCH HOTEL LIST ================= */
  const fetchHotels = useCallback(async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams({
        page,
        limit: LIMIT,
        ...(city && { city }),
        ...(minRating && { minRating }),
      });

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/hotel/list?${params.toString()}`
      );

      const json = await res.json();

      if (json.success) {
        setHotels(json.data || []);
        setTotal(json.total || 0);
      } else {
        setHotels([]);
        setTotal(0);
      }
    } catch (err) {
      console.error("Failed to load hotels", err);
      setHotels([]);
    } finally {
      setLoading(false);
    }
  }, [page, city, minRating]);

  /* ================= FETCH ANALYTICS ================= */
  const fetchAnalytics = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        ...(city && { city }),
      });

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/hotel/analytics/city?${params.toString()}`
      );

      const json = await res.json();

      if (json.success) {
        setAnalytics(json.data);

        setChartData(
          json.data.map((c) => ({
            city: c.city,
            capacity: c.totalRooms,
            occupied: c.totalRooms - c.totalVacancy,
          }))
        );
      }
    } catch (err) {
      console.error("Failed to load analytics", err);
    }
  }, [city]);


  /* ================= EFFECT ================= */
  useEffect(() => {
    fetchHotels();
    fetchAnalytics();
  }, [fetchHotels, fetchAnalytics]);

  /* ================= KPI ================= */
  const totalHotels = analytics.reduce((a, c) => a + c.totalHotels, 0);
  const totalRooms = analytics.reduce((a, c) => a + c.totalRooms, 0);
  const totalVacancy = analytics.reduce((a, c) => a + c.totalVacancy, 0);
  const occupied = totalRooms - totalVacancy;

  const occupancyRate =
    totalRooms > 0
      ? ((occupied / totalRooms) * 100).toFixed(1)
      : 0;

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  /* ================= UI ================= */
  return (
    <div className="space-y-10">

      {/* HEADER */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white shadow-lg">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Hotel Capacity & Occupancy Analytics
        </h1>
        <p className="text-sm opacity-80">
          Government hotel infrastructure monitoring
        </p>
      </section>

      {/* KPI */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6">
        <KPI title="Hotels" value={totalHotels} />
        <KPI title="Rooms" value={totalRooms} />
        <KPI title="Occupied" value={occupied} />
        <KPI title="Occupancy" value={`${occupancyRate}%`} highlight />
      </section>

      {/* FILTERS (CLEAN & WORKING) */}
      <section className="bg-white p-4 rounded-xl shadow">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <select
            value={city}
            onChange={(e) => {
              setPage(1);
              setCity(e.target.value);
            }}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All Cities</option>
            <option>Jaipur</option>
            <option>Udaipur</option>
            <option>Jodhpur</option>
          </select>

          <select
            value={minRating}
            onChange={(e) => {
              setPage(1);
              setMinRating(e.target.value);
            }}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All Ratings</option>
            <option value="4">4★ & above</option>
            <option value="3">3★ & above</option>
          </select>
        </div>
      </section>

      {/* CHART */}
      <section className="bg-white p-6 rounded-2xl shadow">
        <h2 className="font-semibold mb-4">City-wise Utilization</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="city" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="capacity" fill="#6366f1" name="Total Rooms" />
              <Bar dataKey="occupied" fill="#22c55e" name="Occupied Rooms" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* TABLE */}
      <section className="bg-white p-6 rounded-2xl shadow">
        {loading && (
          <p className="text-center text-gray-500">Loading…</p>
        )}

        {!loading && hotels.length === 0 && (
          <p className="text-center text-gray-500">No hotels found.</p>
        )}

        {!loading && hotels.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-2">Hotel</th>
                  <th>City</th>
                  <th>Rooms</th>
                  <th>Vacancy</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {hotels.map((h) => (
                  <tr key={h._id} className="border-b hover:bg-gray-50">
                    <td className="py-2 font-medium">{h.Name}</td>
                    <td>{h.City}</td>
                    <td className="text-center">{h.totalRooms}</td>
                    <td className="text-center">{h.vacancy}</td>
                    <td className="text-center">{h.Rating ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINATION */}
        <div className="flex justify-between items-center mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-sm">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </section>
    </div>
  );
};

/* ================= KPI ================= */
const KPI = ({ title, value, highlight }) => (
  <div className="bg-white p-4 rounded-xl shadow">
    <p className="text-xs text-gray-500">{title}</p>
    <p className={`text-2xl font-bold ${highlight ? "text-indigo-600" : ""}`}>
      {value}
    </p>
  </div>
);

export default HotelAnalytics;
