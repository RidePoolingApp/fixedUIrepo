// app/bookings.tsx
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Svg, { Path } from "react-native-svg";
import BottomNav from "./components/BottomNav";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Bookings() {
  const router = useRouter();

  const rides = [
    {
      from: "HSR Layout",
      to: "MG Road Metro",
      fare: "₹150",
      status: "Completed",
      icon: "checkmark-done-circle",
      time: "Today • 8:00 AM",
    },
    {
      from: "Whitefield",
      to: "Airport",
      fare: "₹820",
      status: "Cancelled",
      icon: "close-circle",
      time: "Yesterday",
    },
  ];

  return (
    <View className="flex-1 bg-gray-50">

      {/* HEADER */}
      <View className="absolute top-0 left-0 right-0">
        <Svg height="240" width="100%">
          <Path d="M0 0 H400 V140 Q200 240 0 140 Z" fill="#FACC15" />
        </Svg>
      </View>

      <View className="mt-20 px-6 mb-4">
        <Text className="text-3xl font-extrabold text-gray-900">My Bookings</Text>
        <Text className="text-gray-700 mt-1">Past & upcoming rides</Text>
      </View>

      <ScrollView className="px-6" contentContainerStyle={{ paddingBottom: 120 }}>
        {rides.map((item, i) => (
          <TouchableOpacity
            key={i}
            className="bg-white rounded-3xl p-6 shadow border border-gray-200 mb-5"
            style={{ elevation: 5 }}
          >
            <View className="flex-row items-center mb-3">
              <Ionicons name={item.icon} size={30} color="#b45309" />
              <Text className="ml-3 text-lg font-bold text-gray-900">
                {item.status}
              </Text>
            </View>

            <View className="flex-row items-center mb-2">
              <Ionicons name="location-outline" size={22} color="#b45309" />
              <Text className="ml-2 text-gray-900 font-semibold">{item.from}</Text>
            </View>

            <View className="ml-3 h-6 border-l-2 border-gray-300" />

            <View className="flex-row items-center mt-2">
              <Ionicons name="flag-outline" size={22} color="#b45309" />
              <Text className="ml-2 text-gray-900 font-semibold">{item.to}</Text>
            </View>

            <Text className="text-gray-500 mt-3">{item.time}</Text>

            <View className="mt-4 flex-row justify-between items-center">
              <Text className="text-yellow-600 text-xl font-extrabold">
                {item.fare}
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/book")}
                className="px-4 py-2 bg-yellow-500 rounded-xl"
              >
                <Text className="text-white font-semibold">Rebook</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <BottomNav />
    </View>
  );
}
