import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { ThemedText, ThemedView } from "../components/Themed";
import { Ionicons } from "@expo/vector-icons";

// Driver Preferences
// Standalone screen: /driver/preferences

type RideType = "Long Trips" | "Daily Commute" | "Rentals" | "Pooling";

type WorkTime = "Morning" | "Afternoon" | "Evening" | "Night";

export default function DriverPreferences() {
  const [rideTypes, setRideTypes] = useState<Record<RideType, boolean>>({
    "Long Trips": true,
    "Daily Commute": true,
    Rentals: true,
    Pooling: true,
  });
  const [workTime, setWorkTime] = useState<WorkTime[]>(["Morning", "Evening"]);
  const [maxPassengers, setMaxPassengers] = useState(2);
  const [maxTripLength, setMaxTripLength] = useState("30 km");
  const [genderPref, setGenderPref] = useState<"None" | "Female-only">("None");

  const toggleRideType = (k: RideType) =>
    setRideTypes((s) => ({ ...s, [k]: !s[k] }));

  const toggleWorkTime = (k: WorkTime) =>
    setWorkTime((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));

  return (
    <ScrollView className="flex-1 px-4 py-6">
      <ThemedText className="text-3xl font-extrabold">Preferences</ThemedText>
      <ThemedText className="text-gray-600 mt-1">Set your job matching preferences</ThemedText>

      {/* Ride types */}
      <ThemedView className="mt-6 p-4 rounded-2xl border" style={{ borderColor: "#e5e7eb" }}>
        <ThemedText className="text-lg font-bold">Ride Types</ThemedText>
        <View className="flex-row flex-wrap mt-3">
          {(["Long Trips", "Daily Commute", "Rentals", "Pooling"] as const).map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => toggleRideType(t)}
              className={`px-3 py-2 mr-2 mb-2 rounded-full ${rideTypes[t] ? "bg-black" : "bg-gray-200"}`}
            >
              <ThemedText className={`text-sm ${rideTypes[t] ? "text-white" : "text-gray-800"}`}>{t}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </ThemedView>

      {/* Preferred work time */}
      <ThemedView className="mt-6 p-4 rounded-2xl border" style={{ borderColor: "#e5e7eb" }}>
        <ThemedText className="text-lg font-bold">Preferred Work Time</ThemedText>
        <View className="flex-row flex-wrap mt-3">
          {(["Morning", "Afternoon", "Evening", "Night"] as const).map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => toggleWorkTime(t)}
              className={`px-3 py-2 mr-2 mb-2 rounded-full ${workTime.includes(t) ? "bg-black" : "bg-gray-200"}`}
            >
              <ThemedText className={`text-sm ${workTime.includes(t) ? "text-white" : "text-gray-800"}`}>{t}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </ThemedView>

      {/* Max passengers (pool) */}
      <ThemedView className="mt-6 p-4 rounded-2xl border" style={{ borderColor: "#e5e7eb" }}>
        <ThemedText className="text-lg font-bold">Max passengers (pool)</ThemedText>
        <View className="flex-row mt-3">
          {[1, 2, 3, 4].map((n) => (
            <TouchableOpacity
              key={n}
              onPress={() => setMaxPassengers(n)}
              className={`px-3 py-2 mr-2 rounded-full ${maxPassengers === n ? "bg-black" : "bg-gray-200"}`}
            >
              <ThemedText className={`text-sm ${maxPassengers === n ? "text-white" : "text-gray-800"}`}>{n}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </ThemedView>

      {/* Max trip length */}
      <ThemedView className="mt-6 p-4 rounded-2xl border" style={{ borderColor: "#e5e7eb" }}>
        <ThemedText className="text-lg font-bold">Max trip length</ThemedText>
        <View className="flex-row mt-3">
          {["10 km", "20 km", "30 km", "50 km", "Predefined routes"].map((d) => (
            <TouchableOpacity
              key={d}
              onPress={() => setMaxTripLength(d)}
              className={`px-3 py-2 mr-2 rounded-full ${maxTripLength === d ? "bg-black" : "bg-gray-200"}`}
            >
              <ThemedText className={`text-sm ${maxTripLength === d ? "text-white" : "text-gray-800"}`}>{d}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </ThemedView>

      {/* Gender preference */}
      <ThemedView className="mt-6 p-4 rounded-2xl border" style={{ borderColor: "#e5e7eb" }}>
        <ThemedText className="text-lg font-bold">Gender preference (optional)</ThemedText>
        <View className="flex-row mt-3">
          {["None", "Female-only"].map((g) => (
            <TouchableOpacity
              key={g}
              onPress={() => setGenderPref(g as any)}
              className={`px-3 py-2 mr-2 rounded-full ${genderPref === g ? "bg-black" : "bg-gray-200"}`}
            >
              <ThemedText className={`text-sm ${genderPref === g ? "text-white" : "text-gray-800"}`}>{g}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>
        <ThemedText className="text-gray-500 mt-2">Applied where compliant and safe.</ThemedText>
      </ThemedView>

      <TouchableOpacity className="mt-8 px-4 py-3 rounded-2xl bg-black">
        <ThemedText className="text-white text-center">Save & Apply</ThemedText>
      </TouchableOpacity>
    </ScrollView>
  );
}
