import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
  Animated,
  Alert,
  ActivityIndicator,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useApi, DailyCabSubscription, Location, LocationInput } from "./services/api";

const DAY_MAP: { [key: string]: number } = {
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
  Sun: 0,
};

const REVERSE_DAY_MAP: { [key: number]: string } = {
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat",
  0: "Sun",
};

export default function DailyCab() {
  const router = useRouter();
  const api = useApi();

  const [repeat, setRepeat] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  
  const [pickupText, setPickupText] = useState("");
  const [pickupLocation, setPickupLocation] = useState<Location | null>(null);
  const [pickupSuggestions, setPickupSuggestions] = useState<Location[]>([]);
  const [loadingPickup, setLoadingPickup] = useState(false);
  
  const [dropText, setDropText] = useState("");
  const [dropLocation, setDropLocation] = useState<Location | null>(null);
  const [dropSuggestions, setDropSuggestions] = useState<Location[]>([]);
  const [loadingDrop, setLoadingDrop] = useState(false);
  
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d;
  });
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [existingSubscription, setExistingSubscription] = useState<DailyCabSubscription | null>(null);
  const [checkingSubscription, setCheckingSubscription] = useState(true);

  const fade = useRef(new Animated.Value(0)).current;
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const toggleDay = (d: string) => {
    if (selectedDays.includes(d)) {
      setSelectedDays(selectedDays.filter((x) => x !== d));
    } else {
      setSelectedDays([...selectedDays, d]);
    }
  };

  const searchLocations = useCallback(async (text: string, isPickup: boolean) => {
    if (!text || text.length < 2) {
      isPickup ? setPickupSuggestions([]) : setDropSuggestions([]);
      return;
    }

    isPickup ? setLoadingPickup(true) : setLoadingDrop(true);
    try {
      const result = await api.getLocations({ search: text, limit: 8 });
      isPickup ? setPickupSuggestions(result.locations) : setDropSuggestions(result.locations);
    } catch (error) {
      console.error("Error searching locations:", error);
    } finally {
      isPickup ? setLoadingPickup(false) : setLoadingDrop(false);
    }
  }, [api]);

  const handlePickupTextChange = (text: string) => {
    setPickupText(text);
    setPickupLocation(null);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => searchLocations(text, true), 300);
  };

  const handleDropTextChange = (text: string) => {
    setDropText(text);
    setDropLocation(null);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => searchLocations(text, false), 300);
  };

  const selectPickupLocation = (location: Location) => {
    setPickupText(`${location.locationName}, ${location.city}`);
    setPickupLocation(location);
    setPickupSuggestions([]);
  };

  const selectDropLocation = (location: Location) => {
    setDropText(`${location.locationName}, ${location.city}`);
    setDropLocation(location);
    setDropSuggestions([]);
  };

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    checkExistingSubscription();
  }, []);

  const checkExistingSubscription = async () => {
    try {
      const subscription = await api.getDailyCabSubscription();
      setExistingSubscription(subscription);
      if (subscription.pickup) {
        setPickupText(`${subscription.pickup.locationName}, ${subscription.pickup.city}`);
      }
      if (subscription.drop) {
        setDropText(`${subscription.drop.locationName}, ${subscription.drop.city}`);
      }
      setSelectedSlot(subscription.pickupTime);
      setSelectedDays(subscription.daysOfWeek.map(d => REVERSE_DAY_MAP[d]));
      setStartDate(new Date(subscription.startDate));
      setEndDate(new Date(subscription.endDate));
    } catch {
    } finally {
      setCheckingSubscription(false);
    }
  };

  const convertSlotTo24h = (slot: string): string => {
    const [time, period] = slot.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  };

  const handleSubscribe = async () => {
    if (!pickupLocation || !dropLocation) {
      Alert.alert("Error", "Please select pickup and drop locations from suggestions");
      return;
    }

    if (!selectedSlot) {
      Alert.alert("Error", "Please select a time slot");
      return;
    }

    if (selectedDays.length === 0) {
      Alert.alert("Error", "Please select at least one day");
      return;
    }

    setLoading(true);
    try {
      const daysOfWeek = selectedDays.map(d => DAY_MAP[d]);
      const pickupTime = convertSlotTo24h(selectedSlot);

      const pickup: LocationInput = {
        state: pickupLocation.state,
        district: pickupLocation.district,
        city: pickupLocation.city,
        locationName: pickupLocation.locationName,
        address: pickupLocation.address,
        pincode: pickupLocation.pincode,
        landmark: pickupLocation.landmark,
        lat: pickupLocation.lat,
        lng: pickupLocation.lng,
      };

      const drop: LocationInput = {
        state: dropLocation.state,
        district: dropLocation.district,
        city: dropLocation.city,
        locationName: dropLocation.locationName,
        address: dropLocation.address,
        pincode: dropLocation.pincode,
        landmark: dropLocation.landmark,
        lat: dropLocation.lat,
        lng: dropLocation.lng,
      };

      const subscription = await api.subscribeDailyCab({
        pickup,
        drop,
        pickupTime,
        daysOfWeek,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        fare: 2500,
      });

      setExistingSubscription(subscription);
      router.push("/ride/daily-cab-confirm");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to create subscription");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!existingSubscription) return;

    Alert.alert(
      "Cancel Subscription",
      "Are you sure you want to cancel your daily cab subscription?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              await api.cancelDailyCabSubscription(existingSubscription.id);
              setExistingSubscription(null);
              Alert.alert("Success", "Subscription cancelled");
            } catch (error: any) {
              Alert.alert("Error", error.message || "Failed to cancel");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  if (checkingSubscription) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#FACC15" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="absolute top-0 left-0 right-0">
        <Svg height="250" width="100%">
          <Path d="M0 0 H400 V130 Q200 250 0 130 Z" fill="#FACC15" />
          <Path d="M0 35 H400 V150 Q200 270 0 150 Z" fill="#FDE047" opacity={0.5} />
        </Svg>
      </View>

      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-14 left-6 bg-white p-3 rounded-full shadow"
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <View className="mt-28 px-6">
        <Text className="text-3xl font-extrabold text-gray-900">Daily Fixed Cab</Text>
        <Text className="text-gray-700 mt-1">
          {existingSubscription ? "Manage your subscription" : "Set your daily pickup schedule"}
        </Text>
      </View>

      <ScrollView
        className="px-6 mt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 150 }}
      >
        {existingSubscription && (
          <View className="bg-green-50 p-4 rounded-2xl border border-green-200 mb-6">
            <View className="flex-row items-center">
              <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
              <Text className="ml-2 text-green-700 font-semibold">Active Subscription</Text>
            </View>
            <Text className="text-green-600 mt-1 text-sm">
              Status: {existingSubscription.status}
            </Text>
          </View>
        )}

        <Animated.View style={{ opacity: fade }}>
          <View className="bg-white p-5 rounded-3xl shadow border border-gray-200">
            <View className="flex-row items-center">
              <Ionicons name="location-outline" size={26} color="#FACC15" />
              <TextInput
                placeholder="Pickup location"
                placeholderTextColor="#999"
                value={pickupText}
                onChangeText={handlePickupTextChange}
                className="ml-3 flex-1 text-gray-900"
                editable={!existingSubscription}
              />
              {loadingPickup && <ActivityIndicator size="small" color="#FACC15" />}
            </View>

            {pickupSuggestions.length > 0 && (
              <View className="mt-2 bg-gray-50 rounded-xl p-2">
                {pickupSuggestions.map((location) => (
                  <TouchableOpacity
                    key={location.id}
                    onPress={() => selectPickupLocation(location)}
                    className="py-2 px-2"
                  >
                    <Text className="text-gray-800 font-medium">{location.locationName}</Text>
                    <Text className="text-gray-500 text-xs">{location.city}, {location.district}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View className="h-[1px] bg-gray-200 my-4" />

            <View className="flex-row items-center">
              <Ionicons name="flag-outline" size={26} color="#FACC15" />
              <TextInput
                placeholder="Drop location"
                placeholderTextColor="#999"
                value={dropText}
                onChangeText={handleDropTextChange}
                className="ml-3 flex-1 text-gray-900"
                editable={!existingSubscription}
              />
              {loadingDrop && <ActivityIndicator size="small" color="#FACC15" />}
            </View>

            {dropSuggestions.length > 0 && (
              <View className="mt-2 bg-gray-50 rounded-xl p-2">
                {dropSuggestions.map((location) => (
                  <TouchableOpacity
                    key={location.id}
                    onPress={() => selectDropLocation(location)}
                    className="py-2 px-2"
                  >
                    <Text className="text-gray-800 font-medium">{location.locationName}</Text>
                    <Text className="text-gray-500 text-xs">{location.city}, {location.district}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </Animated.View>

        <View className="mt-8">
          <Text className="text-lg font-bold text-gray-900 mb-3">Select Time Slot</Text>

          <View className="flex-row flex-wrap">
            {slots.map((t) => (
              <TouchableOpacity
                key={t}
                onPress={() => !existingSubscription && setSelectedSlot(t)}
                disabled={!!existingSubscription}
                className={`px-4 py-3 rounded-2xl mr-3 mb-3 border 
                  ${selectedSlot === t ? "bg-yellow-500 border-yellow-600" : "bg-white border-gray-300"}
                  ${existingSubscription ? "opacity-60" : ""}
                `}
              >
                <Text className={`${selectedSlot === t ? "text-white" : "text-gray-900"} font-semibold`}>
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="mt-8">
          <Text className="text-lg font-bold text-gray-900 mb-3">Repeat on Days</Text>

          <View className="flex-row justify-between">
            {days.map((d) => (
              <TouchableOpacity
                key={d}
                onPress={() => !existingSubscription && toggleDay(d)}
                disabled={!!existingSubscription}
                className={`w-12 h-12 rounded-full items-center justify-center border 
                  ${
                    selectedDays.includes(d)
                      ? "bg-yellow-400 border-yellow-600"
                      : "bg-white border-gray-300"
                  }
                  ${existingSubscription ? "opacity-60" : ""}`}
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

        {!existingSubscription && (
          <>
            <TouchableOpacity
              onPress={() => setShowStartPicker(true)}
              className="bg-white p-5 rounded-3xl mt-6 border border-gray-200 shadow"
            >
              <Text className="text-gray-600 font-semibold">Start Date</Text>
              <Text className="text-gray-900 text-lg mt-1">{startDate.toDateString()}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowEndPicker(true)}
              className="bg-white p-5 rounded-3xl mt-4 border border-gray-200 shadow"
            >
              <Text className="text-gray-600 font-semibold">End Date</Text>
              <Text className="text-gray-900 text-lg mt-1">{endDate.toDateString()}</Text>
            </TouchableOpacity>
          </>
        )}

        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            minimumDate={new Date()}
            onChange={(e, date) => {
              setShowStartPicker(false);
              if (date) setStartDate(date);
            }}
          />
        )}

        {showEndPicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            minimumDate={startDate}
            onChange={(e, date) => {
              setShowEndPicker(false);
              if (date) setEndDate(date);
            }}
          />
        )}

        <View className="flex-row justify-between items-center bg-white p-5 rounded-3xl mt-8 border border-gray-200 shadow">
          <Text className="text-lg font-semibold text-gray-900">Repeat Weekly</Text>
          <Switch 
            value={repeat} 
            onValueChange={setRepeat} 
            thumbColor="#FACC15" 
            disabled={!!existingSubscription}
          />
        </View>

        {existingSubscription ? (
          <TouchableOpacity
            onPress={handleCancelSubscription}
            disabled={loading}
            className="bg-red-500 p-5 rounded-3xl items-center mt-10 shadow"
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-lg">Cancel Subscription</Text>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleSubscribe}
            disabled={loading}
            className="bg-yellow-500 p-5 rounded-3xl items-center mt-10 shadow"
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-lg">Confirm Schedule</Text>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}
