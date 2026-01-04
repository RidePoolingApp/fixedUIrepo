import {
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useThemeStyles } from "../context/themeStyles";
import {
  ThemedScreen,
  ThemedView,
  ThemedText,
  ThemedTextSecondary,
} from "../components/Themed";
import { useState, useEffect } from "react";
import { useApi, PaymentMethod, RideStatus } from "../services/api";

export default function PayNow() {
  const router = useRouter();
  const api = useApi();
  const params = useLocalSearchParams<{ rideId?: string; method?: string; fare?: string }>();
  const { isDark } = useThemeStyles();

  const [promo, setPromo] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [rideStatus, setRideStatus] = useState<RideStatus | null>(null);

  // Fetch ride status to determine navigation after payment
  useEffect(() => {
    const fetchRideStatus = async () => {
      if (!params.rideId) return;
      try {
        const ride = await api.getRide(params.rideId);
        setRideStatus(ride.status);
      } catch (error) {
        console.error("Failed to fetch ride status:", error);
      }
    };
    fetchRideStatus();
  }, [params.rideId]);

  const baseFare = parseInt(params.fare || "749");
  const tax = Math.round(baseFare * 0.05);
  const toll = 30;
  const discount = appliedPromo ? 50 : 0;
  const total = baseFare + tax + toll - discount;

  const paymentMethod = params.method as PaymentMethod || PaymentMethod.UPI;
  
  const getMethodIcon = () => {
    switch (paymentMethod) {
      case PaymentMethod.UPI: return "logo-google";
      case PaymentMethod.CARD: return "card-outline";
      case PaymentMethod.CASH: return "cash-outline";
      case PaymentMethod.WALLET: return "wallet-outline";
      default: return "logo-google";
    }
  };

  const handlePayment = async () => {
    setProcessing(true);
    try {
      const payment = await api.initiatePayment({
        rideId: params.rideId,
        amount: total,
        method: paymentMethod,
      });

      let transactionId: string | undefined;

      if (paymentMethod !== PaymentMethod.CASH) {
        // Mock payment verification for UPI/Card/Wallet
        transactionId = `TXN${Date.now()}`;
        await api.verifyPayment({
          paymentId: payment.id,
          transactionId,
        });
      }

      // If ride is completed, go directly to completed screen
      if (rideStatus === RideStatus.COMPLETED) {
        router.replace({
          pathname: "/ride/competed",
          params: { rideId: params.rideId },
        });
      } else {
        // Otherwise go to payment success screen
        router.push({
          pathname: "/ride/payment-sucess",
          params: { 
            rideId: params.rideId, 
            amount: String(total),
            method: paymentMethod,
            ...(transactionId && { transactionId }),
          },
        });
      }
    } catch (error: any) {
      Alert.alert("Payment Failed", error.message || "Please try again");
    } finally {
      setProcessing(false);
    }
  };

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
              <Ionicons name={getMethodIcon() as any} size={26} color="#FACC15" />
              <ThemedText className="ml-3 text-lg">
                {paymentMethod}
              </ThemedText>
            </View>

            <TouchableOpacity onPress={() => router.push({
              pathname: "/ride/payment",
              params: { rideId: params.rideId, fare: params.fare },
            })}>
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
            <ThemedText>₹{baseFare}</ThemedText>
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
              <ThemedText className="text-green-500">-₹{discount}</ThemedText>
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
          onPress={handlePayment}
          disabled={processing}
          className={`p-5 rounded-3xl items-center shadow ${processing ? "bg-yellow-400" : "bg-yellow-500"}`}
          style={{ elevation: 4 }}
        >
          {processing ? (
            <ActivityIndicator color="white" />
          ) : (
            <ThemedText className="text-white text-lg font-bold">Pay ₹{total}</ThemedText>
          )}
        </TouchableOpacity>

      </ScrollView>
    </ThemedScreen>
  );
}
