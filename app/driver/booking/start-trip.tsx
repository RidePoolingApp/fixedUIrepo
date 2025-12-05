// app/driver/booking/start-trip.tsx
import React, { useState, useRef } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Keyboard,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ThemedView, ThemedText } from "../../components/Themed";
import { Ionicons } from "@expo/vector-icons";

export default function StartTrip() {
  const router = useRouter();
  const params = useLocalSearchParams<{ bookingId?: string }>();
  const bookingId = params.bookingId ?? "BKG_1001";

  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const CORRECT_OTP = "1234"; // Replace with server OTP validation

  const handleChange = (text: string, index: number) => {
    if (/^[0-9]$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      // Move to next input
      if (index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
    } else if (text === "") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    }
  };

  const verifyOtp = () => {
    const entered = otp.join("");

    if (entered === CORRECT_OTP) {
      Alert.alert("OTP Verified", "Trip Started Successfully!", [
        {
          text: "Continue",
          onPress: () =>
            router.replace(`/driver/booking/active-trip?bookingId=${bookingId}`),
        },
      ]);
    } else {
      Alert.alert("Incorrect OTP", "Please re-check the OTP.");
    }
  };

  return (
    <ThemedView className="flex-1 px-6 py-10">
      {/* Title */}
      <ThemedText className="text-3xl font-extrabold">Start Trip</ThemedText>
      <ThemedText className="text-gray-500 mt-1">
        Booking ID: {bookingId}
      </ThemedText>

      {/* Rider Info */}
      <ThemedView className="mt-6 p-5 rounded-2xl border">
        <View className="flex-row items-center">
          <Ionicons name="person-circle-outline" size={40} color="#444" />
          <View className="ml-3">
            <ThemedText className="font-semibold text-lg">A. Patel</ThemedText>
            <ThemedText className="text-xs text-gray-500">4.9 ★ Rider</ThemedText>
          </View>
        </View>

        <ThemedText className="mt-4 text-sm text-gray-500">
          Pickup: Airport Terminal 1  
        </ThemedText>
        <ThemedText className="text-sm text-gray-500">
          Drop: City Center Mall  
        </ThemedText>
      </ThemedView>

      {/* OTP */}
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

      {/* QR Option */}
      <TouchableOpacity
        onPress={() => Alert.alert("Scanning...", "QR scan coming soon")}
        className="mt-6 flex-row items-center"
      >
        <Ionicons name="qr-code-outline" size={22} color="#d97706" />
        <ThemedText className="ml-2 text-yellow-700 font-semibold">
          Scan QR Instead
        </ThemedText>
      </TouchableOpacity>

      {/* Start Trip Button */}
      <TouchableOpacity
        disabled={otp.join("").length < 4}
        onPress={() => {
          Keyboard.dismiss();
          verifyOtp();
        }}
        className={`mt-10 p-4 rounded-2xl items-center ${
          otp.join("").length < 4 ? "bg-gray-300" : "bg-emerald-600"
        }`}
      >
        <ThemedText className="text-white font-bold text-lg">Start Trip</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}
