// src/services/hotel.service.js

const BASE_URL = "https://hackathon-pink-beta.vercel.app";

export const fetchHotels = async () => {
  try {
    const response = await fetch(`${BASE_URL}/hotel/list`);
    if (!response.ok) {
      throw new Error("Failed to fetch hotel data");
    }
    return await response.json();
  } catch (error) {
    console.error("Hotel API Error:", error);
    return [];
  }
};
