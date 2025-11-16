// app/sharing.tsx
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Animated,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "expo-router";

export default function SharingRide() {
  const router = useRouter();

  // animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        speed: 1,
        bounciness: 9,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const [passengers, setPassengers] = useState(1);

  return (
    <View className="flex-1 bg-gray-50">
      {/* PREMIUM YELLOW HEADER */}
      <View className="absolute top-0 left-0 right-0">
        <Svg height="240" width="100%">
          <Path d="M0 0 H400 V130 Q200 240 0 130 Z" fill="#FACC15" />
          <Path
            d="M0 30 H400 V150 Q200 260 0 150 Z"
            fill="#FDE047"
            opacity={0.5}
          />
        </Svg>
      </View>

      {/* BACK BUTTON */}
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-14 left-6 bg-white p-3 rounded-full shadow"
        style={{ elevation: 5 }}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      {/* PAGE TITLE */}
      <View className="mt-28 px-6">
        <Text className="text-3xl font-extrabold text-gray-900">
          Sharing Ride
        </Text>
        <Text className="text-gray-700 mt-1">
          Save money by sharing your ride
        </Text>
      </View>

      <ScrollView
        className="px-6 mt-6"
        contentContainerStyle={{ paddingBottom: 150 }}
        showsVerticalScrollIndicator={false}
      >
        {/* FROM/TO CARD */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
          className="bg-white rounded-3xl p-6 shadow border border-gray-200"
        >
          {/* FROM */}
          <View className="flex-row items-center mb-5">
            <Ionicons name="location-outline" size={26} color="#FACC15" />
            <TextInput
              placeholder="Pickup location"
              placeholderTextColor="#999"
              className="flex-1 ml-3 text-gray-900 text-lg"
            />
          </View>

          <View className="h-[1px] bg-gray-200" />

          {/* TO */}
          <View className="flex-row items-center mt-5">
            <Ionicons name="flag-outline" size={26} color="#FACC15" />
            <TextInput
              placeholder="Drop location"
              placeholderTextColor="#999"
              className="flex-1 ml-3 text-gray-900 text-lg"
            />
          </View>
        </Animated.View>

        {/* PASSENGER COUNT */}
        <View
          className="bg-white rounded-3xl p-6 shadow mt-6 border border-gray-200"
          style={{ elevation: 4 }}
        >
          <Text className="text-xl font-bold text-gray-900">
            Passengers
          </Text>
          <Text className="text-gray-600 mt-1">
            Select number of passengers with you
          </Text>

          <View className="flex-row items-center justify-between mt-4">
            <TouchableOpacity
              onPress={() => passengers > 1 && setPassengers(passengers - 1)}
              className="bg-gray-200 w-12 h-12 rounded-full items-center justify-center"
            >
              <Ionicons name="remove" size={24} color="#333" />
            </TouchableOpacity>

            <Text className="text-3xl font-extrabold text-gray-900">
              {passengers}
            </Text>

            <TouchableOpacity
              onPress={() => passengers < 3 && setPassengers(passengers + 1)}
              className="bg-yellow-500 w-12 h-12 rounded-full items-center justify-center"
            >
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* SHARING TYPE SELECTION */}
        <View
          className="bg-white rounded-3xl p-6 shadow mt-6 border border-gray-200"
          style={{ elevation: 4 }}
        >
          <Text className="text-xl font-bold text-gray-900">
            Sharing Options
          </Text>

          {/* OPTIONS */}
          <View className="mt-4 space-y-4">
            {/* Normal Share */}
            <TouchableOpacity className="flex-row items-center p-4 bg-gray-50 rounded-2xl border border-gray-200">
              <MaterialIcons
                name="group"
                size={30}
                color="#222"
              />
              <View className="ml-4">
                <Text className="text-lg font-semibold text-gray-900">
                  Normal Share
                </Text>
                <Text className="text-gray-500 text-sm">
                  Cheapest & most common option
                </Text>
              </View>
            </TouchableOpacity>

            {/* Scheduled Share */}
            <TouchableOpacity className="flex-row items-center p-4 bg-gray-50 rounded-2xl border border-gray-200">
              <MaterialIcons name="schedule" size={30} color="#222" />
              <View className="ml-4">
                <Text className="text-lg font-semibold text-gray-900">
                  Scheduled Share
                </Text>
                <Text className="text-gray-500 text-sm">
                  Book for a future time
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* CONTINUE BUTTON */}
        <TouchableOpacity
          onPress={() => router.push("/share-results")}
          className="bg-yellow-500 py-5 rounded-3xl items-center mt-10 shadow-lg"
          style={{ elevation: 6 }}
        >
          <Text className="text-white text-xl font-bold">
            Find Shared Rides
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
