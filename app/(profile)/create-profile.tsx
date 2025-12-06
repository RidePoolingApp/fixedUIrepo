// app/create-profile.tsx
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Animated,
  Image,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/clerk-expo";

export default function CreateProfile() {
  const router = useRouter();
  const { user } = useUser();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.primaryEmailAddress?.emailAddress || "");
  const [phone, setPhone] = useState(user?.primaryPhoneNumber?.phoneNumber || "");
  const [gender, setGender] = useState("Male");

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
          className="mb-8 items-center"
        >
          <Text className="text-4xl font-extrabold text-gray-900">
            Set Your Profile
          </Text>
          <Text className="text-gray-600 mt-2 text-center">
            Complete your profile details before you continue
          </Text>
        </Animated.View>

        {/* Card */}
        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
          className="bg-white rounded-3xl p-6 shadow-xl"
        >
          {/* Profile Picture */}
          <View className="items-center mb-6">
            {user?.imageUrl ? (
              <Image
                source={{ uri: user.imageUrl }}
                className="w-28 h-28 rounded-full"
              />
            ) : (
              <TouchableOpacity className="w-28 h-28 bg-gray-200 rounded-full items-center justify-center shadow">
                <Text className="text-3xl">📷</Text>
              </TouchableOpacity>
            )}
            <Text className="text-yellow-600 font-semibold mt-2">
              {user?.imageUrl ? "Change Photo" : "Add Photo"}
            </Text>
          </View>

          {/* Full Name */}
          <View className="mb-5">
            <Text className="text-gray-700 font-medium mb-2">Full Name</Text>
            <TextInput
              placeholder="John Doe"
              placeholderTextColor="#999"
              value={fullName}
              onChangeText={setFullName}
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
              value={email}
              onChangeText={setEmail}
              editable={!user?.primaryEmailAddress?.emailAddress}
              className="bg-gray-100 p-4 rounded-2xl text-gray-900"
            />
          </View>

          {/* Phone */}
          <View className="mb-5">
            <Text className="text-gray-700 font-medium mb-2">Phone Number</Text>
            <View className="bg-gray-100 p-4 rounded-2xl">
              <TextInput
                placeholder="+91 XXXXX XXXXX"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                className="text-gray-900"
              />
            </View>
          </View>

          {/* Gender */}
          <View className="mb-5">
            <Text className="text-gray-700 font-medium mb-2">Gender</Text>

            <View className="flex-row space-x-3">
              {["Male", "Female", "Other"].map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => setGender(item)}
                  className={`px-4 py-2 rounded-2xl border ${
                    gender === item
                      ? "bg-yellow-500 border-yellow-500"
                      : "bg-gray-100 border-gray-300"
                  }`}
                >
                  <Text
                    className={`${
                      gender === item ? "text-white" : "text-gray-700"
                    } font-medium`}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Continue */}
          <TouchableOpacity
            className="bg-yellow-500 py-4 rounded-2xl mt-8 items-center shadow-md active:scale-95"
            onPress={() => router.push("/profile-success")}
          >
            <Text className="text-white text-xl font-semibold">
              Save & Continue
            </Text>
          </TouchableOpacity>



        </Animated.View>
      </View>
    </View>
  );
}
