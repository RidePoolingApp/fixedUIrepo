import React, { useEffect, useRef, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, Image, Linking, Alert, ActivityIndicator } from "react-native";
import MapView, { Marker, AnimatedRegion, LatLng } from "react-native-maps";
import Svg, { Path } from "react-native-svg";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useApi, Ride, RideStatus } from "../services/api";

export default function LiveTracking() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const rideId = params.rideId as string;
  const api = useApi();

  const [ride, setRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eta, setEta] = useState<number | null>(null);
  const [driverCoords, setDriverCoords] = useState<LatLng>({
    latitude: 12.9616,
    longitude: 77.5846,
  });

  const userLocation = {
    latitude: 12.9716,
    longitude: 77.5946,
  };

  const driverPosition = useRef(
    new AnimatedRegion({
      latitude: 12.9616,
      longitude: 77.5846,
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

        if (data.pickup?.lat && data.pickup?.lng) {
          const distance = Math.sqrt(
            Math.pow(data.driver.currentLat - data.pickup.lat, 2) +
            Math.pow(data.driver.currentLng - data.pickup.lng, 2)
          );
          setEta(Math.max(1, Math.round(distance * 100)));
        }
      }

      if (data.status === RideStatus.STARTED) {
        router.replace({ pathname: "/ride/started" as any, params: { rideId } });
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

  const handleCancel = async () => {
    Alert.alert(
      "Cancel Ride",
      "Are you sure you want to cancel this ride?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            try {
              await api.cancelRide(rideId, "User cancelled");
              router.replace("/");
            } catch (err: any) {
              Alert.alert("Error", err.message);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#FACC15" />
        <Text className="mt-4 text-gray-600">Finding your ride...</Text>
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

  const pickupLocation = {
    latitude: ride.pickup?.lat || userLocation.latitude,
    longitude: ride.pickup?.lng || userLocation.longitude,
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="absolute top-0 left-0 right-0 z-20">
        <Svg height="200" width="100%">
          <Path d="M0 0 H400 V110 Q200 200 0 110 Z" fill="#FACC15" />
        </Svg>

        <View className="absolute top-14 px-6 flex-row items-center w-full">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-white p-3 rounded-full shadow"
            style={{ elevation: 5 }}
          >
            <Ionicons name="arrow-back" size={22} color="#333" />
          </TouchableOpacity>

          <Text className="ml-4 text-2xl font-extrabold text-gray-900">
            Live Tracking
          </Text>
        </View>
      </View>

      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: pickupLocation.latitude,
          longitude: pickupLocation.longitude,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        }}
        showsUserLocation={false}
      >
        <Marker.Animated
          coordinate={driverCoords as any}
          anchor={{ x: 0.5, y: 0.5 }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 6,
              borderRadius: 30,
              elevation: 6,
            }}
          >
            <FontAwesome5 name="car-side" size={26} color="#111" />
          </View>
        </Marker.Animated>

        <Marker coordinate={pickupLocation}>
          <View
            style={{
              backgroundColor: "#FACC15",
              width: 18,
              height: 18,
              borderRadius: 9,
              borderWidth: 3,
              borderColor: "#FFF",
            }}
          />
        </Marker>
      </MapView>

      <View
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 shadow-lg"
        style={{ elevation: 10 }}
      >
        <Text className="text-gray-900 font-bold text-xl">
          {ride.status === RideStatus.ACCEPTED ? "Driver is on the way" : "Driver arriving"}
        </Text>
        <Text className="text-gray-600 mt-1">
          Arriving in <Text className="font-bold">{eta || "..."} minutes</Text>
        </Text>

        <View className="flex-row items-center mt-5">
          <Image
            source={{ 
              uri: ride.driver?.user?.profileImage || "https://i.ibb.co/ZY7fCFw/driver.jpg" 
            }}
            className="w-16 h-16 rounded-full"
          />

          <View className="ml-4">
            <Text className="text-lg font-semibold text-gray-900">
              {ride.driver?.user?.firstName || "Driver"} {ride.driver?.user?.lastName || ""}
            </Text>
            <Text className="text-gray-600 text-sm">
              ⭐ {ride.driver?.rating?.toFixed(1) || "5.0"} • {ride.driver?.vehicleType || "Sedan"} • {ride.driver?.licensePlate || "N/A"}
            </Text>
          </View>
        </View>

        <View className="flex-row mt-6 justify-between">
          <TouchableOpacity
            onPress={handleCall}
            className="flex-row bg-yellow-500 px-6 py-4 rounded-2xl items-center"
            style={{ elevation: 4 }}
          >
            <Ionicons name="call" size={20} color="#fff" />
            <Text className="text-white ml-2 font-semibold">Call</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row bg-gray-200 px-6 py-4 rounded-2xl items-center"
            style={{ elevation: 1 }}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={20} color="#333" />
            <Text className="text-gray-800 ml-2 font-semibold">Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleCancel}
            className="flex-row bg-white px-6 py-4 rounded-2xl items-center border border-gray-300"
          >
            <Ionicons name="close" size={20} color="#333" />
            <Text className="text-gray-800 ml-2 font-semibold">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
