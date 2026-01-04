import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
  Linking,
} from "react-native";
import Svg, { Path, Circle } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState, useCallback, useContext } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { useApi, Ride } from "../services/api";
import { ThemeContext } from "../context/ThemeContext";
import { useAuth } from "@clerk/clerk-expo";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL || "http://localhost:3000";

export default function IncomingRequest() {
  const router = useRouter();
  const params = useLocalSearchParams<{ rideId?: string }>();
  const api = useApi();
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const [seconds, setSeconds] = useState(30);
  const [ride, setRide] = useState<Ride | null>(null);
  const [pendingRides, setPendingRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  // Animation
  const slideUp = useRef(new Animated.Value(100)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

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
  }, [isLoaded, isSignedIn, getToken]);

  // Fetch pending ride requests
  const fetchPendingRides = useCallback(async () => {
    if (!authReady) {
      setLoading(false);
      return;
    }
    
    try {
      // Use getDriverJobs which includes both general rides and rides specifically for this driver
      const rides = await api.getDriverJobs();
      console.log("Fetched pending rides:", rides.length);
      setPendingRides(rides);
      if (rides.length > 0 && !ride) {
        setRide(rides[0]);
        setSeconds(30);
      } else if (rides.length === 0) {
        setRide(null);
      }
    } catch (error) {
      console.error("Error fetching pending rides:", error);
    } finally {
      setLoading(false);
    }
  }, [authReady, ride]);

  // Initialize socket connection
  useEffect(() => {
    if (!authReady) return;
    
    const initSocket = async () => {
      try {
        const user = await api.getMe();
        if (!user.driverProfile) return;

        socketRef.current = io(SOCKET_URL, {
          transports: ["websocket"],
        });

        socketRef.current.on("connect", () => {
          console.log("Socket connected");
          socketRef.current?.emit("join:driver", user.driverProfile!.id);
        });

        // Listen for new ride requests
        socketRef.current.on("ride:request", (data: { ride: Ride; message: string }) => {
          console.log("New ride request:", data);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setRide(data.ride);
          setSeconds(30);
          fetchPendingRides();
        });

        // Listen for ride:new (broadcast to all drivers)
        socketRef.current.on("ride:new", (newRide: Ride) => {
          console.log("New ride broadcast:", newRide);
          fetchPendingRides();
        });

        socketRef.current.on("disconnect", () => {
          console.log("Socket disconnected");
        });
      } catch (error) {
        console.error("Error initializing socket:", error);
      }
    };

    initSocket();
    fetchPendingRides();

    // Poll for new rides every 5 seconds
    const pollInterval = setInterval(() => {
      fetchPendingRides();
    }, 5000);

    return () => {
      clearInterval(pollInterval);
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [authReady]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideUp, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for ACCEPT button
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!ride) return;

    const timer = setInterval(() => {
      setSeconds((t) => {
        if (t <= 1) {
          // Move to next ride or go back
          const currentIndex = pendingRides.findIndex((r) => r.id === ride.id);
          if (currentIndex < pendingRides.length - 1) {
            setRide(pendingRides[currentIndex + 1]);
            return 30;
          } else {
            clearInterval(timer);
            router.replace("/driver/dashboard");
          }
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [ride, pendingRides]);

  const acceptRide = async () => {
    if (!ride) return;
    
    setAccepting(true);
    try {
      await api.acceptJob(ride.id);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      router.push(`/driver/assigned?rideId=${ride.id}`);
    } catch (error: any) {
      console.error("Error accepting ride:", error);
      Alert.alert("Error", error.message || "Failed to accept ride. It may have been taken by another driver.");
      fetchPendingRides();
    } finally {
      setAccepting(false);
    }
  };

  const rejectRide = async () => {
    if (!ride) return;
    
    setRejecting(true);
    try {
      await api.rejectJob(ride.id);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      
      // Move to next ride or go back
      const currentIndex = pendingRides.findIndex((r) => r.id === ride.id);
      const newPendingRides = pendingRides.filter((r) => r.id !== ride.id);
      setPendingRides(newPendingRides);
      
      if (newPendingRides.length > 0) {
        setRide(newPendingRides[0]);
        setSeconds(30);
      } else {
        router.replace("/driver/dashboard");
      }
    } catch (error: any) {
      console.error("Error rejecting ride:", error);
      Alert.alert("Error", error.message || "Failed to reject ride.");
    } finally {
      setRejecting(false);
    }
  };

  const callRider = () => {
    const riderPhone = ride?.rider?.phone;
    if (riderPhone) {
      Linking.openURL(`tel:${riderPhone}`);
    } else {
      Alert.alert("Not Available", "Rider's phone number is not available");
    }
  };

  const R = 28;
  const C = 2 * Math.PI * R;
  const progress = seconds / 30;
  const dashOffset = C * (1 - progress);

  if (loading) {
    return (
      <View className={`flex-1 items-center justify-center ${isDark ? "bg-gray-900" : "bg-gray-100"}`}>
        <ActivityIndicator size="large" color="#FACC15" />
        <Text className={`mt-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          Loading ride requests...
        </Text>
      </View>
    );
  }

  if (!ride && pendingRides.length === 0) {
    return (
      <View className={`flex-1 ${isDark ? "bg-gray-900" : "bg-gray-100"}`}>
        {/* Header */}
        <View className="absolute top-0 left-0 right-0">
          <Svg height="260" width="100%">
            <Path d="M0 0 H400 V140 Q200 260 0 140 Z" fill={isDark ? "#374151" : "#FACC15"} />
            <Path d="M0 40 H400 V180 Q200 300 0 180 Z" fill={isDark ? "#4B5563" : "#FDE047"} opacity={0.4} />
          </Svg>
        </View>

        <View className="flex-1 items-center justify-center px-6">
          <View className={`w-24 h-24 rounded-full items-center justify-center ${isDark ? "bg-gray-800" : "bg-white"}`}>
            <Ionicons name="car-outline" size={48} color={isDark ? "#9ca3af" : "#6b7280"} />
          </View>
          <Text className={`mt-6 text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
            No Ride Requests
          </Text>
          <Text className={`mt-2 text-center ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Stay online and wait for ride requests.{"\n"}They'll appear here automatically.
          </Text>
          <TouchableOpacity
            onPress={() => router.replace("/driver/dashboard")}
            className={`mt-8 px-8 py-4 rounded-2xl ${isDark ? "bg-gray-800" : "bg-white"} shadow`}
          >
            <Text className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
              Back to Dashboard
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className={`flex-1 ${isDark ? "bg-gray-900" : "bg-gray-100"}`}>
      {/* PREMIUM HEADER */}
      <View className="absolute top-0 left-0 right-0">
        <Svg height="260" width="100%">
          <Path d="M0 0 H400 V140 Q200 260 0 140 Z" fill={isDark ? "#374151" : "#FACC15"} />
          <Path d="M0 40 H400 V180 Q200 300 0 180 Z" fill={isDark ? "#4B5563" : "#FDE047"} opacity={0.4} />
        </Svg>
      </View>

      {/* TITLE + COUNTDOWN */}
      <View className="mt-24 px-6 flex-row items-center justify-between">
        <View>
          <Text className={`text-3xl font-extrabold ${isDark ? "text-white" : "text-gray-900"}`}>
            New Ride Request
          </Text>
          <Text className={`mt-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            {pendingRides.length > 1 ? `${pendingRides.length} requests waiting` : "Respond quickly to secure the ride"}
          </Text>
        </View>
        <View className="items-center justify-center">
          <Svg height={72} width={72}>
            <Circle cx={36} cy={36} r={R} stroke={isDark ? "#374151" : "#e5e7eb"} strokeWidth={6} fill="none" />
            <Circle
              cx={36}
              cy={36}
              r={R}
              stroke="#f59e0b"
              strokeWidth={6}
              strokeDasharray={`${C}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              fill="none"
              transform="rotate(-90 36 36)"
            />
          </Svg>
          <Text className={`-mt-6 font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{seconds}s</Text>
        </View>
      </View>

      {/* RIDE DETAILS */}
      <Animated.View
        style={{
          opacity: fadeIn,
          transform: [{ translateY: slideUp }],
        }}
        className={`mx-6 mt-6 rounded-3xl shadow p-6 border ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
      >
        {/* Map Preview Placeholder */}
        <View className={`h-32 rounded-2xl items-center justify-center ${isDark ? "bg-gray-700" : "bg-gray-200"}`}>
          <Ionicons name="map-outline" size={48} color={isDark ? "#6b7280" : "#999"} />
        </View>

        {/* Rider + Payment Row */}
        <View className="mt-4 flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            {ride?.rider?.profileImage ? (
              <Image
                source={{ uri: ride.rider.profileImage }}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <View className={`w-10 h-10 rounded-full items-center justify-center ${isDark ? "bg-gray-700" : "bg-gray-200"}`}>
                <Ionicons name="person" size={20} color={isDark ? "#9ca3af" : "#6b7280"} />
              </View>
            )}
            <View className="ml-3 flex-1">
              <Text className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                {ride?.rider?.firstName || "Passenger"} {ride?.rider?.lastName || ""}
              </Text>
              {ride?.rider?.phone && (
                <TouchableOpacity onPress={callRider} className="flex-row items-center">
                  <Text className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    {ride.rider.phone}
                  </Text>
                  <Ionicons name="call" size={12} color="#22c55e" style={{ marginLeft: 4 }} />
                </TouchableOpacity>
              )}
            </View>
            {/* Call Button */}
            {ride?.rider?.phone && (
              <TouchableOpacity
                onPress={callRider}
                className="w-9 h-9 rounded-full bg-green-500 items-center justify-center mr-2"
              >
                <Ionicons name="call" size={18} color="white" />
              </TouchableOpacity>
            )}
          </View>
          <View className="px-3 py-1 rounded-full bg-yellow-100 border border-yellow-300">
            <Text className="text-yellow-700 text-xs font-semibold">CASH/UPI</Text>
          </View>
        </View>

        {/* Locations */}
        <View className="mt-4">
          <View className="flex-row items-start">
            <View className="w-8 items-center">
              <View className="w-3 h-3 rounded-full bg-green-500" />
              <View className="w-0.5 h-8 bg-gray-300" />
            </View>
            <View className="flex-1">
              <Text className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>PICKUP</Text>
              <Text className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                {ride?.pickup?.locationName || "Loading..."}
              </Text>
              <Text className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                {ride?.pickup?.address}
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
                {ride?.drop?.locationName || "Loading..."}
              </Text>
              <Text className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                {ride?.drop?.address}
              </Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View className="flex-row justify-between mt-4 pt-4 border-t border-gray-200">
          <View>
            <Text className={`${isDark ? "text-gray-400" : "text-gray-500"}`}>Distance</Text>
            <Text className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-800"}`}>
              {ride?.distance ? `${ride.distance} km` : "N/A"}
            </Text>
          </View>
          <View>
            <Text className={`${isDark ? "text-gray-400" : "text-gray-500"}`}>Est. Fare</Text>
            <Text className="text-lg font-bold text-yellow-600">
              {ride?.fare ? `₹${ride.fare}` : "N/A"}
            </Text>
          </View>
          <View>
            <Text className={`${isDark ? "text-gray-400" : "text-gray-500"}`}>Type</Text>
            <Text className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-800"}`}>
              {ride?.type || "STANDARD"}
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* Pending Rides Count */}
      {pendingRides.length > 1 && (
        <View className="mx-6 mt-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {pendingRides.map((r, index) => (
              <TouchableOpacity
                key={r.id}
                onPress={() => {
                  setRide(r);
                  setSeconds(30);
                }}
                className={`px-4 py-2 mr-2 rounded-full ${
                  r.id === ride?.id
                    ? "bg-yellow-500"
                    : isDark
                    ? "bg-gray-800"
                    : "bg-white"
                }`}
              >
                <Text
                  className={`font-semibold ${
                    r.id === ride?.id ? "text-white" : isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Request {index + 1}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* ACTION BUTTONS */}
      <View className="absolute bottom-10 left-0 right-0 px-6">
        {/* ACCEPT */}
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity
            onPress={acceptRide}
            disabled={accepting || rejecting}
            className="bg-yellow-500 p-5 rounded-3xl items-center shadow-lg"
            style={{ elevation: 8 }}
          >
            {accepting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-xl font-bold">Accept Ride</Text>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* REJECT */}
        <TouchableOpacity
          onPress={rejectRide}
          disabled={accepting || rejecting}
          className={`p-4 rounded-3xl mt-3 items-center border shadow ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
          }`}
          style={{ elevation: 4 }}
        >
          {rejecting ? (
            <ActivityIndicator color={isDark ? "#9ca3af" : "#6b7280"} />
          ) : (
            <Text className={`text-lg font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Reject
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
