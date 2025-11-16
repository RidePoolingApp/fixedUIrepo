// app/components/CancelBottomSheet.tsx
import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";
import * as Haptics from "expo-haptics";

const { height } = Dimensions.get("window");

export default function CancelBottomSheet({ visible, onClose, onConfirm }) {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  const [selected, setSelected] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [otherText, setOtherText] = useState("");
  const [loading, setLoading] = useState(false);

  const estimatedFee = "₹100";

  // Grouped Reasons
  const groupedReasons = {
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
    "Other": ["Other"],
  };

  const animatedHeights = useRef({}).current;

  Object.keys(groupedReasons).forEach((key) => {
    if (!animatedHeights[key]) animatedHeights[key] = new Animated.Value(0);
  });

  const toggleCategory = (category: string) => {
    const isExpanding = expandedCategory !== category;
    setExpandedCategory(isExpanding ? category : null);

    Animated.timing(animatedHeights[category], {
      toValue: isExpanding ? groupedReasons[category].length * 65 : 0,
      duration: 260,
      useNativeDriver: false,
    }).start();

    Haptics.selectionAsync();
  };

  const closeSheet = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 280,
        useNativeDriver: false,
      }),
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }),
    ]).start(() => onClose());
  };

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [visible]);

  const submitCancellation = () => {
    if (!selected) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return alert("Please select a reason");
    }

    setLoading(true);
    setTimeout(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setLoading(false);
      onConfirm(selected, otherText);
      closeSheet();
    }, 1300);
  };

  return (
    visible && (
      <>
        {/* BACKDROP */}
        <Pressable
          onPress={closeSheet}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            opacity: backdropAnim,
          }}
        />

        {/* BOTTOM SHEET */}
        <Animated.View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: height * 0.75,
            backgroundColor: "#fff",
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            paddingHorizontal: 20,
            paddingTop: 20,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* HEADER BAR */}
          <View className="w-16 h-1.5 bg-gray-300 self-center rounded-full mb-4" />

          <Text className="text-2xl font-extrabold text-gray-900">
            Cancel Ride
          </Text>
          <Text className="text-gray-600 mt-1 mb-4">
            Select a reason — cancellation charges may apply.
          </Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* FEE CARD */}
            <View className="bg-gray-100 rounded-2xl p-4 mb-4">
              <Text className="font-semibold text-gray-900">
                Estimated Cancellation Fee
              </Text>
              <Text className="text-yellow-600 text-2xl font-bold">
                {estimatedFee}
              </Text>
            </View>

            {/* CANCELLATION GROUPS */}
            {Object.entries(groupedReasons).map(([category, reasons]) => {
              const isOpen = expandedCategory === category;

              return (
                <View key={category} className="mb-3">
                  <TouchableOpacity
                    onPress={() => toggleCategory(category)}
                    className="flex-row justify-between bg-white p-4 rounded-xl border border-gray-200"
                  >
                    <Text className="text-lg font-bold text-gray-800">
                      {category}
                    </Text>
                    <Ionicons
                      name={isOpen ? "chevron-up" : "chevron-down"}
                      size={22}
                      color="#333"
                    />
                  </TouchableOpacity>

                  {/* Dropdown */}
                  <Animated.View
                    style={{
                      overflow: "hidden",
                      height: animatedHeights[category],
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
                          className={`flex-row items-center justify-between bg-white mt-2 p-4 rounded-xl border ${
                            active ? "border-yellow-400" : "border-gray-200"
                          }`}
                        >
                          <View className="flex-row items-center">
                            <Ionicons
                              name={
                                active
                                  ? "checkmark-circle"
                                  : "ellipse-outline"
                              }
                              size={22}
                              color={active ? "#FACC15" : "#999"}
                            />
                            <Text className="ml-3 text-gray-700">{reason}</Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </Animated.View>
                </View>
              );
            })}

            {/* OTHER INPUT */}
            {selected === "Other" && (
              <TextInput
                placeholder="Tell us more..."
                value={otherText}
                onChangeText={setOtherText}
                multiline
                className="bg-white border border-gray-200 p-4 rounded-xl mt-3 text-gray-900"
                style={{ minHeight: 90 }}
              />
            )}

            {/* ACTION BUTTONS */}
            <TouchableOpacity
              onPress={submitCancellation}
              className="bg-yellow-500 p-4 rounded-2xl items-center mt-4"
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-bold text-lg">
                  Confirm Cancel
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={closeSheet}
              className="bg-gray-100 p-4 rounded-2xl items-center mt-2"
            >
              <Text className="text-gray-800 font-semibold">Keep Ride</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </>
    )
  );
}
