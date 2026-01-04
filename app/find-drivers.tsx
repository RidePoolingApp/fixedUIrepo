import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  StatusBar,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useContext, useCallback, useEffect } from "react";
import { ThemeContext } from "./context/ThemeContext";
import { useApi, Location, DriverProfile, VehicleType } from "./services/api";
import { useAuth } from "@clerk/clerk-expo";

const vehicleIcons: Record<VehicleType, string> = {
  SEDAN: "car-sport-outline",
  SUV: "car-outline",
  HATCHBACK: "car-outline",
  AUTO: "car-outline",
  BIKE: "bicycle-outline",
};

// Calculate fare based on driver's rates and estimated distance
const calculateFare = (driver: DriverProfile, distanceKm: number): number => {
  const baseFare = driver.baseFare || 30;
  const farePerKm = driver.farePerKm || 12;
  
  if (distanceKm <= 1) {
    return baseFare;
  }
  
  // Base fare covers first km, then farePerKm for remaining distance
  return Math.round(baseFare + farePerKm * (distanceKm - 1));
};

// Estimate distance between two locations (simple approximation)
// In production, you'd use a proper distance API like Google Maps
const estimateDistance = (pickup: Location | null, drop: Location | null): number => {
  if (!pickup || !drop) {
    console.log("estimateDistance: Missing pickup or drop", { pickup: !!pickup, drop: !!drop });
    return 0;
  }
  
  // If we have lat/lng, use Haversine formula
  if (pickup.lat && pickup.lng && drop.lat && drop.lng) {
    const R = 6371; // Earth's radius in km
    const dLat = (drop.lat - pickup.lat) * Math.PI / 180;
    const dLng = (drop.lng - pickup.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(pickup.lat * Math.PI / 180) * Math.cos(drop.lat * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    // Add 30% for road distance vs straight line
    const roadDistance = Math.round(distance * 1.3 * 10) / 10;
    console.log("estimateDistance: Using Haversine", { 
      pickupLat: pickup.lat, pickupLng: pickup.lng,
      dropLat: drop.lat, dropLng: drop.lng,
      straightLine: distance.toFixed(2), 
      roadDistance 
    });
    return roadDistance;
  }
  
  console.log("estimateDistance: Missing lat/lng, using city fallback", {
    pickupCity: pickup.city,
    dropCity: drop.city,
    pickupDistrict: pickup.district,
    dropDistrict: drop.district,
  });
  
  // Fallback: estimate based on same/different city
  if (pickup.city === drop.city) {
    // Same city, estimate 5-15 km
    return 10;
  } else if (pickup.district === drop.district) {
    // Same district, estimate 20-40 km
    return 30;
  } else {
    // Different district, estimate 50+ km
    return 50;
  }
};

export default function FindDrivers() {
  const router = useRouter();
  const params = useLocalSearchParams<{ pickupId?: string; dropId?: string }>();
  const api = useApi();
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const [searchText, setSearchText] = useState("");
  const [locations, setLocations] = useState<Location[]>([]);
  const [drivers, setDrivers] = useState<DriverProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingDrivers, setLoadingDrivers] = useState(false);
  const [selectedPickup, setSelectedPickup] = useState<Location | null>(null);
  const [selectedDrop, setSelectedDrop] = useState<Location | null>(null);
  const [selectingFor, setSelectingFor] = useState<"pickup" | "drop" | null>("pickup");
  const [requesting, setRequesting] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [estimatedDistance, setEstimatedDistance] = useState<number>(0);

  // Wait for auth to be fully ready
  useEffect(() => {
    const checkAuth = async () => {
      if (isLoaded && isSignedIn) {
        try {
          const token = await getToken();
          if (token) {
            setAuthReady(true);
          }
        } catch (error) {
          console.error("Error getting token:", error);
        }
      }
    };
    checkAuth();
  }, [isLoaded, isSignedIn, getToken]);

  // Fetch locations for search
  const searchLocations = useCallback(async (text: string) => {
    if (!authReady) return;
    
    if (!text || text.length < 2) {
      setLocations([]);
      return;
    }

    setLoading(true);
    try {
      const result = await api.getLocations({ search: text, limit: 15 });
      setLocations(result.locations);
    } catch (error) {
      console.error("Error searching locations:", error);
    } finally {
      setLoading(false);
    }
  }, [authReady]);

  // Debounce search
  useEffect(() => {
    if (!authReady) return;
    
    const timer = setTimeout(() => {
      searchLocations(searchText);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchText, searchLocations, authReady]);

  // Fetch drivers when pickup location is selected
  useEffect(() => {
    if (!authReady) return;
    
    if (selectedPickup) {
      fetchDriversAtLocation(selectedPickup);
    }
  }, [selectedPickup, authReady]);

  // Calculate estimated distance when both locations are selected
  useEffect(() => {
    if (selectedPickup && selectedDrop) {
      const distance = estimateDistance(selectedPickup, selectedDrop);
      setEstimatedDistance(distance);
    } else {
      setEstimatedDistance(0);
    }
  }, [selectedPickup, selectedDrop]);

  const fetchDriversAtLocation = async (location: Location) => {
    if (!authReady) return;
    
    setLoadingDrivers(true);
    try {
      // First try exact location match
      const availableDrivers = await api.getAvailableDrivers({
        locationId: location.id,
      });
      
      if (availableDrivers.length > 0) {
        setDrivers(availableDrivers);
      } else {
        // No drivers at exact location, try same city
        console.log("No drivers at exact location, searching in city:", location.city);
        const cityDrivers = await api.getAvailableDrivers({
          city: location.city,
          state: location.state,
        });
        setDrivers(cityDrivers);
      }
    } catch (error) {
      console.error("Error fetching drivers:", error);
      // Fallback to city search on error
      try {
        const cityDrivers = await api.getAvailableDrivers({
          city: location.city,
          state: location.state,
        });
        setDrivers(cityDrivers);
      } catch (e) {
        console.error("Error fetching city drivers:", e);
        setDrivers([]);
      }
    } finally {
      setLoadingDrivers(false);
    }
  };

  const selectLocation = (location: Location) => {
    if (selectingFor === "pickup") {
      setSelectedPickup(location);
      setSelectingFor("drop");
    } else {
      setSelectedDrop(location);
      setSelectingFor(null);
    }
    setSearchText("");
    setLocations([]);
  };

  const requestRide = async (driver: DriverProfile) => {
    if (!selectedPickup || !selectedDrop) {
      Alert.alert("Missing Information", "Please select both pickup and drop locations");
      return;
    }

    // Calculate distance fresh here to avoid stale state issues
    const distance = estimateDistance(selectedPickup, selectedDrop);
    const calculatedFare = calculateFare(driver, distance);

    // DEBUG: Show what we're sending
    console.log("=== FARE DEBUG ===");
    console.log("selectedPickup:", JSON.stringify(selectedPickup, null, 2));
    console.log("selectedDrop:", JSON.stringify(selectedDrop, null, 2));
    console.log("Calculated distance:", distance);
    console.log("Calculated fare:", calculatedFare);
    console.log("Driver rates - base:", driver.baseFare, "perKm:", driver.farePerKm);
    console.log("==================");

    // Validate before sending
    if (!distance || distance === 0) {
      Alert.alert(
        "Debug: Distance Issue",
        `Distance is ${distance}.\nPickup lat/lng: ${selectedPickup.lat}/${selectedPickup.lng}\nDrop lat/lng: ${selectedDrop.lat}/${selectedDrop.lng}`
      );
      return;
    }

    setRequesting(driver.id);
    try {
      const ride = await api.requestRideFromDriver({
        driverId: driver.id,
        pickupId: selectedPickup.id,
        dropId: selectedDrop.id,
        estimatedFare: calculatedFare,
        estimatedDistance: distance,
        type: distance > 30 ? "LONG_TRIP" : "STANDARD",
      });

      Alert.alert(
        "Ride Requested",
        `Your ride request has been sent to ${driver.user?.firstName || "the driver"}.\nEstimated fare: ₹${calculatedFare} (${distance} km)\nYou'll be notified when they accept.`,
        [
          {
            text: "View Ride",
            onPress: () => router.push(`/ride/assigned?rideId=${ride.id}`),
          },
          { text: "OK", onPress: () => router.back() },
        ]
      );
    } catch (error: any) {
      console.error("Error requesting ride:", error);
      Alert.alert("Error", error.message || "Failed to request ride. Please try again.");
    } finally {
      setRequesting(null);
    }
  };

  // Show loading while auth is initializing
  if (!isLoaded || !authReady) {
    return (
      <View className={`flex-1 items-center justify-center ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
        <ActivityIndicator size="large" color="#FACC15" />
        <Text className={`mt-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          Loading...
        </Text>
      </View>
    );
  }

  // Redirect if not signed in
  if (!isSignedIn) {
    return (
      <View className={`flex-1 items-center justify-center ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
        <Ionicons name="lock-closed-outline" size={48} color={isDark ? "#9ca3af" : "#6b7280"} />
        <Text className={`mt-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          Please sign in to continue
        </Text>
        <TouchableOpacity
          onPress={() => router.replace("/(public)/login")}
          className="mt-6 bg-yellow-500 px-6 py-3 rounded-2xl"
        >
          <Text className="text-white font-bold">Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className={`flex-1 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Header */}
      <View className={`pt-14 pb-4 px-6 ${isDark ? "bg-gray-800" : "bg-yellow-500"}`}>
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
            <Ionicons name="arrow-back" size={24} color={isDark ? "white" : "#1f2937"} />
          </TouchableOpacity>
          <Text className={`text-xl font-bold ml-2 ${isDark ? "text-white" : "text-gray-900"}`}>
            Find Available Drivers
          </Text>
        </View>
      </View>

      {/* Location Selection */}
      <View className="px-6 py-4">
        {/* Pickup */}
        <TouchableOpacity
          onPress={() => {
            setSelectingFor("pickup");
            setSearchText("");
          }}
          className={`p-4 rounded-2xl mb-3 ${
            isDark ? "bg-gray-800" : "bg-white"
          } ${selectingFor === "pickup" ? "border-2 border-yellow-500" : ""} shadow`}
        >
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center">
              <Ionicons name="location" size={20} color="#10b981" />
            </View>
            <View className="flex-1 ml-3">
              <Text className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>PICKUP</Text>
              <Text className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                {selectedPickup?.locationName || "Select pickup location"}
              </Text>
            </View>
            {selectedPickup && (
              <TouchableOpacity onPress={() => setSelectedPickup(null)}>
                <Ionicons name="close-circle" size={20} color={isDark ? "#9ca3af" : "#6b7280"} />
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>

        {/* Drop */}
        <TouchableOpacity
          onPress={() => {
            setSelectingFor("drop");
            setSearchText("");
          }}
          className={`p-4 rounded-2xl ${
            isDark ? "bg-gray-800" : "bg-white"
          } ${selectingFor === "drop" ? "border-2 border-yellow-500" : ""} shadow`}
        >
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-red-100 items-center justify-center">
              <Ionicons name="flag" size={20} color="#ef4444" />
            </View>
            <View className="flex-1 ml-3">
              <Text className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>DROP</Text>
              <Text className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                {selectedDrop?.locationName || "Select drop location"}
              </Text>
            </View>
            {selectedDrop && (
              <TouchableOpacity onPress={() => setSelectedDrop(null)}>
                <Ionicons name="close-circle" size={20} color={isDark ? "#9ca3af" : "#6b7280"} />
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* Search Bar (shown when selecting) */}
      {selectingFor && (
        <View className="px-6 pb-4">
          <View
            className={`flex-row items-center rounded-2xl px-4 ${
              isDark ? "bg-gray-800" : "bg-white"
            } shadow`}
          >
            <Ionicons name="search" size={20} color={isDark ? "#9ca3af" : "#6b7280"} />
            <TextInput
              className={`flex-1 ml-3 py-4 ${isDark ? "text-white" : "text-gray-900"}`}
              placeholder={`Search ${selectingFor} location...`}
              placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
              value={searchText}
              onChangeText={setSearchText}
              autoFocus
            />
          </View>

          {/* Location Suggestions */}
          {loading ? (
            <ActivityIndicator className="mt-4" color="#FACC15" />
          ) : locations.length > 0 ? (
            <ScrollView className="mt-2 max-h-48">
              {locations.map((location) => (
                <TouchableOpacity
                  key={location.id}
                  onPress={() => selectLocation(location)}
                  className={`p-3 rounded-xl mb-2 ${isDark ? "bg-gray-800" : "bg-white"}`}
                >
                  <Text className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                    {location.locationName}
                  </Text>
                  <Text className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    {location.address}, {location.city}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : null}
        </View>
      )}

      {/* Available Drivers */}
      {!selectingFor && selectedPickup && (
        <View className="flex-1 px-6">
          <Text className={`font-semibold text-lg mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
            Available Drivers {selectedPickup ? `near ${selectedPickup.locationName}` : ""}
          </Text>

          {loadingDrivers ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color="#FACC15" />
              <Text className={`mt-4 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                Finding drivers...
              </Text>
            </View>
          ) : drivers.length === 0 ? (
            <View className="flex-1 items-center justify-center">
              <Ionicons name="car-outline" size={64} color={isDark ? "#6b7280" : "#9ca3af"} />
              <Text className={`mt-4 text-center ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                No drivers available at this location.{"\n"}Try a different pickup location.
              </Text>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
              {drivers.map((driver) => (
                <View
                  key={driver.id}
                  className={`p-4 rounded-2xl mb-3 ${isDark ? "bg-gray-800" : "bg-white"} shadow`}
                >
                  <View className="flex-row items-center">
                    {/* Driver Avatar */}
                    <View className="w-14 h-14 rounded-full bg-gray-200 items-center justify-center">
                      {driver.user?.profileImage ? (
                        <Image
                          source={{ uri: driver.user.profileImage }}
                          className="w-14 h-14 rounded-full"
                        />
                      ) : (
                        <Ionicons name="person" size={28} color="#6b7280" />
                      )}
                    </View>

                    {/* Driver Info */}
                    <View className="flex-1 ml-3">
                      <Text className={`font-semibold text-base ${isDark ? "text-white" : "text-gray-900"}`}>
                        {driver.user?.firstName || "Driver"} {driver.user?.lastName || ""}
                      </Text>
                      <View className="flex-row items-center mt-1">
                        <Ionicons name="star" size={14} color="#FACC15" />
                        <Text className={`ml-1 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                          {driver.rating.toFixed(1)} • {driver.totalTrips} trips
                        </Text>
                      </View>
                      <View className="flex-row items-center mt-1">
                        <Ionicons
                          name={vehicleIcons[driver.vehicleType] as any}
                          size={14}
                          color={isDark ? "#9ca3af" : "#6b7280"}
                        />
                        <Text className={`ml-1 text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                          {driver.vehicleMake} {driver.vehicleModel} • {driver.vehicleColor}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Vehicle & Location Info */}
                  <View className="flex-row mt-3 justify-between">
                    <View className="flex-row items-center">
                      <View className="px-2 py-1 rounded-full bg-gray-100">
                        <Text className="text-xs text-gray-600">{driver.vehicleType}</Text>
                      </View>
                      <View className="px-2 py-1 rounded-full bg-gray-100 ml-2">
                        <Text className="text-xs text-gray-600">{driver.licensePlate}</Text>
                      </View>
                    </View>
                    {driver.currentLocation && (
                      <Text className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        at {driver.currentLocation.locationName}
                      </Text>
                    )}
                  </View>

                  {/* Fare Info */}
                  <View className={`mt-3 p-3 rounded-xl ${isDark ? "bg-gray-700" : "bg-yellow-50"}`}>
                    <View className="flex-row justify-between items-center">
                      <View>
                        <Text className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                          Fare Rate
                        </Text>
                        <Text className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                          ₹{driver.baseFare || 30} base + ₹{driver.farePerKm || 12}/km
                        </Text>
                      </View>
                      {selectedDrop && estimatedDistance > 0 && (
                        <View className="items-end">
                          <Text className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                            Est. Fare ({estimatedDistance} km)
                          </Text>
                          <Text className="text-xl font-bold text-yellow-600">
                            ₹{calculateFare(driver, estimatedDistance)}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Request Button */}
                  <TouchableOpacity
                    onPress={() => requestRide(driver)}
                    disabled={!selectedDrop || requesting !== null}
                    className={`mt-4 p-3 rounded-xl items-center ${
                      selectedDrop ? "bg-yellow-500" : "bg-gray-300"
                    }`}
                  >
                    {requesting === driver.id ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text className="font-bold text-white">
                        {selectedDrop 
                          ? `Book Now - ₹${calculateFare(driver, estimatedDistance)} (${estimatedDistance}km)` 
                          : "Select drop location first"}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      )}

      {/* Empty State when no pickup selected */}
      {!selectingFor && !selectedPickup && (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="location-outline" size={64} color={isDark ? "#6b7280" : "#9ca3af"} />
          <Text className={`mt-4 text-center text-lg ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            Select a pickup location to find available drivers
          </Text>
        </View>
      )}
    </View>
  );
}
