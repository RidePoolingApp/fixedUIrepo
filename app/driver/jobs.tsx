import React, { useMemo, useState, useEffect, useCallback } from "react";
import { View, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ThemedText, ThemedView } from "../components/Themed";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useApi, Ride, RideType } from "../services/api";

type JobType = "Long Trip" | "Daily Commute" | "Standard" | "All";

export default function DriverJobs() {
  const router = useRouter();
  const api = useApi();
  
  const [jobs, setJobs] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<JobType>("All");
  const [sortKey, setSortKey] = useState<"fare" | "distance" | "time">("fare");

  const fetchJobs = useCallback(async () => {
    try {
      const jobsList = await api.getDriverJobs();
      setJobs(jobsList);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [api]);

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 30000);
    return () => clearInterval(interval);
  }, [fetchJobs]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchJobs();
  };

  const getJobType = (ride: Ride): JobType => {
    switch (ride.type) {
      case RideType.LONG_TRIP:
        return "Long Trip";
      case RideType.DAILY_CAB:
        return "Daily Commute";
      default:
        return "Standard";
    }
  };

  const filtered = useMemo(() => {
    let list = [...jobs];
    if (filterType !== "All") {
      list = list.filter((j) => getJobType(j) === filterType);
    }
    switch (sortKey) {
      case "distance":
        return list.sort((a, b) => (a.distance ?? 999) - (b.distance ?? 999));
      case "time":
        return list.sort((a, b) => (a.duration ?? 999) - (b.duration ?? 999));
      case "fare":
      default:
        return list.sort((a, b) => (b.fare ?? 0) - (a.fare ?? 0));
    }
  }, [jobs, filterType, sortKey]);

  const acceptJob = async (job: Ride) => {
    setAcceptingId(job.id);
    try {
      await api.acceptJob(job.id);
      Alert.alert("Success", "Job accepted successfully!", [
        { text: "View Details", onPress: () => router.push(`/driver/assigned?rideId=${job.id}`) },
      ]);
      fetchJobs();
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to accept job");
    } finally {
      setAcceptingId(null);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#FACC15" />
      </View>
    );
  }

  return (
    <ScrollView 
      className="flex-1 px-4 py-10"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#FACC15"]} />}
    >
      <ThemedText className="text-3xl font-extrabold">Job Marketplace</ThemedText>

      {/* Filters */}
      <View className="flex-row mt-4">
        {(["All", "Long Trip", "Daily Commute", "Standard"] as const).map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setFilterType(t)}
            className={`px-3 py-2 mr-2 rounded-full ${filterType === t ? "bg-yellow-500" : "bg-gray-200"}`}
          >
            <ThemedText className={`text-sm ${filterType === t ? "text-white" : "text-gray-800"}`}>{t}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sorting */}
      <View className="flex-row mt-3">
        {([
          { key: "fare", label: "Fare" },
          { key: "distance", label: "Distance" },
          { key: "time", label: "Time" },
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
        {filtered.length === 0 ? (
          <ThemedView className="p-6 rounded-3xl items-center">
            <Ionicons name="briefcase-outline" size={48} color="#ccc" />
            <ThemedText className="text-gray-500 mt-4">No jobs available right now</ThemedText>
            <ThemedText className="text-gray-400 text-sm">Pull down to refresh</ThemedText>
          </ThemedView>
        ) : (
          filtered.map((job) => (
            <ThemedView
              key={job.id}
              className="mb-5 p-5 rounded-3xl shadow border"
              style={{ elevation: 4 }}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Ionicons name="briefcase-outline" size={22} color="#d97706" />
                  <ThemedText className="ml-2 font-semibold">{getJobType(job)}</ThemedText>
                </View>
                <View className="px-2 py-1 rounded-full bg-yellow-100 border border-yellow-300">
                  <ThemedText className="text-xs text-yellow-700">{job.status}</ThemedText>
                </View>
              </View>

              <ThemedText className="text-xl font-bold mt-2">
                {job.pickup?.locationName || "Pickup"} → {job.drop?.locationName || "Drop"}
              </ThemedText>
              <View className="flex-row items-center mt-1">
                <MaterialIcons name="schedule" size={16} color="#666" />
                <ThemedText className="ml-2 text-gray-500">
                  {job.scheduledAt ? new Date(job.scheduledAt).toLocaleString() : "ASAP"}
                </ThemedText>
              </View>
              <ThemedText className="text-gray-700 mt-1">
                {job.pickup?.city}, {job.pickup?.district}
              </ThemedText>

              <View className="flex-row mt-3">
                {job.distance && (
                  <View className="px-3 py-1 mr-2 rounded-full bg-gray-100 border border-gray-300">
                    <ThemedText className="text-xs text-gray-700">{job.distance} km</ThemedText>
                  </View>
                )}
                {job.duration && (
                  <View className="px-3 py-1 mr-2 rounded-full bg-gray-100 border border-gray-300">
                    <ThemedText className="text-xs text-gray-700">{job.duration} min</ThemedText>
                  </View>
                )}
              </View>

              <View className="flex-row items-center justify-between mt-4">
                <View>
                  <ThemedText className="text-gray-500">Est. Fare</ThemedText>
                  <ThemedText className="text-xl font-extrabold text-yellow-600">
                    ₹{job.fare || "TBD"}
                  </ThemedText>
                </View>
                <View className="flex-row">
                  <TouchableOpacity 
                    onPress={() => acceptJob(job)} 
                    disabled={acceptingId === job.id}
                    className="px-4 py-2 rounded-2xl bg-yellow-500"
                  >
                    {acceptingId === job.id ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <ThemedText className="text-white font-semibold">Accept</ThemedText>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </ThemedView>
          ))
        )}
      </View>
    </ScrollView>
  );
}
