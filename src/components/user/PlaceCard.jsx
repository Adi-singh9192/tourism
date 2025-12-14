const PlaceCard = ({ place }) => {
  const maxCrowd = 10000;
  const crowdPercent = Math.min(
    Math.round((place.crowdLevel / maxCrowd) * 100),
    100
  );

  // Determine color safely (Tailwind-compatible)
  let barColor = "bg-green-500";
  let textColor = "text-green-600";

  if (crowdPercent > 70) {
    barColor = "bg-red-500";
    textColor = "text-red-600";
  } else if (crowdPercent > 40) {
    barColor = "bg-yellow-500";
    textColor = "text-yellow-600";
  }

  return (
    <div className="card p-5 rounded-xl shadow-sm hover:shadow-md transition bg-white">
      {/* Title */}
      <h3 className="text-lg font-semibold">{place.name}</h3>
      <p className="text-sm text-gray-500">{place.city}</p>

      {/* Crowd Bar */}
      <div className="mt-4">
        <div className="flex justify-between text-sm mb-1">
          <span>Crowd Level</span>
          <span className={textColor}>
            {place.crowdLevel.toLocaleString()} people
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className={`h-2 rounded-full ${barColor}`}
            style={{ width: `${crowdPercent}%` }}
          />
        </div>
      </div>

      {/* Meta Info */}
      {place.lastUpdated && (
        <p className="mt-3 text-xs text-gray-400">
          Updated:{" "}
          {new Date(place.lastUpdated).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      )}

      {place.isLowCrowd && (
        <span className="inline-block mt-3 text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
          Low Crowd Recommended
        </span>
      )}
    </div>
  );
};

export default PlaceCard;
