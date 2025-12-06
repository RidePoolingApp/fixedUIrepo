// app/login-phone.tsx
import { View, Text, TouchableOpacity, TextInput, StatusBar, Animated } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";

export default function LoginPhoneScreen() {
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

      {/* Content */}
      <View className="flex-1 justify-end px-8 pb-20">

        {/* Title */}
        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
          className="mb-10"
        >
          <Text className="text-4xl font-extrabold text-gray-900 text-center">
            Login with Phone
          </Text>
        </Animated.View>

        {/* Card */}
        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
          className="bg-white rounded-3xl p-6 shadow-xl"
        >
          {/* Phone Number */}
          <View className="mb-5">
            <Text className="text-gray-700 font-medium mb-2">Phone Number</Text>

            <View className="flex-row bg-gray-100 rounded-2xl p-4 items-center">
              {/* Country Code */}
              <Text className="text-gray-900 text-lg mr-3">+91</Text>

              {/* Divider */}
              <View className="w-[1px] bg-gray-400 h-6 mr-3" />

              <TextInput
                placeholder="Enter phone number"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                className="flex-1 text-gray-900"
              />
            </View>
          </View>

          {/* Continue */}
          <TouchableOpacity
            className="bg-yellow-500 py-4 rounded-2xl mt-8 items-center shadow-md active:scale-95"
            onPress={() => router.push("/otp")}
          >
            <Text className="text-white text-xl font-semibold">Send OTP</Text>
          </TouchableOpacity>

          {/* OR Divider */}
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-[1px] bg-gray-300" />
            <Text className="text-gray-500 mx-3">or</Text>
            <View className="flex-1 h-[1px] bg-gray-300" />
          </View>

          {/* Email Login */}
          <TouchableOpacity
            onPress={() => router.push("/login")}
            className="bg-white border border-gray-300 py-4 rounded-2xl items-center active:scale-95"
          >
            <Text className="text-gray-700 text-lg font-medium">Login with Email</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}
