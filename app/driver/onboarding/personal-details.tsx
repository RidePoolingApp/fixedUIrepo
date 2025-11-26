import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function PersonalDetails() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");

  return (
    <View className="flex-1 bg-gray-50">
      {/* PREMIUM YELLOW HEADER */}
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

      {/* BACK BUTTON */}
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-14 left-6 bg-white p-3 rounded-full shadow"
        style={{ elevation: 4 }}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      {/* TITLE */}
      <View className="mt-28 px-6">
        <Text className="text-3xl font-extrabold text-gray-900">
          Personal Details
        </Text>
        <Text className="text-gray-700 mt-1">
          Tell us about yourself to continue
        </Text>
      </View>

      {/* FORM */}
      <ScrollView
        className="px-6 mt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 150 }}
      >
        {/* Full Name Input */}
        <View className="bg-white p-5 rounded-3xl shadow border border-gray-200 mb-4">
          <Text className="text-gray-800 font-semibold mb-2">Full Name</Text>
          <TextInput
            placeholder="Enter your full name"
            placeholderTextColor="#999"
            value={fullName}
            onChangeText={setFullName}
            className="text-gray-900 text-base"
          />
        </View>

        {/* Age */}
        <View className="bg-white p-5 rounded-3xl shadow border border-gray-200 mb-4">
          <Text className="text-gray-800 font-semibold mb-2">Age</Text>
          <TextInput
            placeholder="Enter your age"
            placeholderTextColor="#999"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
            className="text-gray-900 text-base"
          />
        </View>

        {/* Gender Selector */}
        <View className="bg-white p-5 rounded-3xl shadow border border-gray-200 mb-4">
          <Text className="text-gray-800 font-semibold mb-3">Gender</Text>

          <View className="flex-row justify-between">
            {["Male", "Female", "Other"].map((item) => {
              const selected = gender === item;

              return (
                <TouchableOpacity
                  key={item}
                  onPress={() => setGender(item)}
                  className={`px-6 py-3 rounded-2xl border ${
                    selected
                      ? "bg-yellow-500 border-yellow-600"
                      : "border-gray-300 bg-gray-100"
                  }`}
                >
                  <Text
                    className={`font-semibold ${
                      selected ? "text-white" : "text-gray-700"
                    }`}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* NEXT BUTTON */}
        <TouchableOpacity
          onPress={() => router.push("/driver/onboarding/vehicle")}
          disabled={!fullName || !age || !gender}
          className={`p-5 rounded-3xl items-center mt-4 ${
            fullName && age && gender
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
