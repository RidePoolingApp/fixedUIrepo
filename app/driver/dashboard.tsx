import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState, useContext, useCallback } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { useApi, DriverProfile, Ride, DriverEarning } from "../services/api";
import * as Location from "expo-location";

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
      const [profile, earningsData, jobs] = await Promise.all([
        api.getMe(),
        api.getDriverEarnings(new Date().toISOString().split('T')[0]),
        api.getDriverJobs().catch(() => []),
      ]);

      if (profile.driverProfile) {
        setDriverProfile(profile.driverProfile);
        setOnline(profile.driverProfile.isOnline);
      }

      setTodayEarnings(earningsData.total);
      setTodayRides(earningsData.earnings.length);
      setPendingJobs(jobs);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchDashboardData();
    return () => {
      if (locationIntervalRef.current) {
        clearInterval(locationIntervalRef.current);
      }
    };
  }, [fetchDashboardData]);

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
        {/* ACTIVE RIDE CARD */}
        <View
          className={`p-5 rounded-3xl shadow ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
          style={{ elevation: 4 }}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="navigate-outline" size={26} color="#d97706" />
              <Text className={`ml-2 font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                Next Trip
              </Text>
            </View>
            <View className="px-3 py-1 rounded-full bg-gray-100 border border-gray-300">
              <Text className="text-gray-700 text-xs font-semibold">Trip #2481</Text>
            </View>
          </View>

          <Text className={`text-xl font-bold mt-3 ${isDark ? "text-white" : "text-gray-900"}`}>
            HSR Layout → MG Road
          </Text>
          <Text className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>ETA 8–12 min • 3.2 km</Text>

          <View className="flex-row mt-3">
            <View className="px-3 py-1 mr-2 rounded-full bg-yellow-100 border border-yellow-300">
              <Text className="text-yellow-700 text-xs font-semibold">UPI</Text>
            </View>
            <View className="px-3 py-1 mr-2 rounded-full bg-gray-100 border border-gray-300">
              <Text className="text-gray-700 text-xs font-semibold">2 Seats</Text>
            </View>
            <View className="px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300">
              <Text className="text-emerald-700 text-xs font-semibold">High Rating</Text>
            </View>
          </View>

          <View className="flex-row justify-between mt-4">
            <View>
              <Text className={`${isDark ? "text-gray-300" : "text-gray-500"}`}>Earnings</Text>
              <Text className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-800"}`}>₹89</Text>
            </View>
            <View>
              <Text className={`${isDark ? "text-gray-300" : "text-gray-500"}`}>Distance</Text>
              <Text className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-800"}`}>3.2 km</Text>
            </View>
            <View>
              <Text className={`${isDark ? "text-gray-300" : "text-gray-500"}`}>ETA</Text>
              <Text className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-800"}`}>8 min</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/driver/incoming-request")}
            className="mt-5 bg-yellow-500 p-4 rounded-2xl items-center"
          >
            <Text className="text-white font-bold">View Requests</Text>
          </TouchableOpacity>
        </View>

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
    </View>
  );
}
