import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Image,
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

  // Ride phase: enroute -> arrived -> onTrip
  const [phase, setPhase] = useState<'enroute' | 'arrived' | 'onTrip'>('enroute');

  // Waiting timer
  const [waiting, setWaiting] = useState(false);
  const [waitingSec, setWaitingSec] = useState(0);

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

  // Waiting time ticker
  useEffect(() => {
    if (!waiting) return;
    const timer = setInterval(() => setWaitingSec((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [waiting]);

  const endRide = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    router.replace("/driver/ride-completed");
  };

  const markArrived = () => {
    Haptics.selectionAsync();
    setPhase('arrived');
  };

  const startTrip = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setPhase('onTrip');
  };

  const toggleWaiting = () => {
    setWaiting((w) => !w);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  const statusTitle =
    phase === 'enroute' ? 'Heading to Pickup' : phase === 'arrived' ? 'Arrived at Pickup' : 'Ride in Progress';
  const statusSubtitle =
    phase === 'enroute' ? 'Navigating to pickup point' : phase === 'arrived' ? 'Waiting to start the trip' : 'Navigating to destination';

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
        <Text className="text-3xl font-extrabold text-gray-900">{statusTitle}</Text>
        <Text className="text-gray-700 mt-1">{statusSubtitle}</Text>

        {/* Info chips */}
        <View className="flex-row mt-3">
          <View className="px-3 py-1 mr-2 rounded-full bg-yellow-100 border border-yellow-300">
            <Text className="text-yellow-700 text-xs font-semibold">UPI</Text>
          </View>
          <View className="px-3 py-1 mr-2 rounded-full bg-gray-100 border border-gray-300">
            <Text className="text-gray-700 text-xs font-semibold">2 Seats</Text>
          </View>
          {waiting ? (
            <View className="px-3 py-1 rounded-full bg-red-100 border border-red-300">
              <Text className="text-red-700 text-xs font-semibold">Waiting {formatTime(waitingSec)}</Text>
            </View>
          ) : (
            <View className="px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300">
              <Text className="text-emerald-700 text-xs font-semibold">On Time</Text>
            </View>
          )}
        </View>
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

        {/* Rider row */}
        <View className="mt-5 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Image
              source={{ uri: "https://i.pravatar.cc/80?img=12" }}
              className="w-10 h-10 rounded-full"
            />
            <View className="ml-3">
              <Text className="text-gray-900 font-semibold">Aarav Sharma</Text>
              <View className="flex-row items-center">
                <Ionicons name="star" size={14} color="#FACC15" />
                <Text className="ml-1 text-gray-600 text-xs">4.8</Text>
              </View>
            </View>
          </View>
          <View className="px-3 py-1 rounded-full bg-gray-100 border border-gray-300">
            <Text className="text-gray-700 text-xs font-semibold">Trip #{""}2481</Text>
          </View>
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

      {/* BOTTOM ACTION BAR */}
      <View className="absolute bottom-10 left-0 right-0 px-6">
        {phase === 'enroute' && (
          <>
            <TouchableOpacity
              onPress={markArrived}
              className="bg-yellow-500 p-5 rounded-3xl items-center shadow-lg"
              style={{ elevation: 10 }}
            >
              <Text className="text-white font-bold text-xl">Mark Arrived</Text>
            </TouchableOpacity>
          </>
        )}

        {phase === 'arrived' && (
          <View className="flex-row">
            <TouchableOpacity
              onPress={startTrip}
              className="flex-1 bg-yellow-500 p-5 rounded-3xl items-center shadow-lg"
              style={{ elevation: 10 }}
            >
              <Text className="text-white font-bold text-xl">Start Trip</Text>
            </TouchableOpacity>
            <View className="w-3" />
            <TouchableOpacity
              onPress={toggleWaiting}
              className={`flex-1 p-5 rounded-3xl items-center border shadow ${waiting ? 'bg-red-50 border-red-300' : 'bg-white border-gray-300'}`}
              style={{ elevation: 6 }}
            >
              <Text className={`text-lg font-semibold ${waiting ? 'text-red-600' : 'text-gray-700'}`}>
                {waiting ? `Waiting ${formatTime(waitingSec)}` : 'Start Waiting'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {phase === 'onTrip' && (
          <View>
            <View className="flex-row">
              <TouchableOpacity
                onPress={endRide}
                className="flex-[1.4] bg-red-500 p-5 rounded-3xl items-center shadow-lg"
                style={{ elevation: 10 }}
              >
                <Text className="text-white font-bold text-xl">End Ride</Text>
              </TouchableOpacity>
              <View className="w-3" />
              <TouchableOpacity
                onPress={toggleWaiting}
                className={`flex-1 p-5 rounded-3xl items-center border shadow ${waiting ? 'bg-red-50 border-red-300' : 'bg-white border-gray-300'}`}
                style={{ elevation: 6 }}
              >
                <Text className={`text-lg font-semibold ${waiting ? 'text-red-600' : 'text-gray-700'}`}>
                  {waiting ? `Waiting ${formatTime(waitingSec)}` : 'Start Waiting'}
                </Text>
              </TouchableOpacity>
            </View>
            <Text className="text-center text-gray-500 mt-2 text-xs">Waiting time is added to fare as per policy</Text>
          </View>
        )}
      </View>
    </View>
  );
}
