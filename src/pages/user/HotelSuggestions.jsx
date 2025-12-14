import { useEffect, useState } from "react";
import {
  FaStar,
  FaMapMarkerAlt,
  FaFire,
  FaSearch,
  FaFilter,
} from "react-icons/fa";

const LIMIT = 20;

/* ================= UNSPLASH IMAGES ================= */
const HOTEL_IMAGES = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945",
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1687960116497-0dc41e1808a2?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
  "https://images.unsplash.com/photo-1590490360182-c33d57733427",
  "https://images.unsplash.com/photo-1540541338287-41700207dee6",
  "https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1657349226767-66c983d7df39?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1621293954908-907159247fc8?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1552873547-b88e7b2760e2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1668169064092-04dc2c657d85?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1716061812155-d05b6459d3b3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
];


const getHotelImage = (index) =>
  HOTEL_IMAGES[index % HOTEL_IMAGES.length];

const HotelSuggestions = () => {
  const [search, setSearch] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const [hotels, setHotels] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const [userLocation, setUserLocation] = useState({
    state: "",
    district: "",
  });

  /* ================= LOAD USER LOCATION ================= */
  useEffect(() => {
    const saved = localStorage.getItem("userLocation");
    if (saved) {
      setUserLocation(JSON.parse(saved));
    }
  }, []);

  /* ================= FETCH HOTELS ================= */
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);

        const effectiveCity =
          search.trim() || userLocation.district || "";

        const params = new URLSearchParams({
          page,
          limit: LIMIT,
          ...(effectiveCity && { city: effectiveCity }),
          ...(minRating && { minRating }),
        });

        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/hotel/list?${params.toString()}`
        );

        const data = await res.json();

        if (data.success) {
          setHotels((prev) =>
            page === 1 ? data.data : [...prev, ...data.data]
          );
          setHasMore(data.data.length === LIMIT);
        }
      } catch (err) {
        console.error("Hotel fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [search, minRating, page, userLocation]);

  /* ================= CLIENT FILTER ================= */
  const filteredHotels = hotels.filter((hotel) => {
    const vacancyPercent = (hotel.vacancy / hotel.totalRooms) * 100;

    if (onlyAvailable && vacancyPercent < 20) return false;

    return (
      hotel.City.toLowerCase().includes(search.toLowerCase()) ||
      hotel.nearbyPlaces?.some((p) =>
        p.toLowerCase().includes(search.toLowerCase())
      )
    );
  });

  return (
    <div className="space-y-8 fade-in">

      {/* ================= HEADER ================= */}
      <section className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-6 sm:p-10 text-white">
        <h1 className="text-2xl sm:text-4xl font-bold">
          Hotel Recommendations
        </h1>
        <p className="mt-2 text-primary-100">
          Find the best hotels near tourist attractions with live availability.
        </p>
      </section>

      {/* ================= FILTER BAR ================= */}
      <div className="flex flex-col sm:flex-row gap-4 items-center p-6">

        {/* SEARCH */}
        <div className="relative w-full sm:max-w-md">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search city or nearby place"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="w-full pl-11 pr-4 py-3 rounded-full border shadow-sm"
          />
        </div>

        <div className="flex justify-between sm:justify-start items-center gap-4 w-full sm:max-w-md">
          {/* RATING FILTER */}
          <select
            value={minRating}
            onChange={(e) => {
              setPage(1);
              setMinRating(Number(e.target.value));
            }}
            className="border rounded-full px-4 py-2"
          >
            <option value={0}>All Ratings</option>
            <option value={4}>4★ & above</option>
            <option value={4.5}>4.5★ & above</option>
          </select>

          {/* AVAILABILITY */}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={() => setOnlyAvailable(!onlyAvailable)}
            />
            Only Available
          </label>
        </div>
      </div>

      {/* ================= GRID ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">

        {filteredHotels.map((hotel, index) => {
          const vacancyPercent = Math.round(
            (hotel.vacancy / hotel.totalRooms) * 100
          );

          return (
            <div
              key={hotel._id}
              className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden flex flex-col"
            >
              {/* IMAGE */}
              <div className="relative h-44">
                <img
                  src={getHotelImage(index)}
                  alt={hotel.Name}
                  className="w-full h-full object-cover"
                />

                {vacancyPercent < 20 && (
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                    <FaFire /> Filling Fast
                  </span>
                )}

                <span className="absolute bottom-3 right-3 bg-white px-2 py-1 rounded-lg text-sm flex items-center gap-1">
                  <FaStar className="text-yellow-400" />
                  {hotel.Rating}
                </span>
              </div>

              {/* CONTENT */}
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-lg">
                  {hotel.Name}
                </h3>

                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <FaMapMarkerAlt /> {hotel.City}
                </p>

                <p className="text-xs text-gray-600 mt-1">
                  Near: {hotel.nearbyPlaces?.slice(0, 2).join(", ")}
                </p>

                {/* AVAILABILITY BAR */}
                <div className="mt-3">
                  <p className="text-xs mb-1">
                    Availability: {vacancyPercent}%
                  </p>
                  <div className="w-full bg-gray-200 h-2 rounded-full">
                    <div
                      className={`h-2 rounded-full ${vacancyPercent < 20
                        ? "bg-red-500"
                        : vacancyPercent < 50
                          ? "bg-yellow-400"
                          : "bg-green-500"
                        }`}
                      style={{ width: `${vacancyPercent}%` }}
                    />
                  </div>
                </div>

                {/* CTA */}
                <button className="btn btn-primary w-full mt-5">
                  Book Now
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= PAGINATION ================= */}
      {hasMore && !loading && (
        <div className="flex justify-center">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-6 py-2 rounded-full border font-medium hover:bg-gray-50"
          >
            Load More Hotels
          </button>
        </div>
      )}

      {loading && (
        <p className="text-center text-gray-500">
          Loading hotels...
        </p>
      )}

      {!loading && filteredHotels.length === 0 && (
        <p className="text-center text-gray-500">
          No hotels found.
        </p>
      )}
    </div>
  );
};

export default HotelSuggestions;