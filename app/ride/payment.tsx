// app/ride/payment.tsx
import {
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";
import { useState } from "react";
import { useRouter } from "expo-router";
import { ThemedScreen, ThemedView, ThemedText, ThemedTextSecondary } from "../components/Themed";
import { useThemeStyles } from "../context/themeStyles";

export default function PaymentPage() {
  const router = useRouter();
  const { isDark, colors } = useThemeStyles();

  const [selected, setSelected] = useState("upi");
  const [addCardModal, setAddCardModal] = useState(false);

  const fare = "₹749";

  const methods = [
    { id: "upi", label: "UPI", icon: "logo-google" },
    { id: "wallet", label: "Wallet", icon: "wallet-outline" },
    { id: "cash", label: "Cash", icon: "cash-outline" },
    { id: "card", label: "Credit / Debit Card", icon: "card-outline" },
  ];

  return (
    <ThemedScreen>

      {/* Yellow Header */}
      <View className="absolute top-0 left-0 right-0">
        <Svg height="240" width="100%">
          <Path
            d="M0 0 H400 V140 Q200 240 0 140 Z"
            fill={isDark ? "#1F2937" : "#FACC15"}
          />
        </Svg>
      </View>

      {/* Header */}
      <View className="mt-20 px-6">
        <ThemedText className="text-3xl font-extrabold">Payment</ThemedText>
        <ThemedTextSecondary>Select your preferred payment method</ThemedTextSecondary>
      </View>

      <ScrollView
        className="px-6 mt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 150 }}
      >

        {/* Fare Card */}
        <ThemedView className="p-6 rounded-3xl shadow border mb-6">
          <ThemedText className="text-lg font-semibold">Total Fare</ThemedText>
          <ThemedText className="text-3xl font-extrabold text-yellow-500 mt-1">
            {fare}
          </ThemedText>
        </ThemedView>

        {/* Payment Methods */}
        <ThemedText className="text-xl font-semibold mb-3">Payment Method</ThemedText>

        {methods.map((m, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => {
              if (m.id === "card") {
                setAddCardModal(true);
              } else {
                setSelected(m.id);
              }
            }}
            className={`flex-row items-center justify-between p-5 rounded-2xl border mb-4 ${
              selected === m.id ? "border-yellow-400" : "border-gray-300"
            }`}
          >
            <View className="flex-row items-center">
              <Ionicons name={m.icon} size={28} color="#FACC15" />
              <ThemedText className="ml-4 text-lg">{m.label}</ThemedText>
            </View>

            {selected === m.id && (
              <Ionicons name="checkmark-circle" size={26} color="#FACC15" />
            )}
          </TouchableOpacity>
        ))}

        {/* PAY NOW BUTTON */}
        <TouchableOpacity
          onPress={() => router.push("/ride/pay-now")}
          className="bg-yellow-500 p-5 rounded-3xl items-center mt-6 shadow"
          style={{ elevation: 4 }}
        >
          <ThemedText className="text-white text-lg font-bold">
            Pay Now
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>

      {/* ADD CARD MODAL */}
      <Modal visible={addCardModal} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-end">
          <ThemedView className="p-6 rounded-t-3xl shadow border">
            <ThemedText className="text-xl font-bold mb-4">
              Add New Card
            </ThemedText>

            <ThemedTextSecondary>Card Number</ThemedTextSecondary>
            <TextInput
              placeholder="1234 5678 9012 3456"
              placeholderTextColor="#999"
              keyboardType="numeric"
              className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl mb-3"
            />

            <ThemedTextSecondary>Expiry</ThemedTextSecondary>
            <TextInput
              placeholder="MM/YY"
              placeholderTextColor="#999"
              className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl mb-3"
            />

            <ThemedTextSecondary>CVV</ThemedTextSecondary>
            <TextInput
              placeholder="***"
              placeholderTextColor="#999"
              keyboardType="numeric"
              secureTextEntry
              className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl mb-6"
            />

            <TouchableOpacity
              onPress={() => {
                setSelected("card");
                setAddCardModal(false);
              }}
              className="bg-yellow-500 p-4 rounded-2xl items-center mb-3"
            >
              <ThemedText className="text-white font-bold">
                Save Card
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setAddCardModal(false)}
              className="bg-gray-200 dark:bg-gray-700 p-4 rounded-2xl items-center"
            >
              <ThemedText className="font-semibold">Cancel</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </View>
      </Modal>
    </ThemedScreen>
  );
}
