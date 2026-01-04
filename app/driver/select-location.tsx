import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState, useContext, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { useApi, Location } from "../services/api";
import { useAuth } from "@clerk/clerk-expo";

export default function SelectLocation() {
  const router = useRouter();
  const api = useApi();
  const { isLoaded, isSignedIn } = useAuth();
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const [searchText, setSearchText] = useState("");
  const [locations, setLocations] = useState<Location[]>([]);
  const [allLocations, setAllLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [settingLocation, setSettingLocation] = useState<string | null>(null);
  const [currentLocationId, setCurrentLocationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Determine if we can make API calls
  const canFetch = isLoaded && isSignedIn;

  // Fetch current driver location on mount
  useEffect(() => {
    if (!canFetch) return;

    const fetchCurrentLocation = async () => {
      try {
        const user = await api.getMe();
        if (user.driverProfile?.currentLocationId) {
          setCurrentLocationId(user.driverProfile.currentLocationId);
        }
      } catch (err) {
        console.error("Error fetching current location:", err);
      }
    };
    fetchCurrentLocation();
  }, [canFetch]);

  // Load all locations on mount
  useEffect(() => {
    if (!canFetch) {
      setInitialLoading(false);
      return;
    }

    const loadLocations = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("Fetching locations...");
        const result = await api.getLocations({ limit: 50 });
        console.log("Locations fetched:", result.locations.length);
        setAllLocations(result.locations);
        setLocations(result.locations);
        if (result.locations.length === 0) {
          setError("No locations available. Please contact support.");
        }
      } catch (err: any) {
        console.error("Error loading locations:", err);
        setError(err.message || "Failed to load locations. Please try again.");
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    };
    loadLocations();
  }, [canFetch]);

  // Search/filter locations
  useEffect(() => {
    if (!canFetch || allLocations.length === 0) return;

    if (!searchText || searchText.length < 2) {
      setLocations(allLocations);
      return;
    }

    const searchLower = searchText.toLowerCase();
    const filtered = allLocations.filter(
      (loc) =>
        loc.locationName.toLowerCase().includes(searchLower) ||
        loc.address.toLowerCase().includes(searchLower) ||
        loc.city.toLowerCase().includes(searchLower)
    );
    setLocations(filtered);

    // Also search from API for more results
    const timer = setTimeout(async () => {
      try {
        const result = await api.getLocations({ search: searchText, limit: 20 });
        const apiIds = new Set(result.locations.map((l) => l.id));
        const localOnly = filtered.filter((l) => !apiIds.has(l.id));
        setLocations([...result.locations, ...localOnly]);
      } catch (err) {
        console.error("Error searching locations:", err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchText, canFetch, allLocations]);

  const selectLocation = async (location: Location) => {
    setSettingLocation(location.id);
    try {
      await api.setDriverCurrentLocation(location.id);
      setCurrentLocationId(location.id);
      Alert.alert(
        "Location Set",
        `Your current location is now set to ${location.locationName}. Passengers in this area can now see you and request rides.`,
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (err: any) {
      console.error("Error setting location:", err);
      Alert.alert("Error", err.message || "Failed to set location. Please try again.");
    } finally {
      setSettingLocation(null);
    }
  };

  const retryLoad = () => {
    setError(null);
    setInitialLoading(true);
    setAllLocations([]);
  };

  // Show loading while auth is initializing
  if (!isLoaded) {
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
            Select Your Location
          </Text>
        </View>
        <Text className={`mt-2 ${isDark ? "text-gray-300" : "text-gray-800"}`}>
          Choose a location to set as your current position
        </Text>
      </View>

      {/* Search Bar */}
      <View className="px-6 py-4">
        <View
          className={`flex-row items-center rounded-2xl px-4 ${
            isDark ? "bg-gray-800" : "bg-white"
          } shadow`}
          style={{ elevation: 2 }}
        >
          <Ionicons name="search" size={20} color={isDark ? "#9ca3af" : "#6b7280"} />
          <TextInput
            className={`flex-1 ml-3 py-4 ${isDark ? "text-white" : "text-gray-900"}`}
            placeholder="Search locations..."
            placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText("")}>
              <Ionicons name="close-circle" size={20} color={isDark ? "#9ca3af" : "#6b7280"} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Locations List */}
      {error ? (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
          <Text className={`mt-4 text-center ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            {error}
          </Text>
          <TouchableOpacity
            onPress={retryLoad}
            className="mt-6 bg-yellow-500 px-6 py-3 rounded-2xl"
          >
            <Text className="text-white font-bold">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : initialLoading || (loading && locations.length === 0) ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FACC15" />
          <Text className={`mt-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            Loading locations...
          </Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {locations.length === 0 ? (
            <View className="items-center py-10">
              <Ionicons name="location-outline" size={48} color={isDark ? "#6b7280" : "#9ca3af"} />
              <Text className={`mt-4 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                {searchText.length > 0 ? "No locations found" : "No locations available"}
              </Text>
            </View>
          ) : (
            locations.map((location) => (
              <TouchableOpacity
                key={location.id}
                onPress={() => selectLocation(location)}
                disabled={settingLocation !== null}
                className={`p-4 rounded-2xl mb-3 ${
                  isDark ? "bg-gray-800" : "bg-white"
                } ${currentLocationId === location.id ? "border-2 border-yellow-500" : ""} shadow`}
                style={{ elevation: 2 }}
              >
                <View className="flex-row items-start">
                  <View
                    className={`w-10 h-10 rounded-full items-center justify-center ${
                      currentLocationId === location.id ? "bg-yellow-500" : isDark ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    <Ionicons
                      name={currentLocationId === location.id ? "checkmark" : "location"}
                      size={20}
                      color={currentLocationId === location.id ? "white" : "#d97706"}
                    />
                  </View>
                  <View className="flex-1 ml-3">
                    <View className="flex-row items-center justify-between">
                      <Text
                        className={`font-semibold text-base ${isDark ? "text-white" : "text-gray-900"}`}
                      >
                        {location.locationName}
                      </Text>
                      {currentLocationId === location.id && (
                        <View className="bg-yellow-100 px-2 py-1 rounded-full">
                          <Text className="text-yellow-700 text-xs font-medium">Current</Text>
                        </View>
                      )}
                    </View>
                    <Text className={`mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      {location.address}
                    </Text>
                    <Text className={`text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                      {location.city}, {location.district}, {location.state}
                    </Text>
                  </View>
                  {settingLocation === location.id && (
                    <ActivityIndicator size="small" color="#FACC15" />
                  )}
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}
