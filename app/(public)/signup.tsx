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
import { useEffect, useRef, useState, useCallback } from "react";
import { useSignUp, useSSO } from "@clerk/clerk-expo";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp, setActive, isLoaded } = useSignUp();
  const { startSSOFlow } = useSSO();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  
  const [passwordVisible, setPasswordVisible] = useState(false);

  const onGoogleSignUp = useCallback(async () => {
    try {
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
      setError(err.errors?.[0]?.message || "Google sign up failed");
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

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress: email,
        password,
        firstName: fullName.split(" ")[0],
        lastName: fullName.split(" ").slice(1).join(" ") || undefined,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Sign up failed");
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) return;

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace("/(profile)/create-profile");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Verification failed");
    }
  };

  if (pendingVerification) {
    return (
      <View className="flex-1 bg-white">
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
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
            className="mb-10"
          >
            <Text className="text-4xl font-extrabold text-gray-900 text-center">
              Verify Email
            </Text>
            <Text className="text-gray-600 text-center mt-2">
              Enter the code sent to {email}
            </Text>
          </Animated.View>

          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
            className="bg-white rounded-3xl p-6 shadow-xl"
          >
            <View className="mb-5">
              <Text className="text-gray-700 font-medium mb-2">Verification Code</Text>
              <TextInput
                placeholder="Enter 6-digit code"
                placeholderTextColor="#999"
                keyboardType="number-pad"
                value={code}
                onChangeText={setCode}
                className="bg-gray-100 p-4 rounded-2xl text-gray-900"
              />
            </View>

            {error ? (
              <Text className="text-red-500 text-center mb-2">{error}</Text>
            ) : null}

            <TouchableOpacity
              className="bg-yellow-500 py-4 rounded-2xl mt-8 items-center shadow-md active:scale-95"
              onPress={onPressVerify}
            >
              <Text className="text-white text-xl font-semibold">
                Verify Email
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
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

        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
          className="bg-white rounded-3xl p-6 shadow-xl"
        >
          <View className="mb-5">
            <Text className="text-gray-700 font-medium mb-2">Full Name</Text>
            <TextInput
              placeholder="Enter your full name"
              placeholderTextColor="#999"
              value={fullName}
              onChangeText={setFullName}
              className="bg-gray-100 p-4 rounded-2xl text-gray-900"
            />
          </View>

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

          <View className="mb-5">
            <Text className="text-gray-700 font-medium mb-2">Password</Text>

            <View className="flex-row items-center bg-gray-100 rounded-2xl p-4">
              <TextInput
                placeholder="Enter password"
                placeholderTextColor="#999"
                secureTextEntry={!passwordVisible}
                value={password}
                onChangeText={setPassword}
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

          {error ? (
            <Text className="text-red-500 text-center mb-2">{error}</Text>
          ) : null}

          <TouchableOpacity
            className="bg-yellow-500 py-4 rounded-2xl mt-8 items-center shadow-md active:scale-95"
            onPress={onSignUpPress}
          >
            <Text className="text-white text-xl font-semibold">
              Sign Up
            </Text>
          </TouchableOpacity>

          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="mx-4 text-gray-500">OR</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          <TouchableOpacity
            className="bg-white border-2 border-gray-300 py-4 rounded-2xl items-center shadow-md active:scale-95 flex-row justify-center"
            onPress={onGoogleSignUp}
          >
            <Text className="text-gray-700 text-xl font-semibold">Continue with Google</Text>
          </TouchableOpacity>

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
