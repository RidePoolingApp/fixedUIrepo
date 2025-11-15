// app/forgot-password.tsx

import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";

export default function ForgotPassword() {
  const router = useRouter();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <StatusBar barStyle="dark-content" />

        {/* Curved Yellow Background */}
        <View className="absolute top-0 left-0 right-0">
          <Svg height="260" width="100%">
            <Path
              d="M0 0 H400 V180 Q200 300 0 180 Z"
              fill="#FACC15"
            />
          </Svg>
        </View>

        <View className="flex-1 justify-end px-8 pb-20">

          {/* Title */}
          <Animated.View
            style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
            className="mb-10 items-center"
          >
            <Text className="text-4xl font-extrabold text-gray-900">
              Forgot Password?
            </Text>
            <Text className="text-gray-600 mt-2 text-center px-4">
              Don’t worry! Enter your registered email  
              and we’ll send you a reset link.
            </Text>
          </Animated.View>

          {/* Card */}
          <Animated.View
            style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
            className="bg-white rounded-3xl p-6 shadow-xl"
          >
            {/* Email Input */}
            <View className="mb-5">
              <Text className="text-gray-700 font-medium mb-2">Email</Text>
              <TextInput
                placeholder="example@domain.com"
                placeholderTextColor="#999"
                keyboardType="email-address"
                className="bg-gray-100 p-4 rounded-2xl text-gray-900"
              />
            </View>

            {/* Send Reset Link */}
            <TouchableOpacity
              className="bg-yellow-500 py-4 rounded-2xl mt-6 items-center shadow-md active:scale-95"
              onPress={() => router.push("/reset-password")}
            >
              <Text className="text-white text-xl font-semibold">
                Send Reset Link
              </Text>
            </TouchableOpacity>

            {/* Back to Login */}
            <View className="mt-6 flex-row justify-center">
              <Text className="text-gray-600">Remember your password? </Text>
              <TouchableOpacity onPress={() => router.push("/login")}>
                <Text className="text-yellow-600 font-semibold">Login</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
