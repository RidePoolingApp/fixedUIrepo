import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";

export default function RideHistory() {
  const router = useRouter();

  const [activeFilter, setActiveFilter] = useState("All");

  const rideHistory = [
    {
      id: "R001",
      date: "2024-11-24",
      time: "14:30",
      from: "Connaught Place",
      to: "Indira Gandhi Airport",
      fare: "₹850",
      status: "Completed",
      rating: 5,
    },
    {
      id: "R002",
      date: "2024-11-23",
      time: "09:15",
      from: "Karol Bagh",
      to: "Rajouri Garden",
      fare: "₹320",
      status: "Completed",
      rating: 4,
    },
    {
      id: "R003",
      date: "2024-11-22",
      time: "18:45",
      from: "Lajpat Nagar",
      to: "Nehru Place",
      fare: "₹280",
      status: "Completed",
      rating: 5,
    },
    {
      id: "R004",
      date: "2024-11-21",
      time: "12:00",
      from: "Dwarka",
      to: "CP",
      fare: "₹450",
      status: "Cancelled",
      rating: null,
    },
    {
      id: "R005",
      date: "2024-11-20",
      time: "16:20",
      from: "Pitampura",
      to: "Rohini",
      fare: "₹250",
      status: "Completed",
      rating: 4,
    },
  ];

  const filtered = activeFilter === "All"
    ? rideHistory
    : rideHistory.filter((r) => r.status === activeFilter);

  // Animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

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
        <Text className="text-3xl font-extrabold text-gray-900">Ride History</Text>
        <Text className="text-gray-700 mt-1">Your past rides and earnings</Text>
      </View>

      {/* FILTER TABS */}
      <View className="px-6 mt-5 flex-row justify-between bg-white rounded-3xl p-3 shadow border border-gray-200"
            style={{ elevation: 4 }}>
        {["All", "Completed", "Cancelled"].map((filter) => {
          const active = filter === activeFilter;
          return (
            <TouchableOpacity
              key={filter}
              onPress={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-2xl ${
                active ? "bg-yellow-500" : "bg-gray-100"
              }`}
            >
              <Text
                className={`text-sm font-semibold ${
                  active ? "text-white" : "text-gray-600"
                }`}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        className="px-6 mt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 160 }}
      >
        {/* RIDE HISTORY LIST */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {filtered.map((ride, i) => (
            <View
              key={i}
              className="bg-white p-5 rounded-3xl shadow border border-gray-200 mb-4"
              style={{ elevation: 4 }}
            >
              <View className="flex-row justify-between items-start mb-3">
                <View>
                  <Text className="text-gray-800 font-semibold text-lg">
                    {ride.id}
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    {ride.date} • {ride.time}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="text-yellow-600 font-bold text-xl">
                    {ride.fare}
                  </Text>
                  <Text
                    className={`text-sm font-semibold ${
                      ride.status === "Completed" ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {ride.status}
                  </Text>
                </View>
              </View>

              <View className="mb-3">
                <Text className="text-gray-600 text-sm">
                  <Ionicons name="location-outline" size={14} color="#666" /> From: {ride.from}
                </Text>
                <Text className="text-gray-600 text-sm mt-1">
                  <Ionicons name="location" size={14} color="#666" /> To: {ride.to}
                </Text>
              </View>

              {ride.rating && (
                <View className="flex-row items-center">
                  <Ionicons name="star" size={16} color="#FACC15" />
                  <Text className="text-gray-700 ml-1">{ride.rating}/5</Text>
                </View>
              )}
            </View>
          ))}
        </Animated.View>
      </ScrollView>
    </View>
  );
}