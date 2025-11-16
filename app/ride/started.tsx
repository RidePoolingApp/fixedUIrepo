// // app/ride/started.tsx
// import React, { useEffect, useRef } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Image,
// } from "react-native";
// import MapView, { Marker, AnimatedRegion } from "react-native-maps";
// import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
// import { useRouter } from "expo-router";

// export default function RideStarted() {
//   const router = useRouter();

//   // USER DESTINATION (static)
//   const dropLocation = {
//     latitude: 12.9816,
//     longitude: 77.6046,
//   };

//   // DRIVER LIVE MOVEMENT (starting point)
//   const driverInitial = {
//     latitude: 12.9716,
//     longitude: 77.5946,
//   };

//   const driverPosition = useRef(
//     new AnimatedRegion({
//       latitude: driverInitial.latitude,
//       longitude: driverInitial.longitude,
//       latitudeDelta: 0.01,
//       longitudeDelta: 0.01,
//     })
//   ).current;

//   // Simulate driver movement during ride
//   useEffect(() => {
//     const interval = setInterval(() => {
//       driverPosition.timing({
//         latitude: driverPosition.__getValue().latitude + 0.0005,
//         longitude: driverPosition.__getValue().longitude + 0.0007,
//         duration: 1500,
//         useNativeDriver: false,
//       }).start();

//       // Stop simulation upon reaching destination
//       if (driverPosition.__getValue().latitude >= dropLocation.latitude) {
//         clearInterval(interval);
//         router.replace("/ride/completed"); // auto complete ride
//       }
//     }, 1700);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <View className="flex-1 bg-gray-50">

//       {/* LIVE MAP */}
//       <MapView
//         style={{ flex: 1 }}
//         initialRegion={{
//           latitude: driverInitial.latitude,
//           longitude: driverInitial.longitude,
//           latitudeDelta: 0.03,
//           longitudeDelta: 0.03,
//         }}
//         showsUserLocation={false}
//       >
//         {/* DRIVER ICON */}
//         <Marker.Animated coordinate={driverPosition}>
//           <View className="bg-white p-3 rounded-full shadow" style={{ elevation: 8 }}>
//             <FontAwesome5 name="car-side" size={28} color="#111" />
//           </View>
//         </Marker.Animated>

//         {/* DESTINATION PIN */}
//         <Marker coordinate={dropLocation}>
//           <View className="w-5 h-5 rounded-full bg-yellow-600 border-2 border-white" />
//         </Marker>
//       </MapView>

//       {/* OVERLAY HEADER CARD */}
//       <View
//         className="absolute top-10 left-4 right-4 bg-white rounded-3xl p-4 shadow-lg"
//         style={{ elevation: 12 }}
//       >
//         <View className="flex-row items-center">
//           <Image
//             source={{ uri: "https://i.ibb.co/ZY7fCFw/driver.jpg" }}
//             className="w-14 h-14 rounded-full"
//           />

//           <View className="ml-3 flex-1">
//             <Text className="text-lg font-bold text-gray-900">
//               Rahul Verma
//             </Text>
//             <Text className="text-gray-500 text-sm">
//               ⭐ 4.8 • Sedan • KA 05 MK 2244
//             </Text>
//           </View>

//           {/* Call Driver */}
//           <TouchableOpacity className="bg-yellow-500 p-3 rounded-full shadow" style={{ elevation: 4 }}>
//             <Ionicons name="call" size={20} color="#fff" />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* BOTTOM CARD */}
//       <View
//         className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 shadow-xl"
//         style={{ elevation: 12 }}
//       >
//         <Text className="text-xl font-extrabold text-gray-900">
//           Ride in Progress
//         </Text>
//         <Text className="text-gray-600 mt-1">
//           Sit back and relax — you're on the way to your destination.
//         </Text>

//         {/* DETAILS ROW */}
//         <View className="flex-row justify-between mt-5">
//           <View>
//             <Text className="text-gray-500">Distance</Text>
//             <Text className="text-gray-900 font-semibold text-lg">12.5 km</Text>
//           </View>

//           <View>
//             <Text className="text-gray-500">Time</Text>
//             <Text className="text-gray-900 font-semibold text-lg">
//               21 min
//             </Text>
//           </View>

//           <View>
//             <Text className="text-gray-500">Fare</Text>
//             <Text className="text-yellow-600 font-extrabold text-lg">
//               ₹ 289
//             </Text>
//           </View>
//         </View>

//         {/* SAFETY BUTTONS */}
//         <View className="flex-row justify-between mt-6">
//           {/* SHARE RIDE */}
//           <TouchableOpacity
//             className="flex-row items-center bg-gray-100 px-5 py-4 rounded-2xl"
//           >
//             <Ionicons name="share-social-outline" size={22} color="#333" />
//             <Text className="ml-2 text-gray-800 font-semibold">Share Ride</Text>
//           </TouchableOpacity>

//           {/* SOS */}
//           <TouchableOpacity
//             className="flex-row items-center bg-red-500 px-5 py-4 rounded-2xl"
//             style={{ elevation: 3 }}
//           >
//             <Ionicons name="alert-circle" size={24} color="#fff" />
//             <Text className="ml-2 text-white font-semibold">SOS</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );
// }
