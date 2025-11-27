import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  TextInput,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function DriverProfile() {
  const router = useRouter();
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("John Doe");
  const [phone, setPhone] = useState("+91 9876543210");
  const [email, setEmail] = useState("john@example.com");
  const [model, setModel] = useState("Toyota Camry");
  const [plate, setPlate] = useState("ABC 123");
  const [color, setColor] = useState("White");

  return (
    <View className={`flex-1 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* YELLOW HEADER */}
      <View className="absolute top-0 left-0 right-0">
        <Svg height="200" width="100%">
          <Path d="M0 0 H400 V120 Q200 220 0 120 Z" fill={isDark ? "#1F2937" : "#FACC15"} />
          <Path
            d="M0 30 H400 V140 Q200 240 0 140 Z"
            fill={isDark ? "#374151" : "#FDE047"}
            opacity={0.5}
          />
        </Svg>
      </View>

      {/* HEADER BAR */}
      <View className="mt-16 px-6 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Ionicons name="arrow-back" size={24} color={isDark ? "#fff" : "#333"} />
        </TouchableOpacity>
        <Text className={`text-2xl font-extrabold ml-4 ${isDark ? "text-white" : "text-gray-900"}`}>
          Driver Profile
        </Text>
      </View>

      <ScrollView
        className="px-6 mt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >

        {/* PROFILE CARD */}
        <View
          className={`p-6 rounded-3xl shadow ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
          style={{ elevation: 4 }}
        >
          <View className="items-center">
            <Image
              source={{ uri: "https://via.placeholder.com/100" }}
              className="w-20 h-20 rounded-full"
            />
            {editMode ? (
              <TextInput
                value={name}
                onChangeText={setName}
                placeholderTextColor={isDark ? "#bbb" : "#666"}
                className={`text-xl font-bold mt-3 text-center ${isDark ? "text-white" : "text-gray-900"}`}
              />
            ) : (
              <Text className={`text-xl font-bold mt-3 ${isDark ? "text-white" : "text-gray-900"}`}>
                {name}
              </Text>
            )}
            <Text className={`text-sm ${isDark ? "text-gray-300" : "text-gray-500"}`}>
              Driver ID: 12345
            </Text>
            <View className="flex-row items-center mt-2">
              <Ionicons name="star" size={16} color="#FACC15" />
              <Text className={`ml-1 ${isDark ? "text-white" : "text-gray-800"}`}>4.9 Rating</Text>
            </View>
          </View>
        </View>

        {/* PERSONAL DETAILS */}
        <View className="mt-6">
          <Text className={`text-lg font-semibold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
            Personal Details
          </Text>
          <View
            className={`p-5 rounded-3xl shadow ${
              isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}
            style={{ elevation: 4 }}
          >
            <View className="flex-row justify-between mb-3">
              <Text className={`font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>Name:</Text>
              {editMode ? (
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholderTextColor={isDark ? "#bbb" : "#666"}
                  className={`flex-1 text-right ${isDark ? "text-white" : "text-gray-800"}`}
                />
              ) : (
                <Text className={`${isDark ? "text-white" : "text-gray-800"}`}>{name}</Text>
              )}
            </View>
            <View className="flex-row justify-between mb-3">
              <Text className={`font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>Phone:</Text>
              {editMode ? (
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  placeholderTextColor={isDark ? "#bbb" : "#666"}
                  className={`flex-1 text-right ${isDark ? "text-white" : "text-gray-800"}`}
                />
              ) : (
                <Text className={`${isDark ? "text-white" : "text-gray-800"}`}>{phone}</Text>
              )}
            </View>
            <View className="flex-row justify-between">
              <Text className={`font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>Email:</Text>
              {editMode ? (
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholderTextColor={isDark ? "#bbb" : "#666"}
                  className={`flex-1 text-right ${isDark ? "text-white" : "text-gray-800"}`}
                />
              ) : (
                <Text className={`${isDark ? "text-white" : "text-gray-800"}`}>{email}</Text>
              )}
            </View>
          </View>
        </View>

        {/* VEHICLE DETAILS */}
        <View className="mt-6">
          <Text className={`text-lg font-semibold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
            Vehicle Details
          </Text>
          <View
            className={`p-5 rounded-3xl shadow ${
              isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}
            style={{ elevation: 4 }}
          >
            <View className="flex-row justify-between mb-3">
              <Text className={`font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>Model:</Text>
              {editMode ? (
                <TextInput
                  value={model}
                  onChangeText={setModel}
                  placeholderTextColor={isDark ? "#bbb" : "#666"}
                  className={`flex-1 text-right ${isDark ? "text-white" : "text-gray-800"}`}
                />
              ) : (
                <Text className={`${isDark ? "text-white" : "text-gray-800"}`}>{model}</Text>
              )}
            </View>
            <View className="flex-row justify-between mb-3">
              <Text className={`font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>License Plate:</Text>
              {editMode ? (
                <TextInput
                  value={plate}
                  onChangeText={setPlate}
                  placeholderTextColor={isDark ? "#bbb" : "#666"}
                  className={`flex-1 text-right ${isDark ? "text-white" : "text-gray-800"}`}
                />
              ) : (
                <Text className={`${isDark ? "text-white" : "text-gray-800"}`}>{plate}</Text>
              )}
            </View>
            <View className="flex-row justify-between">
              <Text className={`font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>Color:</Text>
              {editMode ? (
                <TextInput
                  value={color}
                  onChangeText={setColor}
                  placeholderTextColor={isDark ? "#bbb" : "#666"}
                  className={`flex-1 text-right ${isDark ? "text-white" : "text-gray-800"}`}
                />
              ) : (
                <Text className={`${isDark ? "text-white" : "text-gray-800"}`}>{color}</Text>
              )}
            </View>
          </View>
        </View>

        {/* DOCUMENTS */}
        <View className="mt-6">
          <Text className={`text-lg font-semibold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
            Documents
          </Text>
          <TouchableOpacity
            className={`p-5 rounded-3xl shadow mb-4 flex-row items-center ${
              isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}
            style={{ elevation: 4 }}
          >
            <Ionicons name="document-text-outline" size={28} color="#d97706" />
            <View className="ml-3 flex-1">
              <Text className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-800"}`}>
                Driving License
              </Text>
              <Text className={`text-sm ${isDark ? "text-gray-300" : "text-gray-500"}`}>
                Verified
              </Text>
            </View>
            <Ionicons name="checkmark-circle" size={24} color="green" />
          </TouchableOpacity>

          <TouchableOpacity
            className={`p-5 rounded-3xl shadow mb-4 flex-row items-center ${
              isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}
            style={{ elevation: 4 }}
          >
            <MaterialCommunityIcons name="car-outline" size={28} color="#d97706" />
            <View className="ml-3 flex-1">
              <Text className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-800"}`}>
                Vehicle Registration
              </Text>
              <Text className={`text-sm ${isDark ? "text-gray-300" : "text-gray-500"}`}>
                Verified
              </Text>
            </View>
            <Ionicons name="checkmark-circle" size={24} color="green" />
          </TouchableOpacity>

          <TouchableOpacity
            className={`p-5 rounded-3xl shadow flex-row items-center ${
              isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}
            style={{ elevation: 4 }}
          >
            <Ionicons name="shield-checkmark-outline" size={28} color="#d97706" />
            <View className="ml-3 flex-1">
              <Text className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-800"}`}>
                Insurance
              </Text>
              <Text className={`text-sm ${isDark ? "text-gray-300" : "text-gray-500"}`}>
                Verified
              </Text>
            </View>
            <Ionicons name="checkmark-circle" size={24} color="green" />
          </TouchableOpacity>
        </View>

        {/* EDIT PROFILE BUTTON */}
        <TouchableOpacity
          onPress={() => setEditMode(!editMode)}
          className={`p-5 rounded-3xl items-center mt-8 shadow-lg ${
            isDark ? "bg-yellow-600" : "bg-yellow-500"
          }`}
          style={{ elevation: 6 }}
        >
          <Text className="text-lg font-bold text-white">
            {editMode ? "Save Profile" : "Edit Profile"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}