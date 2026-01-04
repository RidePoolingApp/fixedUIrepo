import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import Svg, { Path, Circle } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState, useContext, useCallback } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as Linking from "expo-linking";
import * as Haptics from "expo-haptics";
import { ThemeContext } from "./context/ThemeContext";
import { useApi, Ride, RideStatus } from "./services/api";
import { useAuth } from "@clerk/clerk-expo";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL || "http://localhost:3000";

export default function RideTracking() {
  const router = useRouter();
  const params = useLocalSearchParams<{ rideId: string }>();
  const api = useApi();
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const rideId = params.rideId;

  const [ride, setRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;

  // Wait for auth to be fully ready
  useEffect(() => {
    const checkAuth = async () => {
      if (isLoaded && isSignedIn) {
        try {
          const token = await getToken();
          if (token) {
            setAuthReady(true);
          }
        } catch (error) {
          console.error("Error getting token:", error);
        }
      }
    };
    checkAuth();
  }, [isLoaded, isSignedIn]);

  // Fetch ride details
  const fetchRide = useCallback(async () => {
    if (!authReady || !rideId) {
      setLoading(false);
      return;
    }

    try {
      const rideData = await api.getRide(rideId);
      setRide(rideData);

      // Navigate based on ride status
      if (rideData.status === RideStatus.ACCEPTED || rideData.status === RideStatus.ARRIVING) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.replace({
          pathname: "/ride/assigned",
          params: { rideId: rideData.id },
        });
      } else if (rideData.status === RideStatus.STARTED) {
        router.replace({
          pathname: "/ride/started",
          params: { rideId: rideData.id },
        });
      } else if (rideData.status === RideStatus.COMPLETED) {
        router.replace({
          pathname: "/ride/competed",
          params: { rideId: rideData.id },
        });
      } else if (rideData.status === RideStatus.CANCELLED) {
        Alert.alert(
          "Ride Cancelled",
          rideData.cancelReason || "The ride has been cancelled",
          [{ text: "OK", onPress: () => router.replace("/home") }]
        );
      }
    } catch (error) {
      console.error("Failed to fetch ride:", error);
    } finally {
      setLoading(false);
    }
  }, [authReady, rideId]);

  // Initialize socket connection
  useEffect(() => {
    if (!authReady || !rideId) return;

    const initSocket = async () => {
      try {
        const user = await api.getMe();

        socketRef.current = io(SOCKET_URL, {
          transports: ["websocket"],
        });

        socketRef.current.on("connect", () => {
          console.log("Socket connected for ride tracking");
          socketRef.current?.emit("join:rider", user.id);
        });

        // Listen for ride accepted
        socketRef.current.on("ride:accepted", (data: { ride: Ride; message: string }) => {
          console.log("Ride accepted:", data);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setRide(data.ride);
          
          setTimeout(() => {
            router.replace({
              pathname: "/ride/assigned",
              params: { rideId: data.ride.id },
            });
          }, 1500);
        });

        // Listen for ride rejected
        socketRef.current.on("ride:rejected", (data: { ride: Ride; message: string }) => {
          console.log("Ride rejected:", data);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          
          Alert.alert(
            "Driver Unavailable",
            "The driver has declined your request. Would you like to find another driver?",
            [
              { text: "Go Home", onPress: () => router.replace("/home") },
              { text: "Find Drivers", onPress: () => router.replace("/find-drivers") },
            ]
          );
        });

        // Listen for ride status updates
        socketRef.current.on("ride:status", (data: { ride: Ride; status: RideStatus }) => {
          console.log("Ride status update:", data);
          setRide(data.ride);
          
          if (data.status === RideStatus.ACCEPTED || data.status === RideStatus.ARRIVING) {
            router.replace({
              pathname: "/ride/assigned",
              params: { rideId: data.ride.id },
            });
          }
        });

        socketRef.current.on("disconnect", () => {
          console.log("Socket disconnected");
        });
      } catch (error) {
        console.error("Error initializing socket:", error);
      }
    };

    initSocket();
    fetchRide();

    // Poll for updates as backup
    const pollInterval = setInterval(fetchRide, 5000);

    return () => {
      clearInterval(pollInterval);
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [authReady, rideId]);

  // Animations
  useEffect(() => {
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Pulse animation for waiting indicator
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleCancelRide = async () => {
    if (!rideId) {
      router.replace("/home");
      return;
    }

    Alert.alert(
      "Cancel Ride",
      "Are you sure you want to cancel this ride request?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            setCancelling(true);
            try {
              await api.cancelRide(rideId, "Cancelled by rider before acceptance");
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
              router.replace("/home");
            } catch (error: any) {
              Alert.alert("Error", error.message || "Failed to cancel ride");
            } finally {
              setCancelling(false);
            }
          },
        },
      ]
    );
  };

  const getStatusText = () => {
    if (!ride) return "Loading...";
    
    switch (ride.status) {
      case RideStatus.PENDING:
        return "Waiting for driver to accept...";
      case RideStatus.ACCEPTED:
        return "Driver accepted! Preparing ride...";
      case RideStatus.ARRIVING:
        return "Driver is on the way!";
      default:
        return "Processing your request...";
    }
  };

  if (loading) {
    return (
      <View className={`flex-1 items-center justify-center ${isDark ? "bg-gray-900" : "bg-gray-100"}`}>
        <ActivityIndicator size="large" color="#FACC15" />
        <Text className={`mt-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          Loading ride details...
        </Text>
      </View>
    );
  }

  if (!ride) {
    return (
      <View className={`flex-1 items-center justify-center ${isDark ? "bg-gray-900" : "bg-gray-100"}`}>
        <Ionicons name="alert-circle-outline" size={64} color={isDark ? "#9ca3af" : "#6b7280"} />
        <Text className={`mt-4 text-lg ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          Ride not found
        </Text>
        <TouchableOpacity
          onPress={() => router.replace("/home")}
          className="mt-6 bg-yellow-500 px-8 py-3 rounded-2xl"
        >
          <Text className="text-white font-bold">Go Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className={`flex-1 ${isDark ? "bg-gray-900" : "bg-gray-100"}`}>
      {/* Header Background */}
      <View className="absolute top-0 left-0 right-0">
        <Svg height="280" width="100%">
          <Path d="M0 0 H400 V160 Q200 280 0 160 Z" fill={isDark ? "#374151" : "#FACC15"} />
          <Path d="M0 40 H400 V200 Q200 320 0 200 Z" fill={isDark ? "#4B5563" : "#FDE047"} opacity={0.4} />
        </Svg>
      </View>

      {/* Back Button */}
      <TouchableOpacity
        onPress={() => router.back()}
        className={`absolute top-14 left-6 p-3 rounded-full shadow ${isDark ? "bg-gray-800" : "bg-white"}`}
        style={{ elevation: 4 }}
      >
        <Ionicons name="arrow-back" size={24} color={isDark ? "white" : "#333"} />
      </TouchableOpacity>

      {/* Title */}
      <View className="mt-28 px-6">
        <Text className={`text-3xl font-extrabold ${isDark ? "text-white" : "text-gray-900"}`}>
          Finding Your Ride
        </Text>
        <Text className={`mt-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
          {getStatusText()}
        </Text>
      </View>

      {/* Animated Waiting Indicator */}
      <Animated.View
        style={{
          opacity: fadeIn,
          transform: [{ scale: pulseAnim }],
        }}
        className="items-center mt-10"
      >
        <View className={`w-32 h-32 rounded-full items-center justify-center ${isDark ? "bg-gray-800" : "bg-white"} shadow-lg`}>
          <Ionicons name="car-sport" size={64} color="#FACC15" />
        </View>
      </Animated.View>

      {/* Ride Details Card */}
      <Animated.View
        style={{ opacity: fadeIn }}
        className={`mx-6 mt-8 rounded-3xl shadow p-6 border ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
      >
        {/* Driver Info (if assigned) */}
        {ride.driver && (
          <View className="flex-row items-center mb-4 pb-4 border-b border-gray-200">
            {ride.driver.user?.profileImage ? (
              <Image
                source={{ uri: ride.driver.user.profileImage }}
                className="w-14 h-14 rounded-full"
              />
            ) : (
              <View className={`w-14 h-14 rounded-full items-center justify-center ${isDark ? "bg-gray-700" : "bg-gray-200"}`}>
                <Ionicons name="person" size={28} color={isDark ? "#9ca3af" : "#6b7280"} />
              </View>
            )}
            <View className="ml-3 flex-1">
              <Text className={`font-bold text-lg ${isDark ? "text-white" : "text-gray-900"}`}>
                {ride.driver.user?.firstName || "Driver"} {ride.driver.user?.lastName || ""}
              </Text>
              <View className="flex-row items-center">
                <Ionicons name="star" size={14} color="#FACC15" />
                <Text className={`ml-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  {ride.driver.rating.toFixed(1)} • {ride.driver.vehicleColor} {ride.driver.vehicleMake}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Locations */}
        <View>
          <View className="flex-row items-start">
            <View className="w-8 items-center">
              <View className="w-3 h-3 rounded-full bg-green-500" />
              <View className="w-0.5 h-8 bg-gray-300" />
            </View>
            <View className="flex-1">
              <Text className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>PICKUP</Text>
              <Text className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                {ride.pickup?.locationName || "Pickup Location"}
              </Text>
              <Text className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                {ride.pickup?.address}
              </Text>
            </View>
          </View>
          <View className="flex-row items-start mt-2">
            <View className="w-8 items-center">
              <View className="w-3 h-3 rounded-full bg-red-500" />
            </View>
            <View className="flex-1">
              <Text className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>DROP</Text>
              <Text className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                {ride.drop?.locationName || "Drop Location"}
              </Text>
              <Text className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                {ride.drop?.address}
              </Text>
            </View>
          </View>
        </View>

        {/* Fare Info */}
        <View className="flex-row justify-between mt-4 pt-4 border-t border-gray-200">
          <View>
            <Text className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Est. Fare</Text>
            <Text className="text-xl font-bold text-yellow-600">
              {ride.fare ? `₹${ride.fare}` : "Calculating..."}
            </Text>
          </View>
          <View>
            <Text className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Type</Text>
            <Text className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-800"}`}>
              {ride.type || "STANDARD"}
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* Status Message */}
      <View className="mx-6 mt-6">
        <View className={`p-4 rounded-2xl ${isDark ? "bg-gray-800" : "bg-yellow-50"} flex-row items-center`}>
          <ActivityIndicator size="small" color="#FACC15" />
          <Text className={`ml-3 flex-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            {ride.status === RideStatus.PENDING
              ? "Your ride request has been sent to the driver. Please wait for confirmation."
              : "Driver is preparing for your ride."}
          </Text>
        </View>
      </View>

      {/* Cancel Button */}
      <View className="absolute bottom-10 left-0 right-0 px-6">
        <TouchableOpacity
          onPress={handleCancelRide}
          disabled={cancelling}
          className={`p-4 rounded-3xl items-center border shadow ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
          }`}
          style={{ elevation: 4 }}
        >
          {cancelling ? (
            <ActivityIndicator color={isDark ? "#ef4444" : "#dc2626"} />
          ) : (
            <Text className="text-red-500 text-lg font-semibold">Cancel Request</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
