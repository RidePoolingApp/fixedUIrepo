import "../global.css";
import { View, Text, ActivityIndicator, StatusBar, Animated } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { useAuth } from "@clerk/clerk-expo";

export default function App() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo fade + pop-in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Floating sparkles animation loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(sparkleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(sparkleAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Navigate after splash - check auth status
    const timer = setTimeout(() => {
      if (isLoaded) {
        if (isSignedIn) {
          router.replace("/home");
        } else {
          router.replace("/(public)/welcome");
        }
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isLoaded, isSignedIn]);

  return (
    <View className="flex-1 bg-white justify-center items-center">
      <StatusBar barStyle="dark-content" />

      {/* Curved Yellow Bottom Wave */}
      <View className="absolute bottom-0 left-0 right-0">
        <Svg height="260" width="100%">
          <Path
            d="
              M0 260 
              H400 
              V80 
              Q200 -40 0 80 
              Z
            "
            fill="#FACC15"
          />
        </Svg>
      </View>

      {/* Floating sparkles */}
      <Animated.Text
        style={{
          opacity: sparkleAnim,
          transform: [
            {
              translateY: sparkleAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -12],
              }),
            },
          ],
        }}
        className="absolute top-32 text-2xl"
      >
        ✨
      </Animated.Text>

      <Animated.Text
        style={{
          opacity: sparkleAnim,
          transform: [
            {
              translateY: sparkleAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [10, -8],
              }),
            },
          ],
        }}
        className="absolute top-40 right-16 text-xl"
      >
        ✨
      </Animated.Text>

      {/* Glowing Circle Behind Logo */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}
        className="absolute w-40 h-40 bg-yellow-300/20 rounded-full blur-xl"
      />

      {/* Logo Text */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}
        className="items-center"
      >
        <Text className="text-6xl font-extrabold text-yellow-600 tracking-wide">
          Waylink
        </Text>

        <ActivityIndicator
          size="large"
          color="#d97706"
          className="mt-6"
        />
      </Animated.View>
    </View>
  );
}
