import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker, AnimatedRegion, LatLng } from "react-native-maps";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useApi, Ride, RideStatus } from "../services/api";

export default function RideStarted() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const rideId = params.rideId as string;
  const api = useApi();

  const [ride, setRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [driverCoords, setDriverCoords] = useState<LatLng>({
    latitude: 12.9716,
    longitude: 77.5946,
  });

  const driverPosition = useRef(
    new AnimatedRegion({
      latitude: 12.9716,
      longitude: 77.5946,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    })
  ).current;

  const fetchRide = useCallback(async () => {
    if (!rideId) return;
    try {
      const data = await api.getRide(rideId);
      setRide(data);

      if (data.driver?.currentLat && data.driver?.currentLng) {
        const newCoords = {
          latitude: data.driver.currentLat,
          longitude: data.driver.currentLng,
        };
        setDriverCoords(newCoords);
        driverPosition.timing({
          ...newCoords,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
          duration: 1000,
          useNativeDriver: false,
        } as any).start();
      }

      if (data.status === RideStatus.COMPLETED) {
        router.replace({ pathname: "/ride/competed" as any, params: { rideId } });
      } else if (data.status === RideStatus.CANCELLED) {
        Alert.alert("Ride Cancelled", "This ride has been cancelled.");
        router.replace("/");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [rideId, api]);

  useEffect(() => {
    fetchRide();
    const interval = setInterval(fetchRide, 5000);
    return () => clearInterval(interval);
  }, [fetchRide]);

  const handleCall = () => {
    if (ride?.driver?.user?.phone) {
      Linking.openURL(`tel:${ride.driver.user.phone}`);
    }
  };

  const handleShare = async () => {
    const message = `I'm on a ride with WayLink. Track me: Driver ${ride?.driver?.user?.firstName || "Unknown"}, Vehicle: ${ride?.driver?.licensePlate || "N/A"}`;
    try {
      await Linking.openURL(`sms:?body=${encodeURIComponent(message)}`);
    } catch {
      Alert.alert("Error", "Could not share ride details");
    }
  };

  const handleSOS = () => {
    Alert.alert(
      "Emergency SOS",
      "Are you sure you want to trigger an emergency alert?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Call Emergency",
          style: "destructive",
          onPress: () => Linking.openURL("tel:112"),
        },
      ]
    );
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#FACC15" />
        <Text className="mt-4 text-gray-600">Loading ride details...</Text>
      </View>
    );
  }

  if (error || !ride) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center p-6">
        <Text className="text-red-500 text-center">{error || "Ride not found"}</Text>
        <TouchableOpacity
          onPress={() => router.replace("/")}
          className="mt-4 bg-yellow-500 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-semibold">Go Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const dropLocation = {
    latitude: ride.drop?.lat || 12.9816,
    longitude: ride.drop?.lng || 77.6046,
  };

  const driverInitial = {
    latitude: ride.driver?.currentLat || 12.9716,
    longitude: ride.driver?.currentLng || 77.5946,
  };

  return (
    <View className="flex-1 bg-gray-50">
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: driverInitial.latitude,
          longitude: driverInitial.longitude,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        }}
        showsUserLocation={false}
      >
        <Marker.Animated coordinate={driverCoords as any}>
          <View className="bg-white p-3 rounded-full shadow" style={{ elevation: 8 }}>
            <FontAwesome5 name="car-side" size={28} color="#111" />
          </View>
        </Marker.Animated>

        <Marker coordinate={dropLocation}>
          <View className="w-5 h-5 rounded-full bg-yellow-600 border-2 border-white" />
        </Marker>
      </MapView>

      <View
        className="absolute top-10 left-4 right-4 bg-white rounded-3xl p-4 shadow-lg"
        style={{ elevation: 12 }}
      >
        <View className="flex-row items-center">
          <Image
            source={{ 
              uri: ride.driver?.user?.profileImage || "https://i.ibb.co/ZY7fCFw/driver.jpg" 
            }}
            className="w-14 h-14 rounded-full"
          />

          <View className="ml-3 flex-1">
            <Text className="text-lg font-bold text-gray-900">
              {ride.driver?.user?.firstName || "Driver"} {ride.driver?.user?.lastName || ""}
            </Text>
            <Text className="text-gray-500 text-sm">
              ⭐ {ride.driver?.rating?.toFixed(1) || "5.0"} • {ride.driver?.vehicleType || "Sedan"} • {ride.driver?.licensePlate || "N/A"}
            </Text>
          </View>

          <TouchableOpacity 
            onPress={handleCall}
            className="bg-yellow-500 p-3 rounded-full shadow" 
            style={{ elevation: 4 }}
          >
            <Ionicons name="call" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 shadow-xl"
        style={{ elevation: 12 }}
      >
        <Text className="text-xl font-extrabold text-gray-900">
          Ride in Progress
        </Text>
        <Text className="text-gray-600 mt-1">
          Sit back and relax — you're on the way to your destination.
        </Text>

        <View className="flex-row justify-between mt-5">
          <View>
            <Text className="text-gray-500">Distance</Text>
            <Text className="text-gray-900 font-semibold text-lg">
              {ride.distance ? `${ride.distance.toFixed(1)} km` : "Calculating..."}
            </Text>
          </View>

          <View>
            <Text className="text-gray-500">Time</Text>
            <Text className="text-gray-900 font-semibold text-lg">
              {ride.duration ? `${ride.duration} min` : "Calculating..."}
            </Text>
          </View>

          <View>
            <Text className="text-gray-500">Fare</Text>
            <Text className="text-yellow-600 font-extrabold text-lg">
              ₹ {ride.fare || "---"}
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between mt-6">
          <TouchableOpacity
            onPress={handleShare}
            className="flex-row items-center bg-gray-100 px-5 py-4 rounded-2xl"
          >
            <Ionicons name="share-social-outline" size={22} color="#333" />
            <Text className="ml-2 text-gray-800 font-semibold">Share Ride</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSOS}
            className="flex-row items-center bg-red-500 px-5 py-4 rounded-2xl"
            style={{ elevation: 3 }}
          >
            <Ionicons name="alert-circle" size={24} color="#fff" />
            <Text className="ml-2 text-white font-semibold">SOS</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
