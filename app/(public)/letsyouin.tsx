// app/letsyouin.tsx
import { View, Text, TouchableOpacity, StatusBar, Animated, ActivityIndicator } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState, useCallback } from "react";
import { useSSO } from "@clerk/clerk-expo";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

export default function LetsYouIn() {
  const router = useRouter();
  const { startSSOFlow } = useSSO();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  const onGoogleSignIn = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const { createdSessionId, setActive, signUp } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl: AuthSession.makeRedirectUri(),
      });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        if (signUp?.unsafeMetadata?.profileComplete) {
          router.replace("/home");
        } else {
          router.replace("/(profile)/create-profile");
        }
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Google sign in failed");
    } finally {
      setIsLoading(false);
    }
  }, [startSSOFlow, router]);

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

        {/* Header */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
          className="mb-10 items-center"
        >
          <Text className="text-4xl font-extrabold text-gray-900">
            Let’s You In
          </Text>
        </Animated.View>

        {/* Card */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
          className="bg-white rounded-3xl p-6 shadow-xl"
        >
          {error ? (
            <Text className="text-red-500 text-center mb-4">{error}</Text>
          ) : null}

          {/* Google */}
          <TouchableOpacity
            className="bg-white border border-gray-300 py-4 rounded-2xl flex-row items-center justify-center active:scale-95"
            onPress={onGoogleSignIn}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FACC15" />
            ) : (
              <>
                <Text className="text-xl">🌐</Text>
                <Text className="text-gray-800 text-lg font-medium ml-2">
                  Continue with Google
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Phone */}
          <TouchableOpacity
            className="bg-white border border-gray-300 py-4 rounded-2xl flex-row items-center justify-center mt-4 active:scale-95"
            onPress={() => router.push("/(public)/login-phone")}
          >
            <Text className="text-xl">📱</Text>
            <Text className="text-gray-800 text-lg font-medium ml-2">
              Continue with Phone
            </Text>
          </TouchableOpacity>

          {/* Email */}
          <TouchableOpacity
            className="bg-white border border-gray-300 py-4 rounded-2xl flex-row items-center justify-center mt-4 active:scale-95"
            onPress={() => router.push("/(public)/login")}
          >
            <Text className="text-xl">✉️</Text>
            <Text className="text-gray-800 text-lg font-medium ml-2">
              Continue with Email
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-[1px] bg-gray-300" />
            <Text className="text-gray-500 mx-3">or</Text>
            <View className="flex-1 h-[1px] bg-gray-300" />
          </View>

          {/* Create Account */}
          <TouchableOpacity
            onPress={() => router.push("/(public)/signup")}
            className="bg-yellow-500 py-4 rounded-2xl items-center shadow active:scale-95"
          >
            <Text className="text-white text-lg font-semibold">
              Create New Account
            </Text>
          </TouchableOpacity>

          {/* Already user */}
          <View className="mt-6 flex-row justify-center">
            <Text className="text-gray-600">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/(public)/login")}>
              <Text className="text-yellow-600 font-semibold">Login</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}
