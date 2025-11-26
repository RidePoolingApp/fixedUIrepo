import {
  View,
  Text,
  TouchableOpacity,
  Animated,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

export default function DriverRideStarted() {
  const router = useRouter();

  // Live ride states (mock)
  const [time, setTime] = useState(0);
  const [distanceLeft, setDistanceLeft] = useState(4.8);
  const [speed, setSpeed] = useState(32);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();

    // Mock timer update every second
    const interval = setInterval(() => {
      setTime((t) => t + 1);
      setSpeed(30 + Math.random() * 10);
      setDistanceLeft((d) => (d - 0.05 > 0 ? d - 0.05 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const endRide = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    router.replace("/driver/ride-completed");
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  return (
    <View className="flex-1 bg-gray-100">

      {/* PREMIUM NAV HEADER */}
      <View className="absolute top-0 left-0 right-0">
        <Svg height="230" width="100%">
          <Path d="M0 0 H400 V130 Q200 230 0 130 Z" fill="#FACC15" />
          <Path d="M0 30 H400 V150 Q200 260 0 150 Z" fill="#FDE047" opacity={0.35} />
        </Svg>
      </View>

      {/* BACK BUTTON */}
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-14 left-6 bg-white p-3 rounded-full shadow"
        style={{ elevation: 6 }}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      {/* TITLE */}
      <View className="mt-28 px-6">
        <Text className="text-3xl font-extrabold text-gray-900">Ride in Progress</Text>
        <Text className="text-gray-700 mt-1">Navigating to destination</Text>
      </View>

      {/* MAP VIEW PLACEHOLDER */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [40, 0],
              }),
            },
          ],
        }}
        className="mx-6 mt-6 bg-white rounded-3xl shadow p-6 border border-gray-200"
      >
        {/* MAP Placeholder */}
        <View className="bg-gray-200 h-52 rounded-2xl items-center justify-center">
          <Ionicons name="navigate-outline" size={70} color="#999" />
          <Text className="mt-2 text-gray-600">Navigation in progress...</Text>
        </View>

        {/* LIVE DETAILS ROW */}
        <View className="flex-row justify-between mt-6">
          {/* TIME */}
          <View className="items-center">
            <Ionicons name="time-outline" size={26} color="#FACC15" />
            <Text className="text-gray-900 font-bold mt-1">{formatTime(time)}</Text>
            <Text className="text-gray-500 text-xs">Time</Text>
          </View>

          {/* DISTANCE */}
          <View className="items-center">
            <MaterialCommunityIcons name="map-marker-distance" size={28} color="#FACC15" />
            <Text className="text-gray-900 font-bold mt-1">
              {distanceLeft.toFixed(1)} km
            </Text>
            <Text className="text-gray-500 text-xs">Remaining</Text>
          </View>

          {/* SPEED */}
          <View className="items-center">
            <MaterialCommunityIcons name="speedometer" size={28} color="#FACC15" />
            <Text className="text-gray-900 font-bold mt-1">
              {Math.floor(speed)} km/h
            </Text>
            <Text className="text-gray-500 text-xs">Speed</Text>
          </View>
        </View>

        {/* ROUTE CARD */}
        <View className="mt-6 border-t border-gray-200 pt-6">
          <Text className="font-semibold text-gray-900 text-lg">
            HSR Layout → MG Road
          </Text>
          <Text className="text-gray-600 mt-1">Estimated arrival in 8–12 min</Text>
        </View>
      </Animated.View>

      {/* END RIDE BUTTON */}
      <View className="absolute bottom-10 left-0 right-0 px-6">
        <TouchableOpacity
          onPress={endRide}
          className="bg-red-500 p-5 rounded-3xl items-center shadow-lg"
          style={{ elevation: 10 }}
        >
          <Text className="text-white font-bold text-xl">End Ride</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
