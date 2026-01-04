import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Animated,
  Alert,
  ActivityIndicator,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useApi } from "./services/api";

export default function SharingRide() {
  const router = useRouter();
  const api = useApi();

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
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [departureTime, setDepartureTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [shareType, setShareType] = useState<"normal" | "scheduled">("normal");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!pickupLocation.trim() || !dropLocation.trim()) {
      Alert.alert("Error", "Please enter pickup and drop locations");
      return;
    }

    setLoading(true);
    try {
      const rides = await api.searchSharedRides({
        routeStart: pickupLocation,
        routeEnd: dropLocation,
        departureTime: shareType === "scheduled" ? departureTime.toISOString() : new Date().toISOString(),
        seats: passengers,
      });

      router.push({
        pathname: "/share-results",
        params: {
          rides: JSON.stringify(rides),
          pickup: pickupLocation,
          drop: dropLocation,
          seats: passengers.toString(),
        },
      });
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to search shared rides");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
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

      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-14 left-6 bg-white p-3 rounded-full shadow"
        style={{ elevation: 5 }}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

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
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
          className="bg-white rounded-3xl p-6 shadow border border-gray-200"
        >
          <View className="flex-row items-center mb-5">
            <Ionicons name="location-outline" size={26} color="#FACC15" />
            <TextInput
              placeholder="Pickup location"
              placeholderTextColor="#999"
              value={pickupLocation}
              onChangeText={setPickupLocation}
              className="flex-1 ml-3 text-gray-900 text-lg"
            />
          </View>

          <View className="h-[1px] bg-gray-200" />

          <View className="flex-row items-center mt-5">
            <Ionicons name="flag-outline" size={26} color="#FACC15" />
            <TextInput
              placeholder="Drop location"
              placeholderTextColor="#999"
              value={dropLocation}
              onChangeText={setDropLocation}
              className="flex-1 ml-3 text-gray-900 text-lg"
            />
          </View>
        </Animated.View>

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

        <View
          className="bg-white rounded-3xl p-6 shadow mt-6 border border-gray-200"
          style={{ elevation: 4 }}
        >
          <Text className="text-xl font-bold text-gray-900">
            Sharing Options
          </Text>

          <View className="mt-4 space-y-4">
            <TouchableOpacity 
              onPress={() => setShareType("normal")}
              className={`flex-row items-center p-4 rounded-2xl border ${
                shareType === "normal" 
                  ? "bg-yellow-50 border-yellow-400" 
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <MaterialIcons
                name="group"
                size={30}
                color={shareType === "normal" ? "#f59e0b" : "#222"}
              />
              <View className="ml-4">
                <Text className="text-lg font-semibold text-gray-900">
                  Normal Share
                </Text>
                <Text className="text-gray-500 text-sm">
                  Cheapest & most common option
                </Text>
              </View>
              {shareType === "normal" && (
                <Ionicons name="checkmark-circle" size={24} color="#f59e0b" className="ml-auto" />
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => {
                setShareType("scheduled");
                setShowPicker(true);
              }}
              className={`flex-row items-center p-4 rounded-2xl border ${
                shareType === "scheduled" 
                  ? "bg-yellow-50 border-yellow-400" 
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <MaterialIcons 
                name="schedule" 
                size={30} 
                color={shareType === "scheduled" ? "#f59e0b" : "#222"} 
              />
              <View className="ml-4 flex-1">
                <Text className="text-lg font-semibold text-gray-900">
                  Scheduled Share
                </Text>
                <Text className="text-gray-500 text-sm">
                  {shareType === "scheduled" 
                    ? departureTime.toLocaleString() 
                    : "Book for a future time"}
                </Text>
              </View>
              {shareType === "scheduled" && (
                <Ionicons name="checkmark-circle" size={24} color="#f59e0b" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {showPicker && (
          <DateTimePicker
            value={departureTime}
            mode="datetime"
            minimumDate={new Date()}
            onChange={(event, selectedDate) => {
              setShowPicker(false);
              if (selectedDate) {
                setDepartureTime(selectedDate);
                setShareType("scheduled");
              }
            }}
          />
        )}

        <TouchableOpacity
          onPress={handleSearch}
          disabled={loading}
          className="bg-yellow-500 py-5 rounded-3xl items-center mt-10 shadow-lg"
          style={{ elevation: 6, opacity: loading ? 0.7 : 1 }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-xl font-bold">
              Find Shared Rides
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
