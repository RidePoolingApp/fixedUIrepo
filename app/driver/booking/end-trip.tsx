// app/driver/booking/end-trip.tsx
import React, { useState } from "react";
import { View, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ThemedView, ThemedText } from "../../components/Themed";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

/**
 * Robust EndTrip screen:
 * - Calls backend to mark trip ended
 * - Shows loading state + error handling
 * - Navigates to payment-summary on success
 *
 * Adjust API_BASE and Authorization header to match your backend.
 */

export default function EndTrip() {
  const router = useRouter();
  const params = useLocalSearchParams<{ bookingId?: string }>();
  const bookingIdFromParams = params.bookingId ?? "";

  const [loading, setLoading] = useState(false);

  // <- replace with your API base
  const API_BASE = "https://your.api.server";

  // Helper: call server to end trip
  const endTripApi = async (bookingId: string) => {
    // adapt path to your server
    const url = `${API_BASE}/api/driver/bookings/${encodeURIComponent(bookingId)}/end`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${TOKEN}` // add if needed
        },
        body: JSON.stringify({ endedAt: new Date().toISOString() }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(`Server ${res.status}: ${body || res.statusText}`);
      }

      const json = await res.json().catch(() => ({}));
      return json; // expected to contain bookingId or confirmation
    } catch (err) {
      clearTimeout(timeout);
      throw err;
    }
  };

  const confirmEnd = async () => {
    // sanity
    const bookingId = String(bookingIdFromParams || "").trim();
    if (!bookingId) {
      // If no bookingId param, still allow end but warn devs
      console.warn("EndTrip: bookingId is empty - using fallback booking id");
    }

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
              console.log("Ending trip for bookingId:", bookingId);
              // call API - if you don't have an API, you can skip this call
              const resp = await endTripApi(bookingId || "fallback_booking_id");

              console.log("endTripApi response:", resp);

              // server may return the bookingId or payment info; support both
              const returnedBookingId = resp?.bookingId ?? bookingId ?? "BKG_UNKNOWN";

              // navigate to payment summary - prefer router.replace so user can't go back to active trip
              router.replace(`/driver/booking/payment-summary?bookingId=${encodeURIComponent(returnedBookingId)}`);

            } catch (err: any) {
              console.error("EndTrip error:", err);
              // friendly message to driver
              Alert.alert(
                "Could not end trip",
                typeof err?.message === "string"
                  ? err.message
                  : "Network/server error. Check connection and try again.",
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

  return (
    <ThemedView className="flex-1 px-6 py-10">
      <ThemedText className="text-3xl font-extrabold">End Trip</ThemedText>
      <ThemedText className="text-gray-500 mt-1">Booking ID: {bookingIdFromParams || "unknown"}</ThemedText>

      <View className="mt-6 p-5 rounded-2xl border">
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
            <ThemedText className="text-xl font-bold text-yellow-600">₹1250</ThemedText>
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
          <ThemedText className="text-lg font-semibold">A. Patel</ThemedText>
          <ThemedText className="text-xs text-gray-500">4.9 ★ Rider</ThemedText>
        </View>
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
