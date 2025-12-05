// app/driver/booking/active-trip.tsx
import React, { useEffect, useRef, useState } from "react";
import { View, TouchableOpacity, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ThemedView, ThemedText } from "../../components/Themed";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function ActiveTrip() {
  const router = useRouter();
  const params = useLocalSearchParams<{ bookingId?: string }>();
  const bookingId = params.bookingId ?? "BKG_1001";

  // Timer
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = () => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  };

  const endTrip = () => {
    Alert.alert("End Trip", "Are you sure you want to end this ride?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "End Trip",
        style: "destructive",
        onPress: () =>
          router.replace(`/driver/booking/end-trip?bookingId=${bookingId}`),
      },
    ]);
  };

  const emergency = () => {
    Alert.alert(
      "Emergency Support",
      "Connecting you to safety support. (Implement helpline API)"
    );
  };

  const callRider = () => {
    Alert.alert("Calling Rider", "Mask call feature coming soon.");
  };

  const chatRider = () => {
    Alert.alert("Chat", "Driver–Rider chat not implemented yet.");
  };

  return (
    <ThemedView className="flex-1 px-6 py-10">
      {/* Header */}
      <View className="flex-row justify-between items-center">
        <View>
          <ThemedText className="text-2xl font-extrabold">
            Trip In Progress
          </ThemedText>
          <ThemedText className="text-gray-500 mt-1">
            Booking ID: {bookingId}
          </ThemedText>
        </View>

        {/* Timer */}
        <ThemedView className="px-3 py-2 rounded-xl border items-center">
          <Ionicons name="time-outline" size={20} color="#d97706" />
          <ThemedText className="mt-1 font-semibold text-yellow-600">
            {formatTime()}
          </ThemedText>
        </ThemedView>
      </View>

      {/* Rider Info */}
      <ThemedView className="mt-6 p-5 rounded-2xl border flex-row items-center">
        <Ionicons name="person-circle-outline" size={45} color="#444" />
        <View className="ml-3">
          <ThemedText className="text-lg font-semibold">A. Patel</ThemedText>
          <View className="flex-row items-center mt-1">
            <Ionicons name="star" size={14} color="#fbbf24" />
            <ThemedText className="ml-1 text-xs text-gray-500">4.9 ★</ThemedText>
          </View>
        </View>
      </ThemedView>

      {/* Trip Info */}
      <ThemedView className="mt-4 p-5 rounded-2xl border">
        <View className="flex-row items-center">
          <Ionicons name="navigate-outline" size={20} color="#d97706" />
          <ThemedText className="ml-2 text-sm font-semibold">
            Airport → City Center Mall
          </ThemedText>
        </View>

        <View className="flex-row justify-between mt-4">
          <View>
            <ThemedText className="text-gray-500 text-xs">Distance</ThemedText>
            <ThemedText className="text-lg font-bold">35 km</ThemedText>
          </View>

          <View>
            <ThemedText className="text-gray-500 text-xs">Ride Type</ThemedText>
            <ThemedText className="text-lg font-bold">Long Trip</ThemedText>
          </View>

          <View>
            <ThemedText className="text-gray-500 text-xs">Seats</ThemedText>
            <ThemedText className="text-lg font-bold">1</ThemedText>
          </View>
        </View>
      </ThemedView>

      {/* Special Instructions */}
      <ThemedView className="mt-4 p-4 rounded-2xl border">
        <ThemedText className="text-sm font-semibold">
          Special Instructions
        </ThemedText>
        <ThemedText className="text-sm text-gray-600 mt-2">
          Passenger has 1 large suitcase. Handle carefully.
        </ThemedText>
      </ThemedView>

      {/* Actions */}
      <View className="flex-row justify-between mt-8">
        {/* Call */}
        <TouchableOpacity
          onPress={callRider}
          className="flex-1 mr-2 p-4 rounded-2xl border items-center"
        >
          <Ionicons name="call-outline" size={22} color="#444" />
          <ThemedText className="mt-1 font-semibold">Call</ThemedText>
        </TouchableOpacity>

        {/* Chat */}
        <TouchableOpacity
          onPress={chatRider}
          className="flex-1 mx-2 p-4 rounded-2xl border items-center"
        >
          <Ionicons name="chatbubble-ellipses-outline" size={22} color="#444" />
          <ThemedText className="mt-1 font-semibold">Chat</ThemedText>
        </TouchableOpacity>

        {/* Emergency */}
        <TouchableOpacity
          onPress={emergency}
          className="flex-1 ml-2 p-4 rounded-2xl bg-red-600 items-center"
        >
          <MaterialIcons name="warning" size={22} color="#fff" />
          <ThemedText className="text-white mt-1 font-semibold">
            SOS
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* End Trip Button */}
      <TouchableOpacity
        onPress={endTrip}
        className="mt-10 p-4 rounded-2xl bg-emerald-600 items-center"
      >
        <ThemedText className="text-white font-bold text-lg">
          End Trip
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}
