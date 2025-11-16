// app/ride/completed.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function RideCompleted() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-50">

      {/* PREMIUM HEADER */}
      <View className="absolute top-0 left-0 right-0">
        <Svg height="260" width="100%">
          <Path
            d="M0 0 H400 V140 Q200 260 0 140 Z"
            fill="#FACC15"
          />
          <Path
            d="M0 40 H400 V180 Q200 300 0 180 Z"
            fill="#FDE047"
            opacity={0.4}
          />
        </Svg>
      </View>

      {/* PAGE HEADER */}
      <View className="absolute top-14 w-full px-6 z-10">
        <Text className="text-3xl font-extrabold text-gray-900">
          Ride Completed
        </Text>
        <Text className="text-gray-700 mt-1">
          Your trip summary and invoice are ready
        </Text>
      </View>

      <ScrollView
        className="mt-40 px-6"
        contentContainerStyle={{ paddingBottom: 180 }}
        showsVerticalScrollIndicator={false}
      >
        {/* RIDE SUMMARY CARD */}
        <View
          className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 mb-6"
          style={{ elevation: 6 }}
        >
          <Text className="text-xl text-gray-900 font-bold">Trip Summary</Text>

          {/* ROUTE */}
          <View className="mt-6">
            {/* From */}
            <View className="flex-row items-center">
              <View className="w-3 h-3 bg-yellow-500 rounded-full" />
              <Text className="ml-3 text-gray-900 text-lg font-semibold">
                123 MG Road, Bangalore
              </Text>
            </View>

            {/* line */}
            <View className="ml-1 mt-2 mb-2 h-10 border-l-2 border-gray-300" />

            {/* To */}
            <View className="flex-row items-center">
              <View className="w-3 h-3 bg-gray-700 rounded-full" />
              <Text className="ml-3 text-gray-900 text-lg font-semibold">
                Airport Terminal 1
              </Text>
            </View>
          </View>

          {/* Distance + Time */}
          <View className="flex-row justify-between mt-6">
            <View>
              <Text className="text-gray-500">Distance</Text>
              <Text className="text-gray-900 text-lg font-semibold">
                12.8 km
              </Text>
            </View>
            <View>
              <Text className="text-gray-500">Duration</Text>
              <Text className="text-gray-900 text-lg font-semibold">
                23 min
              </Text>
            </View>
          </View>
        </View>

        {/* FARE DETAILS */}
        <View
          className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 mb-6"
          style={{ elevation: 6 }}
        >
          <Text className="text-xl text-gray-900 font-bold">Fare Details</Text>

          <View className="mt-4">
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Base Fare</Text>
              <Text className="text-gray-900 font-semibold">₹220</Text>
            </View>

            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Distance Fare</Text>
              <Text className="text-gray-900 font-semibold">₹60</Text>
            </View>

            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Time Fare</Text>
              <Text className="text-gray-900 font-semibold">₹20</Text>
            </View>

            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Platform Fee</Text>
              <Text className="text-gray-900 font-semibold">₹15</Text>
            </View>

            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Taxes</Text>
              <Text className="text-gray-900 font-semibold">₹8</Text>
            </View>

            <View className="h-[1px] bg-gray-200 my-3" />

            <View className="flex-row justify-between">
              <Text className="text-gray-900 text-xl font-bold">
                Total Amount
              </Text>
              <Text className="text-yellow-600 text-2xl font-extrabold">
                ₹323
              </Text>
            </View>
          </View>
        </View>

        {/* DRIVER DETAILS */}
        <View
          className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 mb-6"
          style={{ elevation: 6 }}
        >
          <Text className="text-xl font-bold text-gray-900">Driver</Text>

          <View className="mt-4 flex-row items-center">
            <Image
              source={{ uri: "https://i.ibb.co/ZY7fCFw/driver.jpg" }}
              className="w-16 h-16 rounded-full"
            />
            <View className="ml-4">
              <Text className="text-lg text-gray-900 font-semibold">
                Rahul Verma
              </Text>
              <Text className="text-gray-500">⭐ 4.8 • 2,450 trips</Text>

              <Text className="mt-2 text-gray-700 font-medium">
                Sedan • KA 05 MK 2244
              </Text>
            </View>
          </View>
        </View>

        {/* PAYMENT METHOD */}
        <View
          className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 mb-6"
          style={{ elevation: 6 }}
        >
          <Text className="text-xl font-bold text-gray-900">Payment</Text>

          <View className="flex-row items-center mt-4 justify-between">
            <View className="flex-row items-center">
              <Ionicons name="card-outline" size={24} color="#333" />
              <Text className="ml-3 text-gray-900 text-lg">UPI</Text>
            </View>
            <Text className="text-yellow-600 font-bold text-lg">Paid</Text>
          </View>
        </View>

        {/* BOTTOM BUTTONS */}
        <View>
          <TouchableOpacity
            className="bg-yellow-500 py-4 rounded-3xl items-center"
            style={{ elevation: 4 }}
          >
            <Text className="text-white text-lg font-bold">Download Invoice</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-white py-4 rounded-3xl items-center mt-3 border border-gray-200"
            style={{ elevation: 2 }}
            onPress={() => router.replace("/home")}
          >
            <Text className="text-gray-900 text-lg font-semibold">
              Back to Home
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
