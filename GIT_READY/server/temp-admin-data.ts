// Temporary in-memory data for admin panel testing
export const tempProperties = [
  {
    id: "cap-cana-villa",
    name: "Cap Cana Villa",
    location: "Punta Cana, Dominican Republic",
    description: "Luxury beachfront villa with ocean views and private pool",
    pricePerNightUsd: 450,
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3,
    amenities: ["Ocean View", "Private Pool", "Beach Access", "WiFi", "Kitchen"],
    hktPriceOverride: 0.10,
    isActive: true,
    stats: {
      totalBookings: 12,
      activeBookings: 2,
      totalRevenue: 15400,
      occupancyRate: 67
    }
  }
];

export const tempStats = {
  totalUsers: 234,
  activeUsers: 156,
  totalInvestments: 89,
  totalInvestedAmount: 125000,
  totalSubscribers: 445,
  platformStats: {
    totalBookings: 45,
    totalRevenue: 67500,
    averageBookingValue: 1500,
    occupancyRate: 72
  }
};

export const tempUser = {
  id: 1,
  email: "admin@homekrypto.com",
  username: "admin"
};