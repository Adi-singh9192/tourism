import { useState } from "react";
import InternationalPage from "./InternationalPage";
import DomesticPage from "./DomesticPage";
import { FaGlobeAsia, FaMapMarkedAlt } from "react-icons/fa";

export default function SelectType() {
  const [touristType, setTouristType] = useState(
    localStorage.getItem("touristType") || null
  );

  const handleSelect = (type) => {
    localStorage.setItem("touristType", type);
    setTouristType(type);
  };

  if (touristType === "domestic") {
    return <DomesticPage onBack={() => setTouristType(null)} />;
  }

  if (touristType === "international") {
    return <InternationalPage onBack={() => setTouristType(null)} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 px-4">

      <div className="w-full max-w-lg bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200 p-8 sm:p-10 space-y-8">

        {/* HEADER */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Welcome to Rajasthan Tourism
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Select your tourist category to continue
          </p>
        </div>

        {/* OPTIONS */}
        <div className="grid gap-4">

          {/* DOMESTIC */}
          <button
            onClick={() => handleSelect("domestic")}
            className="
              group flex items-center gap-4 p-5 rounded-2xl
              border border-gray-200 bg-white
              hover:border-primary-500 hover:bg-primary-50
              transition-all duration-200
            "
          >
            <div className="w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center text-primary-700 text-2xl group-hover:scale-110 transition">
              <FaMapMarkedAlt />
            </div>

            <div className="text-left">
              <p className="text-lg font-semibold text-gray-900">
                🇮🇳 Domestic Tourist
              </p>
              <p className="text-sm text-gray-600">
                Indian residents exploring Rajasthan
              </p>
            </div>
          </button>

          {/* INTERNATIONAL */}
          <button
            onClick={() => handleSelect("international")}
            className="
              group flex items-center gap-4 p-5 rounded-2xl
              border border-gray-200 bg-white
              hover:border-indigo-500 hover:bg-indigo-50
              transition-all duration-200
            "
          >
            <div className="w-14 h-14 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 text-2xl group-hover:scale-110 transition">
              <FaGlobeAsia />
            </div>

            <div className="text-left">
              <p className="text-lg font-semibold text-gray-900">
                🌍 International Tourist
              </p>
              <p className="text-sm text-gray-600">
                Foreign visitors & global travelers
              </p>
            </div>
          </button>

        </div>

        {/* FOOTER */}
        <p className="text-xs text-center text-gray-500">
          You can change this later from settings
        </p>
      </div>
    </div>
  );
}
