// app/long-trip/results.tsx
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Results() {
  const router = useRouter();

  const cars = [
    {
      type: "Sedan",
      icon: <FontAwesome5 name="car-side" size={34} color="#222" />,
      price: "₹2,850",
      badge: "Most Affordable",
      seats: 4,
      bags: 2,
    },
    {
      type: "SUV",
      icon: <MaterialCommunityIcons name="car-suv" size={38} color="#222" />,
      price: "₹3,690",
      badge: "Family Choice",
      seats: 6,
      bags: 3,
    },
    {
      type: "Prime Sedan",
      icon: <Ionicons name="car-sport" size={38} color="#222" />,
      price: "₹4,350",
      badge: "Most Comfortable",
      seats: 4,
      bags: 2,
    },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      {/* Premium Header */}
      <View className="absolute top-0 left-0 right-0">
        <Svg height="260" width="100%">
          <Path
            d="M0 0 H400 V140 Q200 260 0 140 Z"
            fill="#FACC15"
          />
        </Svg>
      </View>

      {/* Back */}
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-14 left-6 bg-white p-3 rounded-full shadow"
        style={{ elevation: 5 }}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      {/* Title */}
      <View className="mt-28 px-6">
        <Text className="text-3xl font-extrabold text-gray-900">
          Select Your Ride
        </Text>
        <Text className="text-gray-700 mt-1">
          Best options for your long trip
        </Text>
      </View>

      <ScrollView
        className="mt-6 px-6"
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        {cars.map((car, i) => (
          <TouchableOpacity
            key={i}
            onPress={() =>
              router.push({
                pathname: "/long-trip/confirm",
                params: { carType: car.type, price: car.price },
              })
            }
            className="bg-white rounded-3xl p-6 shadow mb-6 border border-gray-100"
            style={{ elevation: 6 }}
          >
            {/* TOP ROW */}
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                {car.icon}
                <Text className="ml-4 text-xl font-bold text-gray-900">
                  {car.type}
                </Text>
              </View>

              {/* Price */}
              <Text className="text-yellow-600 text-2xl font-extrabold">
                {car.price}
              </Text>
            </View>

            {/* BADGE */}
            <View className="mt-3 bg-yellow-100 self-start px-3 py-1 rounded-full">
              <Text className="text-yellow-700 font-semibold text-xs">
                {car.badge}
              </Text>
            </View>

            {/* FEATURES */}
            <View className="flex-row space-x-6 mt-4">
              <View className="flex-row items-center">
                <Ionicons name="person-outline" size={20} color="#444" />
                <Text className="ml-2 text-gray-600">{car.seats} seats</Text>
              </View>

              <View className="flex-row items-center">
                <Ionicons name="briefcase-outline" size={20} color="#444" />
                <Text className="ml-2 text-gray-600">{car.bags} bags</Text>
              </View>

              <View className="flex-row items-center">
                <Ionicons name="snow-outline" size={20} color="#444" />
                <Text className="ml-2 text-gray-600">AC</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
