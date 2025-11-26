import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";

export default function DriverDashboard() {
  const router = useRouter();
  const [online, setOnline] = useState(false);

  // pulse animation for ONLINE button
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

  return (
    <View className="flex-1 bg-gray-50">

      {/* YELLOW HEADER */}
      <View className="absolute top-0 left-0 right-0">
        <Svg height="260" width="100%">
          <Path d="M0 0 H400 V140 Q200 260 0 140 Z" fill="#FACC15" />
          <Path d="M0 40 H400 V180 Q200 320 0 180 Z" fill="#FDE047" opacity={0.4} />
        </Svg>
      </View>

      {/* HEADER BAR */}
      <View className="mt-16 px-6 flex-row justify-between items-center">
        <Text className="text-3xl font-extrabold text-gray-900">
          Driver Mode
        </Text>

        <TouchableOpacity
          onPress={() => router.push("/profile")}
          className="bg-white p-3 rounded-full shadow"
          style={{ elevation: 4 }}
        >
          <Ionicons name="person-circle-outline" size={30} color="#333" />
        </TouchableOpacity>
      </View>

      {/* STATUS BAR */}
      <View className="px-6 mt-3">
        <View className="bg-white p-5 rounded-3xl shadow border border-gray-200 flex-row justify-between items-center">
          <Text className="text-gray-800 font-semibold text-lg">
            Status:{" "}
            <Text className={online ? "text-green-600" : "text-red-500"}>
              {online ? "Online" : "Offline"}
            </Text>
          </Text>

          <TouchableOpacity
            onPress={() => setOnline(!online)}
            className={`px-4 py-2 rounded-2xl ${
              online ? "bg-red-500" : "bg-green-500"
            }`}
          >
            <Text className="text-white font-bold">
              {online ? "Go Offline" : "Go Online"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="px-6 mt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 160 }}
      >
        {/* EARNINGS & STATS */}
        <View className="flex-row justify-between">
          {/* Earnings */}
          <View
            className="bg-white w-[48%] p-5 rounded-3xl shadow border border-gray-200"
            style={{ elevation: 4 }}
          >
            <Ionicons name="wallet-outline" size={30} color="#d97706" />
            <Text className="text-gray-800 text-xl font-bold mt-3">₹1,450</Text>
            <Text className="text-gray-500 text-sm">Today’s Earnings</Text>
          </View>

          {/* Rating */}
          <View
            className="bg-white w-[48%] p-5 rounded-3xl shadow border border-gray-200"
            style={{ elevation: 4 }}
          >
            <Ionicons name="star-outline" size={30} color="#d97706" />
            <Text className="text-gray-800 text-xl font-bold mt-3">4.9</Text>
            <Text className="text-gray-500 text-sm">Your Rating</Text>
          </View>
        </View>

        {/* RIDE COUNT */}
        <View
          className="bg-white p-5 rounded-3xl shadow border border-gray-200 mt-6 flex-row justify-between items-center"
          style={{ elevation: 4 }}
        >
          <View>
            <Text className="text-gray-800 text-xl font-bold">12</Text>
            <Text className="text-gray-500 text-sm">Rides Today</Text>
          </View>
          <MaterialCommunityIcons name="steering" size={34} color="#d97706" />
        </View>

        {/* GO ONLINE BUTTON (Animated) */}
        <Animated.View
          style={{ transform: [{ scale: pulse }] }}
          className="mt-8"
        >
          <TouchableOpacity
            disabled={online}
            onPress={() => {
              setOnline(true);
              router.push("/driver/incoming-request");
            }}
            className={`p-5 rounded-3xl items-center shadow-lg ${
              online ? "bg-gray-300" : "bg-yellow-500"
            }`}
            style={{ elevation: 6 }}
          >
            <Text className="text-lg font-bold text-white">
              Go Online & Start Accepting Rides
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* QUICK LINKS */}
        <View className="mt-10">
          <Text className="text-gray-900 font-semibold text-lg mb-4">
            Quick Actions
          </Text>

          {/* Earnings */}
          <TouchableOpacity
            onPress={() => router.push("/driver/earning")}
            className="bg-white p-5 rounded-3xl shadow border border-gray-200 mb-4 flex-row items-center"
            style={{ elevation: 4 }}
          >
            <Ionicons name="cash-outline" size={28} color="#d97706" />
            <Text className="ml-3 text-gray-800 text-lg font-semibold">
              View Earnings
            </Text>
          </TouchableOpacity>

          {/* Ride History */}
          <TouchableOpacity
            onPress={() => router.push("/driver/ride-history")}
            className="bg-white p-5 rounded-3xl shadow border border-gray-200 mb-4 flex-row items-center"
            style={{ elevation: 4 }}
          >
            <Ionicons name="time-outline" size={28} color="#d97706" />
            <Text className="ml-3 text-gray-800 text-lg font-semibold">
              Ride History
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
  onPress={() => router.push("/driver/ratings")}
  className="bg-white p-5 rounded-2xl border border-gray-200 shadow flex-row items-center mb-3"
>
  <Ionicons name="star-outline" size={26} color="#FACC15" />
  <Text className="ml-4 text-gray-900 text-lg font-semibold">Ratings & Reviews</Text>
</TouchableOpacity>


          {/* Driver Profile */}
          <TouchableOpacity
            onPress={() => router.push("/driver/driver-profile")}
            className="bg-white p-5 rounded-3xl shadow border border-gray-200 flex-row items-center"
            style={{ elevation: 4 }}
          >
            <Ionicons name="person-outline" size={28} color="#d97706" />
            <Text className="ml-3 text-gray-800 text-lg font-semibold">
              Driver Profile
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
