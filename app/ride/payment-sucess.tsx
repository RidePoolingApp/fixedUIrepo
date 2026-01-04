// app/ride/payment-success.tsx
import {
  View,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  ThemedScreen,
  ThemedView,
  ThemedText,
  ThemedTextSecondary,
} from "../components/Themed";
import { useThemeStyles } from "../context/themeStyles";
import { useApi, RideStatus } from "../services/api";

export default function PaymentSuccess() {
  const router = useRouter();
  const api = useApi();
  const params = useLocalSearchParams<{
    amount?: string;
    method?: string;
    rideId?: string;
    transactionId?: string;
  }>();
  const { isDark } = useThemeStyles();

  const [loading, setLoading] = useState(false);
  const [rideStatus, setRideStatus] = useState<RideStatus | null>(null);
  const [countdown, setCountdown] = useState(10);

  // Get payment details from params or use defaults
  const paidAmount = params.amount ? `₹${params.amount}` : "₹0";
  const paymentMethod = params.method || "CASH";
  const rideId = params.rideId;
  const transactionId = params.transactionId;

  // Fetch ride status
  useEffect(() => {
    const fetchRideData = async () => {
      if (!rideId) return;
      try {
        const ride = await api.getRide(rideId);
        setRideStatus(ride.status);
      } catch (error) {
        console.error("Failed to fetch ride status:", error);
      }
    };
    fetchRideData();
  }, [rideId]);

  // Countdown timer - auto complete ride after 10 seconds
  useEffect(() => {
    // Only start countdown if ride is not already completed
    if (rideStatus === RideStatus.COMPLETED) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto-complete the ride
          handleAutoComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [rideStatus]);

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

  const handleAutoComplete = async () => {
    if (!rideId) {
      router.replace("/");
      return;
    }

    setLoading(true);
    try {
      // Complete the ride after payment (rider endpoint)
      await api.completeRideAfterPayment(rideId);
      
      // Navigate to completed screen
      router.replace({
        pathname: "/ride/competed",
        params: { rideId },
      });
    } catch (error) {
      console.error("Error completing ride:", error);
      // Even if API fails, navigate to completed screen for demo purposes
      router.replace({
        pathname: "/ride/competed",
        params: { rideId },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = async () => {
    if (!rideId) {
      router.replace("/");
      return;
    }

    setLoading(true);
    try {
      // Fetch the latest ride status
      const ride = await api.getRide(rideId);
      
      if (ride.status === RideStatus.COMPLETED) {
        // Ride is already completed, go to completed screen
        router.replace({
          pathname: "/ride/competed",
          params: { rideId },
        });
      } else if (ride.status === RideStatus.STARTED) {
        // Ride is in progress, go to started screen
        router.replace({
          pathname: "/ride/started",
          params: { rideId },
        });
      } else if (ride.status === RideStatus.CANCELLED) {
        // Ride was cancelled
        router.replace("/");
      } else {
        // Ride is still pending/accepted/arriving, go to assigned screen
        router.replace({
          pathname: "/ride/assigned",
          params: { rideId },
        });
      }
    } catch (error) {
      console.error("Error fetching ride:", error);
      router.replace("/");
    } finally {
      setLoading(false);
    }
  };

  // Determine button text based on ride status
  const getButtonText = () => {
    if (loading) return "Loading...";
    if (rideStatus === RideStatus.COMPLETED) return "View Trip Summary";
    if (rideStatus === RideStatus.STARTED) return "Track Your Ride";
    return "Continue";
  };

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
        <ThemedTextSecondary>
          {rideStatus === RideStatus.COMPLETED 
            ? "Your trip is complete" 
            : "Your ride has been confirmed"}
        </ThemedTextSecondary>
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

      {/* COUNTDOWN TIMER */}
      {rideStatus !== RideStatus.COMPLETED && countdown > 0 && (
        <View className="mx-6 mt-6 p-4 rounded-2xl bg-blue-100 border border-blue-300">
          <View className="flex-row items-center justify-center">
            <Ionicons name="time-outline" size={20} color="#2563eb" />
            <ThemedText className="ml-2 text-blue-700 font-semibold">
              Ride completing in {countdown} seconds...
            </ThemedText>
          </View>
          <ThemedTextSecondary className="text-center mt-1 text-blue-600 text-sm">
            (Mock: Auto-completing ride for demo)
          </ThemedTextSecondary>
        </View>
      )}

      {/* PAYMENT SUMMARY CARD */}
      <ThemedView className="mx-6 mt-6 p-6 rounded-3xl shadow border">
        <ThemedText className="text-xl font-bold mb-4">Payment Summary</ThemedText>

        <View className="flex-row justify-between mb-3">
          <ThemedTextSecondary>Fare Paid</ThemedTextSecondary>
          <ThemedText className="font-semibold">{paidAmount}</ThemedText>
        </View>

        <View className="flex-row justify-between mb-3">
          <ThemedTextSecondary>Method</ThemedTextSecondary>
          <ThemedText className="font-semibold">{paymentMethod}</ThemedText>
        </View>

        {transactionId && (
          <View className="flex-row justify-between mb-3">
            <ThemedTextSecondary>Transaction ID</ThemedTextSecondary>
            <ThemedText className="font-semibold text-xs">{transactionId.slice(0, 12)}...</ThemedText>
          </View>
        )}

        <View className="flex-row justify-between">
          <ThemedTextSecondary>Status</ThemedTextSecondary>
          <ThemedText className="font-semibold text-green-500">Success</ThemedText>
        </View>
      </ThemedView>

      {/* BUTTON */}
      <TouchableOpacity
        className="mt-6 mx-6 bg-yellow-500 p-5 rounded-3xl items-center shadow"
        onPress={handleContinue}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <ThemedText className="text-white text-lg font-bold">
            {getButtonText()}
          </ThemedText>
        )}
      </TouchableOpacity>
    </ThemedScreen>
  );
}
