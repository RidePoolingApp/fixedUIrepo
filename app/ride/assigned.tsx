// // app/ride/assigned.tsx
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   ScrollView,
//   Animated,
// } from "react-native";
// import Svg, { Path } from "react-native-svg";
// import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
// import { useEffect, useRef } from "react";
// import { useRouter } from "expo-router";
// import * as Linking from "expo-linking";
// import * as Notifications from "expo-notifications";

// export default function DriverAssigned() {
//   const router = useRouter();

// const driverPhone = "+919876543210";
// const proxyPhone = "+918080808080";

// const maskedNumber = "+91 •••• " + driverPhone.slice(-4);

//   // Pulse animation for ETA
//   const pulse = useRef(new Animated.Value(1)).current;
//   useEffect(() => {
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(pulse, { toValue: 1.1, duration: 700, useNativeDriver: true }),
//         Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
//       ])
//     ).start();
//   }, []);
//   useEffect(() => {
//   // Fake simulation: Alert driver is arriving after 5 seconds
//   const timer = setTimeout(() => {
//     sendDriverArrivingNotification();
//   }, 5000);

//   return () => clearTimeout(timer);
// }, []);

// //notification function
// const sendDriverArrivingNotification = async () => {
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "🚕 Your driver is arriving!",
//       body: "Your Waylink driver will reach your pickup in 2–3 minutes.",
//       sound: true,
//       priority: Notifications.AndroidNotificationPriority.HIGH,
//     },
//     trigger: null, // sends immediately
//   });
// };

//   return (
//     <View className="flex-1 bg-gray-50">

// // call button:
// <TouchableOpacity
//   className="bg-yellow-500 p-3 rounded-full shadow"
//   onPress={() => Linking.openURL(`tel:${proxyPhone}`)}
// >
//   <Ionicons name="call" size={20} color="#fff" />
// </TouchableOpacity>

//       {/* PREMIUM HEADER  */}
//       <View className="absolute top-0 left-0 right-0">
//         <Svg height="260" width="100%">
//           <Path d="M0 0 H400 V140 Q200 260 0 140 Z" fill="#FACC15" />
//           <Path d="M0 40 H400 V180 Q200 300 0 180 Z" fill="#FDE047" opacity={0.4} />
//         </Svg>
//       </View>

//       {/* BACK BUTTON */}
//       <TouchableOpacity
//         onPress={() => router.back()}
//         className="absolute top-14 left-6 bg-white p-3 rounded-full shadow"
//         style={{ elevation: 4 }}
//       >
//         <Ionicons name="arrow-back" size={24} color="#333" />
//       </TouchableOpacity>

//       {/* TITLE */}
//       <View className="mt-28 px-6">
//         <Text className="text-3xl font-extrabold text-gray-900">
//           Driver Assigned
//         </Text>
//         <Text className="text-gray-700 mt-1">
//           Your driver is on the way to pickup point
//         </Text>
//       </View>

//       <ScrollView
//         className="px-6 mt-6"
//         contentContainerStyle={{ paddingBottom: 150 }}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* DRIVER CARD */}
//         <View
//           className="bg-white rounded-3xl p-6 shadow border border-gray-100"
//           style={{ elevation: 5 }}
//         >
//           <View className="flex-row items-center">
//             <Image
//               source={{ uri: "https://i.ibb.co/ZY7fCFw/driver.jpg" }}
//               className="w-20 h-20 rounded-full"
//             />

//             <View className="ml-5">
//               <Text className="text-xl font-bold text-gray-900">Rahul Verma</Text>
//               <Text className="text-gray-600 mt-1">⭐ 4.8 • 2,450 rides</Text>
//             </View>
//           </View>
//             <Text className="text-gray-500 text-sm mt-1">
//   Contact : {maskedNumber}
// </Text>
          


