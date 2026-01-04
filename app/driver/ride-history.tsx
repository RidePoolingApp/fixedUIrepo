import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState, useCallback } from "react";
import { useApi, Ride, RideStatus } from "../services/api";

interface RideHistoryItem {
  id: string;
  date: string;
  time: string;
  from: string;
  to: string;
  fare: string;
  status: string;
  rating: number | null;
}

export default function RideHistory() {
  const router = useRouter();
  const api = useApi();

  const [activeFilter, setActiveFilter] = useState("All");
  const [rideHistory, setRideHistory] = useState<RideHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  const fetchRideHistory = useCallback(async (pageNum = 1, filter = activeFilter) => {
    try {
      setError(null);
      const response = await api.getDriverRideHistory(pageNum, 10, filter);
      
      const formattedRides: RideHistoryItem[] = response.rides.map((ride: Ride) => {
        const createdAt = new Date(ride.createdAt);
        return {
          id: ride.id,
          date: createdAt.toISOString().split('T')[0],
          time: createdAt.toTimeString().slice(0, 5),
          from: ride.pickup?.locationName || ride.pickup?.address || "Unknown",
          to: ride.drop?.locationName || ride.drop?.address || "Unknown",
          fare: `₹${ride.fare || 0}`,
          status: ride.status === RideStatus.COMPLETED ? "Completed" : 
                  ride.status === RideStatus.CANCELLED ? "Cancelled" : ride.status,
          rating: ride.rating?.score || null,
        };
      });

      if (pageNum === 1) {
        setRideHistory(formattedRides);
      } else {
        setRideHistory(prev => [...prev, ...formattedRides]);
      }

      setHasMore(response.rides.length === 10);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [api, activeFilter]);

  useEffect(() => {
    fetchRideHistory(1);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    setPage(1);
    setLoading(true);
    fetchRideHistory(1, activeFilter);
  }, [activeFilter]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    fetchRideHistory(1);
  }, [fetchRideHistory]);

  const loadMore = () => {
    if (hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchRideHistory(nextPage);
    }
  };

  const filtered = activeFilter === "All"
    ? rideHistory
    : rideHistory.filter((r) => r.status === activeFilter);

  if (loading && rideHistory.length === 0) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#FACC15" />
        <Text className="mt-4 text-gray-600">Loading ride history...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="absolute top-0 left-0 right-0">
        <Svg height="240" width="100%">
          <Path d="M0 0 H400 V140 Q200 240 0 140 Z" fill="#FACC15" />
          <Path d="M0 30 H400 V150 Q200 250 0 150 Z" fill="#FDE047" opacity={0.4} />
        </Svg>
      </View>

      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-14 left-6 bg-white p-3 rounded-full shadow"
        style={{ elevation: 4 }}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <View className="mt-28 px-6">
        <Text className="text-3xl font-extrabold text-gray-900">Ride History</Text>
        <Text className="text-gray-700 mt-1">Your past rides and earnings</Text>
      </View>

      <View className="px-6 mt-5 flex-row justify-between bg-white rounded-3xl p-3 shadow border border-gray-200"
            style={{ elevation: 4 }}>
        {["All", "Completed", "Cancelled"].map((filter) => {
          const active = filter === activeFilter;
          return (
            <TouchableOpacity
              key={filter}
              onPress={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-2xl ${
                active ? "bg-yellow-500" : "bg-gray-100"
              }`}
            >
              <Text
                className={`text-sm font-semibold ${
                  active ? "text-white" : "text-gray-600"
                }`}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {error && (
        <View className="px-6 mt-4">
          <Text className="text-red-500 text-center">{error}</Text>
        </View>
      )}

      <ScrollView
        className="px-6 mt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 160 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#FACC15"]} />
        }
        onScrollEndDrag={loadMore}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {filtered.length === 0 ? (
            <View className="items-center py-10">
              <Ionicons name="car-outline" size={64} color="#ccc" />
              <Text className="text-gray-500 mt-4">No rides found</Text>
            </View>
          ) : (
            filtered.map((ride, i) => (
              <View
                key={ride.id || i}
                className="bg-white p-5 rounded-3xl shadow border border-gray-200 mb-4"
                style={{ elevation: 4 }}
              >
                <View className="flex-row justify-between items-start mb-3">
                  <View>
                    <Text className="text-gray-800 font-semibold text-lg">
                      {ride.id.slice(0, 8)}...
                    </Text>
                    <Text className="text-gray-500 text-sm">
                      {ride.date} • {ride.time}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-yellow-600 font-bold text-xl">
                      {ride.fare}
                    </Text>
                    <Text
                      className={`text-sm font-semibold ${
                        ride.status === "Completed" ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {ride.status}
                    </Text>
                  </View>
                </View>

                <View className="mb-3">
                  <Text className="text-gray-600 text-sm">
                    <Ionicons name="location-outline" size={14} color="#666" /> From: {ride.from}
                  </Text>
                  <Text className="text-gray-600 text-sm mt-1">
                    <Ionicons name="location" size={14} color="#666" /> To: {ride.to}
                  </Text>
                </View>

                {ride.rating && (
                  <View className="flex-row items-center">
                    <Ionicons name="star" size={16} color="#FACC15" />
                    <Text className="text-gray-700 ml-1">{ride.rating}/5</Text>
                  </View>
                )}
              </View>
            ))
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}
