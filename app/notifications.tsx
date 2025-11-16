// app/notifications.tsx
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import Svg, { Path } from "react-native-svg";
import BottomNav from "./components/BottomNav";
import { Ionicons } from "@expo/vector-icons";

export default function Notifications() {
  const data = [
    {
      title: "Driver arriving in 2 minutes",
      desc: "Your driver for today’s daily cab is almost at pickup point.",
      icon: "car-outline",
      time: "2 min ago",
      unread: true,
    },
    {
      title: "Long Trip Discount Unlocked",
      desc: "You received a 20% coupon for long trips.",
      icon: "pricetag-outline",
      time: "1 hr ago",
      unread: false,
    },
    {
      title: "Ride Completed",
      desc: "Your daily cab ride has been completed successfully.",
      icon: "checkmark-circle-outline",
      time: "Yesterday",
      unread: false,
    },
  ];

  return (
    <View className="flex-1 bg-gray-50">

      {/* PREMIUM CURVED HEADER */}
      <View className="absolute top-0 left-0 right-0">
        <Svg height="240" width="100%">
          <Path d="M0 0 H400 V140 Q200 240 0 140 Z" fill="#FACC15" />
        </Svg>
      </View>

      <View className="mt-20 px-6 mb-4">
        <Text className="text-3xl font-extrabold text-gray-900">Alerts</Text>
        <Text className="text-gray-700 mt-1">
          Stay updated with your rides & offers
        </Text>
      </View>

      <ScrollView className="px-6" contentContainerStyle={{ paddingBottom: 120 }}>
        {data.map((item, i) => (
          <TouchableOpacity
            key={i}
            className={`p-5 rounded-3xl shadow border mb-4 ${
              item.unread ? "bg-yellow-50 border-yellow-300" : "bg-white border-gray-200"
            }`}
            style={{ elevation: 5 }}
          >
            <View className="flex-row items-start">
              <Ionicons name={item.icon} size={32} color="#b45309" />

              <View className="ml-4 flex-1">
                <Text className="text-lg font-bold text-gray-900">
                  {item.title}
                </Text>
                <Text className="text-gray-700 mt-1">{item.desc}</Text>

                <Text className="text-gray-400 text-xs mt-2">{item.time}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <BottomNav />
    </View>
  );
}