//           {/* VEHICLE CARD */}
//           <View className="bg-yellow-50 rounded-2xl p-4 mt-6 border border-yellow-200 flex-row justify-between items-center">
//             <View>
//               <Text className="text-gray-900 font-semibold text-lg">Sedan • White</Text>
//               <Text className="text-gray-500 text-sm mt-1">AC • 4 Seats • Comfortable</Text>
//             </View>

//             <View className="items-end">
//               <Text className="text-yellow-700 text-xl font-bold">KA 05 MK 2244</Text>
//               <Text className="text-gray-500 text-xs mt-1">Number Plate</Text>
//             </View>
//           </View>
//         </View>

//         {/* ETA CARD */}
//         <View
//           className="bg-white rounded-3xl p-6 shadow border border-gray-100 mt-6"
//           style={{ elevation: 5 }}
//         >
//           <Text className="text-xl font-bold text-gray-900">Arrival Time</Text>

//           <Animated.View
//             style={{ transform: [{ scale: pulse }] }}
//             className="flex-row items-center mt-4"
//           >
//             <Ionicons name="time-outline" size={28} color="#FACC15" />
//             <Text className="ml-3 text-lg text-gray-900">
//               Reaching in <Text className="font-bold">12 minutes</Text>
//             </Text>
//           </Animated.View>

//           <Text className="mt-3 text-gray-600">
//             Your driver has started the ride. Please wait at your pickup point.
//           </Text>
//         </View>

//         {/* ACTION BUTTONS */}
//         <View className="mt-10 space-y-4">

//           {/* CONTACT DRIVER */}
//           <TouchableOpacity
//             className="bg-yellow-500 p-5 rounded-3xl items-center shadow"
//             style={{ elevation: 5 }}
//             onPress={() => Linking.openURL(`tel:${proxyPhone}`)}
//           >
//             <Text className="text-white text-lg font-bold">Contact Driver</Text>
//           </TouchableOpacity>

//           {/* CANCEL RIDE */}
//           <TouchableOpacity
//             className="bg-white p-5 rounded-3xl items-center border border-gray-300 shadow"
//             style={{ elevation: 4 }}
//             onPress={() => router.push("/ride/cancel")}
//           >
//             <Text className="text-gray-800 text-lg font-semibold">Cancel Ride</Text>
//           </TouchableOpacity>

//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// app/ride/assigned.tsx
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState, useContext } from "react";
import { useRouter } from "expo-router";
import * as Linking from "expo-linking";
import CancelBottomSheet from "../components/CancelBottomSheet";
import { ThemeContext } from "../context/ThemeContext";
import { useThemeStyles } from "../context/themeStyles";
import { ThemedScreen, ThemedView, ThemedText, ThemedTextSecondary } from "../components/Themed";

