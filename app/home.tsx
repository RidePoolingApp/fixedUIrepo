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
import { useEffect, useRef, useContext } from "react";
import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import BottomNav from "../app/components/BottomNav";
import { useRouter } from "expo-router";
import { ThemeContext } from "../app/context/ThemeContext";  // <-- IMPORTANT

export default function Home() {
  const router = useRouter();
  const { theme, toggleTheme } = useContext(ThemeContext);   // <-- USE THEME
  const isDark = theme === "dark";

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

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
      icon: <FontAwesome5 name="route" size={28} color={isDark ? "#eee" : "#333"} />,
    },
    {
      title: "Refer & Earn",
      desc: "Get ₹200 credits instantly.",
      icon: <MaterialIcons name="card-giftcard" size={30} color={isDark ? "#eee" : "#333"} />,
    },
    {
      title: "Daily Cab Discount",
      desc: "Your everyday commute, now cheaper.",
      icon: <Ionicons name="cash-outline" size={30} color={isDark ? "#eee" : "#333"} />,
    },
  ];

  return (
    <View className={`flex-1 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* HEADER BACKGROUND */}
      <View className="absolute top-0 left-0 right-0">
        <Svg height="220" width="100%">
          <Path
            d="M0 0 H400 V120 Q200 220 0 120 Z"
            fill={isDark ? "#1F2937" : "#FACC15"}
          />
          <Path
            d="M0 30 H400 V140 Q200 240 0 140 Z"
            fill={isDark ? "#374151" : "#FDE047"}
            opacity={0.5}
          />
        </Svg>
      </View>

      {/* MAIN CONTENT */}
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View className="pt-16 px-6 pb-3 flex-row justify-between items-center">
          <View>
            <Text className={`text-3xl font-extrabold ${isDark ? "text-white" : "text-gray-900"}`}>
              Waylink
            </Text>
            <Text className={`${isDark ? "text-gray-300" : "text-gray-700"} mt-1`}>
              Safe. Fast. Affordable.
            </Text>
          </View>

          {/* Dark Mode Toggle Button */}
          <TouchableOpacity
            onPress={toggleTheme}
            className="p-3 bg-white/20 rounded-full"
          >
            {isDark ? (
              <Ionicons name="sunny-outline" size={26} color="yellow" />
            ) : (
              <Ionicons name="moon-outline" size={26} color="#333" />
            )}
          </TouchableOpacity>
        </View>

        {/* FROM & TO BOX */}
        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
          className="px-6 mt-2"
        >
          <View
            className={`rounded-3xl p-5 shadow border ${
              isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}
            style={{ elevation: 5 }}
          >
            {/* FROM */}
            <View className="flex-row items-center mb-4">
              <Ionicons name="location-outline" size={26} color="#FACC15" />
              <TextInput
                placeholder="From"
                placeholderTextColor={isDark ? "#bbb" : "#888"}
                className={`flex-1 ml-3 text-lg ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              />
            </View>

            <View className={`h-[1px] ${isDark ? "bg-gray-700" : "bg-gray-200"} my-2`} />

            {/* TO */}
            <View className="flex-row items-center">
              <Ionicons name="flag-outline" size={26} color="#FACC15" />
              <TextInput
                placeholder="To"
                placeholderTextColor={isDark ? "#bbb" : "#888"}
                className={`flex-1 ml-3 text-lg ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              />
            </View>
          </View>
        </Animated.View>

        {/* SAVED LOCATIONS */}
        <View className="px-6 mt-6">
          <Text className={`text-xl font-semibold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
            Saved Locations
          </Text>

          {/* HOME */}
          <TouchableOpacity
            className={`rounded-2xl p-4 flex-row items-center shadow-sm mb-3 border 
              ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}
            style={{ elevation: 3 }}
          >
            <Ionicons name="home-outline" size={28} color="#FACC15" />
            <View className="ml-4">
              <Text className={`${isDark ? "text-white" : "text-gray-900"} text-lg font-semibold`}>
                Home
              </Text>
              <Text className={`${isDark ? "text-gray-400" : "text-gray-500"} text-sm`}>
                Add your home address
              </Text>
            </View>
          </TouchableOpacity>

          {/* WORK */}
          <TouchableOpacity
            className={`rounded-2xl p-4 flex-row items-center shadow-sm mb-3 border 
              ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}
            style={{ elevation: 3 }}
          >
            <Ionicons name="briefcase-outline" size={28} color="#FACC15" />
            <View className="ml-4">
              <Text className={`${isDark ? "text-white" : "text-gray-900"} text-lg font-semibold`}>
                Work
              </Text>
              <Text className={`${isDark ? "text-gray-400" : "text-gray-500"} text-sm`}>
                Add work location
              </Text>
            </View>
          </TouchableOpacity>

          {/* RECENT */}
          <TouchableOpacity
            className={`rounded-2xl p-4 flex-row items-center shadow-sm border 
              ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}
            style={{ elevation: 3 }}
          >
            <Ionicons name="time-outline" size={28} color="#FACC15" />
            <View className="ml-4 flex-1">
              <Text className={`${isDark ? "text-white" : "text-gray-900"} text-lg font-semibold`}>
                Recent: MG Road
              </Text>
              <Text className={`${isDark ? "text-gray-400" : "text-gray-500"} text-sm`}>
                Bangalore City
              </Text>
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
              className={`rounded-3xl p-5 mr-4 w-72 shadow-lg ${
                isDark ? "bg-gray-800" : "bg-white"
              }`}
            >
              {item.icon}
              <Text className={`text-lg font-bold mt-3 ${isDark ? "text-white" : "text-gray-900"}`}>
                {item.title}
              </Text>
              <Text className={`${isDark ? "text-gray-300" : "text-gray-600"} mt-1`}>
                {item.desc}
              </Text>
            </Animated.View>
          ))}
        </ScrollView>

        {/* SERVICES */}
        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
          className="px-6 mt-10"
        >
          <Text className={`text-xl font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
            Book a Ride
          </Text>

          {/* Long Trip */}
          <TouchableOpacity
            onPress={() => router.push("/long-trip")}
            className={`rounded-3xl p-6 shadow mb-4 ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <FontAwesome5 name="route" size={40} color={isDark ? "#eee" : "#222"} />
            <Text className={`text-xl font-semibold mt-3 ${isDark ? "text-white" : "text-gray-800"}`}>
              Long Trip
            </Text>
            <Text className={`${isDark ? "text-gray-300" : "text-gray-600"} mt-1`}>
              Outstation rides anytime.
            </Text>
          </TouchableOpacity>

          {/* Sharing */}
          <TouchableOpacity
            onPress={() => router.push("/sharing")}
            className={`rounded-3xl p-6 shadow mb-4 ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <Ionicons name="people-outline" size={40} color={isDark ? "#eee" : "#222"} />
            <Text className={`text-xl font-semibold mt-3 ${isDark ? "text-white" : "text-gray-800"}`}>
              Sharing
            </Text>
            <Text className={`${isDark ? "text-gray-300" : "text-gray-600"} mt-1`}>
              Share rides & save money.
            </Text>
          </TouchableOpacity>

          {/* Daily Cab */}
          <TouchableOpacity
            onPress={() => router.push("/daily-cab")}
            className={`rounded-3xl p-6 shadow ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <FontAwesome5 name="taxi" size={40} color={isDark ? "#eee" : "#222"} />
            <Text className={`text-xl font-semibold mt-3 ${isDark ? "text-white" : "text-gray-800"}`}>
              Daily Fixed Cab
            </Text>
            <Text className={`${isDark ? "text-gray-300" : "text-gray-600"} mt-1`}>
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
