import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ThemedView, ThemedText } from "../../components/Themed";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useApi, Ride } from "../../services/api";

export default function EndTrip() {
  const router = useRouter();
  const api = useApi();
  const params = useLocalSearchParams<{ bookingId?: string; rideId?: string }>();
  const rideId = params.rideId || params.bookingId || "";

  const [loading, setLoading] = useState(false);
  const [ride, setRide] = useState<Ride | null>(null);
  const [fetchingRide, setFetchingRide] = useState(true);

  useEffect(() => {
    const fetchRide = async () => {
      if (!rideId) {
        setFetchingRide(false);
        return;
      }
      try {
        const rideData = await api.getRide(rideId);
        setRide(rideData);
      } catch (error) {
        console.error("Error fetching ride:", error);
      } finally {
        setFetchingRide(false);
      }
    };
    fetchRide();
  }, [rideId, api]);

  const confirmEnd = async () => {
    Alert.alert(
      "Confirm End Trip",
      "Has the passenger reached the drop location?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, End Trip",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              const distance = ride?.distance || 10;
              const fare = ride?.fare || 250;

              const completedRide = await api.completeRide(rideId, { distance, fare });

              router.replace(`/driver/booking/payment-summary?bookingId=${encodeURIComponent(completedRide.id)}&fare=${fare}`);
            } catch (err: any) {
              console.error("EndTrip error:", err);
              Alert.alert(
                "Could not end trip",
                err.message || "Network/server error. Check connection and try again.",
                [
                  { text: "Retry", onPress: confirmEnd },
                  { text: "Go to Dashboard", onPress: () => router.replace("/driver/dashboard") },
                ]
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (fetchingRide) {
    return (
      <ThemedView className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#FACC15" />
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1 px-6 py-10">
      <ThemedText className="text-3xl font-extrabold">End Trip</ThemedText>
      <ThemedText className="text-gray-500 mt-1">Ride ID: {rideId || "unknown"}</ThemedText>

      <View className="mt-6 p-5 rounded-2xl border">
        <ThemedText className="text-lg font-semibold">Trip Summary</ThemedText>

        <View className="mt-4 flex-row justify-between">
          <View>
            <ThemedText className="text-gray-500 text-sm">Distance</ThemedText>
            <ThemedText className="text-xl font-bold">{ride?.distance || 0} km</ThemedText>
          </View>

          <View>
            <ThemedText className="text-gray-500 text-sm">Duration</ThemedText>
            <ThemedText className="text-xl font-bold">{ride?.duration || 0} min</ThemedText>
          </View>

          <View>
            <ThemedText className="text-gray-500 text-sm">Fare</ThemedText>
            <ThemedText className="text-xl font-bold text-yellow-600">₹{ride?.fare || 0}</ThemedText>
          </View>
        </View>

        <View className="mt-4 flex-row items-center">
          <MaterialIcons name="info" size={18} color="#d97706" />
          <ThemedText className="ml-2 text-sm text-gray-600">
            Passenger will also confirm trip completion.
          </ThemedText>
        </View>
      </View>

      <View className="mt-6 p-4 rounded-2xl border flex-row items-center">
        <Ionicons name="person-circle-outline" size={45} color="#444" />
        <View className="ml-3">
          <ThemedText className="text-lg font-semibold">
            {ride?.rider?.firstName || "Rider"} {ride?.rider?.lastName || ""}
          </ThemedText>
          <ThemedText className="text-xs text-gray-500">Passenger</ThemedText>
        </View>
      </View>

      <View className="mt-4 p-4 rounded-2xl border">
        <ThemedText className="font-semibold">Route</ThemedText>
        <ThemedText className="text-gray-600 mt-1">
          From: {ride?.pickup?.locationName || "Pickup"}, {ride?.pickup?.city || ""}
        </ThemedText>
        <ThemedText className="text-gray-600 mt-1">
          To: {ride?.drop?.locationName || "Drop"}, {ride?.drop?.city || ""}
        </ThemedText>
      </View>

      <TouchableOpacity
        onPress={confirmEnd}
        className="mt-10 p-4 rounded-2xl bg-red-600 items-center"
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <ThemedText className="text-white font-bold text-lg">End Trip</ThemedText>}
      </TouchableOpacity>
    </ThemedView>
  );
}