export default function DriverAssigned() {
  const router = useRouter();
  const { isDark } = useThemeStyles();

  const [showCancel, setShowCancel] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("pending"); // pending | paid | pay_after_trip
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const proxyPhone = "+918080808080";

  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const fare = "₹749";

  return (
    <ThemedScreen>

      {/* HEADER */}
      <View className="absolute top-0 left-0 right-0">
        <Svg height="260" width="100%">
          <Path
            d="M0 0 H400 V140 Q200 260 0 140 Z"
            fill={isDark ? "#1F2937" : "#FACC15"}
          />
        </Svg>
      </View>

      {/* BACK */}
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-14 left-6 bg-white p-3 rounded-full shadow"
        style={{ elevation: 4 }}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      {/* TITLE */}
      <View className="mt-28 px-6">
        <ThemedText className="text-3xl font-extrabold">Driver Assigned</ThemedText>
        <ThemedTextSecondary>Your ride is being prepared</ThemedTextSecondary>
      </View>

      <ScrollView
        className="px-6 mt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 180 }}
      >
        {/* DRIVER INFO CARD */}
        <ThemedView className="rounded-3xl p-6 shadow border mb-6">
          <View className="flex-row items-center">
            <Image
              source={{ uri: "https://i.ibb.co/ZY7fCFw/driver.jpg" }}
              className="w-20 h-20 rounded-full"
            />

            <View className="ml-4">
              <ThemedText className="text-xl font-bold">Rahul Verma</ThemedText>
              <ThemedTextSecondary>⭐ 4.8 • 2,450 rides</ThemedTextSecondary>
              <ThemedTextSecondary>Car: White Sedan</ThemedTextSecondary>
              <ThemedTextSecondary>KA 05 MK 2244</ThemedTextSecondary>
            </View>
          </View>
        </ThemedView>

        {/* ETA */}
        <ThemedView className="rounded-3xl p-6 shadow border mb-6">
          <ThemedText className="text-xl font-bold">Arrival Time</ThemedText>

          <Animated.View
            style={{ transform: [{ scale: pulse }] }}
            className="flex-row items-center mt-3"
          >
            <Ionicons name="time-outline" size={26} color="#FACC15" />
            <ThemedText className="ml-3 text-lg">
              Reaching in <Text className="font-bold">12 minutes</Text>
            </ThemedText>
          </Animated.View>
        </ThemedView>

        {/* ⭐ PAYMENT SECTION ⭐ */}
        <ThemedView className="rounded-3xl p-6 shadow border mb-6">
          <ThemedText className="text-xl font-bold mb-1">Payment Details</ThemedText>

          {/* Payment Method */}
          <View className="flex-row justify-between mt-2">
            <ThemedTextSecondary>Payment Method</ThemedTextSecondary>
            <ThemedText className="font-semibold">{paymentMethod}</ThemedText>
          </View>

          {/* Fare Lock */}
          <View className="flex-row items-center mt-4">
            <Ionicons name="lock-closed-outline" size={20} color="#FACC15" />
            <ThemedText className="ml-2 font-semibold">Your fare is locked</ThemedText>
          </View>
          <ThemedTextSecondary>No extra charges guaranteed</ThemedTextSecondary>

          {/* Fare */}
          <View className="mt-4">
            <ThemedTextSecondary>Total Fare</ThemedTextSecondary>
            <ThemedText className="text-3xl font-extrabold text-yellow-500">{fare}</ThemedText>
          </View>

          {/* Payment status */}
          {paymentStatus === "pending" && (
            <TouchableOpacity
              onPress={() => router.push("/ride/payment")}
              className="bg-yellow-500 p-4 rounded-2xl mt-5 items-center"
            >
              <Text className="text-white font-bold text-lg">Complete Payment</Text>
            </TouchableOpacity>
          )}

          {paymentStatus === "paid" && (
            <ThemedText className="text-green-500 font-bold mt-4 text-lg">
              Payment Completed
            </ThemedText>
          )}

          {paymentStatus === "pay_after_trip" && (
            <ThemedText className="text-blue-500 font-bold mt-4 text-lg">
              Pay after trip completion
            </ThemedText>
          )}
        </ThemedView>

        {/* ACTION BUTTONS */}
        <View className="space-y-4">

          {/* CONTACT DRIVER */}
          <TouchableOpacity
            className="bg-yellow-500 p-5 rounded-3xl items-center shadow"
            onPress={() => Linking.openURL(`tel:${proxyPhone}`)}
          >
            <Text className="text-white text-lg font-bold">Contact Driver</Text>
          </TouchableOpacity>

          {/* CANCEL */}
          <TouchableOpacity
              onPress={() => router.push("/ride/cancel")}
              className="bg-red-500 p-4 rounded-2xl mt-5 items-center"
            >
              <Text className="text-white font-bold text-lg">Cancel Ride</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>

      {/* CANCEL BOTTOM SHEET */}
      <CancelBottomSheet
        visible={showCancel}
        onClose={() => setShowCancel(false)}
        onConfirm={() => router.replace("/home")}
      />
    </ThemedScreen>
  );
}
