import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function ToggleAvailability() {
  const [available, setAvailable] = useState(true);

  return (
    <View className="flex-1 bg-white p-5">
      <Text className="text-2xl font-bold mb-4">Availability</Text>

      {/* Status Indicator */}
      <View className="flex-row items-center justify-between bg-gray-100 p-4 rounded-xl">
        <Text className="text-lg font-semibold">
          Status: {available ? "Available Now" : "Offline"}
        </Text>

        <Pressable
          onPress={() => setAvailable(!available)}
          className={`px-4 py-2 rounded-full ${
            available ? "bg-green-500" : "bg-gray-400"
          }`}
        >
          <Text className="text-white font-semibold">
            {available ? "Online" : "Offline"}
          </Text>
        </Pressable>
      </View>

      {/* Options */}
      <View className="mt-6 space-y-3">
        <Pressable className="flex-row items-center p-4 bg-white shadow rounded-lg">
          <Ionicons name="time-outline" size={22} />
          <Text className="ml-3 text-base font-medium">Available Later (Schedule)</Text>
        </Pressable>

        <Pressable className="flex-row items-center p-4 bg-white shadow rounded-lg">
          <Ionicons name="close-circle-outline" size={22} />
          <Text className="ml-3 text-base font-medium">Not Available Today</Text>
        </Pressable>
      </View>
    </View>
  );
}
