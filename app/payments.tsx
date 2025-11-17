// app/payments.tsx
import { View, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ThemedScreen, ThemedView, ThemedText, ThemedTextSecondary } from "./components/Themed";
import { useThemeStyles } from "./context/themeStyles";

export default function Payments() {
  const router = useRouter();
  const { isDark } = useThemeStyles();

  const walletBalance = "₹350";

  return (
    <ThemedScreen className="px-6 pt-16">
      <View className="flex-row justify-between items-center mb-6">
        <ThemedText className="text-3xl font-extrabold">Payments & Wallet</ThemedText>
        <TouchableOpacity onPress={() => router.back()} className={`p-3 rounded-full ${isDark ? "bg-gray-700" : "bg-gray-200"}`}>
          <Ionicons name="arrow-back" size={20} color={isDark ? "#fff" : "#333"} />
        </TouchableOpacity>
      </View>

      <ThemedView className="rounded-3xl p-6 shadow mb-6 flex-row justify-between items-center">
        <View>
          <ThemedText className="text-lg font-bold">Wallet Balance</ThemedText>
          <ThemedTextSecondary className="mt-1">{walletBalance}</ThemedTextSecondary>
        </View>

        <TouchableOpacity
          onPress={() => Alert.alert("Top-up", "Top-up flow placeholder")}
          className="bg-yellow-500 px-4 py-3 rounded-2xl"
        >
          <ThemedText className="text-white font-semibold">Add Money</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView className="rounded-3xl p-4 shadow mb-4">
        <ThemedText className="font-semibold mb-2">Payment Methods</ThemedText>
        <TouchableOpacity className="flex-row items-center justify-between py-3">
          <View className="flex-row items-center">
            <Ionicons name="card-outline" size={22} color="#FACC15" />
            <ThemedText className="ml-3">Visa •••• 4242</ThemedText>
          </View>
          <ThemedTextSecondary>Edit</ThemedTextSecondary>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView className="rounded-3xl p-4 shadow">
        <ThemedText className="font-semibold mb-2">Transactions</ThemedText>
        <ThemedTextSecondary>No recent transactions</ThemedTextSecondary>
      </ThemedView>
    </ThemedScreen>
  );
}
