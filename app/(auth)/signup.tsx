// app/signup.tsx
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Animated,
  ActivityIndicator,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useOAuth } from "@clerk/clerk-expo";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

export default function SignUpScreen() {
  const router = useRouter();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const onGoogleSignUp = async () => {
    try {
      setIsLoading(true);
      const { createdSessionId, setActive } = await startOAuthFlow();

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        router.replace("/home");
      }
    } catch (err) {
      console.error("OAuth error", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Curved Yellow Background */}
      <View className="absolute top-0 left-0 right-0">
        <Svg height="260" width="100%">
          <Path
            d="
              M0 0 
              H400 
              V180 
              Q200 300 0 180 
              Z
            "
            fill="#FACC15"
          />
        </Svg>
      </View>

      {/* Content Section */}
      <View className="flex-1 justify-end px-8 pb-20">

        {/* Title */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
          className="mb-10"
        >
          <Text className="text-4xl font-extrabold text-gray-900 text-center">
            Create Account
          </Text>
        </Animated.View>

        {/* Sign Up Card */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
          className="bg-white rounded-3xl p-6 shadow-xl"
        >
          {/* Google Sign Up Button */}
          <TouchableOpacity
            className="bg-white border-2 border-gray-300 py-4 rounded-2xl items-center shadow-sm active:scale-95 mb-6"
            onPress={onGoogleSignUp}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FACC15" />
            ) : (
              <View className="flex-row items-center">
                <Text className="text-2xl mr-3">🔵</Text>
                <Text className="text-gray-900 text-lg font-semibold">
                  Continue with Google
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="mx-4 text-gray-500 font-medium">OR</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          {/* Full Name */}
          <View className="mb-5">
            <Text className="text-gray-700 font-medium mb-2">Full Name</Text>
            <TextInput
              placeholder="Enter your full name"
              placeholderTextColor="#999"
              className="bg-gray-100 p-4 rounded-2xl text-gray-900"
            />
          </View>

          {/* Email */}
          <View className="mb-5">
            <Text className="text-gray-700 font-medium mb-2">Email</Text>
            <TextInput
              placeholder="example@domain.com"
              placeholderTextColor="#999"
              keyboardType="email-address"
              className="bg-gray-100 p-4 rounded-2xl text-gray-900"
            />
          </View>

          {/* Password */}
          <View className="mb-5">
            <Text className="text-gray-700 font-medium mb-2">Password</Text>

            <View className="flex-row items-center bg-gray-100 rounded-2xl p-4">
              <TextInput
                placeholder="Enter password"
                placeholderTextColor="#999"
                secureTextEntry={!passwordVisible}
                className="flex-1 text-gray-900"
              />

              <TouchableOpacity
                onPress={() => setPasswordVisible(!passwordVisible)}
              >
                <Text className="text-gray-600 text-lg">
                  {passwordVisible ? "🙈" : "👁️"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            className="bg-yellow-500 py-4 rounded-2xl mt-8 items-center shadow-md active:scale-95"
            onPress={() => router.push("/create-profile")}
          >
            <Text className="text-white text-xl font-semibold">
              Sign Up
            </Text>
          </TouchableOpacity>

          {/* Navigate to Login */}
          <View className="mt-6 flex-row justify-center">
            <Text className="text-gray-600">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text className="text-yellow-600 font-semibold">Login</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}
