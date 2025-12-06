// app/login.tsx
import { View, Text, TouchableOpacity, TextInput, StatusBar, Animated } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useSignIn, useOAuth } from "@clerk/clerk-expo";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, setActive, isLoaded } = useSignIn();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");

  const onGoogleSignIn = async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        router.replace("/home");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Google sign in failed");
    }
  };

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
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
          className="mb-10"
        >
          <Text className="text-4xl font-extrabold text-gray-900 text-center">
            Login to continue
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
          {/* Email Input */}
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

          {/* Password Input */}
          <View className="mb-3">
            <Text className="text-gray-700 font-medium mb-2">Password</Text>

            <View className="flex-row items-center bg-gray-100 rounded-2xl p-4">
              <TextInput
                placeholder="Enter your password"
                placeholderTextColor="#999"
                secureTextEntry={!passwordVisible}
                value={password}
                onChangeText={setPassword}
                className="flex-1 text-gray-900"
              />

              <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                <Text className="text-gray-600 text-lg">
                  {passwordVisible ? "🙈" : "👁️"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity
            onPress={() => router.push("/(public)/forgot-password")}
            className="self-end mt-2"
          >
            <Text className="text-yellow-600 font-semibold">Forgot Password?</Text>
          </TouchableOpacity>

          {error ? (
            <Text className="text-red-500 text-center mb-2">{error}</Text>
          ) : null}

          {/* Login Button */}
          <TouchableOpacity
            className="bg-yellow-500 py-4 rounded-2xl mt-8 items-center shadow-md active:scale-95"
            onPress={async () => {
              if (!isLoaded) return;

              try {
                const result = await signIn.create({
                  identifier: email,
                  password,
                });

                if (result.status === "complete") {
                  await setActive({ session: result.createdSessionId });
                  router.replace("/home");
                }
              } catch (err: any) {
                setError(err.errors?.[0]?.message || "Login failed");
              }
            }}
          >
            <Text className="text-white text-xl font-semibold">Login</Text>
          </TouchableOpacity>

          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="mx-4 text-gray-500">OR</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          <TouchableOpacity
            className="bg-white border-2 border-gray-300 py-4 rounded-2xl items-center shadow-md active:scale-95 flex-row justify-center"
            onPress={onGoogleSignIn}
          >
            <Text className="text-gray-700 text-xl font-semibold">Continue with Google</Text>
          </TouchableOpacity>

          {/* Sign Up Navigation */}
          <View className="mt-6 flex-row justify-center">
            <Text className="text-gray-600">Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/(public)/signup")}>
              <Text className="text-yellow-600 font-semibold">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}
