import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Globe, Hotel, TrendingUp, AlertTriangle, MapPin } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');
  const [footfallData, setFootfallData] = useState([]);
  const [kpiData, setKpiData] = useState({
    totalFootfall: 45623,
    domestic: 34217,
    foreign: 11406,
    hotelOccupancy: 78.4
  });
  const [alerts] = useState([
    { id: 1, type: 'high', title: 'High Footfall Alert', desc: 'Amber Fort - 12,500 visitors (Capacity: 10,000)', icon: '⚠️' },
    { id: 2, type: 'high', title: 'Hotel Overbooked', desc: 'Jaipur City - 92% rooms occupied', icon: '🏨' },
    { id: 3, type: 'medium', title: 'Low Occupancy', desc: 'Udaipur Hotels - Only 31% occupancy', icon: '📉' },
    { id: 4, type: 'low', title: 'Normal Operations', desc: 'Jodhpur attractions within capacity', icon: '✅' }
  ]);

  const [hotelData] = useState([
    { id: 1, name: 'Taj Lake Palace', city: 'Udaipur', rooms: 83, occupied: 76, domestic: 45, foreign: 31, status: 'High' },
    { id: 2, name: 'Umaid Bhawan Palace', city: 'Jodhpur', rooms: 64, occupied: 42, domestic: 30, foreign: 12, status: 'Normal' },
    { id: 3, name: 'Rambagh Palace', city: 'Jaipur', rooms: 78, occupied: 71, domestic: 52, foreign: 19, status: 'High' },
    { id: 4, name: 'The Oberoi Udaivilas', city: 'Udaipur', rooms: 87, occupied: 68, domestic: 38, foreign: 30, status: 'Normal' },
    { id: 5, name: 'ITC Rajputana', city: 'Jaipur', rooms: 218, occupied: 195, domestic: 142, foreign: 53, status: 'High' }
  ]);

  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Generate dynamic footfall data
  useEffect(() => {
    const generateData = () => {
      if (selectedPeriod === 'daily') {
        return Array.from({ length: 24 }, (_, i) => ({
          name: `${i}:00`,
          visitors: Math.floor(Math.random() * 2000) + 1000
        }));
      } else if (selectedPeriod === 'weekly') {
        return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
          name: day,
          visitors: Math.floor(Math.random() * 8000) + 3000
        }));
      } else {
        return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(month => ({
          name: month,
          visitors: Math.floor(Math.random() * 50000) + 30000
        }));
      }
    };
    setFootfallData(generateData());
  }, [selectedPeriod]);

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setKpiData(prev => ({
        totalFootfall: prev.totalFootfall + Math.floor(Math.random() * 100) - 50,
        domestic: prev.domestic + Math.floor(Math.random() * 80) - 40,
        foreign: prev.foreign + Math.floor(Math.random() * 30) - 15,
        hotelOccupancy: Math.min(100, Math.max(0, prev.hotelOccupancy + (Math.random() * 2 - 1)))
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const visitorSegmentation = [
    { name: 'Domestic', value: kpiData.domestic, color: '#667eea' },
    { name: 'Foreign', value: kpiData.foreign, color: '#48bb78' }
  ];

  const cityWiseData = [
    { city: 'Jaipur', hotels: 156, capacity: 8420, occupied: 7250 },
    { city: 'Udaipur', hotels: 89, capacity: 4560, occupied: 2890 },
    { city: 'Jodhpur', hotels: 67, capacity: 3120, occupied: 2340 },
    { city: 'Jaisalmer', hotels: 45, capacity: 1890, occupied: 1560 }
  ];

  const topAttractions = [
    { name: 'Amber Fort', visitors: 12500, trend: 'up', capacity: 10000 },
    { name: 'Hawa Mahal', visitors: 8900, trend: 'up', capacity: 12000 },
    { name: 'City Palace', visitors: 7600, trend: 'down', capacity: 15000 },
    { name: 'Jantar Mantar', visitors: 5400, trend: 'up', capacity: 8000 }
  ];

  const KPICard = ({ title, value, change, icon: Icon, color, iconBg }) => (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{title}</p>
          <h3 className="text-4xl font-bold text-gray-800 mt-2">{typeof value === 'number' && title.includes('%') ? value.toFixed(1) + '%' : value.toLocaleString()}</h3>
        </div>
        <div className={`${iconBg} p-3 rounded-xl`}>
          <Icon className={color} size={28} />
        </div>
      </div>
      <div className={`text-sm font-semibold ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        {change >= 0 ? '↑' : '↓'} {Math.abs(change).toFixed(1)}% from yesterday
      </div>
    </div>
  );

  const AlertItem = ({ alert }) => {
    const bgColors = {
      high: 'bg-red-50 border-red-500',
      medium: 'bg-orange-50 border-orange-500',
      low: 'bg-green-50 border-green-500'
    };
    return (
      <div className={`${bgColors[alert.type]} border-l-4 rounded-lg p-4 mb-3 hover:shadow-md transition-all duration-300 hover:translate-x-1 cursor-pointer`}>
        <div className="font-bold text-gray-800 flex items-center gap-2">
          <span>{alert.icon}</span>
          {alert.title}
        </div>
        <div className="text-sm text-gray-600 mt-1">{alert.desc}</div>
      </div>
    );
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Total Footfall Today" value={kpiData.totalFootfall} change={12.5} icon={Users} color="text-blue-600" iconBg="bg-blue-100" />
        <KPICard title="Domestic Visitors" value={kpiData.domestic} change={8.3} icon={Users} color="text-green-600" iconBg="bg-green-100" />
        <KPICard title="Foreign Visitors" value={kpiData.foreign} change={18.7} icon={Globe} color="text-purple-600" iconBg="bg-purple-100" />
        <KPICard title="Hotel Occupancy" value={kpiData.hotelOccupancy} change={-3.2} icon={Hotel} color="text-orange-600" iconBg="bg-orange-100" />
      </div>

      {/* Footfall Trend */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <TrendingUp className="text-blue-600" />
            Footfall Trend
          </h2>
          <div className="flex gap-2">
            {['daily', 'weekly', 'monthly'].map(period => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  selectedPeriod === period
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={footfallData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="name" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }} />
            <Bar dataKey="visitors" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#667eea" />
                <stop offset="100%" stopColor="#764ba2" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Heatmap and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin className="text-red-600" />
            Real-Time Heat Map - Rajasthan
          </h2>
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl h-96 flex items-center justify-center relative overflow-hidden">
            <div className="text-center text-gray-600">
              <div className="text-6xl mb-4">🗾</div>
              <div className="font-bold text-xl">Rajasthan Tourism Map</div>
              <div className="text-sm mt-2">Live visitor density monitoring</div>
            </div>
            <div className="absolute top-1/3 left-1/2 w-6 h-6 bg-red-500 rounded-full animate-ping"></div>
            <div className="absolute top-1/2 left-1/3 w-5 h-5 bg-orange-500 rounded-full animate-pulse"></div>
            <div className="absolute top-2/3 left-3/5 w-5 h-5 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <div className="flex gap-6 justify-center mt-4 text-sm font-semibold">
            <span className="flex items-center gap-2"><span className="w-3 h-3 bg-red-500 rounded-full"></span> High Density</span>
            <span className="flex items-center gap-2"><span className="w-3 h-3 bg-orange-500 rounded-full"></span> Medium</span>
            <span className="flex items-center gap-2"><span className="w-3 h-3 bg-green-500 rounded-full"></span> Low</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="text-red-600" />
            Active Alerts
          </h2>
          <div className="space-y-3">
            {alerts.map(alert => <AlertItem key={alert.id} alert={alert} />)}
          </div>
        </div>
      </div>
    </div>
  );

  const renderFootfallAnalytics = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Footfall Analytics</h2>
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-600 mb-2">Select Location</label>
            <select 
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:outline-none"
            >
              <option value="all">All Locations</option>
              <option value="jaipur">Jaipur</option>
              <option value="udaipur">Udaipur</option>
              <option value="jodhpur">Jodhpur</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-600 mb-2">Select Date</label>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:outline-none"
            />
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={footfallData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="visitors" stroke="#667eea" strokeWidth={3} dot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Top Crowded Attractions Today</h3>
        <div className="space-y-3">
          {topAttractions.map((attraction, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold text-purple-600">#{idx + 1}</div>
                <div>
                  <div className="font-bold text-gray-800">{attraction.name}</div>
                  <div className="text-sm text-gray-600">{attraction.visitors.toLocaleString()} visitors</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  attraction.visitors > attraction.capacity ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                }`}>
                  {((attraction.visitors / attraction.capacity) * 100).toFixed(0)}%
                </span>
                <span className={attraction.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                  {attraction.trend === 'up' ? '↑' : '↓'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderVisitorSegmentation = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Visitor Segmentation</h2>
        <div className="flex items-center justify-center gap-12">
          <ResponsiveContainer width="50%" height={300}>
            <PieChart>
              <Pie
                data={visitorSegmentation}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={5}
                dataKey="value"
              >
                {visitorSegmentation.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-4">
            {visitorSegmentation.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: item.color }}></div>
                <div>
                  <div className="font-bold text-gray-800 text-lg">{item.name}</div>
                  <div className="text-gray-600">{item.value.toLocaleString()} visitors ({((item.value / kpiData.totalFootfall) * 100).toFixed(0)}%)</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Top Nationalities (Foreign Visitors)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { country: 'USA', flag: '🇺🇸', count: 3240 },
            { country: 'UK', flag: '🇬🇧', count: 2180 },
            { country: 'Germany', flag: '🇩🇪', count: 1890 },
            { country: 'France', flag: '🇫🇷', count: 1650 }
          ].map((item, idx) => (
            <div key={idx} className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-xl text-center hover:shadow-md transition-all">
              <div className="text-4xl mb-2">{item.flag}</div>
              <div className="font-bold text-gray-800">{item.country}</div>
              <div className="text-sm text-gray-600">{item.count.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderHotelCapacity = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg">
          <div className="text-4xl mb-2">🏨</div>
          <div className="text-3xl font-bold">{hotelData.length}</div>
          <div className="text-sm opacity-90">Total Hotels</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg">
          <div className="text-4xl mb-2">🛏️</div>
          <div className="text-3xl font-bold">{hotelData.reduce((a, b) => a + b.rooms, 0)}</div>
          <div className="text-sm opacity-90">Total Rooms</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-6 shadow-lg">
          <div className="text-4xl mb-2">✅</div>
          <div className="text-3xl font-bold">{hotelData.reduce((a, b) => a + b.occupied, 0)}</div>
          <div className="text-sm opacity-90">Occupied Rooms</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-lg">
          <div className="text-4xl mb-2">📊</div>
          <div className="text-3xl font-bold">
            {((hotelData.reduce((a, b) => a + b.occupied, 0) / hotelData.reduce((a, b) => a + b.rooms, 0)) * 100).toFixed(1)}%
          </div>
          <div className="text-sm opacity-90">Avg Occupancy</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4">City-wise Hotel Capacity</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={cityWiseData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="city" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="capacity" fill="#667eea" name="Total Capacity" />
            <Bar dataKey="occupied" fill="#48bb78" name="Occupied" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg overflow-x-auto">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Hotel Details</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 px-4 font-bold text-gray-700">Hotel Name</th>
              <th className="text-left py-3 px-4 font-bold text-gray-700">City</th>
              <th className="text-center py-3 px-4 font-bold text-gray-700">Rooms</th>
              <th className="text-center py-3 px-4 font-bold text-gray-700">Occupied</th>
              <th className="text-center py-3 px-4 font-bold text-gray-700">Domestic</th>
              <th className="text-center py-3 px-4 font-bold text-gray-700">Foreign</th>
              <th className="text-center py-3 px-4 font-bold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {hotelData.map(hotel => (
              <tr key={hotel.id} className="border-b border-gray-100 hover:bg-gray-50 transition-all">
                <td className="py-4 px-4 font-semibold text-gray-800">{hotel.name}</td>
                <td className="py-4 px-4 text-gray-600">{hotel.city}</td>
                <td className="py-4 px-4 text-center text-gray-600">{hotel.rooms}</td>
                <td className="py-4 px-4 text-center text-gray-600">{hotel.occupied}</td>
                <td className="py-4 px-4 text-center text-gray-600">{hotel.domestic}</td>
                <td className="py-4 px-4 text-center text-gray-600">{hotel.foreign}</td>
                <td className="py-4 px-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    hotel.status === 'High' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                  }`}>
                    {hotel.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAlerts = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Configure Alert Thresholds</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">High Footfall Threshold</label>
            <input type="number" defaultValue="10000" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">Hotel Occupancy Alert (%)</label>
            <input type="number" defaultValue="90" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:outline-none" />
          </div>
        </div>
        <button className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:shadow-lg transition-all">
          Save Alert Rules
        </button>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4">All Active Alerts</h3>
        <div className="space-y-3">
          {alerts.map(alert => <AlertItem key={alert.id} alert={alert} />)}
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'dashboard', name: '🏠 Dashboard' },
    { id: 'footfall', name: '📊 Footfall Analytics' },
    { id: 'segmentation', name: '👥 Visitor Segmentation' },
    { id: 'hotels', name: '🏨 Hotel Capacity' },
    { id: 'alerts', name: '🚨 Alerts' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-purple-700 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 shadow-xl mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                🏛️ Tourism Intelligence Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Real-time monitoring of Rajasthan tourism • Last updated: Live</p>
            </div>
            <div className="flex items-center gap-3 bg-green-100 px-4 py-2 rounded-xl">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-semibold text-green-700">Live Data</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-white text-purple-600 shadow-xl scale-105'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'footfall' && renderFootfallAnalytics()}
        {activeTab === 'segmentation' && renderVisitorSegmentation()}
        {activeTab === 'hotels' && renderHotelCapacity()}
        {activeTab === 'alerts' && renderAlerts()}
      </div>
    </div>
  );
}

export default App;