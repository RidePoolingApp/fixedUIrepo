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
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function VehicleDetails() {
  const router = useRouter();

  const [vehicleType, setVehicleType] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [color, setColor] = useState("");
  const [number, setNumber] = useState("");
  const [seats, setSeats] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseExpiry, setLicenseExpiry] = useState("");

  const isValid = vehicleType && make && model && year && color && number && licenseNumber;

  const handleNext = async () => {
    await AsyncStorage.setItem("driver_vehicle", JSON.stringify({
      vehicleType,
      make,
      model,
      year,
      color,
      number,
      seats,
      licenseNumber,
      licenseExpiry,
    }));
    router.push("/driver/onboarding/documents");
  };

  return (
    <View className="flex-1 bg-gray-50">

      <View className="absolute top-0 left-0 right-0">
        <Svg height="260" width="100%">
          <Path d="M0 0 H400 V140 Q200 260 0 140 Z" fill="#FACC15" />
          <Path d="M0 40 H400 V180 Q200 320 0 180 Z" fill="#FDE047" opacity={0.4} />
        </Svg>
      </View>

      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-14 left-6 bg-white p-3 rounded-full shadow"
        style={{ elevation: 5 }}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <View className="mt-28 px-6">
        <Text className="text-3xl font-extrabold text-gray-900">
          Vehicle Details
        </Text>
        <Text className="text-gray-700 mt-1">
          Tell us about your vehicle and license
        </Text>
      </View>

      <ScrollView
        className="px-6 mt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 150 }}
      >

        <View className="bg-white p-5 rounded-3xl shadow border border-gray-200 mb-4">
          <Text className="text-gray-800 font-semibold mb-3">
            Vehicle Type
          </Text>

          <View className="flex-row justify-between">
            {[
              { key: "SEDAN", label: "Sedan", icon: "car-sport-outline" },
              { key: "SUV", label: "SUV", icon: "car-estate" },
              { key: "HATCHBACK", label: "Hatch", icon: "car-hatchback" },
            ].map(({ key, label, icon }) => (
              <TouchableOpacity
                key={key}
                onPress={() => setVehicleType(key)}
                className={`px-4 py-3 rounded-2xl border flex-row items-center 
                  ${vehicleType === key ? "bg-yellow-500 border-yellow-600" : "bg-gray-100 border-gray-300"}`}
              >
                {icon.includes("estate") || icon.includes("hatchback") ? (
                  <MaterialCommunityIcons name={icon as any} size={24} color={vehicleType === key ? "#fff" : "#555"} />
                ) : (
                  <Ionicons name={icon as any} size={24} color={vehicleType === key ? "#fff" : "#555"} />
                )}
                <Text className={`ml-2 font-semibold ${vehicleType === key ? "text-white" : "text-gray-700"}`}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="bg-white p-5 rounded-3xl shadow border border-gray-200 mb-4">
          <Text className="text-gray-800 font-semibold mb-2">Vehicle Make</Text>
          <TextInput
            placeholder="Example: Maruti, Honda, Hyundai"
            placeholderTextColor="#aaa"
            value={make}
            onChangeText={setMake}
            className="text-gray-900 text-base"
          />
        </View>

        <View className="bg-white p-5 rounded-3xl shadow border border-gray-200 mb-4">
          <Text className="text-gray-800 font-semibold mb-2">Model Name</Text>
          <TextInput
            placeholder="Example: Swift Dzire, City, i20"
            placeholderTextColor="#aaa"
            value={model}
            onChangeText={setModel}
            className="text-gray-900 text-base"
          />
        </View>

        <View className="flex-row mb-4">
          <View className="flex-1 bg-white p-5 rounded-3xl shadow border border-gray-200 mr-2">
            <Text className="text-gray-800 font-semibold mb-2">Year</Text>
            <TextInput
              placeholder="2020"
              placeholderTextColor="#aaa"
              keyboardType="numeric"
              value={year}
              onChangeText={setYear}
              className="text-gray-900 text-base"
            />
          </View>
          <View className="flex-1 bg-white p-5 rounded-3xl shadow border border-gray-200 ml-2">
            <Text className="text-gray-800 font-semibold mb-2">Color</Text>
            <TextInput
              placeholder="White"
              placeholderTextColor="#aaa"
              value={color}
              onChangeText={setColor}
              className="text-gray-900 text-base"
            />
          </View>
        </View>

        <View className="bg-white p-5 rounded-3xl shadow border border-gray-200 mb-4">
          <Text className="text-gray-800 font-semibold mb-2">License Plate Number</Text>
          <TextInput
            placeholder="KA 05 AB 1234"
            placeholderTextColor="#aaa"
            value={number}
            onChangeText={setNumber}
            autoCapitalize="characters"
            className="text-gray-900 text-base"
          />
        </View>

        <View className="bg-white p-5 rounded-3xl shadow border border-gray-200 mb-4">
          <Text className="text-gray-800 font-semibold mb-2">Driving License Number</Text>
          <TextInput
            placeholder="KA0520200012345"
            placeholderTextColor="#aaa"
            value={licenseNumber}
            onChangeText={setLicenseNumber}
            autoCapitalize="characters"
            className="text-gray-900 text-base"
          />
        </View>

        <View className="bg-white p-5 rounded-3xl shadow border border-gray-200 mb-4">
          <Text className="text-gray-800 font-semibold mb-2">License Expiry Date</Text>
          <TextInput
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#aaa"
            value={licenseExpiry}
            onChangeText={setLicenseExpiry}
            className="text-gray-900 text-base"
          />
        </View>

        <TouchableOpacity
          onPress={handleNext}
          disabled={!isValid}
          className={`p-5 rounded-3xl items-center mt-4 ${
            isValid ? "bg-yellow-500" : "bg-gray-300"
          }`}
          style={{ elevation: 5 }}
        >
          <Text className="text-white text-lg font-bold">Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
