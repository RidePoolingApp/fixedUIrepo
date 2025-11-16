// app/ride/daily-cab-weekly.tsx
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function DailyCabWeekly() {
  const router = useRouter();

  // Mock weekly data
  const weekData = [
    { day: "Mon", rides: 1 },
    { day: "Tue", rides: 1 },
    { day: "Wed", rides: 1 },
    { day: "Thu", rides: 0 },
    { day: "Fri", rides: 1 },
    { day: "Sat", rides: 0 },
    { day: "Sun", rides: 0 },
  ];

  const totalRides = weekData.filter((d) => d.rides === 1).length;
  const missed = weekData.filter((d) => d.rides === 0).length;
  const totalAmount = totalRides * 150;

  return (
    <View className="flex-1 bg-gray-50">

      {/* PREMIUM HEADER CURVE */}
      <View className="absolute top-0 left-0 right-0">
        <Svg height="250" width="100%">
          <Path d="M0 0 H400 V130 Q200 250 0 130 Z" fill="#FACC15" />
          <Path d="M0 35 H400 V160 Q200 280 0 160 Z" fill="#FDE047" opacity={0.5} />
        </Svg>
      </View>

      {/* BACK BUTTON */}
      <TouchableOpacity
        onPress={() => router.replace("/home")}
        className="absolute top-14 left-6 bg-white p-3 rounded-full shadow"
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      {/* PAGE TITLE */}
      <View className="mt-28 px-6">
        <Text className="text-3xl font-extrabold text-gray-900">Weekly Summary</Text>
        <Text className="text-gray-700 mt-1">Your daily cab performance</Text>
      </View>

      <ScrollView
        className="px-6 mt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 160 }}
      >

        {/* WEEKLY STATS */}
        <View className="bg-white p-6 rounded-3xl shadow border border-gray-200">
          <Text className="text-xl font-bold text-gray-900 mb-4">
            This Week
          </Text>

          <View className="flex-row justify-between">
            <View className="items-center">
              <Ionicons name="checkmark-circle" size={40} color="#22c55e" />
              <Text className="text-xl font-bold text-gray-900 mt-2">{totalRides}</Text>
              <Text className="text-gray-600">Completed</Text>
            </View>

            <View className="items-center">
              <Ionicons name="close-circle" size={40} color="#ef4444" />
              <Text className="text-xl font-bold text-gray-900 mt-2">{missed}</Text>
              <Text className="text-gray-600">Missed</Text>
            </View>

            <View className="items-center">
              <Ionicons name="cash-outline" size={40} color="#FACC15" />
              <Text className="text-xl font-bold text-gray-900 mt-2">
                ₹{totalAmount}
              </Text>
              <Text className="text-gray-600">Paid</Text>
            </View>
          </View>
        </View>

        {/* WEEKLY GRAPH (ICON-BAR GRAPH WITHOUT LIBRARY) */}
        <View className="bg-white p-6 rounded-3xl shadow border border-gray-200 mt-6">
          <Text className="text-xl font-bold text-gray-900 mb-4">Weekly Activity</Text>

          <View className="flex-row justify-between items-end h-40 px-2">

            {weekData.map((d) => (
              <View key={d.day} className="items-center">
                {/* Bar */}
                <View
                  className={`w-8 rounded-xl ${
                    d.rides === 1 ? "bg-yellow-500" : "bg-gray-300"
                  }`}
                  style={{ height: d.rides === 1 ? 120 : 30 }}
                />
                <Text className="mt-2 font-semibold text-gray-700">{d.day}</Text>
              </View>
            ))}

          </View>
        </View>

        {/* DAILY BREAKDOWN */}
        <View className="bg-white p-6 rounded-3xl shadow border border-gray-200 mt-6">
          <Text className="text-xl font-bold text-gray-900 mb-4">
            Day-wise Summary
          </Text>

          {weekData.map((d, idx) => (
            <View
              key={idx}
              className="flex-row justify-between items-center py-3 border-b border-gray-200"
            >
              <Text className="text-gray-900 font-semibold">{d.day}</Text>

              {d.rides === 1 ? (
                <View className="flex-row items-center">
                  <Ionicons name="checkmark-circle" size={20} color="#16a34a" />
                  <Text className="ml-2 text-gray-700">Completed</Text>
                </View>
              ) : (
                <View className="flex-row items-center">
                  <Ionicons name="close-circle" size={20} color="#dc2626" />
                  <Text className="ml-2 text-gray-700">Missed</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* NEXT RIDE NOTICE */}
        <View className="bg-green-100 p-5 rounded-2xl mt-8 border border-green-300 items-center">
          <Ionicons name="calendar-outline" size={35} color="#16a34a" />
          <Text className="text-green-700 font-bold text-lg mt-2">
            Next Ride Tomorrow • 8:00 AM
          </Text>
        </View>

        {/* HOME */}
        <TouchableOpacity
          onPress={() => router.replace("/home")}
          className="bg-white p-5 rounded-3xl items-center mt-5 border border-gray-300 shadow"
        >
          <Text className="text-gray-900 text-lg font-semibold">
            Back to Home
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}
