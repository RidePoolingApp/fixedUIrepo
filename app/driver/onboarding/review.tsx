import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext } from "react";
import { UserTypeContext } from "../../context/UserTypeContext";

export default function Review() {
  const router = useRouter();
  const { setUserType } = useContext(UserTypeContext);

  const [data, setData] = useState({
    fullName: "",
    age: "",
    gender: "",
    vehicleType: "",
    model: "",
    number: "",
    seats: "",
  });

  const [docs, setDocs] = useState({
    license: null,
    rc: null,
    insurance: null,
  });

//   const [bank, setBank] = useState({
//     holderName: "",
//     accountNumber: "",
//     ifsc: "",
//     upi: "",
//   });

  // Fetching onboarding data from storage or API
  useEffect(() => {
    (async () => {
      // If you saved previous onboarding data in AsyncStorage, load here
      const personal = await AsyncStorage.getItem("driver_personal");
      const vehicle = await AsyncStorage.getItem("driver_vehicle");
      const documents = await AsyncStorage.getItem("driver_docs");
    //   const bankInfo = await AsyncStorage.getItem("driver_bank");

      if (personal) setData(JSON.parse(personal));
      if (vehicle) setData((prev) => ({ ...prev, ...JSON.parse(vehicle) }));
      if (documents) setDocs(JSON.parse(documents));
    //   if (bankInfo) setBank(JSON.parse(bankInfo));
    })();
  }, []);

  const submitDriver = async () => {
    // mark user as driver
    setUserType("driver-approved");

    // redirect
    router.replace("/driver/dashboard");
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
          className="bg-yellow-500 p-5 rounded-3xl items-center shadow-lg"
          style={{ elevation: 6 }}
        >
          <Text className="text-white text-lg font-bold">
            Submit & Become Driver
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
