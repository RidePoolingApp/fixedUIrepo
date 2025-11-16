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
