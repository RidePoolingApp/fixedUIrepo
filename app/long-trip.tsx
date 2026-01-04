import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  ActivityIndicator,
  TextInput,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState, useCallback, useRef } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useApi, RideType, Location, LocationInput } from "./services/api";

export default function LongTrip() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const api = useApi();

  const [fromText, setFromText] = useState("");
  const [fromLocation, setFromLocation] = useState<Location | null>(null);
  const [fromSuggestions, setFromSuggestions] = useState<Location[]>([]);
  const [loadingFrom, setLoadingFrom] = useState(false);
  
  const [toText, setToText] = useState("");
  const [toLocation, setToLocation] = useState<Location | null>(null);
  const [toSuggestions, setToSuggestions] = useState<Location[]>([]);
  const [loadingTo, setLoadingTo] = useState(false);
  
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [isReturn, setIsReturn] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (params.from) setFromText(params.from as string);
    if (params.to) setToText(params.to as string);
    if (params.pickupName) setFromText(params.pickupName as string);
    if (params.dropName) setToText(params.dropName as string);
  }, [params]);

  const searchLocations = useCallback(async (text: string, isFrom: boolean) => {
    if (!text || text.length < 2) {
      isFrom ? setFromSuggestions([]) : setToSuggestions([]);
      return;
    }

    isFrom ? setLoadingFrom(true) : setLoadingTo(true);
    try {
      const result = await api.getLocations({ search: text, limit: 10 });
      isFrom ? setFromSuggestions(result.locations) : setToSuggestions(result.locations);
    } catch (error) {
      console.error("Error searching locations:", error);
    } finally {
      isFrom ? setLoadingFrom(false) : setLoadingTo(false);
    }
  }, [api]);

  const handleFromTextChange = (text: string) => {
    setFromText(text);
    setFromLocation(null);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => searchLocations(text, true), 300);
  };

  const handleToTextChange = (text: string) => {
    setToText(text);
    setToLocation(null);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => searchLocations(text, false), 300);
  };

  const selectFromLocation = (location: Location) => {
    setFromText(`${location.locationName}, ${location.city}`);
    setFromLocation(location);
    setFromSuggestions([]);
  };

  const selectToLocation = (location: Location) => {
    setToText(`${location.locationName}, ${location.city}`);
    setToLocation(location);
    setToSuggestions([]);
  };

  const handleSearchCabs = async () => {
    if (!fromLocation || !toLocation) {
      Alert.alert("Error", "Please select pickup and drop locations from suggestions");
      return;
    }

    setLoading(true);
    try {
      const pickup: LocationInput = {
        state: fromLocation.state,
        district: fromLocation.district,
        city: fromLocation.city,
        locationName: fromLocation.locationName,
        address: fromLocation.address,
        pincode: fromLocation.pincode,
        landmark: fromLocation.landmark,
        lat: fromLocation.lat,
        lng: fromLocation.lng,
      };

      const drop: LocationInput = {
        state: toLocation.state,
        district: toLocation.district,
        city: toLocation.city,
        locationName: toLocation.locationName,
        address: toLocation.address,
        pincode: toLocation.pincode,
        landmark: toLocation.landmark,
        lat: toLocation.lat,
        lng: toLocation.lng,
      };

      const ride = await api.createRide({
        type: RideType.LONG_TRIP,
        pickup,
        drop,
        scheduledAt: date > new Date() ? date.toISOString() : undefined,
      });

      router.push({
        pathname: "/ride/finding",
        params: {
          rideId: ride.id,
        },
      });
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to create ride request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="absolute top-0 left-0 right-0">
        <Svg height="260" width="100%">
          <Path
            d="M0 0 H400 V140 Q200 260 0 140 Z"
            fill="#FACC15"
          />
          <Path
            d="M0 40 H400 V180 Q200 300 0 180 Z"
            fill="#FDE047"
            opacity={0.4}
          />
        </Svg>
      </View>

      <View className="pt-14 px-6">
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-white p-3 w-12 rounded-full shadow"
          style={{ elevation: 5 }}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text className="text-3xl font-extrabold mt-4 text-gray-900">
          Long Trip
        </Text>
        <Text className="text-gray-700 mt-1 text-base font-medium">
          Book outstation rides in minutes.
        </Text>
      </View>

      <ScrollView
        className="mt-6 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        <View
          className="bg-white rounded-3xl p-6 shadow border border-gray-100"
          style={{ elevation: 6 }}
        >
          <View className="flex-row items-center">
            <View className="w-4 h-4 bg-yellow-500 rounded-full" />
            <TextInput
              placeholder="Pickup Location"
              placeholderTextColor="#999"
              value={fromText}
              onChangeText={handleFromTextChange}
              className="flex-1 ml-4 text-gray-900 font-semibold text-lg"
            />
            {loadingFrom && <ActivityIndicator size="small" color="#FACC15" />}
          </View>

          {fromSuggestions.length > 0 && (
            <View className="mt-2 bg-gray-50 rounded-xl p-2">
              {fromSuggestions.map((location) => (
                <TouchableOpacity
                  key={location.id}
                  onPress={() => selectFromLocation(location)}
                  className="py-2 px-2"
                >
                  <Text className="text-gray-800 font-medium">{location.locationName}</Text>
                  <Text className="text-gray-500 text-sm">{location.city}, {location.district}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View className="ml-1 mt-2 mb-2 h-10 border-l-2 border-gray-300" />

          <View className="flex-row items-center">
            <View className="w-4 h-4 bg-gray-900 rounded-full" />
            <TextInput
              placeholder="Drop Location"
              placeholderTextColor="#999"
              value={toText}
              onChangeText={handleToTextChange}
              className="flex-1 ml-4 text-gray-900 font-semibold text-lg"
            />
            {loadingTo && <ActivityIndicator size="small" color="#FACC15" />}
          </View>

          {toSuggestions.length > 0 && (
            <View className="mt-2 bg-gray-50 rounded-xl p-2">
              {toSuggestions.map((location) => (
                <TouchableOpacity
                  key={location.id}
                  onPress={() => selectToLocation(location)}
                  className="py-2 px-2"
                >
                  <Text className="text-gray-800 font-medium">{location.locationName}</Text>
                  <Text className="text-gray-500 text-sm">{location.city}, {location.district}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <TouchableOpacity
          onPress={() => setShowPicker(true)}
          className="bg-white rounded-3xl p-6 shadow border border-gray-100 mt-6"
          style={{ elevation: 5 }}
        >
          <Text className="text-gray-700 font-semibold">Travel Date</Text>
          <View className="flex-row items-center mt-2">
            <Ionicons name="calendar-outline" size={26} color="#FACC15" />
            <Text className="ml-3 text-lg text-gray-900">
              {date.toDateString()}
            </Text>
          </View>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            value={date}
            mode="date"
            minimumDate={new Date()}
            onChange={(event, selectedDate) => {
              const curr = selectedDate || date;
              setShowPicker(false);
              setDate(curr);
            }}
          />
        )}

        <View
          className="bg-white rounded-3xl p-6 shadow border border-gray-100 mt-6 flex-row justify-between items-center"
          style={{ elevation: 5 }}
        >
          <View>
            <Text className="text-gray-900 text-lg font-semibold">
              Return Trip
            </Text>
            <Text className="text-gray-500 text-sm">Need return cab?</Text>
          </View>
          <Switch
            value={isReturn}
            onValueChange={setIsReturn}
            trackColor={{ true: "#FACC15" }}
          />
        </View>

        <TouchableOpacity
          onPress={handleSearchCabs}
          disabled={loading}
          className="bg-yellow-500 mt-8 p-5 rounded-3xl items-center shadow"
          style={{ elevation: 5, opacity: loading ? 0.7 : 1 }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-lg font-bold">Search Cabs</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
