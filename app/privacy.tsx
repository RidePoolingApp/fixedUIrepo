// app/privacy.tsx
import { View, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedScreen, ThemedView, ThemedText, ThemedTextSecondary } from "./components/Themed";
import { useThemeStyles } from "./context/themeStyles";
import { useRouter } from "expo-router";

export default function Privacy() {
  const router = useRouter();
  const { isDark } = useThemeStyles();

  return (
    <ThemedScreen className="px-6 pt-16">
      <View className="flex-row justify-between items-center mb-6">
        <ThemedText className="text-3xl font-extrabold">Privacy & Security</ThemedText>
        <TouchableOpacity onPress={() => router.back()} className={`p-3 rounded-full ${isDark ? "bg-gray-700" : "bg-gray-200"}`}>
          <Ionicons name="arrow-back" size={20} color={isDark ? "#fff" : "#333"} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <ThemedView className="rounded-3xl p-4 shadow mb-4">
          <ThemedText className="font-semibold mb-2">Data Usage</ThemedText>
          <ThemedTextSecondary>
            We only use the data necessary to provide ride services. Location is used for matching and navigation.
          </ThemedTextSecondary>
        </ThemedView>

        <ThemedView className="rounded-3xl p-4 shadow mb-4">
          <ThemedText className="font-semibold mb-2">Security</ThemedText>
          <ThemedTextSecondary>
            Your data is stored securely and encrypted. We do not share your phone number with drivers — masked calling is used.
          </ThemedTextSecondary>
        </ThemedView>

        <ThemedView className="rounded-3xl p-4 shadow">
          <ThemedText className="font-semibold mb-2">Contact</ThemedText>
          <ThemedTextSecondary>
            For privacy concerns contact privacy@waylink.example or go to Support.
          </ThemedTextSecondary>
        </ThemedView>
      </ScrollView>
    </ThemedScreen>
  );
}
