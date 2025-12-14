import { useCallback, useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#6366f1", "#22c55e"];

const VisitorSegmentation = () => {
  const [city, setCity] = useState("");
  const [cities, setCities] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH CITIES (ONCE) ================= */
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/visitor/analytics`
        );
        const json = await res.json();

        if (json.success) {
          const uniqueCities = [
            ...new Set(json.data.map(d => d.location.city)),
          ];
          setCities(uniqueCities);
        }
      } catch (err) {
        console.error("Failed to load cities", err);
      }
    };
    fetchCities();
  }, []);

  /* ================= FETCH TIME SERIES ================= */
  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        ...(city && { city }),
        interval: "15min", // or "15min"
      });

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/visitor/analytics/timeseries?${params}`
      );

      const json = await res.json();

      if (json.success) {
        setData(json.data || []);
      } else {
        setData([]);
      }
    } catch (err) {
      console.error("Failed to load visitor analytics", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [city]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  /* ================= KPI AGGREGATES ================= */
  const totalVisitors = data.reduce((a, d) => a + d.totalVisitors, 0);
  const domesticVisitors = data.reduce((a, d) => a + d.domesticVisitors, 0);
  const internationalVisitors = data.reduce(
    (a, d) => a + d.internationalVisitors,
    0
  );

  const pieData =
    totalVisitors > 0
      ? [
        { name: "Domestic", value: domesticVisitors },
        { name: "International", value: internationalVisitors },
      ]
      : [];

  /* ================= TIME-BASED BAR DATA ================= */
  const barData = data.map(d => ({
    time: new Date(d.time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    visitors: d.totalVisitors,
  }));

  return (
    <div className="min-h-screen bg-gray-50 space-y-10">

      {/* ================= HEADER ================= */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white shadow-lg">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Visitor Segmentation Analytics
        </h1>
        <p className="mt-2 text-sm opacity-90">
          Telecom-based visitor insights (Last 24 Hours)
        </p>

        <div className="mt-6 max-w-xs">
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-4 py-2 rounded-xl text-gray-800 bg-white"
          >
            <option value="">All Cities</option>
            {cities.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ================= KPI ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6">
        <StatCard label="Total Visitors" value={totalVisitors.toLocaleString()} />
        <StatCard
          label="Domestic Visitors"
          value={
            totalVisitors > 0
              ? `${((domesticVisitors / totalVisitors) * 100).toFixed(0)}%`
              : "0%"
          }
          color="text-indigo-600"
        />
        <StatCard
          label="International Visitors"
          value={
            totalVisitors > 0
              ? `${((internationalVisitors / totalVisitors) * 100).toFixed(0)}%`
              : "0%"
          }
          color="text-green-600"
        />
      </div>

      {/* ================= CHARTS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-6">

        {/* PIE */}
        <div className="bg-white rounded-3xl shadow-sm p-6">
          <h2 className="font-semibold text-lg mb-4">
            Visitor Type Distribution
          </h2>

          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={65}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* BAR (TIME BASED) */}
        <div className="bg-white rounded-3xl shadow-sm p-4 sm:p-6">
          <h2 className="font-semibold text-base sm:text-lg mb-3">
            Footfall Trend (Last 24 Hours)
          </h2>

          <div className="w-full h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ top: 10, right: 16, left: 0, bottom: 20 }}
              >
                <XAxis
                  dataKey="time"
                  interval="preserveStartEnd"
                  tickFormatter={(value) => value}
                  tick={{
                    fontSize: 11,
                    fill: "#6b7280",
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                />

                <Tooltip
                  labelFormatter={(label) => `Time: ${label}`}
                  formatter={(v) => [`${v.toLocaleString()}`, "Visitors"]}
                />

                <Bar
                  dataKey="visitors"
                  fill="#8b5cf6"
                  radius={[6, 6, 0, 0]}
                  barSize={14}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {loading && (
        <p className="text-center text-gray-500 pb-6">
          Loading analytics…
        </p>
      )}
    </div>
  );
};

/* ================= KPI CARD ================= */
const StatCard = ({ label, value, color = "text-gray-900" }) => (
  <div className="bg-white rounded-2xl shadow-sm p-6">
    <p className="text-sm text-gray-500">{label}</p>
    <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
  </div>
);

export default VisitorSegmentation;
