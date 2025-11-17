// app/ride/payment-success.tsx
import {
  View,
  TouchableOpacity,
  Animated,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import {
  ThemedScreen,
  ThemedView,
  ThemedText,
  ThemedTextSecondary,
} from "../components/Themed";
import { useThemeStyles } from "../context/themeStyles";

export default function PaymentSuccess() {
  const router = useRouter();
  const { isDark } = useThemeStyles();

  const paidAmount = "₹749";
  const paymentMethod = "UPI";

  // Pulse animation on checkmark
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.15,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <ThemedScreen>
      {/* YELLOW HEADER */}
      <View className="absolute top-0 left-0 right-0">
        <Svg height="260" width="100%">
          <Path
            d="M0 0 H400 V160 Q200 260 0 160 Z"
            fill={isDark ? "#1F2937" : "#FACC15"}
          />
        </Svg>
      </View>

      {/* HEADER TEXT */}
      <View className="mt-24 px-6">
        <ThemedText className="text-3xl font-extrabold">Payment Successful</ThemedText>
        <ThemedTextSecondary>Your ride has been confirmed</ThemedTextSecondary>
      </View>

      {/* CHECKMARK ANIMATION */}
      <View className="items-center mt-10">
        <Animated.View
          style={{ transform: [{ scale: pulse }] }}
          className="w-32 h-32 rounded-full bg-green-500 items-center justify-center shadow-xl"
        >
          <Ionicons name="checkmark" size={80} color="#fff" />
        </Animated.View>

        <ThemedText className="text-2xl font-bold mt-6">Paid {paidAmount}</ThemedText>
        <ThemedTextSecondary>via {paymentMethod}</ThemedTextSecondary>
      </View>

      {/* PAYMENT SUMMARY CARD */}
      <ThemedView className="mx-6 mt-10 p-6 rounded-3xl shadow border">
        <ThemedText className="text-xl font-bold mb-4">Trip Summary</ThemedText>

        <View className="flex-row justify-between mb-3">
          <ThemedTextSecondary>Fare Paid</ThemedTextSecondary>
          <ThemedText className="font-semibold">{paidAmount}</ThemedText>
        </View>

        <View className="flex-row justify-between mb-3">
          <ThemedTextSecondary>Method</ThemedTextSecondary>
          <ThemedText className="font-semibold">{paymentMethod}</ThemedText>
        </View>

        <View className="flex-row justify-between">
          <ThemedTextSecondary>Status</ThemedTextSecondary>
          <ThemedText className="font-semibold text-green-500">Success</ThemedText>
        </View>
      </ThemedView>

      {/* BUTTON */}
      <TouchableOpacity
        className="mt-10 mx-6 bg-yellow-500 p-5 rounded-3xl items-center shadow"
        onPress={() => router.replace("/ride/assigned")}
      >
        <ThemedText className="text-white text-lg font-bold">
          Continue
        </ThemedText>
      </TouchableOpacity>
    </ThemedScreen>
  );
}
