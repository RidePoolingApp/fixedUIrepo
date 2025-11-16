// app/ride/daily-cab-assigned.tsx
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "expo-router";
import * as Linking from "expo-linking";

export default function DailyCabAssigned() {
  const router = useRouter();

  const proxyPhone = "+918080808080";

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

      {/* HEADER CURVES */}
      <View className="absolute top-0 left-0 right-0">
        <Svg height="260" width="100%">
          <Path d="M0 0 H400 V140 Q200 260 0 140 Z" fill="#FACC15" />
          <Path d="M0 40 H400 V180 Q200 300 0 180 Z" fill="#FDE047" opacity={0.5} />
        </Svg>
      </View>

      {/* BACK */}
      <TouchableOpacity
        onPress={() => router.replace("/home")}
        className="absolute top-14 left-6 bg-white p-3 rounded-full shadow"
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      {/* TITLE */}
      <View className="mt-28 px-6 mb-2">
        <Text className="text-3xl font-extrabold text-gray-900">
          Driver Assigned
        </Text>
        <Text className="text-gray-700 mt-1">
          Your daily cab is ready for tomorrow
        </Text>
      </View>

      <ScrollView
        className="px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 160 }}
      >

        {/* DRIVER CARD (NO IMAGE) */}
        <View className="bg-white rounded-3xl p-6 shadow border border-gray-100">
          <View className="flex-row items-center">
            <Ionicons name="person-circle-outline" size={70} color="#444" />

            <View className="ml-5">
              <Text className="text-xl font-bold text-gray-900">Rahul Verma</Text>
              <Text className="text-gray-600 mt-1">⭐ 4.8 • 2,450 rides</Text>
            </View>
          </View>

          {/* CONTACT MASKED */}
          <View className="mt-3 flex-row items-center">
            <Ionicons name="call-outline" size={20} color="#777" />
            <Text className="text-gray-600 ml-2">+91 •••• 4321</Text>
          </View>

          {/* VEHICLE */}
          <View className="bg-yellow-50 rounded-2xl p-4 mt-6 border border-yellow-200 flex-row justify-between items-center">
            <View>
              <Text className="text-gray-900 font-semibold text-lg">Sedan • White</Text>
              <Text className="text-gray-500 text-sm mt-1">AC • 4 Seats</Text>
            </View>

            <View className="items-end">
              <Text className="text-yellow-700 text-xl font-bold">KA 05 MK 2244</Text>
              <Text className="text-gray-500 text-xs mt-1">Number Plate</Text>
            </View>
          </View>
        </View>

        {/* NEXT PICKUP TIME */}
        <View className="bg-white rounded-3xl p-6 shadow border border-gray-100 mt-6">
          <Text className="text-xl font-bold text-gray-900">Next Pickup</Text>

          <Animated.View style={{ transform: [{ scale: pulse }] }} className="flex-row items-center mt-4">
            <Ionicons name="time-outline" size={28} color="#FACC15" />
            <Text className="ml-3 text-lg text-gray-900">
              Tomorrow at <Text className="font-bold">8:00 AM</Text>
            </Text>
          </Animated.View>

          <Text className="mt-3 text-gray-600">
            Your driver will arrive at your pickup point daily.
          </Text>
        </View>

        {/* REPEAT DAYS */}
        <View className="bg-white rounded-3xl p-6 mt-6 shadow border border-gray-100">
          <Text className="text-xl font-bold text-gray-900 mb-4">Days</Text>

          <View className="flex-row flex-wrap gap-3">
            {["Mon","Tue","Wed","Thu","Fri"].map((d) => (
              <View key={d} className="px-4 py-2 rounded-xl bg-yellow-400">
                <Text className="font-semibold text-white">{d}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* FARE */}
        <View className="bg-white rounded-3xl p-6 mt-6 shadow border border-gray-100">
          <Text className="text-xl font-bold text-gray-900">Daily Fare</Text>
          <Text className="text-yellow-600 text-3xl font-extrabold mt-3">₹150</Text>
          <Text className="text-gray-600 mt-1">Charged daily before pickup</Text>
        </View>

        {/* ACTION BUTTONS */}
        <View className="mt-10 space-y-4">

          {/* CONTACT DRIVER */}
          <TouchableOpacity
            className="bg-yellow-500 p-5 rounded-3xl items-center shadow"
            style={{ elevation: 5 }}
            onPress={() => Linking.openURL(`tel:${proxyPhone}`)}
          >
            <Text className="text-white text-lg font-bold">Contact Driver</Text>
          </TouchableOpacity>

          {/* CANCEL DAILY CAB */}
          <TouchableOpacity
            onPress={() => router.push("/ride/cancel")}
            className="bg-white p-5 rounded-3xl items-center border border-gray-300 shadow"
          >
            <Text className="text-gray-800 text-lg font-semibold">
              Cancel Daily Cab
            </Text>
          </TouchableOpacity>

          {/* START RIDE */}
          <TouchableOpacity
            onPress={() => router.replace("/ride/daily-cab-started")}
            className="bg-green-600 p-5 rounded-3xl items-center shadow"
          >
            <Text className="text-white text-lg font-bold">Start Ride</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>

    </View>
  );
}
