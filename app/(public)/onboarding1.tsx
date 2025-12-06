// app/onboarding1.tsx
import { View, Text, TouchableOpacity, StatusBar, Animated } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";

export default function Onboarding1() {
  const router = useRouter();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Curved Yellow Background */}
      <View className="absolute top-0 left-0 right-0">
        <Svg height="280" width="100%">
          <Path
            d="
              M0 0 
              H400 
              V200 
              Q200 320 0 200 
              Z
            "
            fill="#FACC15"
          />
        </Svg>
      </View>

      {/* Content */}
      <View className="flex-1 justify-end px-8 pb-20">

        {/* Main Icon / Emoji */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
          className="items-center mb-10"
        >
          <Text className="text-7xl">🚕</Text>
        </Animated.View>

        {/* Card */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
          className="bg-white rounded-3xl p-6 shadow-xl"
        >
          <Text className="text-yellow-600 text-4xl font-bold">
            We provide taxi services
          </Text>

          <Text className="text-gray-700 mt-3 text-lg leading-7">
            Professional drivers, clean vehicles, and reliable service  
            wherever you need to go.
          </Text>

          {/* Pagination Dots */}
          <View className="flex-row items-center mt-6 space-x-2">
            <View className="w-4 h-4 bg-yellow-500 rounded-full" />
            <View className="w-3 h-3 bg-gray-400 rounded-full" />
            <View className="w-3 h-3 bg-gray-400 rounded-full" />
          </View>

          {/* Next Button */}
          <TouchableOpacity
            onPress={() => router.push("/onboarding2")}
            className="bg-yellow-500 py-4 rounded-2xl mt-8 items-center shadow-md active:scale-95"
          >
            <Text className="text-white text-xl font-semibold">
              Next
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}
