import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, } from "recharts";
import { FaUsers, FaGlobe, FaHotel, FaBell, FaChartLine, FaMapMarkerAlt, } from "react-icons/fa";
import { MapContainer, TileLayer, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";

/* ---------------- HELPERS ---------------- */
const random = (min, max) => Math.floor(min + Math.random() * (max - min));

const rajasthanBounds = [
  [23.3, 69.5],
  [30.2, 78.3],
];

const generateDaily = () =>
  Array.from({ length: 24 }, (_, i) => ({
    label: `${i}:00`,
    visitors: random(900, 3000),
  }));

const generateWeekly = () =>
  ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => ({
    label: d,
    visitors: random(4000, 11000),
  }));

const generateMonthly = () =>
  ["Week 1", "Week 2", "Week 3", "Week 4"].map((w) => ({
    label: w,
    visitors: random(35000, 60000),
  }));

const EMPTY_STATS = {
  totalFootfall: 0,
  domesticVisitors: 0,
  internationalVisitors: 0,
  hotelOccupancy: 0,
};

/* ---------------- ALERT GENERATOR ---------------- */
const generateAlerts = () => {
  const alerts = [];

  if (Math.random() > 0.4) {
    alerts.push({
      type: "Critical",
      title: "High Footfall Alert",
      description: "Amber Fort – 12,500 visitors (Capacity: 10,000)",
      location: "Jaipur",
    });
  }

  if (Math.random() > 0.5) {
    alerts.push({
      type: "High",
      title: "Hotel Overbooking",
      description: "Jaipur City – 92% rooms occupied",
      location: "Jaipur",
    });
  }

  if (Math.random() > 0.6) {
    alerts.push({
      type: "Medium",
      title: "Low Occupancy Warning",
      description: "Udaipur Hotels – 31% occupancy",
      location: "Udaipur",
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      type: "Normal",
      title: "All Systems Normal",
      description: "No abnormal crowd or hotel load detected",
      location: "Statewide",
    });
  }

  return alerts;
};


