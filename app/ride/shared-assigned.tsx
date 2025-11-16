// app/ride/shared-assigned.tsx
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRef, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import * as Linking from "expo-linking";
import CancelBottomSheet from "../components/CancelBottomSheet";

export default function SharedAssigned() {
  const router = useRouter();

  const [showCancel, setShowCancel] = useState(false);
  const proxyPhone = "+918080808080";

  // pulse animation
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.1, duration: 800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const [eta, setEta] = useState(7);

useEffect(() => {
  const countdown = setInterval(() => {
    setEta((prev) => {
      if (prev <= 1) {
        clearInterval(countdown);
        router.replace("/ride/shared-started");
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(countdown);
}, []);

  return (
    <View className="flex-1 bg-gray-50">
      {/* PREMIUM YELLOW HEADER */}
      <View className="absolute top-0 left-0 right-0">
        <Svg height="260" width="100%">
          <Path d="M0 0 H400 V140 Q200 260 0 140 Z" fill="#FACC15" />
          <Path d="M0 40 H400 V180 Q200 300 0 180 Z" fill="#FDE047" opacity={0.5} />
        </Svg>
      </View>

      {/* BACK */}
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-14 left-6 bg-white p-3 rounded-full shadow"
        style={{ elevation: 4 }}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      {/* TITLE */}
      <View className="mt-28 px-6 mb-2">
        <Text className="text-3xl font-extrabold text-gray-900">
          Driver Assigned
        </Text>
        <Text className="text-gray-700 mt-1">
          Shared ride confirmed, reaching soon
        </Text>
      </View>

      <ScrollView
        className="px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 160 }}
      >

        {/* DRIVER CARD */}
        <View
          className="bg-white rounded-3xl p-6 shadow border border-gray-100"
          style={{ elevation: 5 }}
        >
          <View className="flex-row items-center">
            <Image
              source={{ uri: "https://i.ibb.co/ZY7fCFw/driver.jpg" }}
              className="w-20 h-20 rounded-full"
            />
            <View className="ml-5">
              <Text className="text-xl font-bold text-gray-900">Arun Sharma</Text>
              <Text className="text-gray-600 mt-1">⭐ 4.9 • 3,210 rides</Text>
            </View>
          </View>

          {/* VEHICLE */}
          <View className="bg-yellow-50 rounded-2xl p-4 mt-6 border border-yellow-200 flex-row justify-between items-center">
            <View>
              <Text className="text-gray-900 font-semibold text-lg">Hyundai i20 • White</Text>
              <Text className="text-gray-500 text-sm mt-1">AC • 4 Seats</Text>
            </View>
            <View className="items-end">
              <Text className="text-yellow-700 text-xl font-bold">KA 05 AD 8821</Text>
              <Text className="text-gray-500 text-xs mt-1">Number Plate</Text>
            </View>
          </View>
        </View>

        {/* ETA CARD */}
        <View
          className="bg-white rounded-3xl p-6 shadow border border-gray-100 mt-6"
          style={{ elevation: 5 }}
        >
          <Text className="text-xl font-bold text-gray-900">Arrival Time</Text>

          <Animated.View style={{ transform: [{ scale: pulse }] }} className="flex-row items-center mt-4">
            <Ionicons name="time-outline" size={28} color="#FACC15" />
            <Text className="ml-3 text-lg text-gray-900">
              Reaching in <Text className="font-bold">{eta} minutes</Text>
            </Text>
          </Animated.View>

          <Text className="mt-3 text-gray-600">
            Driver is completing other pickups on the shared route.
          </Text>
        </View>

        {/* PICKUP ORDER TIMELINE */}
        <View
          className="bg-white rounded-3xl p-6 mt-6 shadow border border-gray-100"
          style={{ elevation: 4 }}
        >
          <Text className="text-xl font-bold text-gray-900 mb-4">Pickup Order</Text>

          {/* 1st Pickup */}
          <View className="flex-row items-center mb-4">
            <View className="bg-yellow-500 w-10 h-10 rounded-full items-center justify-center">
              <Text className="text-white font-bold">1</Text>
            </View>
            <Text className="ml-4 text-gray-900 font-semibold">
              Indiranagar – Co-Rider Pickup
            </Text>
          </View>

          {/* 2nd Pickup - YOU */}
          <View className="flex-row items-center mb-4">
            <View className="bg-green-500 w-10 h-10 rounded-full items-center justify-center">
              <Text className="text-white font-bold">2</Text>
            </View>
            <Text className="ml-4 text-gray-900 font-semibold">
              HSR Layout – **You**
            </Text>
          </View>

          {/* 3rd Pickup */}
          <View className="flex-row items-center mb-2">
            <View className="bg-gray-300 w-10 h-10 rounded-full items-center justify-center">
              <Text className="text-black font-bold">3</Text>
            </View>
            <Text className="ml-4 text-gray-900 font-semibold">
              Koramangala – Co-Rider Pickup
            </Text>
          </View>
        </View>

        {/* CO-RIDERS */}
        <View
          className="bg-white rounded-3xl p-6 mt-6 shadow border border-gray-100"
          style={{ elevation: 4 }}
        >
          <Text className="text-xl font-bold text-gray-900">Co-Riders</Text>

          <View className="flex-row space-x-4 mt-4">
            <Image
              source={{ uri: "https://i.ibb.co/gJ9Rjgt/user1.jpg" }}
              className="w-16 h-16 rounded-full"
            />
            <Image
              source={{ uri: "https://i.ibb.co/4V3pF2b/user2.jpg" }}
              className="w-16 h-16 rounded-full"
            />
            <View className="w-16 h-16 bg-gray-200 rounded-full items-center justify-center">
              <Text className="font-bold text-gray-700">+1</Text>
            </View>
          </View>
        </View>

        {/* SHARED FARE */}
        <View
          className="bg-white rounded-3xl p-6 mt-6 shadow border border-gray-100"
          style={{ elevation: 4 }}
        >
          <Text className="text-xl font-bold text-gray-900">Your Fare</Text>
          <Text className="text-yellow-600 text-3xl font-extrabold mt-3">₹89</Text>
          <Text className="text-gray-600 mt-1">Shared pricing applied</Text>
        </View>

        {/* ACTION BUTTONS */}
        <View className="mt-10 space-y-4">
          <TouchableOpacity
            className="bg-yellow-500 p-5 rounded-3xl items-center shadow"
            style={{ elevation: 5 }}
            onPress={() => Linking.openURL(`tel:${proxyPhone}`)}
          >
            <Text className="text-white text-lg font-bold">Contact Driver</Text>
          </TouchableOpacity>

           <TouchableOpacity
            className="bg-white p-5 rounded-3xl items-center border border-gray-300 shadow"
            style={{ elevation: 4 }}
            onPress={() => router.push("/ride/cancel")}
          >
            <Text className="text-gray-800 text-lg font-semibold">Cancel Ride</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
  className="bg-green-500 p-5 rounded-3xl items-center shadow"
  style={{ elevation: 5 }}
  onPress={() => router.replace("/ride/shared-started")}
>
  <Text className="text-white text-lg font-bold">Start Ride</Text>
</TouchableOpacity> */}


        </View>
      </ScrollView>

      {/* CANCEL BOTTOM SHEET */}
      <CancelBottomSheet
        visible={showCancel}
        onClose={() => setShowCancel(false)}
        onConfirm={() => router.replace("/home")}
      />
    </View>
  );
}
