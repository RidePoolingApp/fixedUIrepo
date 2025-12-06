// app/otp.tsx
import { View, Text, TouchableOpacity, TextInput, StatusBar, Animated } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";

export default function OTPVerification() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", ""]);

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

  // Handle OTP change
  const updateOTP = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Curved Background */}
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
            Verify OTP
          </Text>

          <Text className="text-gray-600 text-center mt-2">
            Enter the 4-digit code sent to your phone
          </Text>
        </Animated.View>

        {/* Card */}
        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
          className="bg-white rounded-3xl p-6 shadow-xl items-center"
        >
          {/* OTP Box */}
          <View className="flex-row justify-between w-full px-4">
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                maxLength={1}
                keyboardType="number-pad"
                value={digit}
                onChangeText={(text) => updateOTP(text, index)}
                className="w-14 h-14 bg-gray-100 rounded-2xl text-center text-2xl text-gray-900"
              />
            ))}
          </View>

          {/* Resend */}
          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-600">Didn't receive code? </Text>
            <TouchableOpacity>
              <Text className="text-yellow-600 font-semibold">Resend</Text>
            </TouchableOpacity>
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            className="bg-yellow-500 py-4 rounded-2xl mt-8 w-full items-center shadow-md active:scale-95"
            onPress={() => router.push("/create-pin")}
          >
            <Text className="text-white text-xl font-semibold">Verify</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}
