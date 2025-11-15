// app/reset-password.tsx
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Animated,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";

export default function ResetPassword() {
  const router = useRouter();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
          className="mb-10 items-center"
        >
          <Text className="text-4xl font-extrabold text-gray-900">
            Reset Password
          </Text>
          <Text className="text-gray-600 mt-2 text-center px-4">
            Enter your new password and confirm it  
            to reset your access.
          </Text>
        </Animated.View>

        {/* Card */}
        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
          className="bg-white rounded-3xl p-6 shadow-xl"
        >
          {/* New Password */}
          <View className="mb-5">
            <Text className="text-gray-700 font-medium mb-2">New Password</Text>

            <View className="flex-row items-center bg-gray-100 rounded-2xl p-4">
              <TextInput
                placeholder="Enter new password"
                placeholderTextColor="#999"
                secureTextEntry={!showNew}
                className="flex-1 text-gray-900"
              />

              <TouchableOpacity onPress={() => setShowNew(!showNew)}>
                <Text className="text-gray-600 text-lg">
                  {showNew ? "🙈" : "👁️"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm New Password */}
          <View className="mb-3">
            <Text className="text-gray-700 font-medium mb-2">
              Confirm Password
            </Text>

            <View className="flex-row items-center bg-gray-100 rounded-2xl p-4">
              <TextInput
                placeholder="Re-enter password"
                placeholderTextColor="#999"
                secureTextEntry={!showConfirm}
                className="flex-1 text-gray-900"
              />

              <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                <Text className="text-gray-600 text-lg">
                  {showConfirm ? "🙈" : "👁️"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Reset Button */}
          <TouchableOpacity
            className="bg-yellow-500 py-4 rounded-2xl mt-8 items-center shadow-md active:scale-95"
            onPress={() => router.push("/login")}
          >
            <Text className="text-white text-xl font-semibold">
              Reset Password
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
    </View>
  );
}
