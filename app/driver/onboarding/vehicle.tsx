import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function VehicleDetails() {
  const router = useRouter();

  const [type, setType] = useState("");
  const [model, setModel] = useState("");
  const [number, setNumber] = useState("");
  const [seats, setSeats] = useState("");

  return (
    <View className="flex-1 bg-gray-50">

      {/* HEADER */}
      <View className="absolute top-0 left-0 right-0">
        <Svg height="260" width="100%">
          <Path d="M0 0 H400 V140 Q200 260 0 140 Z" fill="#FACC15" />
          <Path d="M0 40 H400 V180 Q200 320 0 180 Z" fill="#FDE047" opacity={0.4} />
        </Svg>
      </View>

      {/* BACK BUTTON */}
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-14 left-6 bg-white p-3 rounded-full shadow"
        style={{ elevation: 5 }}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      {/* TITLE */}
      <View className="mt-28 px-6">
        <Text className="text-3xl font-extrabold text-gray-900">
          Vehicle Details
        </Text>
        <Text className="text-gray-700 mt-1">
          Tell us about the vehicle you drive
        </Text>
      </View>

      <ScrollView
        className="px-6 mt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 150 }}
      >

        {/* VEHICLE TYPE */}
        <View className="bg-white p-5 rounded-3xl shadow border border-gray-200 mb-4">
          <Text className="text-gray-800 font-semibold mb-3">
            Vehicle Type
          </Text>

          <View className="flex-row justify-between">

            {/* Sedan */}
            <TouchableOpacity
              onPress={() => setType("Sedan")}
              className={`px-6 py-3 rounded-2xl border flex-row items-center 
                ${type === "Sedan" ? "bg-yellow-500 border-yellow-600" : "bg-gray-100 border-gray-300"}`}
            >
              <Ionicons name="car-sport-outline" size={24} color={type === "Sedan" ? "#fff" : "#555"} />
              <Text className={`ml-2 font-semibold ${type === "Sedan" ? "text-white" : "text-gray-700"}`}>
                Sedan
              </Text>
            </TouchableOpacity>

            {/* SUV */}
            <TouchableOpacity
              onPress={() => setType("SUV")}
              className={`px-6 py-3 rounded-2xl border flex-row items-center 
                ${type === "SUV" ? "bg-yellow-500 border-yellow-600" : "bg-gray-100 border-gray-300"}`}
            >
              <MaterialCommunityIcons name="car-estate" size={24} color={type === "SUV" ? "#fff" : "#555"} />
              <Text className={`ml-2 font-semibold ${type === "SUV" ? "text-white" : "text-gray-700"}`}>
                SUV
              </Text>
            </TouchableOpacity>

            {/* Hatchback */}
            <TouchableOpacity
              onPress={() => setType("Hatchback")}
              className={`px-6 py-3 rounded-2xl border flex-row items-center 
                ${type === "Hatchback" ? "bg-yellow-500 border-yellow-600" : "bg-gray-100 border-gray-300"}`}
            >
              <MaterialCommunityIcons name="car-hatchback" size={24} color={type === "Hatchback" ? "#fff" : "#555"} />
              <Text className={`ml-2 font-semibold ${type === "Hatchback" ? "text-white" : "text-gray-700"}`}>
                Hatch
              </Text>
            </TouchableOpacity>

          </View>
        </View>

        {/* MODEL NAME */}
        <View className="bg-white p-5 rounded-3xl shadow border border-gray-200 mb-4">
          <Text className="text-gray-800 font-semibold mb-2">Model Name</Text>
          <TextInput
            placeholder="Example: Swift Dzire, Honda City"
            placeholderTextColor="#aaa"
            value={model}
            onChangeText={setModel}
            className="text-gray-900 text-base"
          />
        </View>

        {/* VEHICLE NUMBER */}
        <View className="bg-white p-5 rounded-3xl shadow border border-gray-200 mb-4">
          <Text className="text-gray-800 font-semibold mb-2">Vehicle Number</Text>
          <TextInput
            placeholder="Example: KA 05 AB 1234"
            placeholderTextColor="#aaa"
            value={number}
            onChangeText={setNumber}
            className="text-gray-900 text-base uppercase"
          />
        </View>

        {/* SEATS */}
        <View className="bg-white p-5 rounded-3xl shadow border border-gray-200 mb-4">
          <Text className="text-gray-800 font-semibold mb-2">Number of Seats</Text>
          <TextInput
            placeholder="Example: 4"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            value={seats}
            onChangeText={setSeats}
            className="text-gray-900 text-base"
          />
        </View>

        {/* NEXT BUTTON */}
        <TouchableOpacity
          onPress={() => router.push("/driver/onboarding/documents")}
          disabled={!type || !model || !number || !seats}
          className={`p-5 rounded-3xl items-center mt-4 ${
            type && model && number && seats
              ? "bg-yellow-500"
              : "bg-gray-300"
          }`}
          style={{ elevation: 5 }}
        >
          <Text className="text-white text-lg font-bold">Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
