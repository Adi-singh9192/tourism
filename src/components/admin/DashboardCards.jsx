const DashboardCards = ({ stats = [] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {stats.map((item, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
        >
          <h3 className="text-sm text-gray-500">{item.title}</h3>
          <p className="text-2xl font-bold mt-2">{item.value}</p>
          <p className="text-sm text-green-600 mt-1">{item.change}</p>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
