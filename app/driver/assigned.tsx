// app/driver/assigned.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Animated,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
  Linking,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ThemedText, ThemedView, ThemedScreen } from "../components/Themed";
import { Ionicons, MaterialIcons, Entypo } from "@expo/vector-icons";
import { useApi, Ride, RideStatus } from "../services/api";

/**
 * Driver Assigned screen - shows real ride data
 * - Countdown timer
 * - OTP modal to start trip
 * - Masked passenger + call / chat / report / cancel
 * - Small animated attention ring
 */

export default function DriverAssigned() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const api = useApi();

  const rideId = params.rideId as string;

  const [ride, setRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<
    "assigned" | "arrived" | "waiting_to_start" | "started" | "ended"
  >("assigned");

  // OTP modal
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [otpInput, setOtpInput] = useState("");

  // countdown state - default 8 minutes
  const [secondsLeft, setSecondsLeft] = useState(8 * 60);

  // small attention animation ring
  const ringAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(ringAnim, { toValue: 1.06, duration: 700, useNativeDriver: true }),
        Animated.timing(ringAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // Fetch ride data
  useEffect(() => {
    fetchRide();

    // Poll for ride updates
    const pollInterval = setInterval(fetchRide, 5000);
    return () => clearInterval(pollInterval);
  }, [rideId]);

  // decrement countdown
  useEffect(() => {
    const t = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const fetchRide = async () => {
    if (!rideId) {
      setLoading(false);
      return;
    }

    try {
      const rideData = await api.getRide(rideId);
      setRide(rideData);

      // Update status based on ride status
      if (rideData.status === RideStatus.STARTED) {
        setStatus("started");
        // Navigate to ride started screen
        router.replace({
          pathname: "/driver/ride-started",
          params: { rideId: rideData.id },
        });
      } else if (rideData.status === RideStatus.COMPLETED) {
        setStatus("ended");
        router.replace({
          pathname: "/driver/ride-completed",
          params: { rideId: rideData.id },
        });
      } else if (rideData.status === RideStatus.CANCELLED) {
        Alert.alert("Ride Cancelled", "This ride has been cancelled by the rider");
        router.replace("/driver/dashboard");
      }
    } catch (error) {
      console.error("Failed to fetch ride:", error);
    } finally {
      setLoading(false);
    }
  };

  const formattedCountdown = useMemo(() => {
    const m = Math.floor(secondsLeft / 60);
    const s = secondsLeft % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }, [secondsLeft]);

  const maskedPassengerName = useMemo(() => {
    if (!ride?.rider) return "Rider";
    const name = `${ride.rider.firstName || ''} ${ride.rider.lastName || ''}`.trim();
    if (!name) return "Rider";
    const parts = name.split(" ");
    const first = parts[0];
    if (first.length <= 2) return first[0] + "*";
    return first[0] + first.slice(1, 2) + "*".repeat(Math.max(1, first.length - 3)) + (parts[1] ? " " + parts[1][0] + "." : "");
  }, [ride]);

  const maskedPhone = useMemo(() => {
    const p = ride?.rider?.phone || "";
    if (!p) return "Contact via app";
    // show last 3 digits only
    const last = p.slice(-3);
    return p.slice(0, p.length - 6).replace(/\d/g, "X") + "XXX" + last;
  }, [ride]);

  // Pickup and drop labels
  const pickupLabel = ride?.pickup?.locationName || ride?.pickup?.address || "Pickup location";
  const dropLabel = ride?.drop?.locationName || ride?.drop?.address || "Drop location";
  const fare = ride?.fare || 0;
  const riderRating = 4.8; // Default rating since we may not have it on User model

  // actions
  const onMarkArrived = async () => {
    setStatus("arrived");
    // TODO: Call API to mark arrived when endpoint is available
    Alert.alert("Marked arrived", "Passenger notified that you have reached pickup point.");
  };

  const onStartRideRequest = () => {
    // open OTP modal to verify before starting
    setOtpInput("");
    setOtpModalVisible(true);
    setStatus("waiting_to_start");
  };

  const onVerifyOtpAndStart = async () => {
    if (!rideId) return;
    
    // For now, accept any 4-digit OTP (TODO: verify against actual OTP from backend)
    if (otpInput.trim().length >= 4) {
      try {
        await api.startRide(rideId);
        setOtpModalVisible(false);
        setStatus("started");
        router.push({
          pathname: "/driver/ride-started",
          params: { rideId },
        });
      } catch (error: any) {
        Alert.alert("Error", error.message || "Failed to start ride");
      }
    } else {
      Alert.alert("Invalid OTP", "Please enter a valid 4-digit OTP.");
    }
  };

  const onEndRide = async () => {
    if (!rideId) return;
    
    try {
      await api.completeRide(rideId, { 
        distance: ride?.distance,
        fare: ride?.fare,
      });
      setStatus("ended");
      router.push({
        pathname: "/driver/ride-completed",
        params: { rideId },
      });
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to complete ride");
    }
  };

  const onCallPassenger = () => {
    const riderPhone = ride?.rider?.phone;
    if (riderPhone) {
      Linking.openURL(`tel:${riderPhone}`);
    } else {
      Alert.alert("Not Available", "Rider's phone number is not available");
    }
  };

  const onChatPassenger = () => {
    // go to chat screen
    router.push({
      pathname: "/driver/chat",
      params: { rideId, passengerName: maskedPassengerName },
    });
  };

  const onCancelBooking = () => {
    Alert.alert(
      "Cancel booking",
      "Are you sure you want to cancel? This may affect your driver score.",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, cancel",
          style: "destructive",
          onPress: async () => {
            if (!rideId) return;
            try {
              await api.cancelRide(rideId, "Driver cancelled");
              Alert.alert("Cancelled", "Booking cancelled.");
              router.replace("/driver/dashboard");
            } catch (error: any) {
              Alert.alert("Error", error.message || "Failed to cancel ride");
            }
          },
        },
      ]
    );
  };

  const onReportIssue = () => {
    router.push("/driver/support/issues");
  };

  if (loading) {
    return (
      <ThemedScreen>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FACC15" />
          <ThemedText className="mt-4">Loading ride details...</ThemedText>
        </View>
      </ThemedScreen>
    );
  }

  if (!ride) {
    return (
      <ThemedScreen>
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="car-outline" size={64} color="#999" />
          <ThemedText className="mt-4 text-lg text-center">Ride not found</ThemedText>
          <TouchableOpacity
            onPress={() => router.replace("/driver/dashboard")}
            className="mt-6 bg-yellow-500 px-6 py-3 rounded-2xl"
          >
            <ThemedText className="text-white font-semibold">Go to Dashboard</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedScreen>
    );
  }

  return (
    <ThemedView className="flex-1 px-4 py-8">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <ThemedText className="text-2xl font-extrabold">Assigned</ThemedText>
        <View className="items-end">
          <ThemedText className="text-sm text-gray-500">Ride ID</ThemedText>
          <ThemedText className="font-semibold">{ride.id.slice(0, 8)}...</ThemedText>
        </View>
      </View>

      {/* Pickup Card */}
      <ThemedView className="rounded-3xl p-4 mb-4 border" style={{ elevation: 4 }}>
        <View className="flex-row items-start justify-between">
          <View className="flex-1 mr-3">
            <ThemedText className="text-sm text-gray-500">Pickup</ThemedText>
            <ThemedText className="text-lg font-bold mt-1">{pickupLabel}</ThemedText>
            <ThemedText className="text-xs text-gray-500 mt-1">{ride.type} • OTP required</ThemedText>
          </View>

          <Animated.View style={{ transform: [{ scale: ringAnim }] }}>
            <View className="items-center">
              <View className="bg-yellow-500 rounded-full p-3">
                <Ionicons name="location-outline" size={22} color="#fff" />
              </View>
              <ThemedText className="text-xs mt-2 text-gray-500">ETA</ThemedText>
              <ThemedText className="text-sm font-semibold mt-1">{formattedCountdown}</ThemedText>
            </View>
          </Animated.View>
        </View>

        <View className="mt-4 flex-row items-center justify-between">
          <View className="flex-1 mr-3">
            <ThemedText className="text-sm text-gray-500">Drop</ThemedText>
            <ThemedText className="font-semibold">{dropLabel}</ThemedText>
          </View>

          <View className="items-end">
            <ThemedText className="text-sm text-gray-500">Fare</ThemedText>
            <ThemedText className="text-xl font-extrabold text-yellow-600">₹{fare}</ThemedText>
          </View>
        </View>

        {/* actions */}
        <View className="flex-row justify-between mt-4">
          {/* Left column */}
          <View className="flex-row">
            {status === "assigned" && (
              <TouchableOpacity
                onPress={onMarkArrived}
                className="px-4 py-2 rounded-2xl bg-yellow-500 mr-2"
                accessibilityLabel="Mark arrived"
              >
                <ThemedText className="text-white font-semibold">Arrived</ThemedText>
              </TouchableOpacity>
            )}

            {(status === "arrived" || status === "waiting_to_start") && (
              <TouchableOpacity
                onPress={onStartRideRequest}
                className="px-4 py-2 rounded-2xl bg-emerald-600 mr-2"
                accessibilityLabel="Start ride"
              >
                <ThemedText className="text-white font-semibold">Start Ride</ThemedText>
              </TouchableOpacity>
            )}

            {status === "started" && (
              <TouchableOpacity
                onPress={onEndRide}
                className="px-4 py-2 rounded-2xl bg-red-600 mr-2"
                accessibilityLabel="End ride"
              >
                <ThemedText className="text-white font-semibold">End Ride</ThemedText>
              </TouchableOpacity>
            )}
          </View>

          {/* Right column */}
          <View className="flex-row">
            <TouchableOpacity
              onPress={onCallPassenger}
              className="px-3 py-2 rounded-2xl bg-gray-100 mr-2"
              accessibilityLabel="Call passenger"
            >
              <Ionicons name="call-outline" size={18} color="#333" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onChatPassenger}
              className="px-3 py-2 rounded-2xl bg-gray-100 mr-2"
              accessibilityLabel="Chat with passenger"
            >
              <Ionicons name="chatbubble-outline" size={18} color="#333" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onReportIssue}
              className="px-3 py-2 rounded-2xl bg-gray-100"
              accessibilityLabel="Report issue"
            >
              <Entypo name="warning" size={18} color="#c2410c" />
            </TouchableOpacity>
          </View>
        </View>
      </ThemedView>

      {/* Passenger Card */}
      <ThemedView className="rounded-2xl p-4 mb-4 border" style={{ elevation: 2 }}>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Ionicons name="person-circle-outline" size={36} color="#222" />
            <View className="ml-3">
              <ThemedText className="font-semibold">{maskedPassengerName}</ThemedText>
              <ThemedText className="text-xs text-gray-500">Rating: {riderRating} ★</ThemedText>
            </View>
          </View>

          <View className="items-end">
            <ThemedText className="text-xs text-gray-500">Contact</ThemedText>
            <ThemedText className="font-semibold">{maskedPhone}</ThemedText>
          </View>
        </View>

        <View className="mt-3 flex-row items-center">
          <TouchableOpacity onPress={onCallPassenger} className="flex-row items-center px-3 py-2 rounded-2xl bg-gray-100 mr-3">
            <Ionicons name="call-outline" size={18} color="#333" />
            <ThemedText className="ml-2">Call</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity onPress={onChatPassenger} className="flex-row items-center px-3 py-2 rounded-2xl bg-gray-100 mr-3">
            <Ionicons name="chatbubble-outline" size={18} color="#333" />
            <ThemedText className="ml-2">Message</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity onPress={onCancelBooking} className="flex-row items-center px-3 py-2 rounded-2xl bg-red-50 border border-red-200">
            <MaterialIcons name="cancel" size={18} color="#b91c1c" />
            <ThemedText className="ml-2 text-red-600">Cancel</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>

      {/* Safety / Help */}
      <View className="mt-2">
        <TouchableOpacity onPress={() => router.push("/driver/support/issues")} className="px-4 py-3 rounded-2xl bg-gray-100 items-center">
          <ThemedText className="font-semibold">Need help / Safety</ThemedText>
        </TouchableOpacity>
      </View>

      {/* OTP Modal */}
      <Modal visible={otpModalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
          <View className="flex-1 justify-end px-4 pb-8">
            <View className="bg-white rounded-2xl p-6 shadow" style={{ elevation: 6 }}>
              <ThemedText className="text-lg font-semibold mb-2">Enter Passenger OTP</ThemedText>
              <ThemedText className="text-sm text-gray-500 mb-4">Ask passenger for the 4-digit OTP and enter it here to start the trip.</ThemedText>

              <TextInput
                value={otpInput}
                onChangeText={setOtpInput}
                keyboardType="numeric"
                maxLength={6}
                placeholder="Enter OTP"
                className="border p-3 rounded-md text-lg"
                style={{ letterSpacing: 6 }}
              />

              <View className="flex-row justify-between mt-4">
                <TouchableOpacity onPress={() => setOtpModalVisible(false)} className="px-4 py-3 rounded-2xl border">
                  <ThemedText>Cancel</ThemedText>
                </TouchableOpacity>

                <TouchableOpacity onPress={onVerifyOtpAndStart} className="px-4 py-3 rounded-2xl bg-emerald-600">
                  <ThemedText className="text-white font-semibold">Verify & Start</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ThemedView>
  );
}
