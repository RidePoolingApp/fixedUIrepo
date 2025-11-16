// app/matching-share.tsx
import {
  View,
  Text,
  Animated,
  Image,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { useEffect, useRef } from "react";
import { useRouter } from "expo-router";

export default function MatchingShare() {
  const router = useRouter();

  // animations
  const pulse = useRef(new Animated.Value(1)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulsing Effect
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

    // Rotating Loader
    Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration: 1800,
        useNativeDriver: true,
      })
    ).start();

    // Fade-in text
    Animated.timing(fade, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();

    // Auto redirect after 4 sec
    const timer = setTimeout(() => {
      router.replace("/ride/assigned");
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const spinAnim = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View className="flex-1 bg-gray-50 items-center justify-center">
      {/* PREMIUM HEADER */}
      <View className="absolute top-0 left-0 right-0">
        <Svg height="240" width="100%">
          <Path d="M0 0 H400 V130 Q200 240 0 130 Z" fill="#FACC15" />
          <Path
            d="M0 30 H400 V150 Q200 260 0 150 Z"
            fill="#FDE047"
            opacity={0.5}
          />
        </Svg>
      </View>

      {/* Center Loader Animation */}
      <Animated.View
        style={{
          transform: [{ scale: pulse }],
        }}
        className="w-48 h-48 rounded-full bg-white shadow-xl items-center justify-center"
      >
        {/* Rotating Ring */}
        <Animated.View
          style={{
            position: "absolute",
            width: 180,
            height: 180,
            borderRadius: 180,
            borderWidth: 4,
            borderColor: "#FACC15",
            transform: [{ rotate: spinAnim }],
          }}
        />

        {/* Searching Icon */}
        <Image
          source={{ uri: "https://i.ibb.co/zxpsG7v/search2.png" }}
          className="w-20 h-20"
          style={{ tintColor: "#FACC15" }}
        />
      </Animated.View>

      {/* Floating User Bubbles */}
      <Image
        source={{ uri: "https://i.ibb.co/gJ9Rjgt/user1.jpg" }}
        className="w-16 h-16 rounded-full absolute left-10 top-150"
        style={{ borderWidth: 3, borderColor: "white" }}
      />

      <Image
        source={{ uri: "https://i.ibb.co/4V3pF2b/user2.jpg" }}
        className="w-16 h-16 rounded-full absolute right-10 top-200"
        style={{ borderWidth: 3, borderColor: "white" }}
      />

      <Image
        source={{ uri: "https://i.ibb.co/7G5M3P0/user3.jpg" }}
        className="w-14 h-14 rounded-full absolute left-20 bottom-200"
        style={{ borderWidth: 3, borderColor: "white" }}
      />

      {/* Text */}
      <Animated.View
        style={{ opacity: fade }}
        className="items-center mt-8 px-10"
      >
        <Text className="text-2xl font-extrabold text-gray-900 text-center">
          Finding Co-Riders
        </Text>
        <Text className="text-gray-600 mt-2 text-center">
          We are matching you with the nearest passengers and assigning a driver
        </Text>
      </Animated.View>

      {/* Footer */}
      <Text className="absolute bottom-16 text-gray-500">
        Matching passengers…
      </Text>
    </View>
  );
}
