// app/ride/finding.tsx
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Animated,
  Easing,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function FindingDriver() {
  const router = useRouter();

  // Animations
  const pulse = useRef(new Animated.Value(0)).current; // radar pulse
  const rotate = useRef(new Animated.Value(0)).current; // car rotation
  const bounce = useRef(new Animated.Value(0)).current; // text bounce

  useEffect(() => {
    // Radar pulsing loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Car slow rotation
    Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Subtle bounce
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, {
          toValue: -6,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(bounce, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Simulate finding a driver after X seconds — replace with real event
    const timer = setTimeout(() => {
      // navigate to assigned screen (replace with real logic)
      router.replace("/ride/assigned");
    }, 6000); // 6s simulated search

    return () => clearTimeout(timer);
  }, []);

  // Interpolations
  const pulseScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 2.6],
  });
  const pulseOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.45, 0],
  });

  const rotateDeg = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />

      {/* Curved Yellow Header */}
      <View className="absolute top-0 left-0 right-0">
        <Svg height="220" width="100%">
          <Path d="M0 0 H400 V120 Q200 220 0 120 Z" fill="#FACC15" />
          <Path d="M0 30 H400 V150 Q200 260 0 150 Z" fill="#FDE047" opacity={0.4} />
        </Svg>
      </View>

      {/* Top Title */}
      <View className="pt-20 px-6">
        <Text className="text-3xl font-extrabold text-gray-900">Finding Driver</Text>
        <Text className="text-gray-700 mt-1">We are looking for the best driver near you</Text>
      </View>

      {/* Center animated radar */}
      <View className="flex-1 items-center justify-center px-6">
        {/* Radar container */}
        <View className="items-center justify-center">
          {/* background big pulse */}
          <Animated.View
            style={{
              position: "absolute",
              width: 260,
              height: 260,
              borderRadius: 130,
              backgroundColor: "#FACC1588",
              transform: [{ scale: pulseScale }],
              opacity: pulseOpacity,
            }}
          />

          {/* mid ring */}
          <View
            style={{
              width: 200,
              height: 200,
              borderRadius: 100,
              borderWidth: 1,
              borderColor: "#FACC15",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* rotating car icon */}
            <Animated.View style={{ transform: [{ rotate: rotateDeg }] }}>
              <View
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 45,
                  backgroundColor: "white",
                  alignItems: "center",
                  justifyContent: "center",
                  shadowColor: "#000",
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                  elevation: 8,
                }}
              >
                <FontAwesome5 name="car-side" size={46} color="#111" />
              </View>
            </Animated.View>
          </View>

          {/* small center dot */}
          <View className="w-4 h-4 bg-yellow-600 rounded-full absolute" />
        </View>

        {/* Status text */}
        <Animated.View style={{ transform: [{ translateY: bounce }], marginTop: 28 }}>
          <Text className="text-lg font-semibold text-gray-900 text-center">
            Searching for drivers nearby
          </Text>
          <Text className="text-gray-500 text-center mt-2">
            We’ll notify you when a driver accepts your request
          </Text>
        </Animated.View>
      </View>

      {/* Bottom controls */}
      <View className="px-6 pb-8">
        <TouchableOpacity
          onPress={() => {
            // Cancel and go back to home
            router.replace("/home");
          }}
          className="bg-white p-4 rounded-2xl items-center mb-3 border border-gray-200"
          style={{ elevation: 3 }}
        >
          <Text className="text-gray-700 font-semibold">Cancel Ride</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            // If user wants to wait manually, we can prolong search or show an indicator.
            // For now, navigate to assigned (simulate immediate accept).
            router.replace("/ride/assigned");
          }}
          className="bg-yellow-500 p-4 rounded-2xl items-center"
          style={{ elevation: 4 }}
        >
          <Text className="text-white font-bold">Simulate Driver Found</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
