// app/share-results.tsx
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Animated,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { useRouter } from "expo-router";

export default function ShareResults() {
  const router = useRouter();

  // animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        speed: 1,
        bounciness: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const rides = [
    {
      driver: "Arun Sharma",
      rating: "4.9",
      seatsLeft: 2,
      fare: "₹89/person",
      eta: "5 min away",
      car: "Hyundai i20 • White",
      img: "https://i.ibb.co/WP07R4b/car1.png",
    },
    {
      driver: "Sumanth Rao",
      rating: "4.7",
      seatsLeft: 1,
      fare: "₹75/person",
      eta: "6 min away",
      car: "Swift Dzire • Silver",
      img: "https://i.ibb.co/g6GPk5g/car2.png",
    },
    {
      driver: "Rohit Kulkarni",
      rating: "4.8",
      seatsLeft: 3,
      fare: "₹99/person",
      eta: "4 min away",
      car: "WagonR • Blue",
      img: "https://i.ibb.co/qpqFJZJ/car3.png",
    },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      {/* PREMIUM HEADER */}
      <View className="absolute top-0 left-0 right-0">
        <Svg height="220" width="100%">
          <Path d="M0 0 H400 V120 Q200 220 0 120 Z" fill="#FACC15" />
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
          Shared Rides
        </Text>
        <Text className="text-gray-700 mt-1">
          Choose your preferred shared ride
        </Text>
      </View>

      {/* RIDE LIST */}
      <ScrollView
        className="px-6 mt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {rides.map((ride, index) => (
          <Animated.View
            key={index}
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
            className="bg-white rounded-3xl mb-6 p-5 shadow-xl border border-gray-100"
          >
            {/* CAR IMAGE */}
            <Image
              source={{ uri: ride.img }}
              className="w-full h-44 rounded-2xl"
              style={{ resizeMode: "cover" }}
            />

            {/* DRIVER + RATING */}
            <View className="flex-row justify-between items-center mt-4">
              <View>
                <Text className="text-xl font-bold text-gray-900">
                  {ride.driver}
                </Text>
                <Text className="text-gray-600">{ride.car}</Text>
              </View>

              <View className="bg-yellow-100 rounded-full px-4 py-2 flex-row items-center">
                <Ionicons name="star" size={18} color="#FACC15" />
                <Text className="ml-2 font-semibold text-gray-900">
                  {ride.rating}
                </Text>
              </View>
            </View>

            {/* DETAILS */}
            <View className="flex-row justify-between items-center mt-5">
              {/* Seats Left */}
              <View className="flex-row items-center bg-gray-100 p-3 rounded-2xl">
                <MaterialIcons name="event-seat" size={24} color="#333" />
                <Text className="ml-2 font-semibold text-gray-700">
                  {ride.seatsLeft} seats left
                </Text>
              </View>

              {/* ETA */}
              <View className="flex-row items-center bg-gray-100 p-3 rounded-2xl">
                <Ionicons name="time-outline" size={24} color="#333" />
                <Text className="ml-2 font-semibold text-gray-700">
                  {ride.eta}
                </Text>
              </View>

              {/* fare */}
              <View className="flex-row items-center bg-yellow-100 p-3 rounded-2xl">
                <Ionicons name="pricetag" size={24} color="#D97706" />
                <Text className="ml-2 font-extrabold text-yellow-700">
                  {ride.fare}
                </Text>
              </View>
            </View>

            {/* BOOK NOW BUTTON */}
            <TouchableOpacity
              onPress={() => router.push("/confirm-share")}
              className="bg-yellow-500 p-4 rounded-2xl mt-6 items-center shadow"
              style={{ elevation: 6 }}
            >
              <Text className="text-white font-bold text-lg">
                Join This Ride
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
}