/* ---------------- COMPONENT ---------------- */
const AdminDashboard = () => {
  const [stats, setStats] = useState(EMPTY_STATS);
  const [mode, setMode] = useState("daily");
  const [footfall, setFootfall] = useState(generateDaily());
  const [loading, setLoading] = useState(false);

  const [alerts, setAlerts] = useState(generateAlerts());

  useEffect(() => {
    const interval = setInterval(() => {
      setAlerts(generateAlerts());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const refresh = () => {
      if (mode === "daily") setFootfall(generateDaily());
      if (mode === "weekly") setFootfall(generateWeekly());
      if (mode === "monthly") setFootfall(generateMonthly());
    };
    refresh();
    const interval = setInterval(refresh, 30000);
    return () => clearInterval(interval);
  }, [mode]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/dashboard/stats`
      );
      const json = await res.json();

      if (json.success && json.stats) {
        setStats({
          totalFootfall: json.stats.totalFootfall ?? 0,
          domesticVisitors: json.stats.domesticVisitors ?? 0,
          internationalVisitors: json.stats.internationalVisitors ?? 0,
          hotelOccupancy: json.stats.hotelOccupancy ?? 0,
        });
      }
    } catch {
      setStats(EMPTY_STATS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const kpiCards = [
    {
      title: "Total Footfall (24h)",
      value: stats.totalFootfall.toLocaleString(),
      icon: <FaUsers />,
    },
    {
      title: "Domestic Visitors",
      value: stats.domesticVisitors.toLocaleString(),
      icon: <FaUsers />,
    },
    {
      title: "Foreign Visitors",
      value: stats.internationalVisitors.toLocaleString(),
      icon: <FaGlobe />,
    },
    {
      title: "Hotel Occupancy",
      value: `${stats.hotelOccupancy}%`,
      icon: <FaHotel />,
    },
  ];

  return (
    <div className="space-y-10 pb-10">

      {/* HEADER */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 p-6 sm:p-8 text-white">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Tourism Intelligence Dashboard
        </h1>
        <p className="mt-1 text-sm opacity-80">
          Live monitoring & analytics – Rajasthan
        </p>
      </section>

      {/* KPI CARDS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 px-4 sm:px-6">
        {kpiCards.map((s, i) => (
          <div
            key={i}
            className=" 
        group bg-white rounded-2xl p-6 
        border border-gray-100 
        shadow-sm hover:shadow-lg 
        transition-all duration-300 
        hover:-translate-y-1 
      "
          >
            {/* HEADER */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {s.title}
                </p>
                <p className="mt-1 text-3xl font-bold text-gray-900 tracking-tight">
                  {loading ? "—" : s.value}
                </p>
              </div>

              {/* ICON */}
              <div
                className="
            w-12 h-12 rounded-xl
            bg-gradient-to-br from-indigo-500 to-purple-500
            text-white text-xl
            flex items-center justify-center
            group-hover:scale-105
            transition
          "
              >
                {s.icon}
              </div>
            </div>

            {/* SUBTLE DIVIDER */}
            <div className="mt-4 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
          </div>
        ))}
      </section>


      {/* FOOTFALL CHART */}
      <section className="bg-white rounded-3xl p-4 sm:p-6 mx-4 sm:mx-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 className="font-semibold flex items-center gap-2 text-base sm:text-lg">
            <FaChartLine className="text-indigo-600" />
            Footfall Trend
          </h2>

          {/* TOGGLE */}
          <div className="flex w-full sm:w-auto justify-between sm:justify-start gap-1 bg-gray-100 p-1 rounded-xl">
            {["daily", "weekly", "monthly"].map((t) => (
              <button
                key={t}
                onClick={() => setMode(t)}
                className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-sm font-medium transition
            ${mode === t
                    ? "bg-white shadow text-indigo-600"
                    : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* CHART */}
        <div className="h-[240px] sm:h-[280px] w-full overflow-x-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={footfall}
              margin={{ top: 10, right: 10, left: 0, bottom: 40 }}
            >
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11 }}
                interval={window.innerWidth < 640 ? 2 : "preserveStartEnd"}
                angle={window.innerWidth < 640 ? -45 : 0}
                textAnchor={window.innerWidth < 640 ? "end" : "middle"}
                height={50}
              />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar
                dataKey="visitors"
                fill="#6366f1"
                radius={[8, 8, 0, 0]}
                barSize={window.innerWidth < 640 ? 10 : 18}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </section>


      {/* MAP + ALERTS */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 relative z-0 p-6">
        <div className="xl:col-span-2 bg-white rounded-3xl shadow-sm">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
            <FaMapMarkerAlt className="text-red-500" />
            Crowd Heatmap - Rajasthan
          </h2>
          <MapContainer
            bounds={rajasthanBounds}
            maxBounds={rajasthanBounds}
            scrollWheelZoom={false}
            doubleClickZoom={false}
            maxBoundsViscosity={1.0}
            zoomControl={false}
            className="h-[280px] sm:h-[320px] rounded-xl overflow-hidden z-0 border"
          >
            <TileLayer
              attribution="© OpenStreetMap"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Jaipur */}
            <Circle
              center={[26.9124, 75.7873]}
              radius={12000}
              pathOptions={{ color: 'red', fillOpacity: 0.4 }}
            />

            {/* Udaipur */}
            <Circle
              center={[24.5854, 73.7125]}
              radius={9000}
              pathOptions={{ color: 'orange', fillOpacity: 0.4 }}
            />

            {/* Jodhpur */}
            <Circle
              center={[26.2389, 73.0243]}
              radius={7000}
              pathOptions={{ color: 'green', fillOpacity: 0.4 }}
            />
          </MapContainer>

        </div>

        <div className="bg-white rounded-3xl shadow-sm">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-3 text-red-600">
            <FaBell />
            Alerts
          </h2>

          <div className="mt-4 space-y-3">
            {alerts.map((alert, index) => (
              <AlertCard key={index} alert={alert} />
            ))}
          </div>

        </div>
      </section>

    </div>
  );
};



const AlertCard = ({ alert }) => {
  const colorMap = {
    Critical: "border-red-500 bg-red-50 text-red-700",
    High: "border-orange-500 bg-orange-50 text-orange-700",
    Medium: "border-yellow-500 bg-yellow-50 text-yellow-700",
    Normal: "border-green-500 bg-green-50 text-green-700",
  };

  return (
    <div
      className={`border-l-4 p-4 rounded-xl ${colorMap[alert.type]}`}
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <p className="font-bold">{alert.title}</p>
          <p className="text-sm mt-1">
            {alert.description}
          </p>
          <p className="text-xs mt-1 opacity-80">
            Location: {alert.location}
          </p>
        </div>

        <span className="self-start sm:self-auto text-xs font-bold px-3 py-1 rounded-full bg-white shadow">
          {alert.type}
        </span>
      </div>
    </div>
  );
};



export default AdminDashboard;