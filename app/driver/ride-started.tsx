import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Image,
  ActivityIndicator,
  Alert,
  Linking,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useRef, useState, useCallback, useContext } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { useApi, Ride, RideStatus } from "../services/api";
import { ThemeContext } from "../context/ThemeContext";

export default function DriverRideStarted() {
  const router = useRouter();
  const params = useLocalSearchParams<{ rideId?: string }>();
  const rideId = params.rideId;
  const api = useApi();
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  // Ride data
  const [ride, setRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(true);

  // Live ride states
  const [time, setTime] = useState(0);
  const [completing, setCompleting] = useState(false);

  // Ride phase: enroute -> arrived -> onTrip
  const [phase, setPhase] = useState<"enroute" | "arrived" | "onTrip">("onTrip");

  // Waiting timer
  const [waiting, setWaiting] = useState(false);
  const [waitingSec, setWaitingSec] = useState(0);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Fetch ride data
  const fetchRide = useCallback(async () => {
    if (!rideId) {
      setLoading(false);
      return;
    }

    try {
      const rideData = await api.getRide(rideId);
      setRide(rideData);

      // Check if ride is already completed or cancelled
      if (rideData.status === RideStatus.COMPLETED) {
        router.replace({
          pathname: "/driver/ride-completed",
          params: { rideId },
        });
      } else if (rideData.status === RideStatus.CANCELLED) {
        Alert.alert("Ride Cancelled", "This ride has been cancelled.");
        router.replace("/driver/dashboard");
      }
    } catch (error) {
      console.error("Failed to fetch ride:", error);
      Alert.alert("Error", "Failed to load ride details");
    } finally {
      setLoading(false);
    }
  }, [rideId]);

  useEffect(() => {
    fetchRide();
    // Poll for updates every 10 seconds
    const pollInterval = setInterval(fetchRide, 10000);
    return () => clearInterval(pollInterval);
  }, [fetchRide]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();

    // Timer update every second
    const interval = setInterval(() => {
      setTime((t) => t + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Waiting time ticker
  useEffect(() => {
    if (!waiting) return;
    const timer = setInterval(() => setWaitingSec((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [waiting]);

  const endRide = async () => {
    if (!rideId || !ride) return;

    Alert.alert("End Ride", "Are you sure you want to complete this ride?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "End Ride",
        style: "destructive",
        onPress: async () => {
          setCompleting(true);
          try {
            await api.completeRide(rideId, {
              distance: ride.distance,
              fare: ride.fare,
            });
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            router.replace({
              pathname: "/driver/ride-completed",
              params: { rideId },
            });
          } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to complete ride");
          } finally {
            setCompleting(false);
          }
        },
      },
    ]);
  };

  const toggleWaiting = () => {
    setWaiting((w) => !w);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const callRider = () => {
    const riderPhone = ride?.rider?.phone;
    if (riderPhone) {
      Linking.openURL(`tel:${riderPhone}`);
    } else {
      Alert.alert("Not Available", "Rider's phone number is not available");
    }
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  // Rider info
  const riderName = ride?.rider
    ? `${ride.rider.firstName || ""} ${ride.rider.lastName || ""}`.trim() ||
      "Passenger"
    : "Passenger";
  const riderRating = 4.8; // Default rating

  // Location info
  const pickupLabel =
    ride?.pickup?.locationName || ride?.pickup?.address || "Pickup";
  const dropLabel = ride?.drop?.locationName || ride?.drop?.address || "Drop";

  if (loading) {
    return (
      <View
        className={`flex-1 items-center justify-center ${isDark ? "bg-gray-900" : "bg-gray-100"}`}
      >
        <ActivityIndicator size="large" color="#FACC15" />
        <Text className={`mt-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          Loading ride details...
        </Text>
      </View>
    );
  }

  if (!ride) {
    return (
      <View
        className={`flex-1 items-center justify-center px-6 ${isDark ? "bg-gray-900" : "bg-gray-100"}`}
      >
        <Ionicons
          name="car-outline"
          size={64}
          color={isDark ? "#6b7280" : "#999"}
        />
        <Text
          className={`mt-4 text-lg text-center ${isDark ? "text-white" : "text-gray-900"}`}
        >
          Ride not found
        </Text>
        <TouchableOpacity
          onPress={() => router.replace("/driver/dashboard")}
          className="mt-6 bg-yellow-500 px-6 py-3 rounded-2xl"
        >
          <Text className="text-white font-semibold">Go to Dashboard</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className={`flex-1 ${isDark ? "bg-gray-900" : "bg-gray-100"}`}>
      {/* PREMIUM NAV HEADER */}
      <View className="absolute top-0 left-0 right-0">
        <Svg height="230" width="100%">
          <Path
            d="M0 0 H400 V130 Q200 230 0 130 Z"
            fill={isDark ? "#374151" : "#FACC15"}
          />
          <Path
            d="M0 30 H400 V150 Q200 260 0 150 Z"
            fill={isDark ? "#4B5563" : "#FDE047"}
            opacity={0.35}
          />
        </Svg>
      </View>

      {/* BACK BUTTON */}
      <TouchableOpacity
        onPress={() => router.back()}
        className={`absolute top-14 left-6 p-3 rounded-full shadow ${isDark ? "bg-gray-800" : "bg-white"}`}
        style={{ elevation: 6 }}
      >
        <Ionicons name="arrow-back" size={24} color={isDark ? "#fff" : "#333"} />
      </TouchableOpacity>

      {/* CALL BUTTON */}
      <TouchableOpacity
        onPress={callRider}
        className="absolute top-14 right-6 p-3 rounded-full shadow bg-green-500"
        style={{ elevation: 6 }}
      >
        <Ionicons name="call" size={24} color="#fff" />
      </TouchableOpacity>

      {/* TITLE */}
      <View className="mt-28 px-6">
        <Text
          className={`text-3xl font-extrabold ${isDark ? "text-white" : "text-gray-900"}`}
        >
          Ride in Progress
        </Text>
        <Text className={`mt-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
          Navigate to destination safely
        </Text>

        {/* Info chips */}
        <View className="flex-row mt-3">
          <View className="px-3 py-1 mr-2 rounded-full bg-yellow-100 border border-yellow-300">
            <Text className="text-yellow-700 text-xs font-semibold">
              {ride.payment?.method || "CASH/UPI"}
            </Text>
          </View>
          <View
            className={`px-3 py-1 mr-2 rounded-full border ${isDark ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-300"}`}
          >
            <Text
              className={`text-xs font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}
            >
              {ride.type}
            </Text>
          </View>
          {waiting ? (
            <View className="px-3 py-1 rounded-full bg-red-100 border border-red-300">
              <Text className="text-red-700 text-xs font-semibold">
                Waiting {formatTime(waitingSec)}
              </Text>
            </View>
          ) : (
            <View className="px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300">
              <Text className="text-emerald-700 text-xs font-semibold">
                On Time
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* MAP VIEW PLACEHOLDER */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [40, 0],
              }),
            },
          ],
        }}
        className={`mx-6 mt-6 rounded-3xl shadow p-6 border ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
      >
        {/* MAP Placeholder */}
        <View
          className={`h-40 rounded-2xl items-center justify-center ${isDark ? "bg-gray-700" : "bg-gray-200"}`}
        >
          <Ionicons
            name="navigate-outline"
            size={70}
            color={isDark ? "#6b7280" : "#999"}
          />
          <Text
            className={`mt-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            Navigation in progress...
          </Text>
        </View>

        {/* Rider row */}
        <View className="mt-5 flex-row items-center justify-between">
          <View className="flex-row items-center">
            {ride.rider?.profileImage ? (
              <Image
                source={{ uri: ride.rider.profileImage }}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <View
                className={`w-10 h-10 rounded-full items-center justify-center ${isDark ? "bg-gray-700" : "bg-gray-200"}`}
              >
                <Ionicons
                  name="person"
                  size={20}
                  color={isDark ? "#9ca3af" : "#6b7280"}
                />
              </View>
            )}
            <View className="ml-3">
              <Text
                className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {riderName}
              </Text>
              <View className="flex-row items-center">
                <Ionicons name="star" size={14} color="#FACC15" />
                <Text
                  className={`ml-1 text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}
                >
                  {riderRating}
                </Text>
              </View>
            </View>
          </View>
          <View
            className={`px-3 py-1 rounded-full border ${isDark ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-300"}`}
          >
            <Text
              className={`text-xs font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}
            >
              Trip #{ride.id.slice(0, 6)}
            </Text>
          </View>
        </View>

        {/* LIVE DETAILS ROW */}
        <View className="flex-row justify-between mt-6">
          {/* TIME */}
          <View className="items-center">
            <Ionicons name="time-outline" size={26} color="#FACC15" />
            <Text
              className={`font-bold mt-1 ${isDark ? "text-white" : "text-gray-900"}`}
            >
              {formatTime(time)}
            </Text>
            <Text
              className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
            >
              Time
            </Text>
          </View>

          {/* DISTANCE */}
          <View className="items-center">
            <MaterialCommunityIcons
              name="map-marker-distance"
              size={28}
              color="#FACC15"
            />
            <Text
              className={`font-bold mt-1 ${isDark ? "text-white" : "text-gray-900"}`}
            >
              {ride.distance ? `${ride.distance} km` : "N/A"}
            </Text>
            <Text
              className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
            >
              Distance
            </Text>
          </View>

          {/* FARE */}
          <View className="items-center">
            <Ionicons name="cash-outline" size={26} color="#FACC15" />
            <Text className="font-bold mt-1 text-yellow-600">
              {ride.fare ? `₹${ride.fare}` : "N/A"}
            </Text>
            <Text
              className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
            >
              Fare
            </Text>
          </View>
        </View>

        {/* ROUTE CARD */}
        <View
          className={`mt-6 border-t pt-4 ${isDark ? "border-gray-700" : "border-gray-200"}`}
        >
          <View className="flex-row items-start mb-2">
            <View className="w-3 h-3 rounded-full bg-green-500 mt-1" />
            <View className="ml-3 flex-1">
              <Text
                className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
              >
                PICKUP
              </Text>
              <Text
                className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {pickupLabel}
              </Text>
            </View>
          </View>
          <View className="flex-row items-start">
            <View className="w-3 h-3 rounded-full bg-red-500 mt-1" />
            <View className="ml-3 flex-1">
              <Text
                className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
              >
                DROP
              </Text>
              <Text
                className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {dropLabel}
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* BOTTOM ACTION BAR */}
      <View className="absolute bottom-10 left-0 right-0 px-6">
        <View className="flex-row">
          <TouchableOpacity
            onPress={endRide}
            disabled={completing}
            className="flex-[1.4] bg-red-500 p-5 rounded-3xl items-center shadow-lg"
            style={{ elevation: 10 }}
          >
            {completing ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-xl">End Ride</Text>
            )}
          </TouchableOpacity>
          <View className="w-3" />
          <TouchableOpacity
            onPress={toggleWaiting}
            className={`flex-1 p-5 rounded-3xl items-center border shadow ${
              waiting
                ? "bg-red-50 border-red-300"
                : isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-300"
            }`}
            style={{ elevation: 6 }}
          >
            <Text
              className={`text-lg font-semibold ${
                waiting
                  ? "text-red-600"
                  : isDark
                    ? "text-gray-300"
                    : "text-gray-700"
              }`}
            >
              {waiting ? `${formatTime(waitingSec)}` : "Wait"}
            </Text>
          </TouchableOpacity>
        </View>
        <Text
          className={`text-center mt-2 text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}
        >
          Waiting time is added to fare as per policy
        </Text>
      </View>
    </View>
  );
}
