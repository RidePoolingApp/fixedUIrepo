import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { ThemedText, ThemedView } from "../components/Themed";
import { Ionicons } from "@expo/vector-icons";

// Availability Later scheduler
// Standalone screen: /driver/availability-schedule

export default function AvailabilitySchedule() {
  const [choice, setChoice] = useState<"now" | "later" | "not_today">("later");
  const [time, setTime] = useState("09:00");
  const [duration, setDuration] = useState("4h");

  return (
    <ScrollView className="flex-1 px-4 py-6">
      <ThemedText className="text-3xl font-extrabold">Availability</ThemedText>
      <ThemedText className="text-gray-600 mt-1">Choose when to be available</ThemedText>

      {/* Choice */}
      <View className="flex-row mt-4">
        {([
          { key: "now", label: "Available Now" },
          { key: "later", label: "Available Later" },
          { key: "not_today", label: "Not Available Today" },
        ] as const).map((o) => (
          <TouchableOpacity
            key={o.key}
            onPress={() => setChoice(o.key)}
            className={`px-3 py-2 mr-2 rounded-full ${choice === o.key ? "bg-black" : "bg-gray-200"}`}
          >
            <ThemedText className={`text-sm ${choice === o.key ? "text-white" : "text-gray-800"}`}>{o.label}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      {/* Later scheduling */}
      {choice === "later" && (
        <ThemedView className="mt-6 p-4 rounded-2xl border" style={{ borderColor: "#e5e7eb" }}>
          <ThemedText className="text-lg font-bold">Schedule</ThemedText>
          <View className="flex-row items-center mt-3">
            <Ionicons name="time-outline" size={18} color="#666" />
            <ThemedText className="ml-2 text-gray-700">Start time</ThemedText>
          </View>
          <View className="flex-row mt-2">
            {["08:00", "09:00", "10:00", "11:00", "12:00"].map((t) => (
              <TouchableOpacity
                key={t}
                onPress={() => setTime(t)}
                className={`px-3 py-2 mr-2 rounded-full ${time === t ? "bg-black" : "bg-gray-200"}`}
              >
                <ThemedText className={`text-sm ${time === t ? "text-white" : "text-gray-800"}`}>{t}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>

          <View className="flex-row items-center mt-4">
            <Ionicons name="hourglass-outline" size={18} color="#666" />
            <ThemedText className="ml-2 text-gray-700">Duration</ThemedText>
          </View>
          <View className="flex-row mt-2">
            {["2h", "4h", "6h", "8h"].map((d) => (
              <TouchableOpacity
                key={d}
                onPress={() => setDuration(d)}
                className={`px-3 py-2 mr-2 rounded-full ${duration === d ? "bg-black" : "bg-gray-200"}`}
              >
                <ThemedText className={`text-sm ${duration === d ? "text-white" : "text-gray-800"}`}>{d}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity className="mt-6 px-4 py-3 rounded-2xl bg-black">
            <ThemedText className="text-white text-center">Confirm Schedule</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      )}

      {/* Not available today */}
      {choice === "not_today" && (
        <ThemedView className="mt-6 p-4 rounded-2xl border" style={{ borderColor: "#e5e7eb" }}>
          <ThemedText className="text-lg font-bold">You will not receive offers today</ThemedText>
          <ThemedText className="text-gray-600 mt-2">You can still override this by going online manually.</ThemedText>
        </ThemedView>
      )}

      {/* Available now CTA */}
      {choice === "now" && (
        <TouchableOpacity className="mt-6 px-4 py-3 rounded-2xl bg-black">
          <ThemedText className="text-white text-center">Go Online</ThemedText>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}
