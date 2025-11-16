// app/ride/shared-history.tsx
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function SharedHistory() {
  const router = useRouter();

  const history = [
    {
      id: "1",
      type: "Shared Ride",
      date: "Today • 3:45 PM",
      from: "HSR Layout",
      to: "MG Road",
      fare: "₹89",
      status: "Completed",
    },
    {
      id: "2",
      type: "Shared Ride",
      date: "Yesterday • 7:20 PM",
      from: "Koramangala",
      to: "Indiranagar",
      fare: "₹102",
      status: "Completed",
    },
    {
      id: "3",
      type: "Shared Ride",
      date: "Feb 2 • 5:10 PM",
      from: "BTM Layout",
      to: "HSR 27th Main",
      fare: "₹0",
      status: "Cancelled",
    },
  ];

  return (
    <View className="flex-1 bg-gray-50">

      {/* HEADER BG */}
      <View className="absolute top-0 left-0 right-0">
        <Svg height="200" width="100%">
          <Path d="M0 0 H400 V100 Q200 200 0 100 Z" fill="#FACC15" />
          <Path d="M0 20 H400 V120 Q200 220 0 120 Z" fill="#FDE047" opacity={0.5} />
        </Svg>
      </View>

      {/* Back */}
      <TouchableOpacity
        onPress={() => router.replace("/home")}
        className="absolute top-14 left-6 bg-white p-3 rounded-full shadow"
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      {/* Title */}
      <View className="mt-28 px-6">
        <Text className="text-3xl font-extrabold text-gray-900">
          Trip History
        </Text>
        <Text className="text-gray-700 mt-1">Your shared ride journeys</Text>
      </View>

      <ScrollView
        className="px-6 mt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 150 }}
      >
        {history.map((ride) => (
          <TouchableOpacity
            key={ride.id}
            onPress={() => router.push(`/ride/shared-invoice`)}
            className="bg-white p-5 rounded-3xl shadow mb-5 border border-gray-100"
            style={{ elevation: 3 }}
          >
            {/* TOP ROW */}
            <View className="flex-row justify-between mb-3">
              <View className="flex-row items-center">
                <Ionicons name="people-outline" size={26} color="#FACC15" />
                <Text className="ml-2 text-gray-900 font-semibold">
                  {ride.type}
                </Text>
              </View>

              <View
                className={`px-3 py-1 rounded-full ${
                  ride.status === "Completed"
                    ? "bg-green-100"
                    : "bg-red-100"
                }`}
              >
                <Text
                  className={`text-sm font-semibold ${
                    ride.status === "Completed"
                      ? "text-green-700"
                      : "text-red-600"
                  }`}
                >
                  {ride.status}
                </Text>
              </View>
            </View>

            {/* ROUTE */}
            <View className="flex-row items-center">
              <Ionicons name="location-outline" size={22} color="#555" />
              <Text className="ml-2 text-gray-800">{ride.from}</Text>
            </View>

            <View className="flex-row items-center ml-1 my-2">
              <Ionicons name="ellipsis-vertical" size={22} color="#bbb" />
            </View>

            <View className="flex-row items-center">
              <Ionicons name="flag-outline" size={22} color="#555" />
              <Text className="ml-2 text-gray-800">{ride.to}</Text>
            </View>

            {/* FARE + DATE */}
            <View className="flex-row justify-between mt-4">
              <Text className="text-gray-700">{ride.date}</Text>
              <Text className="text-yellow-600 font-bold text-lg">{ride.fare}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
