// // app/map-select.tsx
// import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
// import MapView, { Marker } from "react-native-maps";
// import { useState, useEffect } from "react";
// import { Ionicons } from "@expo/vector-icons";
// import * as Location from "expo-location";
// import { useRouter, useLocalSearchParams } from "expo-router";

// export default function MapSelect() {
//   const router = useRouter();
//   const params = useLocalSearchParams();  
//   const field = params.field || "from"; // to know which field to update

//   const [region, setRegion] = useState(null);
//   const [pin, setPin] = useState(null);
//   const [address, setAddress] = useState("Fetching location...");

//   useEffect(() => {
//     (async () => {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         alert("Permission denied.");
//         return;
//       }

//       let current = await Location.getCurrentPositionAsync({});
//       const regionData = {
//         latitude: current.coords.latitude,
//         longitude: current.coords.longitude,
//         latitudeDelta: 0.01,
//         longitudeDelta: 0.01,
//       };

//       setRegion(regionData);
//       setPin(regionData);

//       fetchAddress(current.coords.latitude, current.coords.longitude);
//     })();
//   }, []);

//   const fetchAddress = async (lat, long) => {
//     setAddress("Fetching address...");
//     const geo = await Location.reverseGeocodeAsync({
//       latitude: lat,
//       longitude: long,
//     });

//     if (geo[0]) {
//       const a = geo[0];
//       setAddress(`${a.name}, ${a.street}, ${a.city}`);
//     }
//   };

//   const onRegionChange = async (newRegion) => {
//     setPin(newRegion);
//     fetchAddress(newRegion.latitude, newRegion.longitude);
//   };

//   const confirmLocation = () => {
//     router.push({
//       pathname: "/home",
//       params: {
//         [field]: address,
//       },
//     });
//   };

//   if (!region) {
//     return (
//       <View className="flex-1 items-center justify-center bg-white">
//         <ActivityIndicator size="large" color="#FACC15" />
//         <Text className="mt-3 text-gray-600">Loading map...</Text>
//       </View>
//     );
//   }

//   return (
//     <View className="flex-1 bg-white">
//       {/* Back Button */}
//       <TouchableOpacity
//         onPress={() => router.back()}
//         className="absolute top-12 left-6 z-20 bg-white p-3 rounded-full shadow"
//       >
//         <Ionicons name="arrow-back" size={24} color="#333" />
//       </TouchableOpacity>

//       {/* Map Section */}
//       <MapView
//         style={{ flex: 1 }}
//         initialRegion={region}
//         onRegionChangeComplete={onRegionChange}
//       >
//         {pin && (
//           <Marker
//             coordinate={{
//               latitude: pin.latitude,
//               longitude: pin.longitude,
//             }}
//             pinColor="#FACC15"
//           />
//         )}
//       </MapView>

//       {/* Address Card */}
//       <View className="absolute bottom-0 left-0 right-0 bg-white p-6 rounded-t-3xl shadow-lg">
//         <Text className="text-gray-900 font-semibold text-lg">Selected Location</Text>
//         <Text className="text-gray-600 mt-1">{address}</Text>

//         <TouchableOpacity
//           onPress={confirmLocation}
//           className="bg-yellow-500 mt-5 p-4 rounded-2xl items-center shadow"
//           style={{ elevation: 4 }}
//         >
//           <Text className="text-white text-lg font-semibold">Confirm Location</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }
