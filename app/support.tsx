// app/support.tsx
import { View, TouchableOpacity, Linking, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ThemedScreen, ThemedView, ThemedText, ThemedTextSecondary } from "./components/Themed";
import { useThemeStyles } from "./context/themeStyles";

export default function Support() {
  const router = useRouter();
  const { isDark } = useThemeStyles();

  const supportNumber = "+911234567890";

  return (
    <ThemedScreen className="px-6 pt-16">
      <View className="flex-row justify-between items-center mb-6">
        <ThemedText className="text-3xl font-extrabold">Support</ThemedText>
        <TouchableOpacity onPress={() => router.back()} className={`p-3 rounded-full ${isDark ? "bg-gray-700" : "bg-gray-200"}`}>
          <Ionicons name="arrow-back" size={20} color={isDark ? "#fff" : "#333"} />
        </TouchableOpacity>
      </View>

      <ThemedView className="rounded-3xl p-6 shadow mb-4">
        <ThemedText className="font-semibold mb-2">Need help?</ThemedText>
        <ThemedTextSecondary className="mb-4">We’re here 24/7. Reach out via call, email or in-app chat.</ThemedTextSecondary>

        <View className="flex-row space-x-3">
          <TouchableOpacity onPress={() => Linking.openURL(`tel:${supportNumber}`)} className="px-4 py-3 bg-yellow-500 rounded-2xl">
            <ThemedText className="text-white">Call</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => Alert.alert("Chat", "In-app chat placeholder")} className="px-4 py-3 border rounded-2xl" style={{ borderColor: isDark ? "#374151" : "#e5e7eb" }}>
            <ThemedText>Chat</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>

      <ThemedView className="rounded-3xl p-4 shadow">
        <ThemedText className="font-semibold mb-2">FAQs</ThemedText>
        <ThemedTextSecondary>Common questions and answers to help you quickly.</ThemedTextSecondary>
      </ThemedView>
    </ThemedScreen>
  );
}
