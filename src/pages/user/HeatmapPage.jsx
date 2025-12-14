import { FaMapMarkerAlt, FaBell } from "react-icons/fa";
import HeatmapCanvas from "../../components/user/HeatmapCanvas";

const HeatmapPage = () => {
  return (
    <section className="grid grid-cols-1 gap-6 fade-in">

      {/* ================= MAP SECTION ================= */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-6 sm:p-10 text-white">
        <h1 className="text-2xl sm:text-4xl font-bold">
          Crowd Heatmap – Rajasthan
        </h1>

        <p className="mt-2 text-primary-100">
          Real-time tourist density visualization based on telecom data.
        </p>
      </div>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        <div className="p-4 sm:p-6">
          <HeatmapCanvas />
        </div>

        {/* ================= LEGEND & ALERTS ================= */}
        <div className="bg-white rounded-3xl shadow-sm p-4 sm:p-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 text-red-600">
            <FaBell />
            Crowd Levels
          </h2>

          {/* Legend */}
          <div className="space-y-3 text-sm">
            <LegendItem color="bg-green-400" label="Low Crowd" />
            <LegendItem color="bg-yellow-400" label="Medium Crowd" />
            <LegendItem color="bg-red-500" label="High Crowd" />
          </div>

          <div className="mt-6 text-xs text-gray-500 leading-5">
            🔴 Red zones indicate congestion hotspots. <br />
            🟢 Green zones are safer for visits.
          </div>
        </div>
      </section>
    </section>
  );
};

const LegendItem = ({ color, label }) => (
  <div className="flex items-center gap-3">
    <span className={`w-4 h-4 rounded-full ${color}`} />
    <span>{label}</span>
  </div>
);

export default HeatmapPage;
