// app/driver/online-mode.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Platform,
  Alert,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

// Map imports (install react-native-maps / expo install react-native-maps for expo)
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";

/**
 * Driver Online Mode Map
 * - Shows driver position
 * - Shows incoming requests as markers
 * - Simulates live requests (replace with WebSocket)
 * - Popup card for current request with countdown and accept/reject
 */

export default function DriverOnlineMode() {
  const router = useRouter();

  // driver location state
  const [region, setRegion] = useState({
    latitude: 12.9352,
    longitude: 77.6245,
    latitudeDelta: 0.03,
    longitudeDelta: 0.03,
  });

  const [driverLocation, setDriverLocation] = useState({
    latitude: 12.9352,
    longitude: 77.6245,
  });

  // simulated incoming requests list
  const [requests, setRequests] = useState<Array<any>>([]);
  const [activeRequest, setActiveRequest] = useState<any | null>(null);

  // popup animation
  const popupY = useRef(new Animated.Value(300)).current;
  const popupOpacity = useRef(new Animated.Value(0)).current;

  // countdown timer for active request
  const countdownRef = useRef<number>(0);
  const [countdown, setCountdown] = useState(18);

  // map ref for centering
  const mapRef = useRef<MapView | null>(null);

  // simulate incoming requests every 12-18s (for demo)
  useEffect(() => {
    // start location permission & get current location
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const loc = await Location.getCurrentPositionAsync({});
          const { latitude, longitude } = loc.coords;
          setDriverLocation({ latitude, longitude });
          setRegion((r) => ({ ...r, latitude, longitude }));
        }
      } catch (e) {
        console.warn("Location error:", e);
      }
    })();

    const interval = setInterval(() => {
      spawnFakeRequest();
    }, 14000);

    // create first few requests immediately
    spawnFakeRequest();
    const t2 = setTimeout(spawnFakeRequest, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(t2);
      stopCountdown();
    };
  }, []);

  // countdown effect
  useEffect(() => {
    if (!activeRequest) return;

    stopCountdown();
    setCountdown(18);
    countdownRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          // auto-decline
          declineActiveRequest("timeout");
          return 0;
        }
        return c - 1;
      });
    }, 1000) as unknown as number;

    return () => stopCountdown();
  }, [activeRequest]);

  const stopCountdown = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current as unknown as number);
      countdownRef.current = 0;
    }
  };

  function spawnFakeRequest() {
    // create a random nearby coordinate for demo
    const latJitter = (Math.random() - 0.5) * 0.02;
    const lngJitter = (Math.random() - 0.5) * 0.02;

    const newReq = {
      id: "req_" + Date.now(),
      pickup: {
        latitude: driverLocation.latitude + latJitter,
        longitude: driverLocation.longitude + lngJitter,
        address: ["HSR Layout", "Koramangala", "MG Road"][
          Math.floor(Math.random() * 3)
        ],
      },
      drop: "Drop location example",
      distanceKm: (1 + Math.random() * 6).toFixed(1),
      estFare: Math.floor(50 + Math.random() * 300),
      createdAt: Date.now(),
    };

    // push to list
    setRequests((r) => [newReq, ...r]);

    // if no active request, set this as active after a small delay
    if (!activeRequest) {
      setTimeout(() => {
        setActiveRequest(newReq);
        showPopup();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }, 700);
    }
  }

  function showPopup() {
    popupOpacity.setValue(0);
    popupY.setValue(300);
    Animated.parallel([
      Animated.timing(popupOpacity, { toValue: 1, duration: 260, useNativeDriver: true }),
      Animated.timing(popupY, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  }

  function hidePopup() {
    Animated.parallel([
      Animated.timing(popupOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(popupY, { toValue: 300, duration: 240, useNativeDriver: true }),
    ]).start(() => {
      setActiveRequest(null);
    });
  }

  function acceptRequest(req: any) {
    stopCountdown();
    // remove request from queue and proceed
    setRequests((r) => r.filter((x) => x.id !== req.id));
    // navigate to ride-started flow and pass details if needed
    router.push({
      pathname: "/driver/ride-started",
      params: { requestId: req.id },
    });
  }

  function declineActiveRequest(reason = "rejected") {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    // move active request to rejected list (for now, just remove)
    setRequests((r) => r.filter((x) => x.id !== (activeRequest?.id ?? "")));
    hidePopup();
  }

  // center on driver
  function centerOnDriver() {
    if (!mapRef.current) return;
    mapRef.current.animateToRegion(
      {
        ...region,
        latitude: driverLocation.latitude,
        longitude: driverLocation.longitude,
      },
      350
    );
  }

  // render
  return (
    <View className="flex-1 bg-gray-50">
      {/* Header (curved yellow) */}
      <View className="absolute top-0 left-0 right-0">
        <Svg height="220" width="100%">
          <Path d="M0 0 H400 V120 Q200 240 0 120 Z" fill="#FACC15" />
          <Path d="M0 30 H400 V150 Q200 260 0 150 Z" fill="#FDE047" opacity={0.5} />
        </Svg>
      </View>

      {/* Top title */}
      <View className="mt-16 px-6 flex-row justify-between items-center">
        <View>
          <Text className="text-2xl font-extrabold text-gray-900">Online Mode</Text>
          <Text className="text-gray-700 mt-1 text-sm">Listening for nearby requests</Text>
        </View>

        <TouchableOpacity
          onPress={centerOnDriver}
          className="bg-white p-3 rounded-full shadow"
          style={{ elevation: 6 }}
        >
          <Ionicons name="locate-outline" size={22} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Map area */}
      <View className="mt-4 flex-1 mx-4 rounded-3xl overflow-hidden" style={{ borderRadius: 20 }}>
        {/** If react-native-maps is not installed, the app will crash.
            If you want to avoid that, check for MapView before rendering or show fallback.
            Below we render MapView. **/}
        <MapView
          ref={(r) => (mapRef.current = r)}
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
          initialRegion={region}
          showsUserLocation
          showsMyLocationButton={false}
          onRegionChangeComplete={(r) => setRegion(r)}
        >
          {/* driver marker */}
          <Marker
            coordinate={driverLocation}
            anchor={{ x: 0.5, y: 0.5 }}
            tracksViewChanges={false}
            identifier="driver"
          >
            <View style={{
              backgroundColor: "#FACC15",
              padding: 6,
              borderRadius: 20,
              borderWidth: 2,
              borderColor: "#fff",
              elevation: 6,
            }}>
              <MaterialCommunityIcons name="steering" size={22} color="#fff" />
            </View>
          </Marker>

          {/* request markers */}
          {requests.map((r) => (
            <Marker
              key={r.id}
              coordinate={{ latitude: r.pickup.latitude, longitude: r.pickup.longitude }}
              title={r.pickup.address}
            >
              <View style={{
                backgroundColor: "#fff",
                padding: 6,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: "#FACC15",
                alignItems: "center",
                justifyContent: "center",
                elevation: 4,
              }}>
                <Ionicons name="person-outline" size={18} color="#FACC15" />
                <Text style={{ fontSize: 10, color: "#333", marginTop: 2 }}>{r.estFare}</Text>
              </View>
            </Marker>
          ))}
        </MapView>
      </View>

      {/* Active request popup (animated) */}
      {activeRequest && (
        <Animated.View
          style={{
            position: "absolute",
            left: 16,
            right: 16,
            bottom: popupY,
            opacity: popupOpacity,
            transform: [{ translateY: popupY }],
          }}
        >
          <View className="bg-white rounded-3xl p-5 shadow" style={{ elevation: 12 }}>
            <View className="flex-row justify-between items-start">
              <View>
                <Text className="text-lg font-bold text-gray-900">Pickup: {activeRequest.pickup.address}</Text>
                <Text className="text-gray-500 mt-1">Drop: {activeRequest.drop}</Text>

                <View className="flex-row items-center mt-3">
                  <View className="bg-yellow-100 px-3 py-1 rounded-md">
                    <Text className="text-yellow-700 font-semibold">₹{activeRequest.estFare}</Text>
                  </View>
                  <Text className="text-gray-600 ml-3">{activeRequest.distanceKm} km</Text>
                </View>
              </View>

              <View className="items-end">
                <Text className="text-xs text-gray-500">New request</Text>
                <View className="bg-gray-100 px-3 py-1 rounded-md mt-2">
                  <Text className="font-bold">{countdown}s</Text>
                </View>
              </View>
            </View>

            <View className="flex-row mt-5 space-x-3">
              <TouchableOpacity
                onPress={() => {
                  declineActiveRequest("driver_rejected");
                }}
                className="flex-1 bg-white border border-gray-300 p-3 rounded-2xl items-center"
              >
                <Text className="text-gray-700 font-semibold">Reject</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => acceptRequest(activeRequest)}
                className="flex-1 bg-yellow-500 p-3 rounded-2xl items-center"
                style={{ elevation: 6 }}
              >
                <Text className="text-white font-bold">Accept</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      )}

      {/* small floating list of pending requests (tap to open) */}
      {requests.length > 1 && !activeRequest && (
        <View style={{ position: "absolute", left: 20, bottom: 110 }}>
          <TouchableOpacity
            onPress={() => {
              // set latest as active
              setActiveRequest(requests[0]);
              showPopup();
            }}
            className="bg-white p-3 rounded-2xl shadow"
            style={{ elevation: 8 }}
          >
            <Text className="font-semibold">Pending: {requests.length}</Text>
            <Text className="text-xs text-gray-500">Tap to view</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
