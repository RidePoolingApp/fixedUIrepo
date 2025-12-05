// app/driver/booking/end-trip.tsx
import React from "react";
import { View, TouchableOpacity, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ThemedView, ThemedText } from "../../components/Themed";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function EndTrip() {
  const router = useRouter();
  const params = useLocalSearchParams<{ bookingId?: string }>();
  const bookingId = params.bookingId ?? "BKG_1001";

  const confirmEnd = () => {
    Alert.alert(
      "Confirm End Trip",
      "Has the passenger reached the drop location?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, End Trip",
          style: "destructive",
          onPress: () => {
            router.replace(`/driver/booking/payment-summary?bookingId=${bookingId}`);
          },
        },
      ]
    );
  };

  return (
    <ThemedView className="flex-1 px-6 py-10">
      {/* Title */}
      <ThemedText className="text-3xl font-extrabold">End Trip</ThemedText>
      <ThemedText className="text-gray-500 mt-1">
        Booking ID: {bookingId}
      </ThemedText>

      {/* Summary Box */}
      <ThemedView className="mt-6 p-5 rounded-2xl border">
        <ThemedText className="text-lg font-semibold">Trip Summary</ThemedText>

        <View className="mt-4 flex-row justify-between">
          <View>
            <ThemedText className="text-gray-500 text-sm">Distance</ThemedText>
            <ThemedText className="text-xl font-bold">35 km</ThemedText>
          </View>

          <View>
            <ThemedText className="text-gray-500 text-sm">Duration</ThemedText>
            <ThemedText className="text-xl font-bold">50 min</ThemedText>
          </View>

          <View>
            <ThemedText className="text-gray-500 text-sm">Fare</ThemedText>
            <ThemedText className="text-xl font-bold text-yellow-600">
              ₹1250
            </ThemedText>
          </View>
        </View>

        <View className="mt-4 flex-row items-center">
          <MaterialIcons name="info" size={18} color="#d97706" />
          <ThemedText className="ml-2 text-sm text-gray-600">
            Passenger will also confirm trip completion.
          </ThemedText>
        </View>
      </ThemedView>

      {/* Passenger Info */}
      <ThemedView className="mt-6 p-4 rounded-2xl border flex-row items-center">
        <Ionicons name="person-circle-outline" size={45} color="#444" />
        <View className="ml-3">
          <ThemedText className="text-lg font-semibold">A. Patel</ThemedText>
          <ThemedText className="text-xs text-gray-500">4.9 ★ Rider</ThemedText>
        </View>
      </ThemedView>

      {/* End Trip Button */}
      <TouchableOpacity
        onPress={confirmEnd}
        className="mt-10 p-4 rounded-2xl bg-red-600 items-center"
      >
        <ThemedText className="text-white font-bold text-lg">
          End Trip
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}
