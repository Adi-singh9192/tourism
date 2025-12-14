// src/data/mockData.js
export const touristPlaces = [
  {
    id: 1,
    name: "Amber Fort",
    city: "Jaipur",
    currentCrowd: "High",
    crowdLevel: 85,
    color: "red",
    hourlyTrend: [65, 70, 75, 80, 85, 90, 88, 85, 82, 78, 72, 68],
    bestTime: "8:00 AM - 10:00 AM",
    alternatives: ["Nahargarh Fort", "Jaigarh Fort"],
    description: "Historic fort with palace complex"
  },
  {
    id: 2,
    name: "Nahargarh Fort",
    city: "Jaipur",
    currentCrowd: "Medium",
    crowdLevel: 45,
    color: "yellow",
    hourlyTrend: [30, 35, 40, 45, 50, 55, 60, 58, 52, 48, 42, 38],
    bestTime: "Any time",
    alternatives: ["Jal Mahal", "City Palace"],
    description: "Hilltop fort with panoramic views"
  },
  {
    id: 3,
    name: "Mehrangarh Fort",
    city: "Jodhpur",
    currentCrowd: "High",
    crowdLevel: 78,
    color: "red",
    hourlyTrend: [60, 65, 70, 75, 78, 82, 80, 78, 75, 70, 65, 60],
    bestTime: "Early Morning",
    alternatives: ["Jaswant Thada", "Umaid Bhawan"],
    description: "One of the largest forts in India"
  },
  {
    id: 4,
    name: "Lake Palace",
    city: "Udaipur",
    currentCrowd: "Normal",
    crowdLevel: 60,
    color: "yellow",
    hourlyTrend: [40, 45, 50, 55, 60, 65, 70, 68, 62, 58, 52, 48],
    bestTime: "Evening",
    alternatives: ["City Palace", "Saheliyon Ki Bari"],
    description: "White marble palace in Lake Pichola"
  },
  {
    id: 5,
    name: "Ranthambore National Park",
    city: "Sawai Madhopur",
    currentCrowd: "Low",
    crowdLevel: 30,
    color: "green",
    hourlyTrend: [25, 28, 30, 32, 35, 40, 45, 42, 38, 35, 32, 28],
    bestTime: "Morning Safari",
    alternatives: ["Sariska Tiger Reserve"],
    description: "Famous tiger reserve"
  }
];

export const hotels = [
  {
    id: 1,
    name: "RTDC Hotel Raj Vilas",
    city: "Jaipur",
    price: 3500,
    vacancy: "Low",
    vacancyLevel: 15,
    facilities: ["WiFi", "Restaurant", "Parking"],
    type: "RTDC",
    rating: 4.2
  },
  {
    id: 2,
    name: "Umaid Bhawan Palace",
    city: "Jodhpur",
    price: 25000,
    vacancy: "Medium",
    vacancyLevel: 45,
    facilities: ["Pool", "Spa", "Fine Dining", "WiFi"],
    type: "Private",
    rating: 4.8
  },
  {
    id: 3,
    name: "RTDC Hotel Lake View",
    city: "Udaipur",
    price: 2800,
    vacancy: "High",
    vacancyLevel: 70,
    facilities: ["WiFi", "Restaurant"],
    type: "RTDC",
    rating: 4.0
  },
  {
    id: 4,
    name: "The Oberoi Rajvilas",
    city: "Jaipur",
    price: 18000,
    vacancy: "Low",
    vacancyLevel: 20,
    facilities: ["Pool", "Spa", "Golf", "Fine Dining"],
    type: "Private",
    rating: 4.7
  }
];

export const adminDashboardData = {
  totalTourists: 12500,
  domestic: 8900,
  international: 3600,
  topCities: [
    { name: "Jaipur", tourists: 4500 },
    { name: "Jodhpur", tourists: 2800 },
    { name: "Udaipur", tourists: 3200 },
    { name: "Pushkar", tourists: 1500 },
    { name: "Bikaner", tourists: 1200 }
  ],
  alerts: [
    { id: 1, type: "crowd", message: "Amber Fort exceeding capacity", priority: "high" },
    { id: 2, type: "hotel", message: "RTDC hotels in Jaipur filling fast", priority: "medium" },
    { id: 3, type: "weather", message: "Heatwave alert in Jaisalmer", priority: "high" }
  ]
};

export const visitorSegmentation = {
  domestic: {
    states: [
      { name: "Rajasthan", percentage: 25 },
      { name: "Delhi", percentage: 18 },
      { name: "Maharashtra", percentage: 15 },
      { name: "Gujarat", percentage: 12 },
      { name: "Uttar Pradesh", percentage: 10 }
    ]
  },
  international: {
    countries: [
      { name: "USA", percentage: 25 },
      { name: "UK", percentage: 18 },
      { name: "France", percentage: 15 },
      { name: "Germany", percentage: 12 },
      { name: "Australia", percentage: 10 }
    ]
  }
};