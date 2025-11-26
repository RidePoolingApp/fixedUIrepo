// app/driver/ratings.tsx
import { View, Text, TouchableOpacity, ScrollView, Animated } from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";

export default function DriverRatings() {
  const router = useRouter();

  const [activeFilter, setActiveFilter] = useState("All");

  const reviews = [
    { stars: 5, name: "Rohit", msg: "Great driving, very polite!", date: "2 days ago" },
    { stars: 4, name: "Ananya", msg: "Smooth ride, clean car.", date: "3 days ago" },
    { stars: 5, name: "Vikram", msg: "Reached early, very helpful.", date: "5 days ago" },
    { stars: 3, name: "Megha", msg: "Good but AC was low.", date: "1 week ago" },
    { stars: 5, name: "Karan", msg: "Best ride experience!", date: "2 weeks ago" },
  ];

  const filtered = activeFilter === "All"
    ? reviews
    : reviews.filter((r) => r.stars === Number(activeFilter));

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

  const ratingValue = 4.9;
  const ratingCount = 320;

  const ratingBars = [
    { star: 5, value: 0.78 },
    { star: 4, value: 0.15 },
    { star: 3, value: 0.05 },
    { star: 2, value: 0.01 },
    { star: 1, value: 0.01 },
  ];

  return (
    <View className="flex-1 bg-gray-100">

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
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      {/* TITLE */}
      <View className="mt-28 px-6">
        <Text className="text-3xl font-extrabold text-gray-900">Ratings</Text>
        <Text className="text-gray-700 mt-1">Your ride experience score</Text>
      </View>

      <ScrollView
        className="px-6 mt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* RATING SUMMARY */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
          className="bg-white rounded-3xl p-6 shadow border border-gray-200"
        >
          <View className="items-center">
            <Text className="text-5xl font-extrabold text-gray-900">
              {ratingValue}
            </Text>
            <View className="flex-row mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Ionicons
                  key={i}
                  name="star"
                  size={24}
                  color="#FACC15"
                />
              ))}
            </View>
            <Text className="text-gray-600 mt-2">{ratingCount} reviews</Text>
          </View>

          {/* BAR BREAKDOWN */}
          <View className="mt-6">
            {ratingBars.map((r) => (
              <View key={r.star} className="flex-row items-center mb-2">
                <Text className="w-6 text-gray-700">{r.star}★</Text>
                <View className="flex-1 bg-gray-200 h-3 rounded-full mx-3 overflow-hidden">
                  <View
                    style={{ width: `${r.value * 100}%` }}
                    className="h-3 bg-yellow-500 rounded-full"
                  />
                </View>
                <Text className="w-10 text-right text-gray-700">
                  {Math.floor(r.value * 100)}%
                </Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* FILTER TABS */}
        <View className="flex-row justify-between mt-6">
          {["All", "5", "4", "3", "1"].map((f) => {
            const active = f === activeFilter;
            return (
              <TouchableOpacity
                key={f}
                onPress={() => setActiveFilter(f)}
                className={`px-4 py-2 rounded-2xl ${
                  active ? "bg-yellow-500" : "bg-white"
                } shadow border border-gray-200`}
              >
                <Text
                  className={`font-semibold ${
                    active ? "text-white" : "text-gray-700"
                  }`}
                >
                  {f === "All" ? "All" : `${f}★`}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* REVIEWS LIST */}
        <View className="mt-6">
          {filtered.map((r, i) => (
            <View
              key={i}
              className="bg-white p-5 rounded-2xl shadow border border-gray-200 mb-4"
            >
              <View className="flex-row mb-2">
                {Array.from({ length: r.stars }).map((_, i) => (
                  <Ionicons key={i} name="star" size={18} color="#FACC15" />
                ))}
              </View>
              <Text className="text-gray-900 font-semibold">{r.name}</Text>

              <Text className="text-gray-600 mt-1">{r.msg}</Text>

              <Text className="text-gray-400 text-xs mt-2">{r.date}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
