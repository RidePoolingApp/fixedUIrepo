// app/ride/daily-cab-confirm.tsx
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function DailyCabConfirm() {
  const router = useRouter();

  // Dummy data - replace with real state if needed
  const pickup = "HSR Layout Sector 2";
  const drop = "MG Road Metro Station";
  const time = "8:00 AM";
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const fare = "₹150 / day";

  return (
    <View className="flex-1 bg-gray-50">

      {/* HEADER */}
      <View className="absolute top-0 left-0 right-0">
        <Svg height="230" width="100%">
          <Path d="M0 0 H400 V120 Q200 230 0 120 Z" fill="#FACC15" />
          <Path d="M0 35 H400 V150 Q200 260 0 150 Z" fill="#FDE047" opacity={0.5} />
        </Svg>
      </View>

      {/* BACK BUTTON */}
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-14 left-6 bg-white p-3 rounded-full shadow"
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      {/* TITLE */}
      <View className="mt-28 px-6">
        <Text className="text-3xl font-extrabold text-gray-900">
          Confirm Schedule
        </Text>
        <Text className="text-gray-700 mt-1">
          Review your daily cab details
        </Text>
      </View>

      {/* BODY */}
      <ScrollView
        className="px-6 mt-8"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 150 }}
      >

        {/* PICKUP & DROP */}
        <View className="bg-white p-6 rounded-3xl shadow border border-gray-200">
          <Text className="text-xl font-bold text-gray-900 mb-4">
            Route Details
          </Text>

          {/* Pickup */}
          <View className="flex-row items-center mb-4">
            <Ionicons name="location-outline" size={28} color="#FACC15" />
            <View className="ml-3">
              <Text className="text-gray-900 font-semibold">Pickup</Text>
              <Text className="text-gray-600">{pickup}</Text>
            </View>
          </View>

          {/* Divider */}
          <View className="h-[1px] bg-gray-200 mb-4" />

          {/* Drop */}
          <View className="flex-row items-center">
            <Ionicons name="flag-outline" size={28} color="#FACC15" />
            <View className="ml-3">
              <Text className="text-gray-900 font-semibold">Drop</Text>
              <Text className="text-gray-600">{drop}</Text>
            </View>
          </View>
        </View>

        {/* TIME SLOT CARD */}
        <View className="bg-white p-6 rounded-3xl shadow border border-gray-200 mt-6">
          <Text className="text-xl font-bold text-gray-900 mb-3">
            Time Slot
          </Text>

          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={26} color="#FACC15" />
            <Text className="ml-3 text-gray-900 text-lg font-semibold">{time}</Text>
          </View>
        </View>

        {/* DAYS CARD */}
        <View className="bg-white p-6 rounded-3xl shadow border border-gray-200 mt-6">
          <Text className="text-xl font-bold text-gray-900 mb-4">Repeat Days</Text>

          <View className="flex-row flex-wrap gap-3">
            {days.map((d) => (
              <View
                key={d}
                className="px-4 py-2 rounded-xl bg-yellow-400"
              >
                <Text className="font-semibold text-white">{d}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* FARE CARD */}
        <View className="bg-white p-6 rounded-3xl shadow border border-gray-200 mt-6">
          <Text className="text-xl font-bold text-gray-900 mb-2">Estimated Fare</Text>
          <Text className="text-yellow-600 font-extrabold text-3xl">{fare}</Text>
          <Text className="text-gray-600 mt-1">Charged daily at start of trip</Text>
        </View>

        {/* CONFIRM BUTTON */}
        <TouchableOpacity
          onPress={() => router.replace("/ride/daily-cab-assigned")}
          className="bg-yellow-500 p-5 rounded-3xl items-center mt-10 shadow"
        >
          <Text className="text-white font-bold text-lg">
            Confirm & Assign Driver
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
