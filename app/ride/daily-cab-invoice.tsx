// app/ride/daily-cab-invoice.tsx
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Alert,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRef, useEffect } from "react";

export default function DailyCabInvoice() {
  const router = useRouter();

  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.05, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const downloadInvoice = () => {
    Alert.alert("Invoice Downloaded", "Your invoice has been saved.");
  };

  return (
    <View className="flex-1 bg-gray-50">

      {/* HEADER */}
      <View className="absolute top-0 left-0 right-0">
        <Svg height="250" width="100%">
          <Path d="M0 0 H400 V130 Q200 250 0 130 Z" fill="#FACC15" />
          <Path d="M0 35 H400 V160 Q200 280 0 160 Z" fill="#FDE047" opacity={0.5} />
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
      <View className="mt-28 px-6">
        <Text className="text-3xl font-extrabold text-gray-900">Ride Summary</Text>
        <Text className="text-gray-700 mt-1">
          Your daily cab ride has been completed
        </Text>
      </View>

      <ScrollView
        className="px-6 mt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 150 }}
      >

        {/* RIDE TIME CARD */}
        <View className="bg-white rounded-3xl p-6 shadow border border-gray-200">
          <Text className="text-xl font-bold text-gray-900 mb-4">Ride Details</Text>

          {/* START TIME */}
          <View className="flex-row items-center mb-3">
            <Ionicons name="play-circle-outline" size={26} color="#22c55e" />
            <View className="ml-3">
              <Text className="text-gray-700">Started</Text>
              <Text className="font-semibold text-gray-900">8:00 AM</Text>
            </View>
          </View>

          {/* END TIME */}
          <View className="flex-row items-center mb-3">
            <Ionicons name="stop-circle-outline" size={26} color="#ef4444" />
            <View className="ml-3">
              <Text className="text-gray-700">Ended</Text>
              <Text className="font-semibold text-gray-900">8:22 AM</Text>
            </View>
          </View>

          {/* DURATION */}
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={26} color="#FACC15" />
            <View className="ml-3">
              <Text className="text-gray-700">Duration</Text>
              <Text className="font-semibold text-gray-900">22 minutes</Text>
            </View>
          </View>
        </View>

        {/* ROUTE SUMMARY */}
        <View className="bg-white rounded-3xl p-6 mt-6 shadow border border-gray-200">
          <Text className="text-xl font-bold text-gray-900 mb-4">Route</Text>

          {/* Pickup */}
          <View className="flex-row items-center mb-4">
            <Ionicons name="location-outline" size={26} color="#FACC15" />
            <View className="ml-3">
              <Text className="font-semibold text-gray-900">Pickup</Text>
              <Text className="text-gray-600">HSR Layout Sector 2</Text>
            </View>
          </View>

          {/* Vertical connector */}
          <View className="ml-4 h-6 border-l-2 border-gray-300" />

          {/* Drop */}
          <View className="flex-row items-center mt-4">
            <Ionicons name="flag-outline" size={26} color="#FACC15" />
            <View className="ml-3">
              <Text className="font-semibold text-gray-900">Drop</Text>
              <Text className="text-gray-600">MG Road Metro Station</Text>
            </View>
          </View>
        </View>

        {/* PAYMENT */}
        <View className="bg-white rounded-3xl p-6 mt-6 shadow border border-gray-200">
          <Text className="text-xl font-bold text-gray-900 mb-2">Fare</Text>
          <Text className="text-yellow-600 text-4xl font-extrabold">₹150</Text>
          <Text className="text-gray-600 mt-2">Auto-debited from wallet</Text>
        </View>

        {/* DOWNLOAD INVOICE */}
        <TouchableOpacity
          onPress={downloadInvoice}
          className="bg-yellow-500 p-5 rounded-3xl items-center shadow mt-10"
        >
          <Text className="text-white text-lg font-bold">Download Invoice</Text>
        </TouchableOpacity>

        {/* NEXT RIDE REMINDER */}
        <Animated.View
          style={{ transform: [{ scale: pulse }] }}
          className="bg-green-100 border border-green-300 p-5 mt-6 rounded-2xl items-center"
        >
          <Ionicons name="calendar-outline" size={35} color="#16a34a" />
          <Text className="text-green-700 font-bold text-lg mt-2">
            Next Ride Tomorrow • 8:00 AM
          </Text>
        </Animated.View>

        {/* BACK TO HOME */}
        <TouchableOpacity
          onPress={() => router.replace("/home")}
          className="bg-white p-5 rounded-3xl items-center border border-gray-300 mt-5 shadow"
        >
          <Text className="text-gray-900 text-lg font-semibold">
            Back to Home
          </Text>
        </TouchableOpacity>

      </ScrollView>

    </View>
  );
}
