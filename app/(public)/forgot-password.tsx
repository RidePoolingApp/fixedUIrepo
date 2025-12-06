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

export default function ForgotPassword() {
  const router = useRouter();
  const { signIn, isLoaded } = useSignIn();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();
  }, []);

  const onRequestReset = async () => {
    if (!isLoaded) return;
    
    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      setSuccessfulCreation(true);
      setError("");
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Failed to send reset code");
    }
  };

  const onReset = async () => {
    if (!isLoaded) return;
    
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      });

      if (result.status === "complete") {
        setError("");
        router.replace("/(public)/login");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Failed to reset password");
    }
  };

  if (successfulCreation) {
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
              className="mb-10 items-center"
            >
              <Text className="text-4xl font-extrabold text-gray-900">
                Reset Password
              </Text>
              <Text className="text-gray-600 mt-2 text-center px-4">
                Enter the code sent to {email} and your new password
              </Text>
            </Animated.View>

            <Animated.View
              style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
              className="bg-white rounded-3xl p-6 shadow-xl"
            >
              <View className="mb-5">
                <Text className="text-gray-700 font-medium mb-2">Reset Code</Text>
                <TextInput
                  placeholder="Enter 6-digit code"
                  placeholderTextColor="#999"
                  keyboardType="number-pad"
                  value={code}
                  onChangeText={setCode}
                  className="bg-gray-100 p-4 rounded-2xl text-gray-900"
                />
              </View>

              <View className="mb-5">
                <Text className="text-gray-700 font-medium mb-2">New Password</Text>
                <TextInput
                  placeholder="Enter new password"
                  placeholderTextColor="#999"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  className="bg-gray-100 p-4 rounded-2xl text-gray-900"
                />
              </View>

              {error ? (
                <Text className="text-red-500 text-center mb-2">{error}</Text>
              ) : null}

              <TouchableOpacity
                className="bg-yellow-500 py-4 rounded-2xl mt-6 items-center shadow-md active:scale-95"
                onPress={onReset}
              >
                <Text className="text-white text-xl font-semibold">
                  Reset Password
                </Text>
              </TouchableOpacity>

              <View className="mt-6 flex-row justify-center">
                <Text className="text-gray-600">Remember your password? </Text>
                <TouchableOpacity onPress={() => router.push("/(public)/login")}>
                  <Text className="text-yellow-600 font-semibold">Login</Text>
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
            className="mb-10 items-center"
          >
            <Text className="text-4xl font-extrabold text-gray-900">
              Forgot Password?
            </Text>
            <Text className="text-gray-600 mt-2 text-center px-4">
              Don't worry! Enter your registered email  
              and we'll send you a reset code.
            </Text>
          </Animated.View>

          <Animated.View
            style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
            className="bg-white rounded-3xl p-6 shadow-xl"
          >
            <View className="mb-5">
              <Text className="text-gray-700 font-medium mb-2">Email</Text>
              <TextInput
                placeholder="example@domain.com"
                placeholderTextColor="#999"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                className="bg-gray-100 p-4 rounded-2xl text-gray-900"
              />
            </View>

            {error ? (
              <Text className="text-red-500 text-center mb-2">{error}</Text>
            ) : null}

            <TouchableOpacity
              className="bg-yellow-500 py-4 rounded-2xl mt-6 items-center shadow-md active:scale-95"
              onPress={onRequestReset}
            >
              <Text className="text-white text-xl font-semibold">
                Send Reset Code
              </Text>
            </TouchableOpacity>

            <View className="mt-6 flex-row justify-center">
              <Text className="text-gray-600">Remember your password? </Text>
              <TouchableOpacity onPress={() => router.push("/(public)/login")}>
                <Text className="text-yellow-600 font-semibold">Login</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
