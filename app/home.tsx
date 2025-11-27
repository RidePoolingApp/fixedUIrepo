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
import { useState, useEffect, useRef, useContext } from "react";
import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import BottomNav from "../app/components/BottomNav";
import { useRouter } from "expo-router";
import { ThemeContext } from "../app/context/ThemeContext";
import { LOCAL_PLACES } from "../app/data/place";



export default function Home() {
  const router = useRouter();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  const card1 = useRef(new Animated.Value(1)).current;
  const card2 = useRef(new Animated.Value(1)).current;
  const card3 = useRef(new Animated.Value(1)).current;

  // 🔥 Autocomplete states
  const [fromText, setFromText] = useState("");
  const [toText, setToText] = useState("");

  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);

  // Filtering function
  const filterPlaces = (text) => {
    if (!text) return [];
    return LOCAL_PLACES.filter((item) =>
      item.toLowerCase().includes(text.toLowerCase())
    );
  };

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

      {/* Background SVG */}
      <View className="absolute top-0 left-0 right-0">
        <Svg height="220" width="100%">
          <Path d="M0 0 H400 V120 Q200 220 0 120 Z" fill={isDark ? "#1F2937" : "#FACC15"} />
          <Path
            d="M0 30 H400 V140 Q200 240 0 140 Z"
            fill={isDark ? "#374151" : "#FDE047"}
            opacity={0.5}
          />
        </Svg>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View className="pt-16 px-6 pb-3 flex-row justify-between items-center">
          <View>
            <Text className={`text-3xl font-extrabold ${isDark ? "text-white" : "text-gray-900"}`}>
              Waylink
            </Text>
            <Text className={`${isDark ? "text-gray-300" : "text-gray-700"} mt-1`}>
              Safe. Fast. Affordable.
            </Text>
          </View>

          <TouchableOpacity onPress={toggleTheme} className="p-3 bg-white/20 rounded-full">
            {isDark ? (
              <Ionicons name="sunny-outline" size={26} color="yellow" />
            ) : (
              <Ionicons name="moon-outline" size={26} color="#333" />
            )}
          </TouchableOpacity>
        </View>

        {/* FROM & TO BOX */}
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }} className="px-6 mt-2">
          <View
            className={`rounded-3xl p-5 shadow border ${
              isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}
            style={{ elevation: 5 }}
          >

            {/* FROM */}
            <View className="mb-4">
              <View className="flex-row items-center mb-2">
                <Ionicons name="location-outline" size={26} color="#FACC15" />
                <TextInput
                  placeholder="From"
                  value={fromText}
                  onChangeText={(t) => {
                    setFromText(t);
                    setFromSuggestions(filterPlaces(t));
                  }}
                  placeholderTextColor={isDark ? "#bbb" : "#666"}
                  className={`flex-1 ml-3 text-lg ${isDark ? "text-white" : "text-gray-900"}`}
                />
              </View>

              {fromSuggestions.length > 0 && (
                <View className={`${isDark ? "bg-gray-800" : "bg-white"} p-3 rounded-xl`}>
                  {fromSuggestions.map((place, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        setFromText(place);
                        setFromSuggestions([]);
                      }}
                      className="py-2"
                    >
                      <Text className={`${isDark ? "text-white" : "text-gray-800"}`}>{place}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View className={`h-[1px] ${isDark ? "bg-gray-700" : "bg-gray-200"} my-2`} />

            {/* TO */}
            <View>
              <View className="flex-row items-center mb-2">
                <Ionicons name="flag-outline" size={26} color="#FACC15" />
                <TextInput
                  placeholder="To"
                  value={toText}
                  onChangeText={(t) => {
                    setToText(t);
                    setToSuggestions(filterPlaces(t));
                  }}
                  placeholderTextColor={isDark ? "#bbb" : "#666"}
                  className={`flex-1 ml-3 text-lg ${isDark ? "text-white" : "text-gray-900"}`}
                />
              </View>

              {toSuggestions.length > 0 && (
                <View className={`${isDark ? "bg-gray-800" : "bg-white"} p-3 rounded-xl`}>
                  {toSuggestions.map((place, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        setToText(place);
                        setToSuggestions([]);
                      }}
                      className="py-2"
                    >
                      <Text className={`${isDark ? "text-white" : "text-gray-800"}`}>{place}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* SEARCH BUTTON */}
            <View className="mt-4">
              <TouchableOpacity
                onPress={() => router.push("/long-trip/results")}
                className={`p-4 rounded-2xl ${isDark ? "bg-yellow-500" : "bg-yellow-400"}`}
              >
                <Text className="text-center text-white font-bold text-lg">Search Rides</Text>
              </TouchableOpacity>
            </View>

          </View>
        </Animated.View>

        {/* SAVED LOCATIONS */}
        <View className="px-6 mt-6">
          <Text className={`text-xl font-semibold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
            Offers
          </Text>
        {/* (existing saved locations code stays the same) */}
        </View>

        {/* PROMO BANNERS */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-6 px-6">
          {ads.map((item, index) => (
            <Animated.View
              key={index}
              style={{
                transform: [{ scale: index === 0 ? card1 : index === 1 ? card2 : card3 }],
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

         <ScrollView
        className="px-6 mt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >

        {/* LONG TRIP */}
        <TouchableOpacity
          onPress={() => router.push("/long-trip")}
          className="bg-white p-6 rounded-3xl shadow border border-gray-200 mb-5"
        >
          <FontAwesome5 name="route" size={36} color="#333" />
          <Text className="text-xl font-bold text-gray-900 mt-3">Long Trip</Text>
          <Text className="text-gray-600 mt-1">
            Outstation travel made easy.
          </Text>
        </TouchableOpacity>

        {/* SHARING */}
        <TouchableOpacity
          onPress={() => router.push("/sharing")}
          className="bg-white p-6 rounded-3xl shadow border border-gray-200 mb-5"
        >
          <Ionicons name="people-outline" size={36} color="#333" />
          <Text className="text-xl font-bold text-gray-900 mt-3">Sharing Ride</Text>
          <Text className="text-gray-600 mt-1">Affordable shared commute.</Text>
        </TouchableOpacity>

        {/* DAILY CAB */}
        <TouchableOpacity
          onPress={() => router.push("/daily-cab")}
          className="bg-white p-6 rounded-3xl shadow border border-gray-200 mb-5"
        >
          <FontAwesome5 name="taxi" size={36} color="#333" />
          <Text className="text-xl font-bold text-gray-900 mt-3">
            Daily Fixed Cab
          </Text>
          <Text className="text-gray-600 mt-1">
            Your everyday commute at a fixed time.
          </Text>
        </TouchableOpacity>

      </ScrollView>


      </ScrollView>

      {/* Bottom Nav */}
      <BottomNav />
    </View>
  );
}
