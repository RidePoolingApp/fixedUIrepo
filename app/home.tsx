// app/home.tsx
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Animated,
  TextInput,
  ScrollView,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { useEffect, useRef } from "react";
import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import BottomNav from "../app/components/BottomNav";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import { useState } from "react";


export default function Home() {
  const router = useRouter();
  const [currentAddress, setCurrentAddress] = useState("");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  // Floating animations for promo cards
  const card1 = useRef(new Animated.Value(1)).current;
  const card2 = useRef(new Animated.Value(1)).current;
  const card3 = useRef(new Animated.Value(1)).current;

  const floatAnim = (ref) => {
    Animated.sequence([
      Animated.timing(ref, { toValue: 1.03, duration: 600, useNativeDriver: true }),
      Animated.timing(ref, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start(() => floatAnim(ref));
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, bounciness: 9, useNativeDriver: true }),
    ]).start();

    floatAnim(card1);
    floatAnim(card2);
    floatAnim(card3);
  }, []);

  const ads = [
    {
      title: "20% OFF on Long Trips",
      desc: "Save more on outstation rides.",
      icon: <FontAwesome5 name="route" size={28} color="#333" />,
    },
    {
      title: "Refer & Earn",
      desc: "Get ₹200 credits instantly.",
      icon: <MaterialIcons name="card-giftcard" size={30} color="#333" />,
    },
    {
      title: "Daily Cab Discount",
      desc: "Your everyday commute, now cheaper.",
      icon: <Ionicons name="cash-outline" size={30} color="#333" />,
    },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />

      {/* YELLOW CURVED HEADER */}
      <View className="absolute top-0 left-0 right-0">
        <Svg height="220" width="100%">
          <Path d="M0 0 H400 V120 Q200 220 0 120 Z" fill="#FACC15" />
          <Path d="M0 30 H400 V140 Q200 240 0 140 Z" fill="#FDE047" opacity={0.5} />
        </Svg>
      </View>

      {/* MAIN SCROLL CONTENT */}
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View className="pt-16 px-6 pb-3 flex-row justify-between items-center">
          <View>
            <Text className="text-3xl font-extrabold text-gray-900">Waylink</Text>
            <Text className="text-gray-700 mt-1">Safe. Fast. Affordable.</Text>
          </View>

          {/* Notification Icon */}
          <TouchableOpacity onPress={() => router.push("/notifications")} className="relative">
            <Ionicons name="notifications-outline" size={32} color="#333" />
            <View className="absolute -top-1 -right-1 bg-red-500 w-4 h-4 rounded-full items-center justify-center">
              <Text className="text-white text-[10px] font-bold">3</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* FROM & TO SEARCH */}
        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
          className="px-6 mt-2"
        >
          <View
            className="bg-white rounded-3xl p-5 shadow border border-gray-200"
            style={{ elevation: 5 }}
          >
            {/* FROM */}
            <View className="flex-row items-center mb-4">
              <Ionicons name="location-outline" size={26} color="#FACC15" />
              <TextInput
                placeholder="From"
                placeholderTextColor="#888"
                className="flex-1 ml-3 text-gray-900 text-lg"
              />
            </View>

            <View className="h-[1px] bg-gray-200 my-2" />

            {/* TO */}
            <View className="flex-row items-center">
              <Ionicons name="flag-outline" size={26} color="#FACC15" />
              <TextInput
                placeholder="To"
                placeholderTextColor="#888"
                className="flex-1 ml-3 text-gray-900 text-lg"
              />
            </View>
          </View>
        </Animated.View>
{/* SAVED LOCATIONS */}
<View className="px-6 mt-6">
  <Text className="text-xl font-semibold text-gray-900 mb-3">
    Saved Locations
  </Text>

  {/* HOME */}
  <TouchableOpacity
    className="
      bg-white 
      rounded-2xl 
      p-4 
      flex-row 
      items-center 
      shadow-sm 
      mb-3
      border border-gray-100
    "
    style={{ elevation: 3 }}
  >
    <Ionicons name="home-outline" size={28} color="#FACC15" />

    <View className="ml-4">
      <Text className="text-gray-900 text-lg font-semibold">Home</Text>
      <Text className="text-gray-500 text-sm">Add your home address</Text>
    </View>
  </TouchableOpacity>

  {/* WORK */}
  <TouchableOpacity
    className="
      bg-white 
      rounded-2xl 
      p-4 
      flex-row 
      items-center 
      shadow-sm 
      mb-3
      border border-gray-100
    "
    style={{ elevation: 3 }}
  >
    <Ionicons name="briefcase-outline" size={28} color="#FACC15" />

    <View className="ml-4">
      <Text className="text-gray-900 text-lg font-semibold">Work</Text>
      <Text className="text-gray-500 text-sm">Add work location</Text>
    </View>
  </TouchableOpacity>

  {/* RECENT PLACE */}
  <TouchableOpacity
    className="
      bg-white 
      rounded-2xl 
      p-4 
      flex-row 
      items-center 
      shadow-sm 
      border border-gray-100
    "
    style={{ elevation: 3 }}
  >
    <Ionicons name="time-outline" size={28} color="#FACC15" />

    <View className="ml-4 flex-1">
      <Text className="text-gray-900 text-lg font-semibold">
        Recent: MG Road
      </Text>
      <Text className="text-gray-500 text-sm">Bangalore City</Text>
    </View>
  </TouchableOpacity>
</View>

        {/* PROMO BANNERS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-6 px-6"
        >
          {ads.map((item, index) => (
            <Animated.View
              key={index}
              style={{
                transform: [
                  { scale: index === 0 ? card1 : index === 1 ? card2 : card3 },
                ],
              }}
              className="bg-white rounded-3xl p-5 mr-4 w-72 shadow-lg"
            >
              {item.icon}
              <Text className="text-lg font-bold text-gray-900 mt-3">{item.title}</Text>
              <Text className="text-gray-600 mt-1">{item.desc}</Text>
            </Animated.View>
          ))}
        </ScrollView>

        {/* SERVICES */}
        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
          className="px-6 mt-10"
        >
          <Text className="text-xl font-semibold text-gray-900 mb-4">
            Book a Ride
          </Text>

          {/* Long Trip */}
          <TouchableOpacity
            onPress={() => router.push("/long-trip")}
            className="bg-white rounded-3xl p-6 shadow mb-4 active:scale-95"
          >
            <FontAwesome5 name="route" size={40} color="#222" />
            <Text className="text-xl font-semibold mt-3 text-gray-800">Long Trip</Text>
            <Text className="text-gray-600 mt-1">Outstation rides anytime.</Text>
          </TouchableOpacity>

          {/* Sharing */}
          <TouchableOpacity
            onPress={() => router.push("/sharing")}
            className="bg-white rounded-3xl p-6 shadow mb-4 active:scale-95"
          >
            <Ionicons name="people-outline" size={40} color="#222" />
            <Text className="text-xl font-semibold mt-3 text-gray-800">Sharing</Text>
            <Text className="text-gray-600 mt-1">Share rides & save money.</Text>
          </TouchableOpacity>

          {/* Daily Cab */}
          <TouchableOpacity
            onPress={() => router.push("/daily-cab")}
            className="bg-white rounded-3xl p-6 shadow active:scale-95"
          >
            <FontAwesome5 name="taxi" size={40} color="#222" />
            <Text className="text-xl font-semibold mt-3 text-gray-800">
              Daily Fixed Cab
            </Text>
            <Text className="text-gray-600 mt-1">
              Get a cab at fixed timings daily.
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      {/* NAVBAR */}
      <BottomNav />
    </View>
  );
}
