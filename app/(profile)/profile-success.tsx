// app/profile-success.tsx
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";

export default function ProfileSuccess() {
  const router = useRouter();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View className="flex-1 bg-black/40 justify-center items-center px-8">
      <StatusBar barStyle="light-content" />

      {/* Popup Card */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}
        className="bg-white w-full rounded-3xl p-8 items-center shadow-2xl"
      >
        {/* Success Icon */}
        <View className="w-20 h-20 bg-yellow-400 rounded-full items-center justify-center mb-4">
          <Text className="text-4xl">👤</Text>
        </View>

        {/* Title */}
        <Text className="text-2xl font-bold text-gray-900 text-center">
          Congratulations!
        </Text>

        {/* Subtitle */}
        <Text className="text-gray-600 text-center mt-2 leading-6">
          Your account is ready to use.  
          You will be redirected to the Home Page in a few seconds.
        </Text>

        {/* Loading Style Emoji */}
        <Text className="text-3xl mt-4">✨</Text>

        {/* Continue Button */}
        <TouchableOpacity
          onPress={() => router.replace("/home")}
          className="bg-yellow-500 py-4 rounded-2xl w-full mt-6 items-center active:scale-95 shadow"
        >
          <Text className="text-white text-lg font-semibold">Continue</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
