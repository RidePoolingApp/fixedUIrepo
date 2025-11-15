// app/welcome.tsx
import { View, Text, TouchableOpacity, StatusBar, Animated, Easing } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";

export default function WelcomeScreen() {
  const router = useRouter();

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade + Slide animation
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

    // Waving hand loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(waveAnim, {
          toValue: -1,
          duration: 400,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
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
            fill="#FACC15"  // yellow-400 equivalent
          />
        </Svg>
      </View>

      {/* Content */}
      <View className="flex-1 justify-end px-8 pb-20">

        {/* Floating Welcome */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
          className="mb-10"
        >
          <View className="bg-white/70 rounded-3xl px-6 py-4 self-start shadow">
            <Text className="text-gray-900 text-3xl font-bold">
              Welcome to{" "}
              <Animated.Text
                style={{
                  transform: [
                    {
                      rotate: waveAnim.interpolate({
                        inputRange: [-1, 1],
                        outputRange: ["-20deg", "20deg"],
                      }),
                    },
                  ],
                }}
              >
                👋
              </Animated.Text>
            </Text>
          </View>
        </Animated.View>

        {/* Bottom Card */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
          className="bg-white rounded-3xl p-6 shadow-xl"
        >
          <Text className="text-yellow-600 text-6xl font-extrabold tracking-tight">
            Waylink
          </Text>

          <Text className="text-gray-700 mt-4 text-lg leading-7">
            The best taxi booking service of the century  
            to make your day great!
          </Text>

          <TouchableOpacity
            onPress={() => router.push("/onboarding1")}
            className="bg-yellow-500 py-4 rounded-2xl mt-8 items-center shadow-md active:scale-95"
          >
            <Text className="text-white text-xl font-semibold">
              Get Started
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}
