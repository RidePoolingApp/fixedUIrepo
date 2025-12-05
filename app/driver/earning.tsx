import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "expo-router";

export default function DriverEarnings() {
  const router = useRouter();

  const tabs = ["Today", "Week", "Month"];
  const [active, setActive] = useState("Today");

  // Fake earnings data
  const data = {
    Today: { earnings: "₹1,450", rides: 12, hours: 5.2 },
    Week: { earnings: "₹9,840", rides: 62, hours: 41 },
    Month: { earnings: "₹38,200", rides: 198, hours: 162 },
  };

  // Graph animation
  const graphAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(graphAnim, {
      toValue: 1,
      duration: 900,
      useNativeDriver: true,
    }).start();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [active]);

  return (
    <View className="flex-1 bg-gray-50">
      {/* PREMIUM HEADER */}
      <View className="absolute top-0 left-0 right-0">
        <Svg height="240" width="100%">
          <Path d="M0 0 H400 V140 Q200 240 0 140 Z" fill="#FACC15" />
          <Path d="M0 30 H400 V150 Q200 250 0 150 Z" fill="#FDE047" opacity={0.4} />
        </Svg>
      </View>

      {/* BACK BUTTON */}
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-14 left-6 bg-white p-3 rounded-full shadow"
        style={{ elevation: 4 }}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      {/* TITLE */}
      <View className="mt-28 px-6">
        <Text className="text-3xl font-extrabold text-gray-900">Earnings</Text>
        <Text className="text-gray-700 mt-1">Track your driving income</Text>
      </View>

      {/* FILTER TABS */}
      <View
        className="px-5 mt-5 flex-row items-center justify-between bg-white rounded-3xl py-3 shadow border border-gray-200"
        style={{ elevation: 4 }}
      >
        {tabs.map((tab) => {
          const activeTab = tab === active;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setActive(tab)}
              className={`px-4 py-2 rounded-2xl ${activeTab ? "bg-yellow-500" : "bg-gray-100"}`}
            >
              <Text className={`text-sm font-semibold ${activeTab ? "text-white" : "text-gray-600"}`}>
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView className="px-6 mt-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 180 }}>
        {/* EARNINGS CARD */}
        <Animated.View style={{ opacity: fadeAnim }} className="bg-white p-6 rounded-3xl shadow border border-gray-200">
          <Text className="text-gray-500">Total Earnings</Text>
          <Text className="text-4xl font-extrabold text-gray-900 mt-2">{data[active].earnings}</Text>

          <View className="flex-row justify-between mt-4">
            <View>
              <Text className="text-gray-500">Rides</Text>
              <Text className="text-xl font-bold text-gray-800">{data[active].rides}</Text>
            </View>
            <View>
              <Text className="text-gray-500">Hours Online</Text>
              <Text className="text-xl font-bold text-gray-800">{data[active].hours}</Text>
            </View>
          </View>
        </Animated.View>

        {/* GRAPH PLACEHOLDER (Animated Bars) */}
        <Text className="text-lg font-bold text-gray-900 mt-8">Earnings Overview</Text>

        <Animated.View
          style={{
            opacity: graphAnim,
            transform: [
              {
                translateY: graphAnim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }),
              },
            ],
          }}
          className="bg-white rounded-3xl p-6 mt-3 shadow border border-gray-200"
        >
          {/* FAKE GRAPH BARS */}
          <View className="flex-row justify-between items-end h-40">
            {[60, 100, 80, 140, 110, 70, 90].map((h, i) => (
              <View key={i} style={{ height: h }} className="w-6 bg-yellow-400 rounded-xl" />
            ))}
          </View>
        </Animated.View>

        {/* RECENT PAYMENTS */}
        <Text className="text-lg font-bold mt-10 text-gray-900">Recent Payments</Text>

        {[1, 2, 3, 4].map((item) => (
          <View
            key={item}
            className="bg-white p-5 rounded-2xl shadow mt-3 border border-gray-200 flex-row justify-between"
            style={{ elevation: 4 }}
          >
            <View>
              <Text className="text-gray-800 font-semibold">Ride #{2100 + item}</Text>
              <Text className="text-gray-500 text-sm">Completed • UPI Payment</Text>
            </View>

            <Text className="text-yellow-600 font-bold text-lg">₹{120 + item * 10}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

