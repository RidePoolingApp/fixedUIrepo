// app/ride/cancel.tsx
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
  Easing,
  TextInput,
  ActivityIndicator, // FIXED IMPORT
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

export default function CancelRide() {
  const router = useRouter();

  const [selected, setSelected] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [otherText, setOtherText] = useState("");
  const [loading, setLoading] = useState(false);

  const estimatedFee = "₹100";

  // Animated dropdown heights
  const animatedHeights = useRef({}).current;

  const groupedReasons: { [key: string]: string[] } = {
    "General Reasons": [
      "Change of plans",
      "No longer needed the ride",
      "Booked by mistake",
      "Found alternate transportation",
    ],
    "Driver / Vehicle Related": [
      "Driver was too far away",
      "Driver arrived late",
      "Vehicle details didn’t match the app",
      "Vehicle was not clean",
      "Driver was unprofessional",
      "Driver refused destination",
    ],
    "User Scheduling Issues": [
      "Running late for pickup",
      "Unexpected personal emergency",
      "Change in travel plan",
      "Unexpected work commitment",
    ],
    "Location / Pickup Issues": [
      "Wrong pickup location entered",
      "Unable to locate the driver",
      "Driver couldn’t reach pickup point",
      "Traffic or road closure",
      "Pickup point not accessible",
    ],
    "Safety & Comfort Related": [
      "Felt unsafe or uncomfortable",
      "Surroundings at pickup felt unsafe",
      "Driver was driving aggressively",
    ],
    "Price / Payment Issues": [
      "Fare too high",
      "Payment issue",
      "Discount/coupon not applied",
      "Surge pricing",
    ],
    "Weather / External Factors": [
      "Bad weather",
      "Event cancellation",
      "Public disturbance or strike",
      "Medical emergency",
      "Other",
    ],
  };

  // Create animated height for each category
  Object.keys(groupedReasons).forEach((key) => {
    if (!animatedHeights[key]) {
      animatedHeights[key] = new Animated.Value(0);
    }
  });

  const toggleCategory = (category: string) => {
    const isExpanding = expandedCategory !== category;
    setExpandedCategory(isExpanding ? category : null);

    Animated.timing(animatedHeights[category], {
      toValue: isExpanding ? groupedReasons[category].length * 65 : 0,
      duration: 260,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();

    Haptics.selectionAsync();
  };

  const confirmCancel = () => {
    if (!selected) {
      Alert.alert("Pick a reason", "Please select a cancellation reason.");
      return;
    }

    Alert.alert(
      "Confirm Cancellation",
      `Cancel ride now? Estimated fee: ${estimatedFee}`,
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: performCancel,
        },
      ]
    );
  };

  const performCancel = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      Alert.alert("Ride Cancelled", "Your ride was cancelled successfully.", [
        {
          text: "OK",
          onPress: () => router.replace("/home"),
        },
      ]);
    }, 1400);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* HEADER */}
      <View className="absolute top-0 left-0 right-0">
        <Svg height="220" width="100%">
          <Path d="M0 0 H400 V120 Q200 220 0 120 Z" fill="#FACC15" />
        </Svg>
      </View>

      <View className="pt-16 px-6">
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-white w-12 p-3 rounded-full shadow"
        >
          <Ionicons name="arrow-back" size={20} color="#333" />
        </TouchableOpacity>

        <Text className="text-3xl font-extrabold mt-4 text-gray-900">
          Cancel Ride
        </Text>
        <Text className="text-gray-700 mt-1">
          Choose a reason — cancellation fees may apply
        </Text>
      </View>

      {/* MAIN SCROLL */}
      <ScrollView
        className="mt-6 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 160 }}
      >
        {/* CANCELLATION FEE */}
        <View
          className="bg-white rounded-3xl p-6 shadow border border-gray-200 mb-6"
          style={{ elevation: 4 }}
        >
          <Text className="text-gray-900 font-semibold text-lg">
            Estimated Cancellation Fee
          </Text>
          <Text className="text-gray-700 mt-2">Based on driver distance.</Text>
          <Text className="text-yellow-600 font-extrabold text-2xl mt-3">
            {estimatedFee}
          </Text>
        </View>

        {/* COLLAPSIBLE SECTIONS */}
        {Object.entries(groupedReasons).map(([category, reasons]) => {
          const isOpen = expandedCategory === category;

          return (
            <View key={category} className="mb-4">
              {/* CATEGORY HEADER */}
              <TouchableOpacity
                onPress={() => toggleCategory(category)}
                className="flex-row justify-between bg-white p-4 rounded-2xl shadow"
                style={{ elevation: 3 }}
              >
                <Text className="text-gray-900 text-lg font-bold">
                  {category}
                </Text>

                <Ionicons
                  name={isOpen ? "chevron-up" : "chevron-down"}
                  size={22}
                  color="#333"
                />
              </TouchableOpacity>

              {/* ANIMATED DROPDOWN */}
              <Animated.View
                style={{
                  overflow: "hidden",
                  height: animatedHeights[category],
                  marginTop: isOpen ? 6 : 0,
                }}
              >
                {reasons.map((reason) => {
                  const active = selected === reason;

                  return (
                    <TouchableOpacity
                      key={reason}
                      onPress={() => {
                        Haptics.selectionAsync();
                        setSelected(reason);
                      }}
                      className={`flex-row items-center justify-between bg-white p-4 rounded-2xl mb-3 border ${
                        active ? "border-yellow-400" : "border-gray-100"
                      }`}
                      style={{ elevation: active ? 4 : 1 }}
                    >
                      <View className="flex-row items-center">
                        <Ionicons
                          name={
                            active ? "checkmark-circle" : "ellipse-outline"
                          }
                          size={22}
                          color={active ? "#FACC15" : "#9CA3AF"}
                        />
                        <Text className="ml-3 text-gray-800 text-base">
                          {reason}
                        </Text>
                      </View>

                      {active && (
                        <Text className="text-yellow-600 font-semibold">
                          Selected
                        </Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </Animated.View>
            </View>
          );
        })}

        {/* "OTHER" TEXTBOX */}
        {selected === "Other" && (
          <TextInput
            placeholder="Tell us more..."
            className="bg-white p-4 rounded-2xl border border-gray-200 mb-6 text-gray-900"
            placeholderTextColor="#aaa"
            multiline
            value={otherText}
            onChangeText={setOtherText}
            style={{ height: 110 }}
          />
        )}

        {/* BUTTONS */}
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            confirmCancel();
          }}
          className="bg-yellow-500 p-4 rounded-3xl items-center"
          style={{ elevation: 4 }}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-bold text-lg">Confirm Cancel</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-white p-4 rounded-3xl items-center border border-gray-200 mt-3"
          style={{ elevation: 2 }}
        >
          <Text className="text-gray-900 font-semibold text-lg">Keep Ride</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
