import {
  View,
  Text,
  TouchableOpacity,
  Animated,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

export default function IncomingRequest() {
  const router = useRouter();
  const [seconds, setSeconds] = useState(15);

  // Animation
  const slideUp = useRef(new Animated.Value(100)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

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

    // Countdown
    const timer = setInterval(() => {
      setSeconds((t) => {
        if (t <= 1) {
          clearInterval(timer);
          router.replace("/driver/dashboard");
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const acceptRide = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    router.push("/driver/ride-started");
  };

  const rejectRide = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    router.replace("/driver/dashboard");
  };

  return (
    <View className="flex-1 bg-gray-100">

      {/* PREMIUM HEADER */}
      <View className="absolute top-0 left-0 right-0">
        <Svg height="260" width="100%">
          <Path d="M0 0 H400 V140 Q200 260 0 140 Z" fill="#FACC15" />
          <Path d="M0 40 H400 V180 Q200 300 0 180 Z" fill="#FDE047" opacity={0.4} />
        </Svg>
      </View>

      {/* TITLE */}
      <View className="mt-24 px-6">
        <Text className="text-3xl font-extrabold text-gray-900">New Ride Request</Text>
        <Text className="text-gray-700 mt-1">You have {seconds} seconds to respond</Text>
      </View>

      {/* MAP PREVIEW (Placeholder Card) */}
      <Animated.View
        style={{
          opacity: fadeIn,
          transform: [{ translateY: slideUp }],
        }}
        className="mx-6 mt-6 bg-white rounded-3xl shadow p-6 border border-gray-200"
      >
        <View className="bg-gray-200 h-40 rounded-2xl items-center justify-center">
          <Ionicons name="map-outline" size={60} color="#999" />
        </View>

        <Text className="mt-4 text-xl font-semibold text-gray-900">
          Pickup: HSR Layout, Bangalore
        </Text>
        <Text className="text-gray-600 mt-1">Drop: MG Road, Bangalore</Text>

        <View className="flex-row justify-between mt-4">
          <View>
            <Text className="text-gray-500">Distance</Text>
            <Text className="text-lg font-bold text-gray-800">3.2 km</Text>
          </View>
          <View>
            <Text className="text-gray-500">Est. Earnings</Text>
            <Text className="text-lg font-bold text-yellow-600">₹89</Text>
          </View>
        </View>
      </Animated.View>

      {/* ACTION BUTTONS */}
      <View className="absolute bottom-10 left-0 right-0 px-6">

        {/* ACCEPT */}
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity
            onPress={acceptRide}
            className="bg-yellow-500 p-5 rounded-3xl items-center shadow-lg"
            style={{ elevation: 8 }}
          >
            <Text className="text-white text-xl font-bold">Accept Ride</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* REJECT */}
        <TouchableOpacity
          onPress={rejectRide}
          className="p-4 rounded-3xl mt-3 items-center border border-gray-400 bg-white shadow"
          style={{ elevation: 4 }}
        >
          <Text className="text-gray-700 text-lg font-semibold">Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
