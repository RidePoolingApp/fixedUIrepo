import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useApi, Ride, PaymentMethod, PaymentStatus } from "../services/api";

export default function RideCompleted() {
  const router = useRouter();
  const api = useApi();
  const params = useLocalSearchParams<{ rideId?: string }>();
  const rideId = params.rideId;

  const [ride, setRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [submittingRating, setSubmittingRating] = useState(false);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  useEffect(() => {
    const fetchRide = async () => {
      if (!rideId) {
        setLoading(false);
        return;
      }
      try {
        const rideData = await api.getRide(rideId);
        setRide(rideData);
        if (rideData.rating) {
          setRating(rideData.rating.score);
          setRatingSubmitted(true);
        }
      } catch (error) {
        console.error("Error fetching ride:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRide();
  }, [rideId]);

  const submitRating = async () => {
    if (!rideId || rating === 0) return;
    
    setSubmittingRating(true);
    try {
      await api.rateRide(rideId, rating);
      setRatingSubmitted(true);
      Alert.alert("Thank you!", "Your rating has been submitted.");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to submit rating");
    } finally {
      setSubmittingRating(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#FACC15" />
      </View>
    );
  }

  const pickupAddress = ride?.pickup?.locationName 
    ? `${ride.pickup.locationName}, ${ride.pickup.city}` 
    : "Pickup Location";
  const dropAddress = ride?.drop?.locationName 
    ? `${ride.drop.locationName}, ${ride.drop.city}` 
    : "Drop Location";

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

      <View className="absolute top-14 w-full px-6 z-10">
        <Text className="text-3xl font-extrabold text-gray-900">
          Ride Completed
        </Text>
        <Text className="text-gray-700 mt-1">
          Your trip summary and invoice are ready
        </Text>
      </View>

      <ScrollView
        className="mt-40 px-6"
        contentContainerStyle={{ paddingBottom: 180 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 mb-6"
          style={{ elevation: 6 }}
        >
          <Text className="text-xl text-gray-900 font-bold">Trip Summary</Text>

          <View className="mt-6">
            <View className="flex-row items-center">
              <View className="w-3 h-3 bg-yellow-500 rounded-full" />
              <Text className="ml-3 text-gray-900 text-lg font-semibold">
                {pickupAddress}
              </Text>
            </View>

            <View className="ml-1 mt-2 mb-2 h-10 border-l-2 border-gray-300" />

            <View className="flex-row items-center">
              <View className="w-3 h-3 bg-gray-700 rounded-full" />
              <Text className="ml-3 text-gray-900 text-lg font-semibold">
                {dropAddress}
              </Text>
            </View>
          </View>

          <View className="flex-row justify-between mt-6">
            <View>
              <Text className="text-gray-500">Distance</Text>
              <Text className="text-gray-900 text-lg font-semibold">
                {ride?.distance || 0} km
              </Text>
            </View>
            <View>
              <Text className="text-gray-500">Duration</Text>
              <Text className="text-gray-900 text-lg font-semibold">
                {ride?.duration || 0} min
              </Text>
            </View>
          </View>
        </View>

        <View
          className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 mb-6"
          style={{ elevation: 6 }}
        >
          <Text className="text-xl text-gray-900 font-bold">Fare Details</Text>

          <View className="mt-4">
            <View className="h-[1px] bg-gray-200 my-3" />

            <View className="flex-row justify-between">
              <Text className="text-gray-900 text-xl font-bold">
                Total Amount
              </Text>
              <Text className="text-yellow-600 text-2xl font-extrabold">
                ₹{ride?.fare || 0}
              </Text>
            </View>
          </View>
        </View>

        {ride?.driver && (
          <View
            className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 mb-6"
            style={{ elevation: 6 }}
          >
            <Text className="text-xl font-bold text-gray-900">Driver</Text>

            <View className="mt-4 flex-row items-center">
              <Image
                source={{ uri: ride.driver.user?.profileImage || "https://i.ibb.co/ZY7fCFw/driver.jpg" }}
                className="w-16 h-16 rounded-full"
              />
              <View className="ml-4">
                <Text className="text-lg text-gray-900 font-semibold">
                  {ride.driver.user?.firstName || "Driver"} {ride.driver.user?.lastName || ""}
                </Text>
                <Text className="text-gray-500">⭐ {ride.driver.rating?.toFixed(1) || "5.0"} • {ride.driver.totalTrips || 0} trips</Text>

                <Text className="mt-2 text-gray-700 font-medium">
                  {ride.driver.vehicleType} • {ride.driver.licensePlate}
                </Text>
              </View>
            </View>

            {!ratingSubmitted && (
              <View className="mt-6">
                <Text className="text-gray-700 font-medium mb-2">Rate your driver</Text>
                <View className="flex-row justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity key={star} onPress={() => setRating(star)} className="mx-2">
                      <Ionicons 
                        name={star <= rating ? "star" : "star-outline"} 
                        size={36} 
                        color="#FACC15" 
                      />
                    </TouchableOpacity>
                  ))}
                </View>
                {rating > 0 && (
                  <TouchableOpacity
                    onPress={submitRating}
                    disabled={submittingRating}
                    className="mt-4 bg-yellow-500 py-3 rounded-2xl items-center"
                  >
                    {submittingRating ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text className="text-white font-bold">Submit Rating</Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        )}

        <View
          className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 mb-6"
          style={{ elevation: 6 }}
        >
          <Text className="text-xl font-bold text-gray-900">Payment</Text>

          <View className="flex-row items-center mt-4 justify-between">
            <View className="flex-row items-center">
              <Ionicons name="card-outline" size={24} color="#333" />
              <Text className="ml-3 text-gray-900 text-lg">
                {ride?.payment?.method || "CASH"}
              </Text>
            </View>
            <Text className={`font-bold text-lg ${ride?.payment?.status === PaymentStatus.COMPLETED ? "text-green-600" : "text-yellow-600"}`}>
              {ride?.payment?.status === PaymentStatus.COMPLETED ? "Paid" : "Pending"}
            </Text>
          </View>

          {/* Pay Now button if payment is pending */}
          {ride?.payment?.status !== PaymentStatus.COMPLETED && (
            <TouchableOpacity
              onPress={() => router.push({
                pathname: "/ride/payment",
                params: { rideId, fare: String(ride?.fare || 0) },
              })}
              className="bg-yellow-500 py-3 rounded-2xl items-center mt-4"
            >
              <Text className="text-white font-bold text-lg">Pay Now - ₹{ride?.fare || 0}</Text>
            </TouchableOpacity>
          )}
        </View>

        <View>
          <TouchableOpacity
            className="bg-yellow-500 py-4 rounded-3xl items-center"
            style={{ elevation: 4 }}
          >
            <Text className="text-white text-lg font-bold">Download Invoice</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-white py-4 rounded-3xl items-center mt-3 border border-gray-200"
            style={{ elevation: 2 }}
            onPress={() => router.replace("/home")}
          >
            <Text className="text-gray-900 text-lg font-semibold">
              Back to Home
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
