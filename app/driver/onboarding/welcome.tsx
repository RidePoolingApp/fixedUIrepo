import { View, Text, TouchableOpacity } from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function DriverWelcome() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-50">
      
      {/* PREMIUM HEADER */}
      <View className="absolute top-0 left-0 right-0">
        <Svg height="260" width="100%">
          <Path d="M0 0 H400 V140 Q200 280 0 140 Z" fill="#FACC15" />
          <Path
            d="M0 40 H400 V180 Q200 320 0 180 Z"
            fill="#FDE047"
            opacity={0.4}
          />
        </Svg>
      </View>

      {/* TITLE */}
      <View className="mt-28 px-6">
        <Text className="text-4xl font-extrabold text-gray-900">
          Become a Driver
        </Text>
        <Text className="text-gray-700 mt-2 text-base">
          Earn more with Waylink by driving your own vehicle.
        </Text>
      </View>

      {/* DRIVER ICON */}
      <View className="items-center mt-10">
        <View className="bg-yellow-100 p-10 rounded-full border-2 border-yellow-300">
          <Ionicons name="car-sport" size={80} color="#d97706" />
        </View>
      </View>

      {/* FEATURES */}
      <View className="px-6 mt-10 space-y-4">
        
        <View className="bg-white p-5 rounded-3xl shadow border border-gray-200 flex-row items-center">
          <Ionicons name="cash-outline" size={34} color="#d97706" />
          <Text className="ml-4 text-gray-900 text-lg font-semibold">
            Earn flexible income weekly
          </Text>
        </View>

        <View className="bg-white p-5 rounded-3xl shadow border border-gray-200 flex-row items-center">
          <Ionicons name="time-outline" size={34} color="#d97706" />
          <Text className="ml-4 text-gray-900 text-lg font-semibold">
            Work anytime you want
          </Text>
        </View>

        <View className="bg-white p-5 rounded-3xl shadow border border-gray-200 flex-row items-center">
          <Ionicons name="shield-checkmark-outline" size={34} color="#d97706" />
          <Text className="ml-4 text-gray-900 text-lg font-semibold">
            Trusted & safe platform
          </Text>
        </View>

      </View>

      {/* BUTTON */}
      <View className="px-6 mt-10">
        <TouchableOpacity
          onPress={() => router.push("/driver/onboarding/personal-details")}
          className="bg-yellow-500 p-5 rounded-3xl items-center shadow-lg"
          style={{ elevation: 5 }}
        >
          <Text className="text-white text-lg font-bold">Start Registration</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}
