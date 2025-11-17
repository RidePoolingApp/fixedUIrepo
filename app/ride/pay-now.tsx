// app/ride/pay-now.tsx
import {
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useThemeStyles } from "../context/themeStyles";
import {
  ThemedScreen,
  ThemedView,
  ThemedText,
  ThemedTextSecondary,
} from "../components/Themed";
import { useState } from "react";

export default function PayNow() {
  const router = useRouter();
  const { isDark } = useThemeStyles();

  const [promo, setPromo] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(false);

  const fare = 749;
  const tax = 48;
  const toll = 30;
  const total = fare + tax + toll - (appliedPromo ? 50 : 0);

  const paymentMethod = "UPI";

  return (
    <ThemedScreen>
      {/* HEADER BG */}
      <View className="absolute top-0 left-0 right-0">
        <Svg height="220" width="100%">
          <Path
            d="M0 0 H400 V120 Q200 220 0 120 Z"
            fill={isDark ? "#1F2937" : "#FACC15"}
          />
        </Svg>
      </View>

      {/* PAGE HEADER */}
      <View className="mt-20 px-6">
        <ThemedText className="text-3xl font-extrabold">Pay Now</ThemedText>
        <ThemedTextSecondary>Review your fare before paying</ThemedTextSecondary>
      </View>

      <ScrollView
        className="px-6 mt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 180 }}
      >

        {/* PAYMENT METHOD */}
        <ThemedView className="p-5 rounded-3xl shadow border mb-6">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="logo-google" size={26} color="#FACC15" />
              <ThemedText className="ml-3 text-lg">
                {paymentMethod}
              </ThemedText>
            </View>

            <TouchableOpacity onPress={() => router.push("/ride/payment")}>
              <ThemedText className="text-yellow-500 font-semibold">
                Change
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>

        {/* FARE BREAKDOWN */}
        <ThemedView className="p-6 rounded-3xl shadow border mb-6">
          <ThemedText className="text-xl font-bold mb-4">Fare Breakdown</ThemedText>

          <View className="flex-row justify-between mb-2">
            <ThemedTextSecondary>Ride Fare</ThemedTextSecondary>
            <ThemedText>₹{fare}</ThemedText>
          </View>

          <View className="flex-row justify-between mb-2">
            <ThemedTextSecondary>Taxes</ThemedTextSecondary>
            <ThemedText>₹{tax}</ThemedText>
          </View>

          <View className="flex-row justify-between mb-2">
            <ThemedTextSecondary>Toll Charges</ThemedTextSecondary>
            <ThemedText>₹{toll}</ThemedText>
          </View>

          {appliedPromo && (
            <View className="flex-row justify-between mb-2">
              <ThemedTextSecondary>Promo Discount</ThemedTextSecondary>
              <ThemedText className="text-green-500">-₹50</ThemedText>
            </View>
          )}

          <View className="h-[1px] bg-gray-300 dark:bg-gray-700 my-3" />

          <View className="flex-row justify-between">
            <ThemedText className="text-xl font-bold">Total</ThemedText>
            <ThemedText className="text-xl font-extrabold text-yellow-500">
              ₹{total}
            </ThemedText>
          </View>
        </ThemedView>

        {/* PROMO CODE */}
        <ThemedView className="p-6 rounded-3xl shadow border mb-6">
          <ThemedText className="text-lg font-semibold mb-3">Apply Promo Code</ThemedText>

          <View className="flex-row items-center bg-gray-200 dark:bg-gray-800 rounded-2xl p-4">
            <TextInput
              placeholder="Enter promo code"
              placeholderTextColor="#777"
              value={promo}
              onChangeText={setPromo}
              className="flex-1 text-base text-gray-900 dark:text-gray-100"
            />

            <TouchableOpacity
              onPress={() => promo.toLowerCase() === "waylink50" && setAppliedPromo(true)}
            >
              <ThemedText className="text-yellow-500 font-bold ml-3">
                Apply
              </ThemedText>
            </TouchableOpacity>
          </View>

          {appliedPromo && (
            <ThemedText className="text-green-500 mt-2 font-semibold">
              Promo Applied: WAYLINK50
            </ThemedText>
          )}
        </ThemedView>

        {/* PAY NOW BUTTON */}
        <TouchableOpacity
          onPress={() => router.push("/ride/payment-sucess")}
          className="bg-yellow-500 p-5 rounded-3xl items-center shadow"
          style={{ elevation: 4 }}
        >
          <ThemedText className="text-white text-lg font-bold">Pay ₹{total}</ThemedText>
        </TouchableOpacity>

      </ScrollView>
    </ThemedScreen>
  );
}
