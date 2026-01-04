import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  StatusBar,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState, useContext, useCallback } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { useApi, DriverProfile, Ride, DriverEarning } from "../services/api";
import * as Location from "expo-location";
import { io, Socket } from "socket.io-client";
import * as Haptics from "expo-haptics";

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL || "http://localhost:3000";

export default function DriverDashboard() {
  const router = useRouter();
  const api = useApi();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDark = theme === "dark";
  
  const [online, setOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [driverProfile, setDriverProfile] = useState<DriverProfile | null>(null);
  const [todayEarnings, setTodayEarnings] = useState(0);
  const [todayRides, setTodayRides] = useState(0);
  const [pendingJobs, setPendingJobs] = useState<Ride[]>([]);
  const locationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fare settings modal state
  const [fareModalVisible, setFareModalVisible] = useState(false);
  const [farePerKm, setFarePerKm] = useState("12");
  const [baseFare, setBaseFare] = useState("30");
  const [savingFare, setSavingFare] = useState(false);

  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.07,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const fetchDashboardData = useCallback(async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const [profile, earningsData, jobs, requests] = await Promise.all([
        api.getMe(),
        api.getDriverEarnings(today, today),
        api.getDriverJobs().catch(() => []),
        api.getDriverRequests().catch(() => []),
      ]);

      if (profile.driverProfile) {
        // Fetch full driver profile with current location if needed
        const driverWithLocation = {
          ...profile.driverProfile,
          currentLocation: profile.driverProfile.currentLocation,
        };
        setDriverProfile(driverWithLocation);
        setOnline(profile.driverProfile.isOnline);
        // Set fare values
        setFarePerKm(String(profile.driverProfile.farePerKm || 12));
        setBaseFare(String(profile.driverProfile.baseFare || 30));
      }

      setTodayEarnings(earningsData.total);
      setTodayRides(earningsData.earnings.length);
      // Combine jobs and direct requests, remove duplicates
      const allJobs = [...jobs, ...requests];
      const uniqueJobs = allJobs.filter((job, index, self) => 
        index === self.findIndex(j => j.id === job.id)
      );
      setPendingJobs(uniqueJobs);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    
    // Set up polling for pending jobs every 5 seconds
    pollIntervalRef.current = setInterval(() => {
      fetchDashboardData();
    }, 5000);
    
    return () => {
      if (locationIntervalRef.current) {
        clearInterval(locationIntervalRef.current);
      }
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [fetchDashboardData]);

  // Set up socket connection when driver is online
  useEffect(() => {
    if (!online || !driverProfile) return;

    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => {
      console.log("Dashboard socket connected");
      socketRef.current?.emit("join:driver", driverProfile.id);
    });

    socketRef.current.on("ride:request", (data: { ride: Ride; message: string }) => {
      console.log("New ride request received:", data);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      fetchDashboardData();
      Alert.alert(
        "New Ride Request!",
        `${data.ride.pickup?.locationName || 'Pickup'} → ${data.ride.drop?.locationName || 'Drop'}`,
        [
          { text: "View", onPress: () => router.push("/driver/incoming-request") },
          { text: "Later", style: "cancel" }
        ]
      );
    });

    socketRef.current.on("ride:new", (ride: Ride) => {
      console.log("New ride broadcast:", ride);
      fetchDashboardData();
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [online, driverProfile?.id]);

  const startLocationUpdates = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required to go online");
        return false;
      }

      const updateLocation = async () => {
        try {
          const location = await Location.getCurrentPositionAsync({});
          await api.updateDriverLocation(location.coords.latitude, location.coords.longitude);
        } catch (error) {
          console.error("Error updating location:", error);
        }
      };

      await updateLocation();
      locationIntervalRef.current = setInterval(updateLocation, 30000);
      return true;
    } catch (error) {
      console.error("Error starting location updates:", error);
      return false;
    }
  };

  const stopLocationUpdates = () => {
    if (locationIntervalRef.current) {
      clearInterval(locationIntervalRef.current);
      locationIntervalRef.current = null;
    }
  };

  const toggleOnlineStatus = async () => {
    setToggling(true);
    try {
      const newStatus = !online;
      
      if (newStatus) {
        const locationStarted = await startLocationUpdates();
        if (!locationStarted) {
          setToggling(false);
          return;
        }
      } else {
        stopLocationUpdates();
      }

      const updatedProfile = await api.updateDriverAvailability(newStatus);
      setOnline(updatedProfile.isOnline);
      setDriverProfile(updatedProfile);

      if (newStatus) {
        fetchDashboardData();
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      Alert.alert("Error", "Failed to update status. Please try again.");
    } finally {
      setToggling(false);
    }
  };

  const saveFareSettings = async () => {
    const farePerKmNum = parseFloat(farePerKm);
    const baseFareNum = parseFloat(baseFare);

    if (isNaN(farePerKmNum) || farePerKmNum < 5 || farePerKmNum > 50) {
      Alert.alert("Invalid Fare", "Fare per km must be between ₹5 and ₹50");
      return;
    }

    if (isNaN(baseFareNum) || baseFareNum < 10 || baseFareNum > 100) {
      Alert.alert("Invalid Base Fare", "Base fare must be between ₹10 and ₹100");
      return;
    }

    setSavingFare(true);
    try {
      const updatedProfile = await api.updateDriverFareSettings(farePerKmNum, baseFareNum);
      setDriverProfile(updatedProfile);
      setFareModalVisible(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Success", "Fare settings updated successfully!");
    } catch (error: any) {
      console.error("Error saving fare settings:", error);
      Alert.alert("Error", error.message || "Failed to update fare settings");
    } finally {
      setSavingFare(false);
    }
  };

  if (loading) {
    return (
      <View className={`flex-1 items-center justify-center ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
        <ActivityIndicator size="large" color="#FACC15" />
      </View>
    );
  }

  return (
    <View className={`flex-1 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* YELLOW HEADER */}
      <View className="absolute top-0 left-0 right-0">
        <Svg height="260" width="100%">
          <Path d="M0 0 H400 V140 Q200 260 0 140 Z" fill={isDark ? "#1F2937" : "#FACC15"} />
          <Path
            d="M0 40 H400 V180 Q200 320 0 180 Z"
            fill={isDark ? "#374151" : "#FDE047"}
            opacity={0.5}
          />
        </Svg>
      </View>

      {/* HEADER BAR */}
      <View className="mt-16 px-6 flex-row justify-between items-center">
        <Text className={`text-3xl font-extrabold ${isDark ? "text-white" : "text-gray-900"}`}>
          Driver Mode
        </Text>

        <View className="flex-row">
          <TouchableOpacity onPress={toggleTheme} className="p-3 bg-white/20 rounded-full mr-2">
            {isDark ? (
              <Ionicons name="sunny-outline" size={26} color="yellow" />
            ) : (
              <Ionicons name="moon-outline" size={26} color="#333" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/driver/driver-profile")}
            className="bg-white/20 p-3 rounded-full"
          >
            <Ionicons name="person-circle-outline" size={30} color={isDark ? "#eee" : "#333"} />
          </TouchableOpacity>
        </View>
      </View>

      {/* STATUS BAR */}
      <View className="px-6 mt-3">
        <View
          className={`p-5 rounded-3xl shadow flex-row justify-between items-center ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
          style={{ elevation: 5 }}
        >
          <View>
            <Text className={`font-semibold text-lg ${isDark ? "text-white" : "text-gray-800"}`}>
              Status:{" "}
              <Text className={online ? "text-green-600" : "text-red-500"}>
                {online ? "Online" : "Offline"}
              </Text>
            </Text>
            <Text className={`text-xs mt-1 ${isDark ? "text-gray-300" : "text-gray-500"}`}>
              {online ? "You are visible to riders" : "Go online to receive trip requests"}
            </Text>
          </View>

          <TouchableOpacity
            onPress={toggleOnlineStatus}
            disabled={toggling}
            className={`px-4 py-2 rounded-2xl ${online ? "bg-red-500" : "bg-green-500"}`}
          >
            {toggling ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="text-white font-bold">{online ? "Go Offline" : "Go Online"}</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="px-6 mt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 200 }}
      >
        {/* ACTIVE RIDE / PENDING REQUEST CARD */}
        {pendingJobs.length > 0 ? (
          <View
            className={`p-5 rounded-3xl shadow ${
              isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}
            style={{ elevation: 4 }}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="w-3 h-3 rounded-full bg-green-500 mr-2 animate-pulse" />
                <Ionicons name="navigate-outline" size={26} color="#d97706" />
                <Text className={`ml-2 font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                  {pendingJobs.length === 1 ? "New Request" : `${pendingJobs.length} Pending Requests`}
                </Text>
              </View>
              <View className="px-3 py-1 rounded-full bg-yellow-100 border border-yellow-300">
                <Text className="text-yellow-700 text-xs font-semibold">PENDING</Text>
              </View>
            </View>

            <Text className={`text-xl font-bold mt-3 ${isDark ? "text-white" : "text-gray-900"}`}>
              {pendingJobs[0].pickup?.locationName || "Pickup"} → {pendingJobs[0].drop?.locationName || "Drop"}
            </Text>
            <Text className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
              {pendingJobs[0].pickup?.address || ""} • {pendingJobs[0].distance ? `${pendingJobs[0].distance} km` : "Calculating..."}
            </Text>

            <View className="flex-row mt-3">
              <View className="px-3 py-1 mr-2 rounded-full bg-yellow-100 border border-yellow-300">
                <Text className="text-yellow-700 text-xs font-semibold">CASH/UPI</Text>
              </View>
              <View className="px-3 py-1 mr-2 rounded-full bg-gray-100 border border-gray-300">
                <Text className="text-gray-700 text-xs font-semibold">{pendingJobs[0].type || "STANDARD"}</Text>
              </View>
              {pendingJobs[0].rider && (
                <View className="px-3 py-1 rounded-full bg-blue-100 border border-blue-300">
                  <Text className="text-blue-700 text-xs font-semibold">
                    {pendingJobs[0].rider.firstName || "Rider"}
                  </Text>
                </View>
              )}
            </View>

            <View className="flex-row justify-between mt-4">
              <View>
                <Text className={`${isDark ? "text-gray-300" : "text-gray-500"}`}>Est. Fare</Text>
                <Text className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-800"}`}>
                  {pendingJobs[0].fare ? `₹${pendingJobs[0].fare}` : "View details"}
                </Text>
              </View>
              <View>
                <Text className={`${isDark ? "text-gray-300" : "text-gray-500"}`}>Distance</Text>
                <Text className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-800"}`}>
                  {pendingJobs[0].distance ? `${pendingJobs[0].distance} km` : "View details"}
                </Text>
              </View>
              <View>
                <Text className={`${isDark ? "text-gray-300" : "text-gray-500"}`}>Requests</Text>
                <Text className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-800"}`}>
                  {pendingJobs.length}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => router.push("/driver/incoming-request")}
              className="mt-5 bg-yellow-500 p-4 rounded-2xl items-center"
            >
              <Text className="text-white font-bold">View & Accept Requests</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View
            className={`p-5 rounded-3xl shadow ${
              isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}
            style={{ elevation: 4 }}
          >
            <View className="flex-row items-center justify-center py-6">
              <Ionicons name="car-outline" size={48} color={isDark ? "#6b7280" : "#9ca3af"} />
            </View>
            <Text className={`text-center text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
              No Pending Requests
            </Text>
            <Text className={`text-center mt-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              {online 
                ? "Stay online to receive ride requests from passengers nearby"
                : "Go online to start receiving ride requests"}
            </Text>
            {!online && (
              <TouchableOpacity
                onPress={toggleOnlineStatus}
                disabled={toggling}
                className="mt-4 bg-green-500 p-4 rounded-2xl items-center"
              >
                {toggling ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-bold">Go Online Now</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* EARNINGS & STATS */}
        <View className="flex-row justify-between mt-6">
          {/* Earnings */}
          <View
            className={`w-[48%] p-5 rounded-3xl shadow ${
              isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}
            style={{ elevation: 4 }}
          >
            <Ionicons name="wallet-outline" size={30} color="#d97706" />
            <Text className={`text-xl font-bold mt-3 ${isDark ? "text-white" : "text-gray-800"}`}>₹{todayEarnings.toLocaleString()}</Text>
            <Text className={`text-sm ${isDark ? "text-gray-300" : "text-gray-500"}`}>Today's Earnings</Text>
          </View>

          {/* Rating */}
          <View
            className={`w-[48%] p-5 rounded-3xl shadow ${
              isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}
            style={{ elevation: 4 }}
          >
            <Ionicons name="star-outline" size={30} color="#d97706" />
            <Text className={`text-xl font-bold mt-3 ${isDark ? "text-white" : "text-gray-800"}`}>{driverProfile?.rating?.toFixed(1) || "5.0"}</Text>
            <Text className={`text-sm ${isDark ? "text-gray-300" : "text-gray-500"}`}>Your Rating</Text>
          </View>
        </View>

        {/* MICRO STATS ROW */}
        <View className="flex-row justify-between mt-6">
          {[{label: 'Rides Today', value: String(todayRides), icon: 'steering'}, {label: 'Total Trips', value: String(driverProfile?.totalTrips || 0), icon: 'timer-outline'}, {label: 'Pending Jobs', value: String(pendingJobs.length), icon: 'checkmark-done-outline'}].map((s, idx) => (
            <View key={idx} className={`w-[32%] p-4 rounded-2xl items-center ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow`} style={{ elevation: 3 }}>
              {s.icon === 'steering' ? (
                <MaterialCommunityIcons name="steering" size={24} color="#d97706" />
              ) : (
                <Ionicons name={s.icon as any} size={24} color="#d97706" />
              )}
              <Text className={`mt-2 text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>{s.value}</Text>
              <Text className={`${isDark ? 'text-gray-300' : 'text-gray-500'} text-xs`}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* GO ONLINE BUTTON (Animated) */}
        <Animated.View style={{ transform: [{ scale: pulse }] }} className="mt-8">
          <TouchableOpacity
            disabled={online || toggling}
            onPress={async () => {
              await toggleOnlineStatus();
              if (!online) {
                router.push("/driver/incoming-request");
              }
            }}
            className={`p-5 rounded-3xl items-center shadow-lg ${online ? "bg-gray-300" : "bg-yellow-500"}`}
            style={{ elevation: 6 }}
          >
            {toggling ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-lg font-bold text-white">Go Online & Start Accepting Rides</Text>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* QUICK LINKS */}
        <View className="mt-10">
          <Text className={`font-semibold text-lg mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
            Quick Actions
          </Text>

          {/* Select Location */}
          <TouchableOpacity
            onPress={() => router.push("/driver/select-location")}
            className={`p-5 rounded-3xl shadow mb-4 flex-row items-center ${
              isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}
            style={{ elevation: 4 }}
          >
            <Ionicons name="location-outline" size={28} color="#10b981" />
            <View className="flex-1 ml-3">
              <Text className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-800"}`}>
                Set Current Location
              </Text>
              <Text className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                {driverProfile?.currentLocation?.locationName || "Select a location to be visible to riders"}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={isDark ? "#9ca3af" : "#6b7280"} />
          </TouchableOpacity>

          {/* Set Fare */}
          <TouchableOpacity
            onPress={() => setFareModalVisible(true)}
            className={`p-5 rounded-3xl shadow mb-4 flex-row items-center ${
              isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}
            style={{ elevation: 4 }}
          >
            <Ionicons name="pricetag-outline" size={28} color="#10b981" />
            <View className="flex-1 ml-3">
              <Text className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-800"}`}>
                Set Your Fare
              </Text>
              <Text className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                ₹{driverProfile?.baseFare || 30} base + ₹{driverProfile?.farePerKm || 12}/km
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={isDark ? "#9ca3af" : "#6b7280"} />
          </TouchableOpacity>

          {/* Earnings */}
          <TouchableOpacity
            onPress={() => router.push("/driver/earning")}
            className={`p-5 rounded-3xl shadow mb-4 flex-row items-center ${
              isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}
            style={{ elevation: 4 }}
          >
            <Ionicons name="cash-outline" size={28} color="#d97706" />
            <Text className={`ml-3 text-lg font-semibold ${isDark ? "text-white" : "text-gray-800"}`}>
              View Earnings
            </Text>
          </TouchableOpacity>

          {/* Ride History */}
          <TouchableOpacity
            onPress={() => router.push("/driver/ride-history")}
            className={`p-5 rounded-3xl shadow mb-4 flex-row items-center ${
              isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}
            style={{ elevation: 4 }}
          >
            <Ionicons name="time-outline" size={28} color="#d97706" />
            <Text className={`ml-3 text-lg font-semibold ${isDark ? "text-white" : "text-gray-800"}`}>
              Ride History
            </Text>
          </TouchableOpacity>

          {/* Ratings & Reviews */}
          <TouchableOpacity
            onPress={() => router.push("/driver/ratings")}
            className={`p-5 rounded-3xl shadow mb-4 flex-row items-center ${
              isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}
            style={{ elevation: 4 }}
          >
            <Ionicons name="star-outline" size={28} color="#FACC15" />
            <Text className={`ml-3 text-lg font-semibold ${isDark ? "text-white" : "text-gray-800"}`}>
              Ratings & Reviews
            </Text>
          </TouchableOpacity>

          {/* Driver Profile */}
          <TouchableOpacity
            onPress={() => router.push("/driver/driver-profile")}
            className={`p-5 rounded-3xl shadow mb-4 flex-row items-center ${
              isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}
            style={{ elevation: 4 }}
          >
            <Ionicons name="person-outline" size={28} color="#d97706" />
            <Text className={`ml-3 text-lg font-semibold ${isDark ? "text-white" : "text-gray-800"}`}>
              Driver Profile
            </Text>
          </TouchableOpacity>

          {/* Jobs - corrected bar (distinct icon + correct route) */}
          <TouchableOpacity
            onPress={() => router.push("/driver/jobs")}
            className={`p-5 rounded-3xl shadow mb-4 flex-row items-center ${
              isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}
            style={{ elevation: 4 }}
          >
            <Ionicons name="briefcase-outline" size={28} color="#d97706" />
            <Text className={`ml-3 text-lg font-semibold ${isDark ? "text-white" : "text-gray-800"}`}>
              Jobs
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Fare Settings Modal */}
      <Modal visible={fareModalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"} 
          style={{ flex: 1 }}
        >
          <View className="flex-1 justify-end">
            <View 
              className={`rounded-t-3xl p-6 ${isDark ? "bg-gray-800" : "bg-white"}`}
              style={{ elevation: 10, shadowColor: "#000", shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.25, shadowRadius: 10 }}
            >
              <View className="flex-row justify-between items-center mb-6">
                <Text className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                  Set Your Fare
                </Text>
                <TouchableOpacity onPress={() => setFareModalVisible(false)}>
                  <Ionicons name="close" size={28} color={isDark ? "#9ca3af" : "#6b7280"} />
                </TouchableOpacity>
              </View>

              <Text className={`mb-2 font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                Base Fare (₹)
              </Text>
              <Text className={`text-xs mb-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                Fixed charge for first kilometer (₹10 - ₹100)
              </Text>
              <View className={`flex-row items-center mb-4 border rounded-2xl px-4 ${isDark ? "border-gray-600 bg-gray-700" : "border-gray-300 bg-gray-50"}`}>
                <Text className={`text-xl ${isDark ? "text-gray-300" : "text-gray-600"}`}>₹</Text>
                <TextInput
                  value={baseFare}
                  onChangeText={setBaseFare}
                  keyboardType="numeric"
                  placeholder="30"
                  placeholderTextColor={isDark ? "#6b7280" : "#9ca3af"}
                  className={`flex-1 p-4 text-xl ${isDark ? "text-white" : "text-gray-900"}`}
                />
              </View>

              <Text className={`mb-2 font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                Fare Per Kilometer (₹)
              </Text>
              <Text className={`text-xs mb-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                Charge per km after first km (₹5 - ₹50)
              </Text>
              <View className={`flex-row items-center mb-4 border rounded-2xl px-4 ${isDark ? "border-gray-600 bg-gray-700" : "border-gray-300 bg-gray-50"}`}>
                <Text className={`text-xl ${isDark ? "text-gray-300" : "text-gray-600"}`}>₹</Text>
                <TextInput
                  value={farePerKm}
                  onChangeText={setFarePerKm}
                  keyboardType="numeric"
                  placeholder="12"
                  placeholderTextColor={isDark ? "#6b7280" : "#9ca3af"}
                  className={`flex-1 p-4 text-xl ${isDark ? "text-white" : "text-gray-900"}`}
                />
                <Text className={`text-lg ${isDark ? "text-gray-400" : "text-gray-500"}`}>/km</Text>
              </View>

              {/* Fare Preview */}
              <View className={`p-4 rounded-2xl mb-6 ${isDark ? "bg-gray-700" : "bg-yellow-50"}`}>
                <Text className={`font-semibold mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Fare Preview
                </Text>
                <View className="flex-row justify-between">
                  <Text className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>5 km ride:</Text>
                  <Text className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                    ₹{(parseFloat(baseFare || "0") + parseFloat(farePerKm || "0") * 4).toFixed(0)}
                  </Text>
                </View>
                <View className="flex-row justify-between mt-1">
                  <Text className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>10 km ride:</Text>
                  <Text className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                    ₹{(parseFloat(baseFare || "0") + parseFloat(farePerKm || "0") * 9).toFixed(0)}
                  </Text>
                </View>
                <View className="flex-row justify-between mt-1">
                  <Text className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>20 km ride:</Text>
                  <Text className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                    ₹{(parseFloat(baseFare || "0") + parseFloat(farePerKm || "0") * 19).toFixed(0)}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={saveFareSettings}
                disabled={savingFare}
                className="bg-yellow-500 p-4 rounded-2xl items-center"
              >
                {savingFare ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-lg font-bold">Save Fare Settings</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setFareModalVisible(false)}
                className={`p-4 rounded-2xl items-center mt-3 ${isDark ? "bg-gray-700" : "bg-gray-100"}`}
              >
                <Text className={`font-semibold ${isDark ? "text-gray-300" : "text-gray-600"}`}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
