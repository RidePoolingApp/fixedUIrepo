import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from "react-native";
import Svg, { Path } from "react-native-svg";
import BottomNav from "./components/BottomNav";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import { useApi, Ride, RideStatus } from "./services/api";
import { ThemedScreen, ThemedView, ThemedText, ThemedTextSecondary } from "./components/Themed";
import { useThemeStyles } from "./context/themeStyles";

export default function Bookings() {
  const router = useRouter();
  const api = useApi();
  const { isDark } = useThemeStyles();

  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchRides = useCallback(async (pageNum = 1, refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else if (pageNum === 1) setLoading(true);

      const response = await api.getRideHistory(pageNum, 10);
      
      if (refresh || pageNum === 1) {
        setRides(response.rides || []);
      } else {
        setRides(prev => [...prev, ...(response.rides || [])]);
      }
      
      setHasMore((response.rides?.length || 0) === 10);
      setPage(pageNum);
    } catch (error) {
      console.error("Failed to fetch rides:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [api]);

  useEffect(() => {
    fetchRides();
  }, []);

  const onRefresh = () => fetchRides(1, true);

  const loadMore = () => {
    if (hasMore && !loading) {
      fetchRides(page + 1);
    }
  };

  const getStatusIcon = (status: RideStatus) => {
    switch (status) {
      case RideStatus.COMPLETED:
        return "checkmark-done-circle";
      case RideStatus.CANCELLED:
        return "close-circle";
      case RideStatus.STARTED:
        return "car";
      case RideStatus.ACCEPTED:
      case RideStatus.ARRIVING:
        return "time-outline";
      default:
        return "hourglass-outline";
    }
  };

  const getStatusColor = (status: RideStatus) => {
    switch (status) {
      case RideStatus.COMPLETED:
        return "#22c55e";
      case RideStatus.CANCELLED:
        return "#ef4444";
      default:
        return "#f59e0b";
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return `Today • ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    if (diffDays === 1) return "Yesterday";
    return date.toLocaleDateString();
  };

  return (
    <ThemedScreen>
      <View className="absolute top-0 left-0 right-0">
        <Svg height="240" width="100%">
          <Path d="M0 0 H400 V140 Q200 240 0 140 Z" fill={isDark ? "#1F2937" : "#FACC15"} />
        </Svg>
      </View>

      <View className="mt-20 px-6 mb-4">
        <ThemedText className="text-3xl font-extrabold">My Bookings</ThemedText>
        <ThemedTextSecondary>Past & upcoming rides</ThemedTextSecondary>
      </View>

      {loading && rides.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FACC15" />
        </View>
      ) : (
        <ScrollView 
          className="px-6" 
          contentContainerStyle={{ paddingBottom: 120 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FACC15" />
          }
          onScrollEndDrag={loadMore}
        >
          {rides.length === 0 ? (
            <ThemedView className="rounded-3xl p-6 items-center">
              <Ionicons name="car-outline" size={48} color="#FACC15" />
              <ThemedText className="text-lg font-semibold mt-4">No rides yet</ThemedText>
              <ThemedTextSecondary className="text-center mt-2">
                Your ride history will appear here
              </ThemedTextSecondary>
              <TouchableOpacity
                onPress={() => router.push("/book")}
                className="bg-yellow-500 px-6 py-3 rounded-2xl mt-4"
              >
                <Text className="text-white font-bold">Book a Ride</Text>
              </TouchableOpacity>
            </ThemedView>
          ) : (
            rides.map((ride) => (
              <TouchableOpacity
                key={ride.id}
                onPress={() => router.push({ pathname: "/ride/assigned", params: { rideId: ride.id } })}
                className={`rounded-3xl p-6 shadow border mb-5 ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
                style={{ elevation: 5 }}
              >
                <View className="flex-row items-center mb-3">
                  <Ionicons 
                    name={getStatusIcon(ride.status) as any} 
                    size={30} 
                    color={getStatusColor(ride.status)} 
                  />
                  <ThemedText className="ml-3 text-lg font-bold">
                    {ride.status.charAt(0) + ride.status.slice(1).toLowerCase()}
                  </ThemedText>
                </View>

                <View className="flex-row items-center mb-2">
                  <Ionicons name="location-outline" size={22} color="#b45309" />
                  <ThemedText className="ml-2 font-semibold" numberOfLines={1}>
                    {ride.pickup?.locationName || ride.pickup?.address || "Pickup"}
                  </ThemedText>
                </View>

                <View className="ml-3 h-6 border-l-2 border-gray-300" />

                <View className="flex-row items-center mt-2">
                  <Ionicons name="flag-outline" size={22} color="#b45309" />
                  <ThemedText className="ml-2 font-semibold" numberOfLines={1}>
                    {ride.drop?.locationName || ride.drop?.address || "Drop"}
                  </ThemedText>
                </View>

                <ThemedTextSecondary className="mt-3">
                  {formatDate(ride.createdAt)}
                </ThemedTextSecondary>

                <View className="mt-4 flex-row justify-between items-center">
                  <Text className="text-yellow-600 text-xl font-extrabold">
                    {ride.fare ? `₹${ride.fare}` : "Pending"}
                  </Text>
                  {ride.status === RideStatus.COMPLETED && (
                    <TouchableOpacity
                      onPress={() => router.push({
                        pathname: "/long-trip",
                        params: { 
                          from: ride.pickup?.locationName || ride.pickup?.address || "", 
                          to: ride.drop?.locationName || ride.drop?.address || ""
                        }
                      })}
                      className="px-4 py-2 bg-yellow-500 rounded-xl"
                    >
                      <Text className="text-white font-semibold">Rebook</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {ride.driver && (
                  <View className={`mt-4 pt-4 border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                    <ThemedTextSecondary>
                      Driver: {ride.driver.vehicleMake} {ride.driver.vehicleModel} • {ride.driver.licensePlate}
                    </ThemedTextSecondary>
                  </View>
                )}
              </TouchableOpacity>
            ))
          )}
          
          {hasMore && rides.length > 0 && (
            <TouchableOpacity onPress={loadMore} className="items-center py-4">
              <ThemedTextSecondary>Load more</ThemedTextSecondary>
            </TouchableOpacity>
          )}
        </ScrollView>
      )}

      <BottomNav />
    </ThemedScreen>
  );
}
