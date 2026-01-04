import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  Alert,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import FareBreakdown from "../components/FareBreakdown";
import { useRef, useEffect, useState, useCallback, useContext } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { useApi, Ride } from "../services/api";
import { ThemeContext } from "../context/ThemeContext";

export default function DriverRideCompleted() {
  const router = useRouter();
  const params = useLocalSearchParams<{ rideId?: string }>();
  const rideId = params.rideId;
  const api = useApi();
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const [ride, setRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(true);

  // Animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(60)).current;

  const fetchRide = useCallback(async () => {
    if (!rideId) {
      setLoading(false);
      return;
    }

    try {
      const rideData = await api.getRide(rideId);
      setRide(rideData);
    } catch (error) {
      console.error("Failed to fetch ride:", error);
      Alert.alert("Error", "Failed to load ride details");
    } finally {
      setLoading(false);
    }
  }, [rideId]);

  useEffect(() => {
    fetchRide();
  }, [fetchRide]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(slideUp, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  // Calculate fare breakdown
  const baseFare = 30;
  const distanceCharge = ride?.distance ? Math.round((ride.distance - 1) * 12) : 0;
  const totalFare = ride?.fare || baseFare + distanceCharge;

  // Calculate duration in minutes
  const duration = ride?.duration || 
    (ride?.startedAt && ride?.completedAt 
      ? Math.round((new Date(ride.completedAt).getTime() - new Date(ride.startedAt).getTime()) / 60000)
      : 0);

  // Location labels
  const pickupLabel = ride?.pickup?.locationName || ride?.pickup?.address || "Pickup";
  const dropLabel = ride?.drop?.locationName || ride?.drop?.address || "Drop";

  // Payment status
  const paymentStatus = ride?.payment?.status || "PENDING";
  const paymentMethod = ride?.payment?.method || "CASH";
  const isPaid = paymentStatus === "COMPLETED";

  if (loading) {
    return (
      <View className={`flex-1 items-center justify-center ${isDark ? "bg-gray-900" : "bg-gray-100"}`}>
        <ActivityIndicator size="large" color="#FACC15" />
        <Text className={`mt-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          Loading ride summary...
        </Text>
      </View>
    );
  }

  if (!ride) {
    return (
      <View className={`flex-1 items-center justify-center px-6 ${isDark ? "bg-gray-900" : "bg-gray-100"}`}>
        <Ionicons name="car-outline" size={64} color={isDark ? "#6b7280" : "#999"} />
        <Text className={`mt-4 text-lg text-center ${isDark ? "text-white" : "text-gray-900"}`}>
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
      {/* PREMIUM HEADER */}
      <View className="absolute top-0 left-0 right-0">
        <Svg height="230" width="100%">
          <Path d="M0 0 H400 V130 Q200 230 0 130 Z" fill={isDark ? "#374151" : "#FACC15"} />
          <Path d="M0 30 H400 V150 Q200 260 0 150 Z" fill={isDark ? "#4B5563" : "#FDE047"} opacity={0.35} />
        </Svg>
      </View>

      {/* BACK BUTTON */}
      <TouchableOpacity
        onPress={() => router.replace("/driver/dashboard")}
        className={`absolute top-14 left-6 p-3 rounded-full shadow ${isDark ? "bg-gray-800" : "bg-white"}`}
        style={{ elevation: 6 }}
      >
        <Ionicons name="arrow-back" size={24} color={isDark ? "#fff" : "#333"} />
      </TouchableOpacity>

      {/* TITLE */}
      <View className="mt-28 px-6">
        <Text className={`text-3xl font-extrabold ${isDark ? "text-white" : "text-gray-900"}`}>
          Ride Completed
        </Text>
        <Text className={`mt-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
          Trip summary generated
        </Text>
      </View>

      {/* CONTENT */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideUp }],
        }}
        className={`mx-6 mt-6 p-6 rounded-3xl shadow border ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
      >
        {/* TRIP SUMMARY */}
        <Text className={`text-lg font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
          Trip Summary
        </Text>

        {/* PICKUP - DROP */}
        <View className="flex-row items-start mb-4">
          <View className="w-3 h-3 rounded-full bg-green-500 mt-1" />
          <View className="ml-3 flex-1">
            <Text className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
              {pickupLabel}
            </Text>
            <Text className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Pickup Location
            </Text>
          </View>
        </View>

        <View className="flex-row items-start mb-6">
          <View className="w-3 h-3 rounded-full bg-red-500 mt-1" />
          <View className="ml-3 flex-1">
            <Text className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
              {dropLabel}
            </Text>
            <Text className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Drop Location
            </Text>
          </View>
        </View>

        {/* TRIP DETAILS */}
        <View className="flex-row justify-between mb-6">
          <View className="items-center">
            <MaterialCommunityIcons name="map-marker-distance" size={28} color="#FACC15" />
            <Text className={`font-bold mt-1 ${isDark ? "text-white" : "text-gray-800"}`}>
              {ride.distance ? `${ride.distance} km` : "N/A"}
            </Text>
            <Text className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Distance
            </Text>
          </View>

          <View className="items-center">
            <Ionicons name="time-outline" size={26} color="#FACC15" />
            <Text className={`font-bold mt-1 ${isDark ? "text-white" : "text-gray-800"}`}>
              {duration > 0 ? `${duration} min` : "N/A"}
            </Text>
            <Text className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Duration
            </Text>
          </View>

          <View className="items-center">
            <Ionicons name="cash-outline" size={26} color="#FACC15" />
            <Text className="font-bold mt-1 text-yellow-600">
              ₹{totalFare}
            </Text>
            <Text className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Total Fare
            </Text>
          </View>
        </View>

        {/* BILLING SECTION */}
        <FareBreakdown
          items={[
            { label: "Base Fare", amount: baseFare },
            { label: "Distance Charge", amount: distanceCharge, note: ride.distance ? `${ride.distance} km` : "" },
          ]}
          total={totalFare}
          currency="₹"
          accentColor="#FACC15"
        />

        {/* PAYMENT STATUS */}
        <View
          className={`p-4 rounded-2xl mt-6 ${
            isPaid
              ? "bg-green-100 border border-green-300"
              : paymentMethod === "CASH"
                ? "bg-yellow-100 border border-yellow-300"
                : "bg-orange-100 border border-orange-300"
          }`}
        >
          <Text
            className={`font-bold text-lg ${
              isPaid
                ? "text-green-700"
                : paymentMethod === "CASH"
                  ? "text-yellow-700"
                  : "text-orange-700"
            }`}
          >
            {isPaid
              ? "Payment Received"
              : paymentMethod === "CASH"
                ? "Collect Cash Payment"
                : "Payment Pending"}
          </Text>
          <Text className={`mt-1 ${isDark ? "text-gray-600" : "text-gray-600"}`}>
            {isPaid
              ? `Paid via ${paymentMethod}`
              : paymentMethod === "CASH"
                ? `Collect ₹${totalFare} from passenger`
                : "Waiting for online payment"}
          </Text>
        </View>

        {/* Rider Info */}
        <View className={`mt-4 p-3 rounded-xl ${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
          <Text className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Passenger
          </Text>
          <Text className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
            {ride.rider?.firstName || ""} {ride.rider?.lastName || "Passenger"}
          </Text>
        </View>
      </Animated.View>

      {/* BUTTONS */}
      <View className="absolute bottom-10 left-0 right-0 px-6">
        <TouchableOpacity
          onPress={() => router.replace("/driver/dashboard")}
          className="bg-yellow-500 p-5 rounded-3xl items-center shadow-lg"
          style={{ elevation: 10 }}
        >
          <Text className="text-white text-lg font-bold">Back to Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/driver/earning")}
          className={`p-4 rounded-3xl mt-3 items-center border shadow ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-400"}`}
          style={{ elevation: 4 }}
        >
          <Text className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-800"}`}>
            View Earnings
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
