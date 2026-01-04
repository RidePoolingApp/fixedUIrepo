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
import { useEffect, useRef, useState } from "react";
import { useSignIn } from "@clerk/clerk-expo";

export default function LoginPhoneScreen() {
  const router = useRouter();
  const { signIn, setActive, isLoaded } = useSignIn();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  const [phoneNumber, setPhoneNumber] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

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

  const onSendOTP = async () => {
    if (!isLoaded) return;

    try {
      const fullPhoneNumber = `+91${phoneNumber}`;
      
      await signIn.create({
        strategy: "phone_code",
        identifier: fullPhoneNumber,
      });

      const phoneCodeFactor = signIn.supportedFirstFactors?.find(
        (factor) => factor.strategy === "phone_code"
      );

      if (phoneCodeFactor && "phoneNumberId" in phoneCodeFactor) {
        await signIn.prepareFirstFactor({
          strategy: "phone_code",
          phoneNumberId: phoneCodeFactor.phoneNumberId as string,
        });
      }

      setPendingVerification(true);
      setError("");
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Failed to send OTP");
    }
  };

  const onVerifyOTP = async () => {
    if (!isLoaded) return;

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "phone_code",
        code,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.replace("/home");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Verification failed");
    }
  };

  if (pendingVerification) {
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

          <View className="absolute top-0 left-0 right-0">
            <Svg height="260" width="100%">
              <Path
                d="M0 0 H400 V180 Q200 300 0 180 Z"
                fill="#FACC15"
              />
            </Svg>
          </View>

          <View className="flex-1 justify-end px-8 pb-20">
            <Animated.View
              style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
              className="mb-10"
            >
              <Text className="text-4xl font-extrabold text-gray-900 text-center">
                Verify OTP
              </Text>
              <Text className="text-gray-600 text-center mt-2">
                Enter the code sent to +91{phoneNumber}
              </Text>
            </Animated.View>

            <Animated.View
              style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
              className="bg-white rounded-3xl p-6 shadow-xl"
            >
              <View className="mb-5">
                <Text className="text-gray-700 font-medium mb-2">OTP Code</Text>
                <TextInput
                  placeholder="Enter 6-digit code"
                  placeholderTextColor="#999"
                  keyboardType="number-pad"
                  value={code}
                  onChangeText={setCode}
                  maxLength={6}
                  className="bg-gray-100 p-4 rounded-2xl text-gray-900 text-center text-xl tracking-widest"
                />
              </View>

              {error ? (
                <Text className="text-red-500 text-center mb-2">{error}</Text>
              ) : null}

              <TouchableOpacity
                className="bg-yellow-500 py-4 rounded-2xl mt-6 items-center shadow-md active:scale-95"
                onPress={onVerifyOTP}
              >
                <Text className="text-white text-xl font-semibold">Verify</Text>
              </TouchableOpacity>

              <View className="mt-6 flex-row justify-center">
                <Text className="text-gray-600">Didn't receive code? </Text>
                <TouchableOpacity onPress={onSendOTP}>
                  <Text className="text-yellow-600 font-semibold">Resend</Text>
                </TouchableOpacity>
              </View>

              <View className="mt-4 flex-row justify-center">
                <TouchableOpacity onPress={() => setPendingVerification(false)}>
                  <Text className="text-gray-600">Change phone number</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

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

        <View className="absolute top-0 left-0 right-0">
          <Svg height="260" width="100%">
            <Path
              d="M0 0 H400 V180 Q200 300 0 180 Z"
              fill="#FACC15"
            />
          </Svg>
        </View>

        <View className="flex-1 justify-end px-8 pb-20">
          <Animated.View
            style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
            className="mb-10"
          >
            <Text className="text-4xl font-extrabold text-gray-900 text-center">
              Login with Phone
            </Text>
          </Animated.View>

          <Animated.View
            style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
            className="bg-white rounded-3xl p-6 shadow-xl"
          >
            <View className="mb-5">
              <Text className="text-gray-700 font-medium mb-2">Phone Number</Text>

              <View className="flex-row bg-gray-100 rounded-2xl p-4 items-center">
                <Text className="text-gray-900 text-lg mr-3">+91</Text>
                <View className="w-[1px] bg-gray-400 h-6 mr-3" />
                <TextInput
                  placeholder="Enter phone number"
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  maxLength={10}
                  className="flex-1 text-gray-900"
                />
              </View>
            </View>

            {error ? (
              <Text className="text-red-500 text-center mb-2">{error}</Text>
            ) : null}

            <TouchableOpacity
              className="bg-yellow-500 py-4 rounded-2xl mt-8 items-center shadow-md active:scale-95"
              onPress={onSendOTP}
            >
              <Text className="text-white text-xl font-semibold">Send OTP</Text>
            </TouchableOpacity>

            <View className="flex-row items-center my-6">
              <View className="flex-1 h-[1px] bg-gray-300" />
              <Text className="text-gray-500 mx-3">or</Text>
              <View className="flex-1 h-[1px] bg-gray-300" />
            </View>

            <TouchableOpacity
              onPress={() => router.push("/(public)/login")}
              className="bg-white border border-gray-300 py-4 rounded-2xl items-center active:scale-95"
            >
              <Text className="text-gray-700 text-lg font-medium">Login with Email</Text>
            </TouchableOpacity>

            <View className="mt-6 flex-row justify-center">
              <Text className="text-gray-600">Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/(public)/signup")}>
                <Text className="text-yellow-600 font-semibold">Sign Up</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
