// app/confirm-share.tsx
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  ScrollView,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";

export default function ConfirmShare() {
  const router = useRouter();

  // animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        speed: 1,
        bounciness: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View className="flex-1 bg-gray-50">
      {/* PREMIUM YELLOW HEADER */}
      <View className="absolute top-0 left-0 right-0">
        <Svg height="240" width="100%">
          <Path d="M0 0 H400 V130 Q200 240 0 130 Z" fill="#FACC15" />
          <Path
            d="M0 30 H400 V150 Q200 260 0 150 Z"
            fill="#FDE047"
            opacity={0.5}
          />
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
        <Text className="text-3xl font-extrabold text-gray-900">
          Confirm Your Ride
        </Text>
        <Text className="text-gray-700 mt-1">
          Review details before joining
        </Text>
      </View>

      <ScrollView
        className="px-6 mt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* MAIN CARD */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
          className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100"
        >
          {/* CAR IMAGE */}
          <Image
            source={{
              uri: "https://i.ibb.co/WP07R4b/car1.png",
            }}
            className="w-full h-40 rounded-2xl"
          />

          {/* DRIVER INFO */}
          <View className="flex-row justify-between items-center mt-4">
            <View>
              <Text className="text-xl font-bold text-gray-900">
                Arun Sharma
              </Text>
              <Text className="text-gray-600">Hyundai i20 • White</Text>
            </View>

            <View className="bg-yellow-100 rounded-full px-4 py-2 flex-row items-center">
              <Ionicons name="star" size={18} color="#FACC15" />
              <Text className="ml-2 font-semibold text-gray-900">4.9</Text>
            </View>
          </View>

          {/* RIDE DETAILS */}
          <View className="mt-5 space-y-4">
            <View className="flex-row items-center">
              <Ionicons name="location-outline" size={24} color="#FACC15" />
              <Text className="ml-3 text-gray-900 font-semibold">
                Pickup: HSR Layout
              </Text>
            </View>

            <View className="flex-row items-center">
              <Ionicons name="flag-outline" size={24} color="#FACC15" />
              <Text className="ml-3 text-gray-900 font-semibold">
                Drop: MG Road
              </Text>
            </View>

            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={24} color="#333" />
              <Text className="ml-3 text-gray-800">ETA: 5 minutes</Text>
            </View>
          </View>

          {/* CO-PASSENGERS */}
          <Text className="text-lg font-bold text-gray-900 mt-7 mb-3">
            Co-Passengers
          </Text>

          <View className="flex-row space-x-4">
            <Image
              source={{ uri: "https://i.ibb.co/gJ9Rjgt/user1.jpg" }}
              className="w-14 h-14 rounded-full"
            />
            <Image
              source={{ uri: "https://i.ibb.co/4V3pF2b/user2.jpg" }}
              className="w-14 h-14 rounded-full"
            />
            <View className="w-14 h-14 rounded-full bg-gray-200 items-center justify-center">
              <Text className="font-bold text-gray-700">+1</Text>
            </View>
          </View>

          {/* FARE BREAKDOWN */}
          <Text className="text-lg font-bold text-gray-900 mt-8">
            Fare Details
          </Text>

          <View className="mt-4 space-y-3">
            <View className="flex-row justify-between">
              <Text className="text-gray-700">Base Fare</Text>
              <Text className="text-gray-900 font-semibold">₹50</Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-gray-700">Sharing Discount</Text>
              <Text className="text-green-600 font-semibold">−₹20</Text>
            </View>

            <View className="flex-row justify-between mt-2">
              <Text className="text-gray-900 font-bold">Total</Text>
              <Text className="text-yellow-600 text-xl font-extrabold">
                ₹89 / person
              </Text>
            </View>
          </View>

          {/* CTA BUTTON */}
          <TouchableOpacity
            onPress={() => router.replace("/ride/shared-assigned")}
            className="bg-yellow-500 p-5 rounded-3xl items-center mt-8 shadow"
            style={{ elevation: 6 }}
          >
            <Text className="text-white font-bold text-lg">
              Join Ride Now
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
