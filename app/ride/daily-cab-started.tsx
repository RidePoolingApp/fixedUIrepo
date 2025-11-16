// app/ride/daily-cab-started.tsx
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import * as Linking from "expo-linking";

export default function DailyCabStarted() {
  const router = useRouter();

  const proxyPhone = "+918080808080"; // masked calling

  // Pulse animation for ETA
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.1, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View className="flex-1 bg-gray-50">

      {/* HEADER CURVE */}
      <View className="absolute top-0 left-0 right-0">
        <Svg height="250" width="100%">
          <Path d="M0 0 H400 V130 Q200 250 0 130 Z" fill="#FACC15" />
          <Path d="M0 35 H400 V160 Q200 280 0 160 Z" fill="#FDE047" opacity={0.5} />
        </Svg>
      </View>

      {/* Back */}
      <TouchableOpacity
        onPress={() => router.replace("/home")}
        className="absolute top-14 left-6 bg-white p-3 rounded-full shadow"
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      {/* TITLE */}
      <View className="mt-28 px-6">
        <Text className="text-3xl font-extrabold text-gray-900">Ride Started</Text>
        <Text className="text-gray-700 mt-1">
          You're on your daily route
        </Text>
      </View>

      <ScrollView
        className="px-6 mt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 150 }}
      >

        {/* LIVE ETA CARD */}
        <View className="bg-white rounded-3xl p-6 shadow border border-gray-200">
          <Animated.View
            style={{ transform: [{ scale: pulse }] }}
            className="flex-row items-center"
          >
            <Ionicons name="navigate-outline" size={30} color="#FACC15" />
            <Text className="ml-3 text-xl font-bold text-gray-900">
              ETA: <Text className="text-yellow-600">18 min</Text>
            </Text>
          </Animated.View>

          <Text className="mt-3 text-gray-600">
            Your cab is moving towards your drop point.
          </Text>
        </View>

        {/* TODAY'S ROUTE */}
        <View className="bg-white mt-6 rounded-3xl p-6 shadow border border-gray-200">
          <Text className="text-xl font-bold text-gray-900 mb-4">
            Today's Route
          </Text>

          {/* FROM */}
          <View className="flex-row items-center mb-4">
            <Ionicons name="location-outline" size={26} color="#FACC15" />
            <View className="ml-3">
              <Text className="text-gray-900 font-semibold">Pickup</Text>
              <Text className="text-gray-600">HSR Layout Sector 2</Text>
            </View>
          </View>

          {/* Divider */}
          <View className="h-[1px] bg-gray-200 mb-4" />

          {/* TO */}
          <View className="flex-row items-center">
            <Ionicons name="flag-outline" size={26} color="#FACC15" />
            <View className="ml-3">
              <Text className="text-gray-900 font-semibold">Drop</Text>
              <Text className="text-gray-600">MG Road Metro Station</Text>
            </View>
          </View>
        </View>

        {/* DAILY ROUTINE CARD */}
        <View className="bg-white rounded-3xl p-6 mt-6 shadow border border-gray-200">
          <Text className="text-xl font-bold text-gray-900">Daily Schedule</Text>

          <View className="flex-row flex-wrap gap-3 mt-4">
            {["Mon","Tue","Wed","Thu","Fri"].map((d) => (
              <View key={d} className="px-4 py-2 rounded-xl bg-yellow-400">
                <Text className="font-semibold text-white">{d}</Text>
              </View>
            ))}
          </View>

          <Text className="text-gray-600 mt-4">
            This ride will repeat daily on your selected days.
          </Text>
        </View>

        {/* FARE CARD */}
        <View className="bg-white rounded-3xl p-6 mt-6 shadow border border-gray-200">
          <Text className="text-xl font-bold text-gray-900">Today's Fare</Text>
          <Text className="text-yellow-600 text-3xl font-extrabold mt-3">₹150</Text>
          <Text className="text-gray-600 mt-1">Debited automatically</Text>
        </View>

        {/* ACTION BUTTONS */}
        <View className="mt-10 space-y-4">

          {/* Contact driver */}
          <TouchableOpacity
            className="bg-yellow-500 p-5 rounded-3xl items-center shadow"
            onPress={() => Linking.openURL(`tel:${proxyPhone}`)}
          >
            <Text className="text-white text-lg font-bold">Contact Driver</Text>
          </TouchableOpacity>

          {/* End Ride */}
          <TouchableOpacity
            className="bg-green-600 p-5 rounded-3xl items-center shadow"
            onPress={() => router.replace("/ride/daily-cab-invoice")}
          >
            <Text className="text-white text-lg font-bold">End Ride</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>

    </View>
  );
}
