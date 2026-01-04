import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserTypeContext } from "../../context/UserTypeContext";
import { useApi, VehicleType } from "../../services/api";

export default function Review() {
  const router = useRouter();
  const api = useApi();
  const { setUserType } = useContext(UserTypeContext);
  const [submitting, setSubmitting] = useState(false);

  const [data, setData] = useState({
    fullName: "",
    age: "",
    gender: "",
    vehicleType: "",
    make: "",
    model: "",
    year: "",
    color: "",
    number: "",
    seats: "",
    licenseNumber: "",
    licenseExpiry: "",
  });

  const [docs, setDocs] = useState({
    license: null,
    rc: null,
    insurance: null,
  });

  useEffect(() => {
    (async () => {
      const personal = await AsyncStorage.getItem("driver_personal");
      const vehicle = await AsyncStorage.getItem("driver_vehicle");
      const documents = await AsyncStorage.getItem("driver_docs");

      if (personal) {
        const parsed = JSON.parse(personal);
        setData((prev) => ({ ...prev, ...parsed }));
      }
      if (vehicle) {
        const parsed = JSON.parse(vehicle);
        setData((prev) => ({ ...prev, ...parsed }));
      }
      if (documents) setDocs(JSON.parse(documents));
    })();
  }, []);

  const mapVehicleType = (type: string): VehicleType => {
    const typeMap: { [key: string]: VehicleType } = {
      "SEDAN": VehicleType.SEDAN,
      "SUV": VehicleType.SUV,
      "HATCHBACK": VehicleType.HATCHBACK,
      "AUTO": VehicleType.AUTO,
      "BIKE": VehicleType.BIKE,
    };
    return typeMap[type] || VehicleType.SEDAN;
  };

  const submitDriver = async () => {
    setSubmitting(true);
    try {
      const licenseExpiry = data.licenseExpiry || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

      await api.registerDriver({
        licenseNumber: data.licenseNumber,
        licenseExpiry,
        vehicleType: mapVehicleType(data.vehicleType),
        vehicleMake: data.make,
        vehicleModel: data.model,
        vehicleYear: parseInt(data.year) || new Date().getFullYear(),
        vehicleColor: data.color,
        licensePlate: data.number,
      });

      await AsyncStorage.removeItem("driver_personal");
      await AsyncStorage.removeItem("driver_vehicle");
      await AsyncStorage.removeItem("driver_docs");

      setUserType("driver-approved");
      Alert.alert("Success", "Your driver profile has been created!", [
        { text: "Continue", onPress: () => router.replace("/driver/dashboard") }
      ]);
    } catch (error: any) {
      console.error("Error registering driver:", error);
      Alert.alert("Error", error.message || "Failed to register as driver. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* PREMIUM HEADER */}
      <View className="absolute top-0 left-0 right-0">
        <Svg height="260" width="100%">
          <Path d="M0 0 H400 V140 Q200 260 0 140 Z" fill="#FACC15" />
          <Path
            d="M0 40 H400 V180 Q200 320 0 180 Z"
            fill="#FDE047"
            opacity={0.4}
          />
        </Svg>
      </View>

      {/* BACK BUTTON */}
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-14 left-6 bg-white p-3 rounded-full shadow"
        style={{ elevation: 4 }}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      {/* TITLE */}
      <View className="mt-28 px-6 mb-3">
        <Text className="text-3xl font-extrabold text-gray-900">Review</Text>
        <Text className="text-gray-700 mt-1">
          Check your details before submitting
        </Text>
      </View>

      <ScrollView
        className="px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 160 }}
      >
        {/* SECTION CARD */}
        <View className="bg-white p-5 rounded-3xl shadow border border-gray-200 mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-3">
            Personal Details
          </Text>

          <Text className="text-gray-700">Name: {data.fullName}</Text>
          <Text className="text-gray-700 mt-1">Age: {data.age}</Text>
          <Text className="text-gray-700 mt-1">Gender: {data.gender}</Text>
        </View>

        <View className="bg-white p-5 rounded-3xl shadow border border-gray-200 mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-3">
            Vehicle Details
          </Text>

          <Text className="text-gray-700">Type: {data.vehicleType}</Text>
          <Text className="text-gray-700 mt-1">Model: {data.model}</Text>
          <Text className="text-gray-700 mt-1">Number: {data.number}</Text>
          <Text className="text-gray-700 mt-1">Seats: {data.seats}</Text>
        </View>

        <View className="bg-white p-5 rounded-3xl shadow border border-gray-200 mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-3">
            Uploaded Documents
          </Text>

          <Text className="text-gray-700">Driving License: ✔</Text>
          <Text className="text-gray-700 mt-1">RC Book: ✔</Text>
          <Text className="text-gray-700 mt-1">Insurance: ✔</Text>
        </View>

        {/* <View className="bg-white p-5 rounded-3xl shadow border border-gray-200 mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-3">
            Bank Details
          </Text>

          <Text className="text-gray-700">
            Account Holder: {bank.holderName}
          </Text>
          <Text className="text-gray-700 mt-1">
            Account No: {bank.accountNumber}
          </Text>
          <Text className="text-gray-700 mt-1">IFSC: {bank.ifsc}</Text>
          {bank.upi ? (
            <Text className="text-gray-700 mt-1">UPI: {bank.upi}</Text>
          ) : null}
        </View> */}

        {/* SUBMIT BUTTON */}
        <TouchableOpacity
          onPress={submitDriver}
          disabled={submitting}
          className={`p-5 rounded-3xl items-center shadow-lg ${submitting ? "bg-yellow-400" : "bg-yellow-500"}`}
          style={{ elevation: 6 }}
        >
          {submitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-lg font-bold">
              Submit & Become Driver
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
