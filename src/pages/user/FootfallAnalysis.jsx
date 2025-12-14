import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid, } from "recharts";
import { FaUsers, FaClock, FaSnowflake } from "react-icons/fa";
import axios from "axios";
import Skeleton from "../../components/ui/Skeleton";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  timeout: 10000,
});

/* ================= FORMATTERS ================= */
const formatCrowd = (value) =>
  value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value;

const FootfallAnalysis = () => {
  const [hourlyData, setHourlyData] = useState([]);
  const [placeCrowd, setPlaceCrowd] = useState([]);
  const [insights, setInsights] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchAll = async () => {
      try {
        const [hourly, summary, visit] = await Promise.all([
          api.get("/dashboard/hourly-crowd"),
          api.get("/dashboard/crowd-summary"),
          api.get("/dashboard/best-visit-insights"),
        ]);

        if (!mounted) return;

        if (hourly.data.success) {
          setHourlyData(
            hourly.data.data.map((d) => ({
              time: `${String(d.hour).padStart(2, "0")}:00`,
              crowd: d.crowd,
            }))
          );
        }

        if (summary.data.success) {
          setPlaceCrowd(summary.data.data);
        }

        if (visit.data.success) {
          setInsights(visit.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAll();
    return () => (mounted = false);
  }, []);

  return (
    <div className="space-y-10">

      {/* ================= HEADER ================= */}
      <section className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-6 sm:p-10 text-white">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Crowd Insights & Visit Planner
        </h1>

        <p className="mt-1 text-sm opacity-80">
          Real-time telecom-powered crowd analytics for smarter travel
        </p>
      </section>

      {/* ⭐ TRAVEL TIP AT TOP */}
      {!loading && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 text-sm sm:text-base">
          🌞 <strong>Travel Tip:</strong> {insights.recommendation}
        </div>
      )}

      {/* ================= OVERVIEW CARDS ================= */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {loading
          ? [...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))
          : (
            <>
              <OverviewCard
                icon={<FaUsers />}
                title="Crowd Status"
                value={
                  placeCrowd[0]?.crowd >= 25000
                    ? "Critical"
                    : placeCrowd[0]?.crowd >= 15000
                      ? "High"
                      : "Moderate"
                }
              />
              <OverviewCard
                icon={<FaClock />}
                title="Best Visit Time"
                value={insights.bestTime}
              />
              <OverviewCard
                icon={<FaSnowflake />}
                title="Best Season"
                value={insights.bestSeason}
              />
            </>
          )}
      </section>

      {/* ================= CHARTS ================= */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* ===== LINE CHART ===== */}
        <ChartCard title="Crowd Trend Throughout the Day">
          {loading ? (
            <Skeleton className="h-[280px]" />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis tickFormatter={formatCrowd} />
                <Tooltip
                  formatter={(value) => formatCrowd(value)}
                  labelFormatter={(label) => `Time: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="crowd"
                  stroke="#16a34a"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* ===== BAR CHART ===== */}
        <ChartCard title="Most Crowded Places">
          {loading ? (
            <Skeleton className="h-[280px]" />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={placeCrowd}
                margin={{
                  top: 20,
                  right: 20,
                  left: 10,
                  bottom: 40, // 👈 this adds space for rotated labels
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="place"
                  tick={{ fontSize: 11 }}
                  angle={-15}
                  textAnchor="end"
                  interval={0}
                />

                <YAxis tickFormatter={formatCrowd} />

                <Tooltip formatter={(v) => formatCrowd(v)} />

                <Bar
                  dataKey="crowd"
                  fill="#fb923c"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </section>
    </div>
  );
};

/* ================= UI COMPONENTS ================= */

const OverviewCard = ({ icon, title, value }) => (
  <div className="bg-white border rounded-xl p-4 flex items-center gap-4">
    <div className="text-2xl text-primary-600">{icon}</div>
    <div>
      <p className="text-xs text-gray-500">{title}</p>
      <p className="text-lg sm:text-xl font-bold">{value}</p>
    </div>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-white border rounded-xl p-6 space-y-7">
    <h1 className="text-2xl sm:text-3xl font-bold">{title}</h1>
    {children}
  </div>
);

export default FootfallAnalysis;
