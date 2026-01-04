import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ThemedView, ThemedText } from "../../components/Themed";
import { Ionicons } from "@expo/vector-icons";
import { useApi, Ride } from "../../services/api";

export default function StartTrip() {
  const router = useRouter();
  const api = useApi();
  const params = useLocalSearchParams<{ bookingId?: string; rideId?: string }>();
  const rideId = params.rideId || params.bookingId || "";

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [ride, setRide] = useState<Ride | null>(null);
  const [fetchingRide, setFetchingRide] = useState(true);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    const fetchRide = async () => {
      if (!rideId) {
        setFetchingRide(false);
        return;
      }
      try {
        const rideData = await api.getRide(rideId);
        setRide(rideData);
      } catch (error) {
        console.error("Error fetching ride:", error);
      } finally {
        setFetchingRide(false);
      }
    };
    fetchRide();
  }, [rideId, api]);

  const handleChange = (text: string, index: number) => {
    if (/^[0-9]$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);
      if (index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
    } else if (text === "") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    }
  };

  const verifyAndStartTrip = async () => {
    const entered = otp.join("");
    
    if (entered.length < 4) {
      Alert.alert("Invalid OTP", "Please enter the complete OTP");
      return;
    }

    setLoading(true);
    try {
      await api.startRide(rideId);
      Alert.alert("OTP Verified", "Trip Started Successfully!", [
        {
          text: "Continue",
          onPress: () => router.replace(`/driver/booking/active-trip?rideId=${rideId}`),
        },
      ]);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to start trip. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingRide) {
    return (
      <ThemedView className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#FACC15" />
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1 px-6 py-10">
      <ThemedText className="text-3xl font-extrabold">Start Trip</ThemedText>
      <ThemedText className="text-gray-500 mt-1">
        Ride ID: {rideId}
      </ThemedText>

      <ThemedView className="mt-6 p-5 rounded-2xl border">
        <View className="flex-row items-center">
          <Ionicons name="person-circle-outline" size={40} color="#444" />
          <View className="ml-3">
            <ThemedText className="font-semibold text-lg">
              {ride?.rider?.firstName || "Rider"} {ride?.rider?.lastName || ""}
            </ThemedText>
            <ThemedText className="text-xs text-gray-500">Passenger</ThemedText>
          </View>
        </View>

        <ThemedText className="mt-4 text-sm text-gray-500">
          Pickup: {ride?.pickup?.locationName || "Pickup Location"}, {ride?.pickup?.city || ""}
        </ThemedText>
        <ThemedText className="text-sm text-gray-500">
          Drop: {ride?.drop?.locationName || "Drop Location"}, {ride?.drop?.city || ""}
        </ThemedText>
      </ThemedView>

      <ThemedText className="mt-10 text-lg font-semibold">
        Enter OTP to Start Trip
      </ThemedText>

      <View className="flex-row justify-between mt-4">
        {[0, 1, 2, 3].map((i) => (
          <TextInput
            key={i}
            ref={(ref) => (inputRefs.current[i] = ref)}
            value={otp[i]}
            maxLength={1}
            keyboardType="number-pad"
            onChangeText={(t) => handleChange(t, i)}
            className="w-16 h-16 text-center rounded-2xl bg-gray-200 text-xl font-bold"
          />
        ))}
      </View>

      <TouchableOpacity
        onPress={() => Alert.alert("Scanning...", "QR scan coming soon")}
        className="mt-6 flex-row items-center"
      >
        <Ionicons name="qr-code-outline" size={22} color="#d97706" />
        <ThemedText className="ml-2 text-yellow-700 font-semibold">
          Scan QR Instead
        </ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        disabled={otp.join("").length < 4 || loading}
        onPress={() => {
          Keyboard.dismiss();
          verifyAndStartTrip();
        }}
        className={`mt-10 p-4 rounded-2xl items-center ${
          otp.join("").length < 4 ? "bg-gray-300" : "bg-emerald-600"
        }`}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <ThemedText className="text-white font-bold text-lg">Start Trip</ThemedText>
        )}
      </TouchableOpacity>
    </ThemedView>
  );
}
