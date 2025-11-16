// app/ride/shared-rating.tsx
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Animated,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "expo-router";

export default function SharedRating() {
  const router = useRouter();

  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.1, duration: 600, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View className="flex-1 bg-gray-50">

      {/* PREMIUM YELLOW HEADER */}
      <View className="absolute top-0 left-0 right-0">
        <Svg height="230" width="100%">
          <Path d="M0 0 H400 V120 Q200 230 0 120 Z" fill="#FACC15" />
          <Path d="M0 30 H400 V150 Q200 260 0 150 Z" fill="#FDE047" opacity={0.5} />
        </Svg>
      </View>

      {/* BACK BUTTON */}
      <TouchableOpacity
        onPress={() => router.replace("/home")}
        className="absolute top-14 left-6 bg-white p-3 rounded-full shadow"
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      {/* HEADER TEXT */}
      <View className="mt-28 px-6">
        <Text className="text-3xl font-extrabold text-gray-900">
          Rate Your Ride
        </Text>
        <Text className="text-gray-700 mt-1">Help improve shared rides</Text>
      </View>

      <View className="px-6 mt-10">

        {/* DRIVER INITIALS AVATAR */}
        <View className="items-center">
          <Animated.View style={{ transform: [{ scale: pulse }] }}>
            <View className="w-24 h-24 rounded-full bg-yellow-300 items-center justify-center">
              <Text className="text-3xl font-extrabold text-gray-800">AS</Text>
            </View>
          </Animated.View>

          <Text className="text-2xl font-bold text-gray-900 mt-3">
            Arun Sharma
          </Text>
          <Text className="text-gray-600">Your shared ride driver</Text>
        </View>

        {/* STAR RATING */}
        <View className="flex-row justify-center mt-6 space-x-4">
          {[1,2,3,4,5].map((i) => (
            <TouchableOpacity key={i} onPress={() => setRating(i)}>
              <Ionicons
                name={i <= rating ? "star" : "star-outline"}
                size={40}
                color={i <= rating ? "#FACC15" : "#999"}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* FEEDBACK INPUT */}
        <TextInput
          placeholder="Share your experience (optional)"
          placeholderTextColor="#aaa"
          multiline
          value={feedback}
          onChangeText={setFeedback}
          className="bg-white border border-gray-200 rounded-2xl p-4 mt-8 text-gray-900"
          style={{ height: 130 }}
        />

        {/* SUBMIT BUTTON */}
        <TouchableOpacity
          className="bg-yellow-500 p-5 rounded-3xl items-center shadow mt-10"
          onPress={() => {
            alert("Thank you for rating!");
            router.replace("/home");
          }}
        >
          <Text className="text-white text-lg font-bold">
            Submit Rating
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
