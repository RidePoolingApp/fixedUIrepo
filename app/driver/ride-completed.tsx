import {
  View,
  Text,
  TouchableOpacity,
  Animated,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import FareBreakdown from "../components/FareBreakdown";
import { useRef, useEffect } from "react";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

export default function DriverRideCompleted() {
  const router = useRouter();

  // Animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(60)).current;

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

  return (
    <View className="flex-1 bg-gray-100">
      
      {/* PREMIUM HEADER */}
      <View className="absolute top-0 left-0 right-0">
        <Svg height="230" width="100%">
          <Path d="M0 0 H400 V130 Q200 230 0 130 Z" fill="#FACC15" />
          <Path d="M0 30 H400 V150 Q200 260 0 150 Z" fill="#FDE047" opacity={0.35} />
        </Svg>
      </View>

      {/* BACK BUTTON */}
      <TouchableOpacity
        onPress={() => router.replace("/driver/dashboard")}
        className="absolute top-14 left-6 bg-white p-3 rounded-full shadow"
        style={{ elevation: 6 }}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      {/* TITLE */}
      <View className="mt-28 px-6">
        <Text className="text-3xl font-extrabold text-gray-900">Ride Completed</Text>
        <Text className="text-gray-700 mt-1">Trip summary generated</Text>
      </View>

      {/* CONTENT */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideUp }],
        }}
        className="mx-6 mt-6 bg-white p-6 rounded-3xl shadow border border-gray-200"
      >
        {/* TRIP SUMMARY */}
        <Text className="text-lg font-bold text-gray-900 mb-2">Trip Summary</Text>

        {/* PICKUP - DROP */}
        <View className="flex-row items-start mb-6">
          <Ionicons name="location" size={26} color="#FACC15" />
          <View className="ml-3">
            <Text className="text-gray-900 font-semibold">HSR Layout</Text>
            <Text className="text-gray-500 text-sm">Pickup Location</Text>
          </View>
        </View>

        <View className="flex-row items-start mb-6">
          <Ionicons name="flag" size={26} color="#FACC15" />
          <View className="ml-3">
            <Text className="text-gray-900 font-semibold">MG Road</Text>
            <Text className="text-gray-500 text-sm">Drop Location</Text>
          </View>
        </View>

        {/* TRIP DETAILS */}
        <View className="flex-row justify-between mb-6">
          <View className="items-center">
            <MaterialCommunityIcons name="map-marker-distance" size={28} color="#FACC15" />
            <Text className="font-bold text-gray-800 mt-1">6.2 km</Text>
            <Text className="text-gray-600 text-xs">Distance</Text>
          </View>

          <View className="items-center">
            <Ionicons name="time-outline" size={26} color="#FACC15" />
            <Text className="font-bold text-gray-800 mt-1">14 min</Text>
            <Text className="text-gray-600 text-xs">Duration</Text>
          </View>

          <View className="items-center">
            <MaterialCommunityIcons name="speedometer" size={28} color="#FACC15" />
            <Text className="font-bold text-gray-800 mt-1">32 km/h</Text>
            <Text className="text-gray-600 text-xs">Avg. Speed</Text>
          </View>
        </View>

        {/* BILLING SECTION */}
        <FareBreakdown
          items={[
            { label: "Base Fare", amount: 45 },
            { label: "Distance Charge", amount: 120, note: "6.2 km" },
            { label: "Time Charge", amount: 30, note: "14 min" },
          ]}
          total={195}
          currency="₹"
          accentColor="#FACC15"
        />

        {/* PAYMENT STATUS */}
        <View className="bg-green-100 border border-green-300 p-4 rounded-2xl mt-6">
          <Text className="text-green-700 font-bold text-lg">Payment Received</Text>
          <Text className="text-gray-600 mt-1">Paid via UPI</Text>
        </View>
      </Animated.View>

      {/* BUTTONS */}
      <View className="absolute bottom-10 left-0 right-0 px-6">
        <TouchableOpacity
          className="bg-yellow-500 p-5 rounded-3xl items-center shadow-lg"
          style={{ elevation: 10 }}
        >
          <Text className="text-white text-lg font-bold">Download Invoice</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.replace("/driver/dashboard")}
          className="p-4 rounded-3xl mt-3 items-center border border-gray-400 bg-white shadow"
          style={{ elevation: 4 }}
        >
          <Text className="text-gray-800 text-lg font-semibold">Back to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
