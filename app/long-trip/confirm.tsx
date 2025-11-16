// app/long-trip/confirm.tsx
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";

export default function ConfirmLongTrip() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const carType = params.carType || "Sedan";
  const price = params.price || "₹2,800";

  return (
    <View className="flex-1 bg-gray-50">
      {/* PREMIUM HEADER */}
      <View className="absolute top-0 left-0 right-0">
        <Svg height="240" width="100%">
          <Path
            d="M0 0 H400 V130 Q200 250 0 130 Z"
            fill="#FACC15"
          />
          <Path
            d="M0 40 H400 V160 Q200 280 0 160 Z"
            fill="#FDE047"
            opacity={0.4}
          />
        </Svg>
      </View>

      {/* Back button */}
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-14 left-6 bg-white p-3 rounded-full shadow"
        style={{ elevation: 5 }}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      {/* TITLE */}
      <View className="mt-28 px-6">
        <Text className="text-3xl font-extrabold text-gray-900">
          Confirm Your Ride
        </Text>
        <Text className="text-gray-700 mt-1">
          Review your trip details before booking
        </Text>
      </View>

      <ScrollView
        className="mt-6 px-6"
        contentContainerStyle={{ paddingBottom: 160 }}
        showsVerticalScrollIndicator={false}
      >
        {/* SELECTED CAR */}
        <View
          className="bg-white rounded-3xl p-6 shadow border border-gray-100 mb-6"
          style={{ elevation: 6 }}
        >
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center">
              {carType === "SUV" ? (
                <MaterialCommunityIcons
                  name="car-suv"
                  size={34}
                  color="#333"
                />
              ) : carType.includes("Prime") ? (
                <Ionicons name="car-sport" size={34} color="#333" />
              ) : (
                <FontAwesome5 name="car-side" size={32} color="#333" />
              )}

              <View className="ml-4">
                <Text className="text-xl font-semibold text-gray-900">
                  {carType}
                </Text>
                <Text className="text-gray-600 text-sm mt-1">
                  AC • Comfortable • Verified Driver
                </Text>
              </View>
            </View>

            <Text className="text-yellow-600 text-2xl font-extrabold">
              {price}
            </Text>
          </View>
        </View>

        {/* TRIP SUMMARY */}
        <View
          className="bg-white rounded-3xl p-6 shadow border border-gray-100 mb-6"
          style={{ elevation: 6 }}
        >
          <Text className="text-xl font-bold text-gray-900">Trip Summary</Text>

          {/* From */}
          <View className="flex-row items-center mt-5">
            <View className="w-3 h-3 rounded-full bg-yellow-500" />
            <Text className="ml-4 text-gray-900 font-semibold text-lg">
              {params.from || "Pickup Location"}
            </Text>
          </View>

          {/* Connector */}
          <View className="ml-1 mt-2 mb-2 h-10 border-l-2 border-gray-300" />

          {/* To */}
          <View className="flex-row items-center">
            <View className="w-3 h-3 rounded-full bg-gray-800" />
            <Text className="ml-4 text-gray-900 font-semibold text-lg">
              {params.to || "Drop Location"}
            </Text>
          </View>

          {/* Distance */}
          <View className="flex-row justify-between mt-5">
            <Text className="text-gray-700">
              Distance: <Text className="font-semibold">280 km</Text>
            </Text>

            <Text className="text-gray-700">
              Duration: <Text className="font-semibold">4h 20m</Text>
            </Text>
          </View>
        </View>

        {/* DATE & TIME */}
        <View
          className="bg-white rounded-3xl p-6 shadow border border-gray-100 mb-6"
          style={{ elevation: 6 }}
        >
          <Text className="text-xl font-bold text-gray-900">Travel Date</Text>

          <View className="flex-row items-center mt-4">
            <Ionicons name="calendar-outline" size={26} color="#FACC15" />
            <Text className="ml-3 text-lg text-gray-900">
              {params.date || "Not Selected"}
            </Text>
          </View>
        </View>

        {/* FARE BREAKDOWN */}
        <View
          className="bg-white rounded-3xl p-6 shadow border border-gray-100 mb-6"
          style={{ elevation: 6 }}
        >
          <Text className="text-xl font-bold text-gray-900">Fare Details</Text>

          <View className="mt-4">
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Base Fare</Text>
              <Text className="text-gray-900 font-semibold">₹2,500</Text>
            </View>

            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Taxes & Charges</Text>
              <Text className="text-gray-900 font-semibold">₹350</Text>
            </View>

            <View className="flex-row justify-between mt-3 pt-3 border-t border-gray-200">
              <Text className="text-gray-800 font-semibold text-lg">Total</Text>
              <Text className="text-yellow-600 font-extrabold text-xl">
                {price}
              </Text>
            </View>
          </View>
        </View>

        {/* CONFIRM BUTTON */}
        <TouchableOpacity
          onPress={() => router.push("/ride/finding")}
          className="bg-yellow-500 p-5 rounded-3xl items-center shadow"
          style={{ elevation: 5 }}
        >
          <Text className="text-white text-lg font-bold">Confirm Booking</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
