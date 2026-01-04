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
  rating: number;
  totalTrips: number;
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

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken ? await this.getToken() : null;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || `HTTP error ${response.status}`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
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
  }): Promise<Ride> {
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
  api.setTokenGetter(getToken);
  return api;
}
