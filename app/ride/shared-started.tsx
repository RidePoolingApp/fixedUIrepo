import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRef, useEffect } from "react";
import { useRouter } from "expo-router";

export default function SharedStarted() {
  const router = useRouter();

  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.15, duration: 800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View className="flex-1 bg-gray-50">

      {/* HEADER */}
      <View className="absolute top-0 left-0 right-0">
        <Svg height="240" width="100%">
          <Path d="M0 0 H400 V130 Q200 240 0 130 Z" fill="#FACC15" />
          <Path d="M0 25 H400 V150 Q200 260 0 150 Z" fill="#FDE047" opacity={0.5} />
        </Svg>
      </View>

      {/* Back Button */}
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-14 left-6 bg-white p-3 rounded-full shadow"
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      {/* Title Section */}
      <View className="mt-28 px-6">
        <Text className="text-3xl font-extrabold text-gray-900">
          Ride Started
        </Text>
        <Text className="text-gray-700 mt-1">You're on the shared route</Text>
      </View>

      <ScrollView
        className="px-6 mt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 160 }}
      >

        {/* LIVE ETA */}
        <View className="bg-white rounded-3xl p-6 shadow border border-gray-200">
          <Animated.View style={{ transform: [{ scale: pulse }] }}>
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={32} color="#FACC15" />
              <Text className="ml-3 text-xl font-bold text-gray-900">
                ETA: <Text className="text-yellow-600">22 min</Text>
              </Text>
            </View>
          </Animated.View>

          <Text className="text-gray-600 mt-3">
            You are currently in transit. Driver will follow the shared drop order.
          </Text>
        </View>

        {/* VEHICLE INFO */}
        <View className="bg-white rounded-3xl p-6 mt-6 shadow border border-gray-200">
          <View className="flex-row items-center">
            <MaterialIcons name="directions-car" size={40} color="#FACC15" />
            <View className="ml-4">
              <Text className="text-lg font-bold text-gray-900">Hyundai i20 • White</Text>
              <Text className="text-gray-600">AC • 4 Seats • Smooth Ride</Text>
            </View>
          </View>
        </View>

        {/* DROP ORDER */}
        <View className="bg-white mt-6 rounded-3xl p-6 shadow border border-gray-200">
          <Text className="text-xl font-bold text-gray-900 mb-4">
            Drop Sequence
          </Text>

          {/* 1 */}
          <View className="flex-row items-center mb-5">
            <View className="bg-yellow-500 w-10 h-10 rounded-full items-center justify-center">
              <Text className="text-white font-bold">1</Text>
            </View>
            <Text className="ml-4 text-gray-900 font-semibold">
              Koramangala – Co-Rider Drop
            </Text>
          </View>

          {/* 2: YOU */}
          <View className="flex-row items-center mb-5">
            <View className="bg-green-500 w-10 h-10 rounded-full items-center justify-center">
              <Text className="text-white font-bold">2</Text>
            </View>
            <Text className="ml-4 text-gray-900 font-semibold">
              MG Road – **Your Stop**
            </Text>
          </View>

          {/* 3 */}
          <View className="flex-row items-center">
            <View className="bg-gray-300 w-10 h-10 rounded-full items-center justify-center">
              <Text className="text-black font-bold">3</Text>
            </View>
            <Text className="ml-4 text-gray-900 font-semibold">
              Indiranagar – Co-Rider Drop
            </Text>
          </View>
        </View>

        {/* CO-RIDERS */}
        <View className="bg-white rounded-3xl p-6 mt-6 shadow border border-gray-200">
          <Text className="text-xl font-bold text-gray-900">Co-Riders</Text>

          <View className="flex-row space-x-4 mt-4">

            {/* Circle Initials */}
            <View className="w-16 h-16 rounded-full bg-yellow-200 items-center justify-center">
              <Text className="text-xl font-bold text-gray-800">AK</Text>
            </View>

            <View className="w-16 h-16 rounded-full bg-green-200 items-center justify-center">
              <Text className="text-xl font-bold text-gray-800">MP</Text>
            </View>

            <View className="w-16 h-16 rounded-full bg-gray-300 items-center justify-center">
              <Text className="text-lg font-bold text-gray-700">+1</Text>
            </View>

          </View>
        </View>

        {/* ACTION BUTTON */}
        <TouchableOpacity
          onPress={() => router.replace("/ride/shared-invoice")}
          className="bg-yellow-500 p-5 rounded-3xl items-center shadow mt-10"
        >
          <Text className="text-white text-lg font-bold">Finish Ride</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
