import { useAuth } from "@clerk/clerk-expo";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api/v1";

export enum Role {
  RIDER = "RIDER",
  DRIVER = "DRIVER",
  ADMIN = "ADMIN",
}

export enum VehicleType {
  SEDAN = "SEDAN",
  SUV = "SUV",
  HATCHBACK = "HATCHBACK",
  AUTO = "AUTO",
  BIKE = "BIKE",
}

export enum RideType {
  STANDARD = "STANDARD",
  SHARED = "SHARED",
  DAILY_CAB = "DAILY_CAB",
  LONG_TRIP = "LONG_TRIP",
}

export enum RideStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  ARRIVING = "ARRIVING",
  STARTED = "STARTED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum PassengerStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  PICKED_UP = "PICKED_UP",
  DROPPED = "DROPPED",
  CANCELLED = "CANCELLED",
}

export enum SubscriptionStatus {
  ACTIVE = "ACTIVE",
  PAUSED = "PAUSED",
  CANCELLED = "CANCELLED",
  EXPIRED = "EXPIRED",
}

export enum PaymentMethod {
  CASH = "CASH",
  UPI = "UPI",
  CARD = "CARD",
  WALLET = "WALLET",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export enum EarningType {
  RIDE = "RIDE",
  BONUS = "BONUS",
  TIP = "TIP",
  REFERRAL = "REFERRAL",
}

export enum NotificationType {
  RIDE_UPDATE = "RIDE_UPDATE",
  PAYMENT = "PAYMENT",
  PROMO = "PROMO",
  SYSTEM = "SYSTEM",
}

export interface Location {
  id: string;
  state: string;
  district: string;
  city: string;
  locationName: string;
  address: string;
  pincode: string;
  landmark?: string;
  lat?: number;
  lng?: number;
}

export interface LocationInput {
  state: string;
  district: string;
  city: string;
  locationName: string;
  address: string;
  pincode: string;
  landmark?: string;
  lat?: number;
  lng?: number;
}

export interface User {
  id: string;
  email: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
  driverProfile?: DriverProfile;
}

export interface DriverProfile {
  id: string;
  userId: string;
  user?: User;
  licenseNumber: string;
  licenseExpiry: string;
  vehicleType: VehicleType;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  vehicleColor: string;
  licensePlate: string;
  isVerified: boolean;
  isOnline: boolean;
  currentLat?: number;
  currentLng?: number;
  currentLocationId?: string;
  currentLocation?: Location;
  rating: number;
  totalTrips: number;
  farePerKm: number;
  baseFare: number;
  createdAt: string;
  updatedAt: string;
}

export interface Ride {
  id: string;
  riderId: string;
  rider?: User;
  driverId?: string;
  driver?: DriverProfile;
  type: RideType;
  status: RideStatus;
  pickupId: string;
  pickup?: Location;
  dropId: string;
  drop?: Location;
  distance?: number;
  duration?: number;
  fare?: number;
  scheduledAt?: string;
  startedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancelReason?: string;
  createdAt: string;
  updatedAt: string;
  payment?: Payment;
  rating?: Rating;
}

export interface SharedRide {
  id: string;
  driverId?: string;
  status: RideStatus;
  routeStartId: string;
  routeStart?: Location;
  routeEndId: string;
  routeEnd?: Location;
  departureTime: string;
  availableSeats: number;
  pricePerSeat: number;
  createdAt: string;
  updatedAt: string;
  passengers?: SharedRidePassenger[];
}

export interface SharedRidePassenger {
  id: string;
  sharedRideId: string;
  sharedRide?: SharedRide;
  userId: string;
  user?: User;
  pickupId: string;
  pickup?: Location;
  dropId: string;
  drop?: Location;
  seats: number;
  status: PassengerStatus;
  createdAt: string;
}

export interface DailyCabSubscription {
  id: string;
  userId: string;
  pickupId: string;
  pickup?: Location;
  dropId: string;
  drop?: Location;
  pickupTime: string;
  daysOfWeek: number[];
  startDate: string;
  endDate: string;
  fare: number;
  status: SubscriptionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  userId: string;
  rideId?: string;
  ride?: Ride;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  createdAt: string;
}

export interface Rating {
  id: string;
  rideId: string;
  raterId: string;
  driverId: string;
  score: number;
  comment?: string;
  createdAt: string;
}

export interface SavedPlace {
  id: string;
  userId: string;
  name: string;
  locationId: string;
  location?: Location;
  createdAt: string;
}

export interface DriverEarning {
  id: string;
  driverId: string;
  amount: number;
  type: EarningType;
  description?: string;
  date: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: NotificationType;
  data?: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  rides?: T[];
  payments?: T[];
  locations?: T[];
  total: number;
  page: number;
  limit: number;
}

class ApiService {
  private getToken: (() => Promise<string | null>) | null = null;

