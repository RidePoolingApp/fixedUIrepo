// // app/ride/live.tsx
// import React, { useEffect, useRef, useState } from "react";
// import { View, Text, TouchableOpacity, Image } from "react-native";
// import MapView, { Marker, AnimatedRegion } from "react-native-maps";
// import Svg, { Path } from "react-native-svg";
// import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
// import { useRouter } from "expo-router";

// export default function LiveTracking() {
//   const router = useRouter();

//   // USER PICKUP LOCATION (static)
//   const userLocation = {
//     latitude: 12.9716,
//     longitude: 77.5946,
//   };

//   // DRIVER START LOCATION (will move)
//   const driverInitial = {
//     latitude: 12.9616,
//     longitude: 77.5846,
//   };

//   const driverPosition = useRef(
//     new AnimatedRegion({
//       latitude: driverInitial.latitude,
//       longitude: driverInitial.longitude,
//       latitudeDelta: 0.01,
//       longitudeDelta: 0.01,
//     })
//   ).current;

//   // Simulate driver movement toward user
//   useEffect(() => {
//     const interval = setInterval(() => {
//       driverPosition.timing({
//           latitude: driverPosition.__getValue().latitude + 0.0008,
//           longitude: driverPosition.__getValue().longitude + 0.0008,
//           duration: 1200,
//           useNativeDriver: false,
//           toValue: 0,
//           latitudeDelta: 0,
//           longitudeDelta: 0
//       }).start();

//       // Stop movement after reaching
//       if (driverPosition.__getValue().latitude >= userLocation.latitude) {
//         clearInterval(interval);
//       }
//     }, 1500);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <View className="flex-1 bg-gray-50">
//       {/* HEADER */}
//       <View className="absolute top-0 left-0 right-0 z-20">
//         <Svg height="200" width="100%">
//           <Path d="M0 0 H400 V110 Q200 200 0 110 Z" fill="#FACC15" />
//         </Svg>

//         {/* Back + Title */}
//         <View className="absolute top-14 px-6 flex-row items-center w-full">
//           <TouchableOpacity
//             onPress={() => router.back()}
//             className="bg-white p-3 rounded-full shadow"
//             style={{ elevation: 5 }}
//           >
//             <Ionicons name="arrow-back" size={22} color="#333" />
//           </TouchableOpacity>

//           <Text className="ml-4 text-2xl font-extrabold text-gray-900">
//             Live Tracking
//           </Text>
//         </View>
//       </View>

//       {/* MAP */}
//       <MapView
//         style={{ flex: 1 }}
//         initialRegion={{
//           latitude: userLocation.latitude,
//           longitude: userLocation.longitude,
//           latitudeDelta: 0.03,
//           longitudeDelta: 0.03,
//         }}
//         showsUserLocation={false}
//       >
//         {/* DRIVER MARKER */}
//         <Marker.Animated
//           coordinate={driverPosition}
//           anchor={{ x: 0.5, y: 0.5 }}
//         >
//           <View
//             style={{
//               backgroundColor: "white",
//               padding: 6,
//               borderRadius: 30,
//               elevation: 6,
//             }}
//           >
//             <FontAwesome5 name="car-side" size={26} color="#111" />
//           </View>
//         </Marker.Animated>

//         {/* USER PICKUP PIN */}
//         <Marker coordinate={userLocation}>
//           <View
//             style={{
//               backgroundColor: "#FACC15",
//               width: 18,
//               height: 18,
//               borderRadius: 9,
//               borderWidth: 3,
//               borderColor: "#FFF",
//             }}
//           />
//         </Marker>
//       </MapView>

//       {/* BOTTOM STATUS CARD */}
//       <View
//         className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 shadow-lg"
//         style={{ elevation: 10 }}
//       >
//         <Text className="text-gray-900 font-bold text-xl">
//           Driver is on the way
//         </Text>
//         <Text className="text-gray-600 mt-1">
//           Arriving in <Text className="font-bold">8 minutes</Text>
//         </Text>

//         {/* Driver Info */}
//         <View className="flex-row items-center mt-5">
//           <Image
//             source={{ uri: "https://i.ibb.co/ZY7fCFw/driver.jpg" }}
//             className="w-16 h-16 rounded-full"
//           />

//           <View className="ml-4">
//             <Text className="text-lg font-semibold text-gray-900">
//               Rahul Verma
//             </Text>
//             <Text className="text-gray-600 text-sm">⭐ 4.8 • Sedan • KA 05 MK 2244</Text>
//           </View>
//         </View>

//         {/* ACTION BUTTONS */}
//         <View className="flex-row mt-6 justify-between">
//           {/* CALL */}
//           <TouchableOpacity
//             className="flex-row bg-yellow-500 px-6 py-4 rounded-2xl items-center"
//             style={{ elevation: 4 }}
//           >
//             <Ionicons name="call" size={20} color="#fff" />
//             <Text className="text-white ml-2 font-semibold">Call</Text>
//           </TouchableOpacity>

//           {/* CHAT */}
//           <TouchableOpacity
//             className="flex-row bg-gray-200 px-6 py-4 rounded-2xl items-center"
//             style={{ elevation: 1 }}
//           >
//             <Ionicons name="chatbubble-ellipses-outline" size={20} color="#333" />
//             <Text className="text-gray-800 ml-2 font-semibold">Chat</Text>
//           </TouchableOpacity>

//           {/* CANCEL */}
//           <TouchableOpacity
//             className="flex-row bg-white px-6 py-4 rounded-2xl items-center border border-gray-300"
//           >
//             <Ionicons name="close" size={20} color="#333" />
//             <Text className="text-gray-800 ml-2 font-semibold">Cancel</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );
// }
