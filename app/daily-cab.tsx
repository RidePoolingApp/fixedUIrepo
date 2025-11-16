// app/daily-cab.tsx
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
  Animated,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "expo-router";

export default function DailyCab() {
  const router = useRouter();

  const [repeat, setRepeat] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const fade = useRef(new Animated.Value(0)).current;

  const slots = [
    "6:00 AM",
    "7:00 AM",
    "8:00 AM",
    "9:00 AM",
    "10:00 AM",
    "4:00 PM",
    "5:00 PM",
    "6:00 PM",
    "7:00 PM",
  ];

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const [selectedDays, setSelectedDays] = useState(["Mon", "Tue", "Wed", "Thu", "Fri"]);

  const toggleDay = (d) => {
    if (selectedDays.includes(d)) {
      setSelectedDays(selectedDays.filter((x) => x !== d));
    } else {
      setSelectedDays([...selectedDays, d]);
    }
  };

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View className="flex-1 bg-gray-50">
      {/* HEADER */}
      <View className="absolute top-0 left-0 right-0">
        <Svg height="250" width="100%">
          <Path d="M0 0 H400 V130 Q200 250 0 130 Z" fill="#FACC15" />
          <Path d="M0 35 H400 V150 Q200 270 0 150 Z" fill="#FDE047" opacity={0.5} />
        </Svg>
      </View>

      {/* Back */}
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-14 left-6 bg-white p-3 rounded-full shadow"
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <View className="mt-28 px-6">
        <Text className="text-3xl font-extrabold text-gray-900">Daily Fixed Cab</Text>
        <Text className="text-gray-700 mt-1">Set your daily pickup schedule</Text>
      </View>

      <ScrollView
        className="px-6 mt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 150 }}
      >
        {/* FROM / TO Inputs */}
        <Animated.View style={{ opacity: fade }}>
          <View className="bg-white p-5 rounded-3xl shadow border border-gray-200">
            {/* From */}
            <View className="flex-row items-center">
              <Ionicons name="location-outline" size={26} color="#FACC15" />
              <TextInput
                placeholder="Pickup location"
                placeholderTextColor="#999"
                className="ml-3 flex-1 text-gray-900"
              />
            </View>

            <View className="h-[1px] bg-gray-200 my-4" />

            {/* To */}
            <View className="flex-row items-center">
              <Ionicons name="flag-outline" size={26} color="#FACC15" />
              <TextInput
                placeholder="Drop location"
                placeholderTextColor="#999"
                className="ml-3 flex-1 text-gray-900"
              />
            </View>
          </View>
        </Animated.View>

        {/* TIME SLOTS */}
        <View className="mt-8">
          <Text className="text-lg font-bold text-gray-900 mb-3">Select Time Slot</Text>

          <View className="flex-row flex-wrap">
            {slots.map((t) => (
              <TouchableOpacity
                key={t}
                onPress={() => setSelectedSlot(t)}
                className={`px-4 py-3 rounded-2xl mr-3 mb-3 border 
                  ${selectedSlot === t ? "bg-yellow-500 border-yellow-600" : "bg-white border-gray-300"}
                `}
              >
                <Text className={`${selectedSlot === t ? "text-white" : "text-gray-900"} font-semibold`}>
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* DAYS SELECTOR */}
        <View className="mt-8">
          <Text className="text-lg font-bold text-gray-900 mb-3">Repeat on Days</Text>

          <View className="flex-row justify-between">
            {days.map((d) => (
              <TouchableOpacity
                key={d}
                onPress={() => toggleDay(d)}
                className={`w-12 h-12 rounded-full items-center justify-center border 
                  ${
                    selectedDays.includes(d)
                      ? "bg-yellow-400 border-yellow-600"
                      : "bg-white border-gray-300"
                  }`}
              >
                <Text
                  className={`font-semibold ${
                    selectedDays.includes(d) ? "text-white" : "text-gray-800"
                  }`}
                >
                  {d}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* TOGGLE */}
        <View className="flex-row justify-between items-center bg-white p-5 rounded-3xl mt-8 border border-gray-200 shadow">
          <Text className="text-lg font-semibold text-gray-900">Repeat Weekly</Text>
          <Switch value={repeat} onValueChange={setRepeat} thumbColor="#FACC15" />
        </View>

        {/* BUTTON */}
        <TouchableOpacity
          onPress={() => router.push("/ride/daily-cab-confirm")}
          className="bg-yellow-500 p-5 rounded-3xl items-center mt-10 shadow"
        >
          <Text className="text-white font-bold text-lg">Confirm Schedule</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
