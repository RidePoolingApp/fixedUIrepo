// app/book.tsx
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import BottomNav from "./components/BottomNav";

export default function BookHub() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-50">

      {/* HEADER */}
      <View className="bg-yellow-400 py-16 px-6 rounded-b-3xl shadow-lg">
        <Text className="text-3xl font-extrabold text-gray-900">Book a Ride</Text>
        <Text className="text-gray-700 mt-1">
          Choose the service that fits your travel
        </Text>
      </View>

      <ScrollView
        className="px-6 mt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >

        {/* FIND DRIVERS */}
        <TouchableOpacity
          onPress={() => router.push("/find-drivers")}
          className="bg-white p-6 rounded-3xl shadow border border-yellow-400 mb-5"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="w-12 h-12 rounded-full bg-yellow-100 items-center justify-center">
                <Ionicons name="car-sport" size={28} color="#d97706" />
              </View>
              <View className="ml-4">
                <Text className="text-xl font-bold text-gray-900">Find Drivers</Text>
                <Text className="text-gray-600 mt-1">
                  See available drivers nearby
                </Text>
              </View>
            </View>
            <View className="bg-green-100 px-3 py-1 rounded-full">
              <Text className="text-green-700 text-xs font-semibold">Live</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* LONG TRIP */}
        <TouchableOpacity
          onPress={() => router.push("/long-trip")}
          className="bg-white p-6 rounded-3xl shadow border border-gray-200 mb-5"
        >
          <FontAwesome5 name="route" size={36} color="#333" />
          <Text className="text-xl font-bold text-gray-900 mt-3">Long Trip</Text>
          <Text className="text-gray-600 mt-1">
            Outstation travel made easy.
          </Text>
        </TouchableOpacity>

        {/* SHARING */}
        <TouchableOpacity
          onPress={() => router.push("/sharing")}
          className="bg-white p-6 rounded-3xl shadow border border-gray-200 mb-5"
        >
          <Ionicons name="people-outline" size={36} color="#333" />
          <Text className="text-xl font-bold text-gray-900 mt-3">Sharing Ride</Text>
          <Text className="text-gray-600 mt-1">Affordable shared commute.</Text>
        </TouchableOpacity>

        {/* DAILY CAB */}
        <TouchableOpacity
          onPress={() => router.push("/daily-cab")}
          className="bg-white p-6 rounded-3xl shadow border border-gray-200 mb-5"
        >
          <FontAwesome5 name="taxi" size={36} color="#333" />
          <Text className="text-xl font-bold text-gray-900 mt-3">
            Daily Fixed Cab
          </Text>
          <Text className="text-gray-600 mt-1">
            Your everyday commute at a fixed time.
          </Text>
        </TouchableOpacity>

      </ScrollView>

      {/* NAVBAR */}
      <BottomNav />
    </View>
  );
}
