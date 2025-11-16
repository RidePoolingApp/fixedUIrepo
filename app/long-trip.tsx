// app/long-trip.tsx
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function LongTrip() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [isReturn, setIsReturn] = useState(false);

  useEffect(() => {
    if (params.from) setFromLocation(params.from);
    if (params.to) setToLocation(params.to);
  }, [params]);

  return (
    <View className="flex-1 bg-gray-50">

      {/* Premium Header */}
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

      {/* Top Bar */}
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
        {/* FROM - TO CARD */}
        <View
          className="bg-white rounded-3xl p-6 shadow border border-gray-100"
          style={{ elevation: 6 }}
        >
          {/* FROM */}
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/map-select",
                params: { field: "from" },
              })
            }
            className="flex-row items-center"
          >
            <View className="w-4 h-4 bg-yellow-500 rounded-full" />
            <Text className="ml-4 text-gray-900 font-semibold text-lg">
              {fromLocation || "Pickup Location"}
            </Text>
          </TouchableOpacity>

          {/* line connector */}
          <View className="ml-1 mt-2 mb-2 h-10 border-l-2 border-gray-300" />

          {/* TO */}
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/map-select",
                params: { field: "to" },
              })
            }
            className="flex-row items-center"
          >
            <View className="w-4 h-4 bg-gray-900 rounded-full" />
            <Text className="ml-4 text-gray-900 font-semibold text-lg">
              {toLocation || "Drop Location"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* DATE PICKER */}
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
            onChange={(event, selectedDate) => {
              const curr = selectedDate || date;
              setShowPicker(false);
              setDate(curr);
            }}
          />
        )}

        {/* RETURN TRIP */}
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

        {/* SEARCH CAB BTN */}
        <TouchableOpacity
          onPress={() => router.push("/long-trip/results")}
          className="bg-yellow-500 mt-8 p-5 rounded-3xl items-center shadow"
          style={{ elevation: 5 }}
        >
          <Text className="text-white text-lg font-bold">Search Cabs</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
