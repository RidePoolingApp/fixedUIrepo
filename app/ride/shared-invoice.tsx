// app/ride/shared-invoice.tsx
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function SharedInvoice() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-50">

      {/* HEADER */}
      <View className="absolute top-0 left-0 right-0">
        <Svg height="220" width="100%">
          <Path d="M0 0 H400 V120 Q200 220 0 120 Z" fill="#FACC15" />
          <Path d="M0 30 H400 V150 Q200 260 0 150 Z" fill="#FDE047" opacity={0.5} />
        </Svg>
      </View>

      <TouchableOpacity
        onPress={() => router.replace("/ride/shared-history")}
        className="absolute top-14 left-6 bg-white p-3 rounded-full shadow"
      >
        <Ionicons name="home" size={24} color="#333" />
      </TouchableOpacity>

      <View className="mt-32 px-6">
        <Text className="text-3xl font-extrabold text-gray-900">
          Ride Completed
        </Text>
        <Text className="text-gray-700 mt-1">Your invoice is ready</Text>
      </View>

      <ScrollView
        className="px-6 mt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 150 }}
      >
        {/* FARE SUMMARY */}
        <View className="bg-white rounded-3xl p-6 shadow border border-gray-200">
          <Text className="text-xl font-bold text-gray-900">Fare Summary</Text>

          <View className="mt-4 space-y-3">
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Base Fare</Text>
              <Text className="text-gray-900 font-semibold">₹120</Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-gray-600">Shared Savings</Text>
              <Text className="text-green-600 font-semibold">−₹31</Text>
            </View>

            <View className="flex-row justify-between mt-2">
              <Text className="text-gray-900 font-bold">Total Paid</Text>
              <Text className="text-yellow-600 text-3xl font-extrabold">₹89</Text>
            </View>
          </View>
        </View>

        {/* ROUTE DETAILS */}
        <View className="bg-white rounded-3xl p-6 mt-6 shadow border">
          <Text className="text-xl font-bold text-gray-900">Route</Text>

          <View className="mt-4 space-y-4">
            <View className="flex-row items-center">
              <Ionicons name="location" size={24} color="#FACC15" />
              <Text className="ml-3 text-gray-900">HSR Layout</Text>
            </View>

            <View className="flex-row items-center ml-2">
              <Ionicons name="ellipsis-vertical" size={24} color="#999" />
              <Text className="ml-3 text-gray-500">Shared Pickup / Drop Stops</Text>
            </View>

            <View className="flex-row items-center">
              <Ionicons name="flag" size={24} color="#FACC15" />
              <Text className="ml-3 text-gray-900">MG Road</Text>
            </View>
          </View>
        </View>

        {/* DOWNLOAD */}
        <TouchableOpacity
          className="bg-yellow-500 p-5 rounded-3xl items-center mt-10 shadow"
          onPress={() => alert("Receipt Downloaded")}
        >
          <Text className="text-white font-bold text-lg">Download Receipt</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