  setTokenGetter(getter: () => Promise<string | null>) {
    this.getToken = getter;
  }

  private async getAuthToken(): Promise<string | null> {
    if (!this.getToken) {
      console.warn("Token getter not set. Call useApi() first.");
      return null;
    }

    // Always get a fresh token from Clerk - don't cache
    // Clerk handles its own token caching and refresh
    let retries = 3;
    while (retries > 0) {
      try {
        const token = await this.getToken();
        if (token) {
          return token;
        }
        retries--;
        if (retries > 0) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      } catch (error) {
        console.error("Error getting auth token:", error);
        retries--;
        if (retries > 0) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }
    }
    
    return null;
  }

  clearTokenCache() {
    // No-op now, kept for compatibility
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getAuthToken();

    console.log(`API Request: ${endpoint}, Token available: ${!!token}`);

    if (!token) {
      console.warn(`No auth token available for request to ${endpoint}`);
      throw new Error("Authentication required. Please sign in again.");
    }

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    };

    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`Fetching: ${url}`);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      console.log(`Response status: ${response.status} for ${endpoint}`);

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: `HTTP error ${response.status}` }));
        throw new Error(error.error || error.message || `HTTP error ${response.status}`);
      }

      if (response.status === 204) {
        return {} as T;
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Network request failed");
    }
  }

  async syncUser(data: {
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    profileImage?: string;
  }): Promise<User> {
    return this.request<User>("/users/sync", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getMe(): Promise<User> {
    return this.request<User>("/users/profile");
  }

  async updateMe(data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    profileImage?: string;
  }): Promise<User> {
    return this.request<User>("/users/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async getSavedPlaces(): Promise<SavedPlace[]> {
    return this.request<SavedPlace[]>("/users/saved-places");
  }

  async addSavedPlace(data: {
    name: string;
    locationName: string;
    address: string;
    pincode: string;
    state: string;
    district: string;
    city: string;
    landmark?: string;
    lat?: number;
    lng?: number;
  }): Promise<SavedPlace> {
    return this.request<SavedPlace>("/users/saved-places", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async deleteSavedPlace(id: string): Promise<void> {
    return this.request<void>(`/users/saved-places/${id}`, {
      method: "DELETE",
    });
  }

  async createRide(data: {
    type?: RideType;
    pickup: LocationInput;
    drop: LocationInput;
    scheduledAt?: string;
    estimatedFare?: number;
    estimatedDistance?: number;
  }): Promise<Ride> {
    console.log("Creating ride with data:", JSON.stringify(data, null, 2));
    return this.request<Ride>("/rides", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getRideHistory(
    page = 1,
    limit = 10
  ): Promise<PaginatedResponse<Ride> & { rides: Ride[] }> {
    return this.request<PaginatedResponse<Ride> & { rides: Ride[] }>(
      `/rides/history?page=${page}&limit=${limit}`
    );
  }

  async getRide(id: string): Promise<Ride> {
    return this.request<Ride>(`/rides/${id}`);
  }

  async cancelRide(id: string, reason?: string): Promise<Ride> {
    return this.request<Ride>(`/rides/${id}/cancel`, {
      method: "PUT",
      body: JSON.stringify({ reason }),
    });
  }

  async rateRide(
    id: string,
    score: number,
    comment?: string
  ): Promise<Rating> {
    return this.request<Rating>(`/rides/${id}/rate`, {
      method: "POST",
      body: JSON.stringify({ score, comment }),
    });
  }

  async searchSharedRides(data: {
    routeStart: string;
    routeEnd: string;
    departureTime: string;
    seats?: number;
  }): Promise<SharedRide[]> {
    return this.request<SharedRide[]>("/sharing/search", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async joinSharedRide(data: {
    sharedRideId: string;
    pickup: LocationInput;
    drop: LocationInput;
    seats?: number;
  }): Promise<SharedRidePassenger> {
    return this.request<SharedRidePassenger>("/sharing/join", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getSharedRideMatches(): Promise<SharedRidePassenger[]> {
    return this.request<SharedRidePassenger[]>("/sharing/matches");
  }

  async leaveSharedRide(id: string): Promise<void> {
    return this.request<void>(`/sharing/${id}/leave`, {
      method: "DELETE",
    });
  }

  async subscribeDailyCab(data: {
    pickup: LocationInput;
    drop: LocationInput;
    pickupTime: string;
    daysOfWeek: number[];
    startDate: string;
    endDate: string;
    fare: number;
  }): Promise<DailyCabSubscription> {
    return this.request<DailyCabSubscription>("/daily-cab/subscribe", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getDailyCabSubscription(): Promise<DailyCabSubscription> {
    return this.request<DailyCabSubscription>("/daily-cab/subscription");
  }

  async updateDailyCabSubscription(
    id: string,
    data: {
      pickupTime?: string;
      daysOfWeek?: number[];
      endDate?: string;
      status?: SubscriptionStatus;
    }
  ): Promise<DailyCabSubscription> {
    return this.request<DailyCabSubscription>(`/daily-cab/subscription/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async cancelDailyCabSubscription(id: string): Promise<void> {
    return this.request<void>(`/daily-cab/subscription/${id}`, {
      method: "DELETE",
    });
  }

  async initiatePayment(data: {
    rideId?: string;
    amount: number;
    method: PaymentMethod;
  }): Promise<Payment> {
    return this.request<Payment>("/payments/initiate", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async verifyPayment(data: {
    paymentId: string;
    transactionId: string;
  }): Promise<Payment> {
    return this.request<Payment>("/payments/verify", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getPaymentHistory(
    page = 1,
    limit = 10
  ): Promise<PaginatedResponse<Payment> & { payments: Payment[] }> {
    return this.request<PaginatedResponse<Payment> & { payments: Payment[] }>(
      `/payments/history?page=${page}&limit=${limit}`
    );
  }

  async registerDriver(data: {
    licenseNumber: string;
    licenseExpiry: string;
    vehicleType: VehicleType;
    vehicleMake: string;
    vehicleModel: string;
    vehicleYear: number;
    vehicleColor: string;
    licensePlate: string;
  }): Promise<DriverProfile> {
    return this.request<DriverProfile>("/drivers/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateDriverAvailability(isOnline: boolean): Promise<DriverProfile> {
    return this.request<DriverProfile>("/drivers/availability", {
      method: "PUT",
      body: JSON.stringify({ isOnline }),
    });
  }

  async updateDriverLocation(lat: number, lng: number): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>("/drivers/location", {
      method: "PUT",
      body: JSON.stringify({ lat, lng }),
    });
  }

  async setDriverCurrentLocation(locationId: string): Promise<DriverProfile> {
    return this.request<DriverProfile>("/drivers/current-location", {
      method: "PUT",
      body: JSON.stringify({ locationId }),
    });
  }

  async updateDriverFareSettings(farePerKm?: number, baseFare?: number): Promise<DriverProfile> {
    return this.request<DriverProfile>("/drivers/fare-settings", {
      method: "PUT",
      body: JSON.stringify({ farePerKm, baseFare }),
    });
  }

  async getAvailableDrivers(params?: {
    locationId?: string;
    city?: string;
    state?: string;
    district?: string;
  }): Promise<DriverProfile[]> {
    const searchParams = new URLSearchParams();
    if (params?.locationId) searchParams.append("locationId", params.locationId);
    if (params?.city) searchParams.append("city", params.city);
    if (params?.state) searchParams.append("state", params.state);
    if (params?.district) searchParams.append("district", params.district);
    const query = searchParams.toString();
    return this.request<DriverProfile[]>(`/drivers/available${query ? `?${query}` : ""}`);
  }

  async requestRideFromDriver(data: {
    driverId: string;
    pickupId: string;
    dropId: string;
    type?: RideType;
    scheduledAt?: string;
    estimatedFare?: number;
    estimatedDistance?: number;
  }): Promise<Ride> {
    console.log("=== API requestRideFromDriver ===");
    console.log("Input data:", JSON.stringify(data, null, 2));
    console.log("estimatedFare value:", data.estimatedFare, "type:", typeof data.estimatedFare);
    console.log("estimatedDistance value:", data.estimatedDistance, "type:", typeof data.estimatedDistance);
    console.log("================================");
    return this.request<Ride>("/rides/request-driver", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getActiveRide(): Promise<Ride | null> {
    return this.request<Ride | null>("/rides/active");
  }

  async getDriverRequests(): Promise<Ride[]> {
    return this.request<Ride[]>("/drivers/requests");
  }

  async rejectJob(id: string, reason?: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/drivers/jobs/${id}/reject`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
  }

  async setRideArriving(id: string): Promise<Ride> {
    return this.request<Ride>(`/drivers/rides/${id}/arriving`, {
      method: "PUT",
    });
  }

  async getDriverJobs(): Promise<Ride[]> {
    return this.request<Ride[]>("/drivers/jobs");
  }

  async acceptJob(id: string): Promise<Ride> {
    return this.request<Ride>(`/drivers/jobs/${id}/accept`, {
      method: "POST",
    });
  }

  async startRide(id: string): Promise<Ride> {
    return this.request<Ride>(`/drivers/rides/${id}/start`, {
      method: "PUT",
    });
  }

  async completeRide(
    id: string,
    data: { distance?: number; fare?: number }
  ): Promise<Ride> {
    return this.request<Ride>(`/drivers/rides/${id}/complete`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // Rider endpoint to complete ride after payment is verified
  async completeRideAfterPayment(id: string): Promise<Ride> {
    return this.request<Ride>(`/rides/${id}/complete-after-payment`, {
      method: "PUT",
    });
  }

  async getDriverEarnings(from?: string, to?: string): Promise<{
    earnings: DriverEarning[];
    total: number;
  }> {
    const params = new URLSearchParams();
    if (from) params.append("from", from);
    if (to) params.append("to", to);
    const query = params.toString();
    return this.request(`/drivers/earnings${query ? `?${query}` : ""}`);
  }

  async getDriverRideHistory(
    page = 1,
    limit = 10,
    status?: string
  ): Promise<PaginatedResponse<Ride> & { rides: Ride[] }> {
    const params = new URLSearchParams();
    params.append("page", String(page));
    params.append("limit", String(limit));
    if (status && status !== "All") params.append("status", status);
    return this.request<PaginatedResponse<Ride> & { rides: Ride[] }>(
      `/drivers/rides/history?${params.toString()}`
    );
  }

  async getDriverRatings(): Promise<{
    rating: number;
    totalReviews: number;
    ratingBreakdown: { star: number; percentage: number }[];
    reviews: { stars: number; name: string; msg: string; date: string }[];
  }> {
    return this.request(`/drivers/ratings`);
  }

  async getLocations(params?: {
    state?: string;
    district?: string;
    city?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Location> & { locations: Location[] }> {
    const searchParams = new URLSearchParams();
    if (params?.state) searchParams.append("state", params.state);
    if (params?.district) searchParams.append("district", params.district);
    if (params?.city) searchParams.append("city", params.city);
    if (params?.search) searchParams.append("search", params.search);
    if (params?.page) searchParams.append("page", String(params.page));
    if (params?.limit) searchParams.append("limit", String(params.limit));
    const query = searchParams.toString();
    return this.request(`/locations${query ? `?${query}` : ""}`);
  }

  async getStates(): Promise<string[]> {
    return this.request<string[]>("/locations/states");
  }

  async getDistricts(state: string): Promise<string[]> {
    return this.request<string[]>(`/locations/districts?state=${encodeURIComponent(state)}`);
  }

  async getCities(state: string, district: string): Promise<string[]> {
    return this.request<string[]>(
      `/locations/cities?state=${encodeURIComponent(state)}&district=${encodeURIComponent(district)}`
    );
  }

  async getLocation(id: string): Promise<Location> {
    return this.request<Location>(`/locations/${id}`);
  }

  async createLocation(data: LocationInput): Promise<Location> {
    return this.request<Location>("/locations", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getDriverProfile(): Promise<DriverProfile | null> {
    try {
      const user = await this.getMe();
      return user.driverProfile || null;
    } catch {
      return null;
    }
  }
}

export const api = new ApiService();

export function useApi() {
  const { getToken } = useAuth();
  
  // Wrap getToken to handle Clerk's async token fetching
  // getToken() returns the session token when called without arguments
  const tokenGetter = async () => {
    try {
      const token = await getToken();
      return token;
    } catch (error) {
      console.error("Error in tokenGetter:", error);
      return null;
    }
  };
  
  // Ensure token getter is always set with the latest getToken function
  api.setTokenGetter(tokenGetter);
  
  return api;
}

// For use outside of React components (e.g., in utilities)
export function getApiInstance() {
  return api;
}
