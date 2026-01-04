import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
  ActivityIndicator,
  Alert,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as Linking from "expo-linking";
import CancelBottomSheet from "../components/CancelBottomSheet";
import { useThemeStyles } from "../context/themeStyles";
import { ThemedScreen, ThemedView, ThemedText, ThemedTextSecondary } from "../components/Themed";
import { useApi, Ride, RideStatus } from "../services/api";

export default function DriverAssigned() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { isDark } = useThemeStyles();
  const api = useApi();

  const rideId = params.rideId as string;

  const [ride, setRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCancel, setShowCancel] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "paid" | "pay_after_trip">("pending");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [cancelling, setCancelling] = useState(false);
  
  const proxyPhone = "+918080808080";

  const pulse = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    fetchRide();

    let pollInterval: ReturnType<typeof setInterval> | undefined;
    if (rideId) {
      pollInterval = setInterval(fetchRide, 5000);
    }

    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [rideId]);

  const fetchRide = async () => {
    if (!rideId) {
      setLoading(false);
      return;
    }

    try {
      const rideData = await api.getRide(rideId);
      setRide(rideData);

      if (rideData.status === RideStatus.STARTED) {
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
        Alert.alert("Ride Cancelled", "This ride has been cancelled");
        router.replace("/home");
      }

      if (rideData.payment) {
        setPaymentStatus(rideData.payment.status === "COMPLETED" ? "paid" : "pending");
        setPaymentMethod(rideData.payment.method);
      }
    } catch (error) {
      console.error("Failed to fetch ride:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRide = async () => {
    if (!rideId) {
      router.replace("/home");
      return;
    }

    setCancelling(true);
    try {
      await api.cancelRide(rideId, "User cancelled after driver assigned");
      router.replace("/home");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to cancel ride");
    } finally {
      setCancelling(false);
      setShowCancel(false);
    }
  };

  const handlePayment = () => {
    router.push({
      pathname: "/ride/payment",
      params: { rideId, amount: ride?.fare?.toString() || "749" },
    });
  };

  const driverName = ride?.driver?.vehicleMake 
    ? `Driver` 
    : "Rahul Verma";
    
  const driverRating = ride?.driver?.rating || 4.8;
  const driverTrips = ride?.driver?.totalTrips || 2450;
  const vehicleInfo = ride?.driver 
    ? `${ride.driver.vehicleColor} ${ride.driver.vehicleMake} ${ride.driver.vehicleModel}`
    : "White Sedan";
  const licensePlate = ride?.driver?.licensePlate || "KA 05 MK 2244";
  const fare = ride?.fare ? `₹${ride.fare}` : "₹749";

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

  return (
    <ThemedScreen>
      <View className="absolute top-0 left-0 right-0">
        <Svg height="260" width="100%">
          <Path
            d="M0 0 H400 V140 Q200 260 0 140 Z"
            fill={isDark ? "#1F2937" : "#FACC15"}
          />
        </Svg>
      </View>

      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-14 left-6 bg-white p-3 rounded-full shadow"
        style={{ elevation: 4 }}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <View className="mt-28 px-6">
        <ThemedText className="text-3xl font-extrabold">Driver Assigned</ThemedText>
        <ThemedTextSecondary>Your ride is being prepared</ThemedTextSecondary>
      </View>

      <ScrollView
        className="px-6 mt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 180 }}
      >
        <ThemedView className="rounded-3xl p-6 shadow border mb-6">
          <View className="flex-row items-center">
            <Image
              source={{ uri: "https://i.ibb.co/ZY7fCFw/driver.jpg" }}
              className="w-20 h-20 rounded-full"
            />

            <View className="ml-4">
              <ThemedText className="text-xl font-bold">{driverName}</ThemedText>
              <ThemedTextSecondary>⭐ {driverRating} • {driverTrips.toLocaleString()} rides</ThemedTextSecondary>
              <ThemedTextSecondary>Car: {vehicleInfo}</ThemedTextSecondary>
              <ThemedTextSecondary>{licensePlate}</ThemedTextSecondary>
            </View>
          </View>
        </ThemedView>

        {ride && (
          <ThemedView className="rounded-3xl p-6 shadow border mb-6">
            <ThemedText className="text-lg font-bold mb-3">Route</ThemedText>
            <View className="flex-row items-start mb-2">
              <View className="w-3 h-3 bg-yellow-500 rounded-full mt-1" />
              <ThemedText className="ml-3 flex-1" numberOfLines={2}>
                {ride.pickupAddress}
              </ThemedText>
            </View>
            <View className="ml-1 h-4 border-l-2 border-gray-300" />
            <View className="flex-row items-start">
              <View className="w-3 h-3 bg-gray-900 rounded-full mt-1" />
              <ThemedText className="ml-3 flex-1" numberOfLines={2}>
                {ride.dropAddress}
              </ThemedText>
            </View>
          </ThemedView>
        )}

        <ThemedView className="rounded-3xl p-6 shadow border mb-6">
          <ThemedText className="text-xl font-bold">Arrival Time</ThemedText>

          <Animated.View
            style={{ transform: [{ scale: pulse }] }}
            className="flex-row items-center mt-3"
          >
            <Ionicons name="time-outline" size={26} color="#FACC15" />
            <ThemedText className="ml-3 text-lg">
              Reaching in <Text className="font-bold">12 minutes</Text>
            </ThemedText>
          </Animated.View>
        </ThemedView>

        <ThemedView className="rounded-3xl p-6 shadow border mb-6">
          <ThemedText className="text-xl font-bold mb-1">Payment Details</ThemedText>

          <View className="flex-row justify-between mt-2">
            <ThemedTextSecondary>Payment Method</ThemedTextSecondary>
            <ThemedText className="font-semibold">{paymentMethod}</ThemedText>
          </View>

          <View className="flex-row items-center mt-4">
            <Ionicons name="lock-closed-outline" size={20} color="#FACC15" />
            <ThemedText className="ml-2 font-semibold">Your fare is locked</ThemedText>
          </View>
          <ThemedTextSecondary>No extra charges guaranteed</ThemedTextSecondary>

          <View className="mt-4">
            <ThemedTextSecondary>Total Fare</ThemedTextSecondary>
            <ThemedText className="text-3xl font-extrabold text-yellow-500">{fare}</ThemedText>
          </View>

          {paymentStatus === "pending" && (
            <TouchableOpacity
              onPress={handlePayment}
              className="bg-yellow-500 p-4 rounded-2xl mt-5 items-center"
            >
              <Text className="text-white font-bold text-lg">Complete Payment</Text>
            </TouchableOpacity>
          )}

          {paymentStatus === "paid" && (
            <ThemedText className="text-green-500 font-bold mt-4 text-lg">
              Payment Completed
            </ThemedText>
          )}

          {paymentStatus === "pay_after_trip" && (
            <ThemedText className="text-blue-500 font-bold mt-4 text-lg">
              Pay after trip completion
            </ThemedText>
          )}
        </ThemedView>

        <View className="space-y-4">
          <TouchableOpacity
            className="bg-yellow-500 p-5 rounded-3xl items-center shadow"
            onPress={() => Linking.openURL(`tel:${proxyPhone}`)}
          >
            <Text className="text-white text-lg font-bold">Contact Driver</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowCancel(true)}
            className="bg-red-500 p-4 rounded-2xl mt-5 items-center"
          >
            <Text className="text-white font-bold text-lg">Cancel Ride</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <CancelBottomSheet
        visible={showCancel}
        onClose={() => setShowCancel(false)}
        onConfirm={handleCancelRide}
      />
    </ThemedScreen>
  );
}
