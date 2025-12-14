import { useEffect, useState } from "react";

/* ================= BASE ALERT RULES ================= */

const DEFAULT_RULES = {
  maxFootfall: 10000,
  hotelHighOccupancy: 90,
  hotelLowOccupancy: 35,
};

/* ================= ALERT GENERATOR ================= */

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

/* ================= COMPONENT ================= */

const AlertsManagement = () => {
  const [alerts, setAlerts] = useState(generateAlerts());
  const [rules, setRules] = useState(DEFAULT_RULES);

  /* 🔄 Auto refresh alerts */
  useEffect(() => {
    const interval = setInterval(() => {
      setAlerts(generateAlerts());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-10 pb-10">

      {/* ================= HEADER ================= */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 p-6 sm:p-8 text-white">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Alerts & Risk Monitoring
        </h1>
        <p className="mt-2 text-sm opacity-90">
          Real-time warnings for crowd control, hotel capacity & safety
        </p>
      </section>

      {/* ================= ALERT LIST ================= */}
      <section className="px-4 sm:px-6">
        <div className="bg-white p-4 sm:p-6 rounded-3xl shadow">
          <h2 className="font-bold text-lg mb-4">
            Live Active Alerts
          </h2>

          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <AlertCard key={index} alert={alert} />
            ))}
          </div>
        </div>
      </section>

      {/* ================= FOOTER / RULE CONFIG ================= */}
      <footer className="px-4 sm:px-6">
        <div className="bg-white p-4 sm:p-6 rounded-3xl shadow">
          <h2 className="font-bold text-lg mb-6">
            Alert Threshold Configuration
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <RuleInput
              label="Max Footfall per Tourist Spot"
              value={rules.maxFootfall}
              onChange={(v) =>
                setRules({ ...rules, maxFootfall: v })
              }
              unit="visitors"
            />

            <RuleInput
              label="High Hotel Occupancy Alert"
              value={rules.hotelHighOccupancy}
              onChange={(v) =>
                setRules({ ...rules, hotelHighOccupancy: v })
              }
              unit="%"
            />

            <RuleInput
              label="Low Hotel Occupancy Warning"
              value={rules.hotelLowOccupancy}
              onChange={(v) =>
                setRules({ ...rules, hotelLowOccupancy: v })
              }
              unit="%"
            />
          </div>

          {/* FOOTER ACTION */}
          <button className="mt-6 w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition">
            Save Alert Rules
          </button>
        </div>
      </footer>

    </div>
  );
};

/* ================= SUB COMPONENTS ================= */

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

const RuleInput = ({ label, value, onChange, unit }) => (
  <div>
    <label className="block text-sm font-semibold mb-2">
      {label}
    </label>
    <div className="flex items-center gap-2">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      <span className="text-sm font-semibold text-gray-500">
        {unit}
      </span>
    </div>
  </div>
);

export default AlertsManagement;
