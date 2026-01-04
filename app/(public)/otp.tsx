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
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useSignUp, useSignIn } from "@clerk/clerk-expo";

export default function OTPVerification() {
  const router = useRouter();
  const params = useLocalSearchParams<{ type?: string; email?: string; phone?: string }>();
  
  const { signUp, setActive: setSignUpActive, isLoaded: isSignUpLoaded } = useSignUp();
  const { signIn, setActive: setSignInActive, isLoaded: isSignInLoaded } = useSignIn();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  const isSignUp = params.type === "signup";
  const identifier = params.email || params.phone || "";

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

  const onVerify = async () => {
    try {
      if (isSignUp && isSignUpLoaded && signUp) {
        const result = await signUp.attemptEmailAddressVerification({ code });
        if (result.status === "complete") {
          await setSignUpActive({ session: result.createdSessionId });
          router.replace("/(profile)/create-profile");
        }
      } else if (isSignInLoaded && signIn) {
        const result = await signIn.attemptFirstFactor({
          strategy: "email_code",
          code,
        });
        if (result.status === "complete") {
          await setSignInActive({ session: result.createdSessionId });
          router.replace("/home");
        }
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Verification failed");
    }
  };

  const onResend = async () => {
    try {
      setError("");
      if (isSignUp && isSignUpLoaded && signUp) {
        await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      } else if (isSignInLoaded && signIn) {
        await signIn.prepareFirstFactor({
          strategy: "email_code",
          emailAddressId: signIn.supportedFirstFactors?.find(
            (f) => f.strategy === "email_code" && "emailAddressId" in f
          )?.emailAddressId as string,
        });
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Failed to resend code");
    }
  };

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
              Enter the code sent to {identifier}
            </Text>
          </Animated.View>

          <Animated.View
            style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
            className="bg-white rounded-3xl p-6 shadow-xl items-center"
          >
            <View className="w-full mb-5">
              <Text className="text-gray-700 font-medium mb-2 text-center">
                Verification Code
              </Text>
              <TextInput
                placeholder="Enter 6-digit code"
                placeholderTextColor="#999"
                keyboardType="number-pad"
                value={code}
                onChangeText={setCode}
                maxLength={6}
                className="bg-gray-100 p-4 rounded-2xl text-gray-900 text-center text-2xl tracking-widest"
              />
            </View>

            {error ? (
              <Text className="text-red-500 text-center mb-2">{error}</Text>
            ) : null}

            <View className="flex-row justify-center mt-4">
              <Text className="text-gray-600">Didn't receive code? </Text>
              <TouchableOpacity onPress={onResend}>
                <Text className="text-yellow-600 font-semibold">Resend</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              className="bg-yellow-500 py-4 rounded-2xl mt-8 w-full items-center shadow-md active:scale-95"
              onPress={onVerify}
            >
              <Text className="text-white text-xl font-semibold">Verify</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
