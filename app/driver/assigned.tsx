// app/driver/booking/assigned.tsx
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
} from "react-native";
import { useRouter } from "expo-router";
import { ThemedText, ThemedView } from "../components/Themed"; // Adjusted path
import { Ionicons, MaterialIcons, Entypo } from "@expo/vector-icons";

/**
 * Improved Driver Assigned screen
 * - Countdown timer
 * - OTP modal to start trip
 * - Masked passenger + call / chat / report / cancel
 * - Small animated attention ring
 *
 * Replace ThemedView/ThemedText with your own if different.
 */

const MOCK_BOOKING = {
  id: "BKG_2481",
  pickupLabel: "Airport Terminal 1 - Arrival (Door 3)",
  dropLabel: "City Center Mall - Main Gate",
  etaMinutes: 8,
  scheduledStartAt: new Date(Date.now() + 8 * 60 * 1000).toISOString(),
  vehicleType: "Sedan",
  otp: "1234",
  fare: 480,
  passenger: {
    name: "Rahul Sharma",
    phone: "+91-98765-43210",
    rating: 4.8,
  },
};

export default function DriverAssigned() {
  const router = useRouter();
  const [status, setStatus] = useState<
    "assigned" | "arrived" | "waiting_to_start" | "started" | "ended"
  >("assigned");

  // OTP modal
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [otpInput, setOtpInput] = useState("");

  // countdown state
  const targetTime = useMemo(() => new Date(MOCK_BOOKING.scheduledStartAt).getTime(), []);
  const [secondsLeft, setSecondsLeft] = useState(Math.max(0, Math.floor((targetTime - Date.now()) / 1000)));

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

  // decrement countdown
  useEffect(() => {
    const t = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const formattedCountdown = useMemo(() => {
    const m = Math.floor(secondsLeft / 60);
    const s = secondsLeft % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }, [secondsLeft]);

  const maskedPassengerName = useMemo(() => {
    const name = MOCK_BOOKING.passenger.name;
    if (!name) return "Rider";
    const parts = name.split(" ");
    const first = parts[0];
    if (first.length <= 2) return first[0] + "*";
    return first[0] + first.slice(1, 2) + "*".repeat(Math.max(1, first.length - 3)) + (parts[1] ? " " + parts[1][0] + "." : "");
  }, []);

  const maskedPhone = useMemo(() => {
    const p = MOCK_BOOKING.passenger.phone;
    if (!p) return "";
    // show last 3 digits only
    const last = p.slice(-3);
    return p.slice(0, p.length - 6).replace(/\d/g, "X") + "XXX" + last;
  }, []);

  // actions
  const onMarkArrived = () => {
    setStatus("arrived");
    Alert.alert("Marked arrived", "Passenger notified that you have reached pickup point.");
  };

  const onStartRideRequest = () => {
    // open OTP modal to verify before starting
    setOtpInput("");
    setOtpModalVisible(true);
    setStatus("waiting_to_start");
  };

  const onVerifyOtpAndStart = () => {
    if (otpInput.trim() === MOCK_BOOKING.otp) {
      setOtpModalVisible(false);
      setStatus("started");
      router.push("/driver/booking/active-trip"); // your in-progress route
    } else {
      Alert.alert("Incorrect OTP", "The OTP entered does not match. Please try again.");
    }
  };

  const onEndRide = () => {
    setStatus("ended");
    router.push("/driver/ride-completed");
  };

  const onCallPassenger = () => {
    // In real app, use Linking with masked phone or server call masking
    Alert.alert("Calling passenger", `${maskedPhone}`, [
      { text: "Cancel", style: "cancel" },
      { text: "Call (mock)", onPress: () => console.log("call mock") },
    ]);
  };

  const onChatPassenger = () => {
    // go to chat screen
    router.push({
      pathname: "/driver/chat",
      params: { to: MOCK_BOOKING.passenger.name },
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
          onPress: () => {
            // call API to cancel
            Alert.alert("Cancelled", "Booking cancelled.");
            router.back();
          },
        },
      ]
    );
  };

  const onReportIssue = () => {
    router.push("/driver/support/issues");
  };

  return (
    <ThemedView className="flex-1 px-4 py-8">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <ThemedText className="text-2xl font-extrabold">Assigned</ThemedText>
        <View className="items-end">
          <ThemedText className="text-sm text-gray-500">Booking ID</ThemedText>
          <ThemedText className="font-semibold">{MOCK_BOOKING.id}</ThemedText>
        </View>
      </View>

      {/* Pickup Card */}
      <ThemedView className="rounded-3xl p-4 mb-4 border" style={{ elevation: 4 }}>
        <View className="flex-row items-start justify-between">
          <View>
            <ThemedText className="text-sm text-gray-500">Pickup</ThemedText>
            <ThemedText className="text-lg font-bold mt-1">{MOCK_BOOKING.pickupLabel}</ThemedText>
            <ThemedText className="text-xs text-gray-500 mt-1">{MOCK_BOOKING.vehicleType} • OTP required</ThemedText>
          </View>

          <Animated.View style={{ transform: [{ scale: ringAnim }] }}>
            <View className="items-center">
              <View className="bg-yellow-500 rounded-full p-3">
                <Ionicons name="location-outline" size={22} color="#fff" />
              </View>
              <ThemedText className="text-xs mt-2 text-gray-500">ETA {MOCK_BOOKING.etaMinutes}m</ThemedText>
              <ThemedText className="text-sm font-semibold mt-1">{formattedCountdown}</ThemedText>
            </View>
          </Animated.View>
        </View>

        <View className="mt-4 flex-row items-center justify-between">
          <View>
            <ThemedText className="text-sm text-gray-500">Drop</ThemedText>
            <ThemedText className="font-semibold">{MOCK_BOOKING.dropLabel}</ThemedText>
          </View>

          <View className="items-end">
            <ThemedText className="text-sm text-gray-500">Fare</ThemedText>
            <ThemedText className="text-xl font-extrabold text-yellow-600">₹{MOCK_BOOKING.fare}</ThemedText>
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
              <ThemedText className="text-xs text-gray-500">Rating: {MOCK_BOOKING.passenger.rating} ★</ThemedText>
            </View>
          </View>

          <View className="items-end">
            <ThemedText className="text-xs text-gray-500">Contact</ThemedText>
            <ThemedText className="font-semibold">{maskedPhone}</ThemedText>
          </View>
        </View>

        <View className="mt-3 flex-row items-center">
          <TouchableOpacity onPress={onCallPassenger} className="px-3 py-2 rounded-2xl bg-gray-100 mr-3">
            <Ionicons name="call-outline" size={18} color="#333" />
            <ThemedText className="ml-2">Call</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity onPress={onChatPassenger} className="px-3 py-2 rounded-2xl bg-gray-100 mr-3">
            <Ionicons name="chatbubble-outline" size={18} color="#333" />
            <ThemedText className="ml-2">Message</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity onPress={onCancelBooking} className="px-3 py-2 rounded-2xl bg-red-50 border border-red-200">
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
