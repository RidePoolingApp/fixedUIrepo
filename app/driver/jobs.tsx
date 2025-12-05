import React, { useMemo, useState } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ThemedText, ThemedView } from "../components/Themed";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

// Driver-First Job Marketplace
// Non-invasive: standalone screen. Does not alter existing UI.
// Route: /driver/jobs

type JobType = "Long Trip" | "Daily Commute" | "Rental";

type JobCard = {
  id: string;
  type: JobType;
  title: string;
  pickupWindow: string;
  routeSummary: string;
  estPay: string;
  passengers?: number;
  distanceKm?: number;
  timeMin?: number;
  requirements?: string[];
  badges?: string[];
};

const mockJobs: JobCard[] = [
  {
    id: "job-001",
    type: "Long Trip",
    title: "Airport → City Center",
    pickupWindow: "Today 6:30–7:00 AM",
    routeSummary: "35 km / 50 min",
    estPay: "₹1,250 + bonus",
    distanceKm: 35,
    timeMin: 50,
    requirements: ["Sedan"],
    badges: ["High Demand"],
  },
  {
    id: "job-002",
    type: "Daily Commute",
    title: "Tech Park Shuttle",
    pickupWindow: "Today 9:00 AM",
    routeSummary: "12 km / 25 min",
    estPay: "₹320",
    distanceKm: 12,
    timeMin: 25,
    passengers: 1,
    badges: ["Nearby"],
  },

  {
    id: "job-004",
    type: "Rental",
    title: "3-hr City Rental",
    pickupWindow: "Tomorrow 11:00 AM",
    routeSummary: "Flexible itinerary",
    estPay: "₹900",
    badges: ["Advance Booking"],
  },
];

export default function DriverJobs() {
  const router = useRouter();
  const [filterType, setFilterType] = useState<JobType | "All">("All");
  const [sortKey, setSortKey] = useState<"pay" | "distance" | "time" | "match">("pay");

  const filtered = useMemo(() => {
    let list = [...mockJobs];
    if (filterType !== "All") list = list.filter((j) => j.type === filterType);
    switch (sortKey) {
      case "distance":
        return list.sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));
      case "time":
        return list.sort((a, b) => (a.timeMin ?? 999) - (b.timeMin ?? 999));
      case "match":
        // Placeholder: would use preferences ranking
        return list;
      case "pay":
      default:
        // Heuristic: extract number from estPay if possible
        const num = (s?: string) => parseInt((s || "").replace(/[^0-9]/g, "")) || 0;
        return list.sort((a, b) => num(b.estPay) - num(a.estPay));
    }
  }, [filterType, sortKey]);

  const goDetails = (job: JobCard) => {
    // Connect to existing passenger assigned flow
    router.push("/driver/assigned");
  };

  const accept = (job: JobCard) => goDetails(job);
  const schedule = (job: JobCard) => router.push("/driver/availability-schedule");

  return (
    <ScrollView className="flex-1 px-4 py-10">
      <ThemedText className="text-3xl font-extrabold">Job Marketplace</ThemedText>

      {/* Filters */}
      <View className="flex-row mt-4">
        {(["All", "Long Trip", "Daily Commute", "Rental"] as const).map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setFilterType(t as any)}
            className={`px-3 py-2 mr-2 rounded-full ${filterType === t ? "bg-yellow-500" : "bg-gray-200"}`}
          >
            <ThemedText className={`text-sm ${filterType === t ? "text-white" : "text-gray-800"}`}>{t}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sorting */}
      <View className="flex-row mt-3">
        {([
          { key: "pay", label: "Pay" },
          { key: "distance", label: "Distance" },
          { key: "time", label: "Time" },
          { key: "match", label: "Match" },
        ] as const).map((o) => (
          <TouchableOpacity
            key={o.key}
            onPress={() => setSortKey(o.key)}
            className={`px-3 py-2 mr-2 rounded-full ${sortKey === o.key ? "bg-black" : "bg-gray-200"}`}
          >
            <ThemedText className={`text-sm ${sortKey === o.key ? "text-white" : "text-gray-800"}`}>{o.label}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      {/* Job Cards */}
      <View className="mt-6">
        {filtered.map((job) => (
          <ThemedView
            key={job.id}
            className="mb-5 p-5 rounded-3xl shadow border"
            style={{ elevation: 4 }}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Ionicons name="briefcase-outline" size={22} color="#d97706" />
                <ThemedText className="ml-2 font-semibold">{job.type}</ThemedText>
              </View>
              <View className="flex-row">
                {job.badges?.map((b) => (
                  <View key={b} className="px-2 py-1 ml-2 rounded-full bg-yellow-100 border border-yellow-300">
                    <ThemedText className="text-xs text-yellow-700">{b}</ThemedText>
                  </View>
                ))}
              </View>
            </View>

            <ThemedText className="text-xl font-bold mt-2">{job.title}</ThemedText>
            <View className="flex-row items-center mt-1">
              <MaterialIcons name="schedule" size={16} color="#666" />
              <ThemedText className="ml-2 text-gray-500">{job.pickupWindow}</ThemedText>
            </View>
            <ThemedText className="text-gray-700 mt-1">{job.routeSummary}</ThemedText>

            <View className="flex-row mt-3">
              {job.distanceKm != null && (
                <View className="px-3 py-1 mr-2 rounded-full bg-gray-100 border border-gray-300">
                  <ThemedText className="text-xs text-gray-700">{job.distanceKm} km</ThemedText>
                </View>
              )}
              {job.timeMin != null && (
                <View className="px-3 py-1 mr-2 rounded-full bg-gray-100 border border-gray-300">
                  <ThemedText className="text-xs text-gray-700">{job.timeMin} min</ThemedText>
                </View>
              )}
              {job.requirements?.map((r) => (
                <View key={r} className="px-3 py-1 mr-2 rounded-full bg-gray-100 border border-gray-300">
                  <ThemedText className="text-xs text-gray-700">{r}</ThemedText>
                </View>
              ))}
            </View>

            <View className="flex-row items-center justify-between mt-4">
              <View>
                <ThemedText className="text-gray-500">Est. Pay</ThemedText>
                <ThemedText className="text-xl font-extrabold text-yellow-600">{job.estPay}</ThemedText>
              </View>
              <View className="flex-row">
                <TouchableOpacity onPress={() => accept(job)} className="px-4 py-2 rounded-2xl bg-yellow-500 mr-2">
                  <ThemedText className="text-white font-semibold">Accept</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => schedule(job)} className="px-4 py-2 rounded-2xl bg-white border border-gray-300">
                  <ThemedText className="font-semibold">Schedule</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </ThemedView>
        ))}
      </View>
    </ScrollView>
  );
}
