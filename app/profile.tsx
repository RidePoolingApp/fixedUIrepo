// app/profile.tsx
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import BottomNav from "./components/BottomNav";

export default function Profile() {
  return (
    <View className="flex-1 bg-gray-50">

      {/* HEADER */}
      <View className="absolute top-0 left-0 right-0">
        <Svg height="240" width="100%">
          <Path d="M0 0 H400 V140 Q200 240 0 140 Z" fill="#FACC15" />
        </Svg>
      </View>

      {/* TITLE */}
      <View className="mt-20 px-6 mb-6">
        <Text className="text-3xl font-extrabold text-gray-900">Profile</Text>
        <Text className="text-gray-700 mt-1">Manage your preferences</Text>
      </View>

      <ScrollView
        className="px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        {/* USER CARD */}
        <View className="bg-white p-6 rounded-3xl shadow border border-gray-200">
          <View className="flex-row items-center">
            <Ionicons name="person-circle-outline" size={80} color="#555" />
            <View className="ml-4">
              <Text className="text-2xl font-extrabold text-gray-900">John Doe</Text>
              <Text className="text-gray-600">+91 98765 43210</Text>
            </View>
          </View>
        </View>

        {/* MENU OPTIONS */}
        <View className="mt-6 space-y-4">
          {[
            { label: "Saved Places", icon: "location-outline" },
            { label: "Payments & Wallet", icon: "wallet-outline" },
            { label: "Ride History", icon: "time-outline" },
            { label: "Support", icon: "help-circle-outline" },
            { label: "Privacy & Security", icon: "shield-checkmark-outline" },
          ].map((item, i) => (
            <TouchableOpacity
              key={i}
              className="bg-white p-5 rounded-2xl shadow border border-gray-200 flex-row items-center"
            >
              <Ionicons name={item.icon} size={28} color="#444" />
              <Text className="ml-4 text-gray-900 text-lg">{item.label}</Text>
            </TouchableOpacity>
          ))}

          {/* LOGOUT */}
          <TouchableOpacity className="bg-red-50 p-5 rounded-2xl border border-red-200 flex-row items-center">
            <MaterialIcons name="logout" size={28} color="#dc2626" />
            <Text className="ml-4 text-red-600 text-lg font-semibold">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNav />
    </View>
  );
}
