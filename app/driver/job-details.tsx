// // app/driver/job-details.tsx
// import React, { useMemo, useState } from "react";
// import {
//   View,
//   ScrollView,
//   TouchableOpacity,
//   Alert,
//   Share,
//   AccessibilityInfo,
//   ActivityIndicator,
// } from "react-native";
// import { useRouter, useLocalSearchParams } from "expo-router";
// import { ThemedText, ThemedView } from "../components/Themed";
// import { Ionicons, MaterialIcons, Entypo } from "@expo/vector-icons";

// type Params = { jobId?: string };

// const MOCK_JOBS: Record<string, any> = {
//   "job-001": {
//     id: "job-001",
//     type: "Long Trip",
//     pickup: "Airport Terminal 1 - Door 4 (Arrival)",
//     drop: "City Center Mall - Main Gate",
//     time: "Today • 06:30 AM",
//     distance: "35 km",
//     duration: "50 min",
//     vehicle: "Sedan",
//     estPay: 1250,
//     bonus: 150,
//     payment: "Online (UPI)",
//     rider: { name: "Anita Patel", rating: 4.9 },
//     special: "One large suitcase. Please help with luggage.",
//     cancellationPenalty: "₹200 or platform penalty",
//   },
// };

// export default function DriverJobDetails() {
//   const router = useRouter();
//   const params = useLocalSearchParams() as Params;
//   const [loadingAccept, setLoadingAccept] = useState(false);

//   const jobId = params?.jobId ?? "job-001";
//   const job = useMemo(() => MOCK_JOBS[jobId] ?? MOCK_JOBS["job-001"], [jobId]);

//   // Mask rider name
//   const maskedRider = useMemo(() => {
//     const name: string = job?.rider?.name ?? "Rider";
//     const parts = name.split(" ");
//     return `${parts[0][0]}. ${parts[1]}`;
//   }, [job]);

//   const onShare = async () => {
//     try {
//       await Share.share({
//         message: `Job ${job.id}: ${job.pickup} → ${job.drop} • ${job.time} • Est ₹${job.estPay}`,
//       });
//     } catch {
//       Alert.alert("Share failed");
//     }
//   };

//   const onSchedule = () => router.push("/driver/availability/preferences");

//   const onAcceptJob = async () => {
//     setLoadingAccept(true);
//     AccessibilityInfo.announceForAccessibility("Accepting job...");

//     // Simulated API response
//     setTimeout(() => {
//       const bookingId = "BKG_" + Math.floor(Math.random() * 9000 + 1000);

//       setLoadingAccept(false);
//       Alert.alert("Job Accepted", "This job has been assigned to you.", [
//         {
//           text: "Go to Booking",
//           onPress: () =>
//             router.replace(`/driver/booking/assigned?bookingId=${bookingId}`),
//         },
//       ]);
//     }, 1200);
//   };

//   return (
//     <ThemedView className="flex-1">
//       <ScrollView
//         contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
//         showsVerticalScrollIndicator={false}
//       >
//         <ThemedText className="text-2xl font-extrabold">{job.type}</ThemedText>
//         <ThemedText className="text-sm text-gray-500 mt-1">
//           Job ID: {job.id}
//         </ThemedText>

//         {/* Pickup & Drop */}
//         <ThemedView className="mt-4 p-4 rounded-2xl border">
//           <View className="flex-row justify-between">
//             <View>
//               <View className="flex-row items-center">
//                 <Ionicons name="location-sharp" size={18} color="#d97706" />
//                 <ThemedText className="ml-2 text-xs text-gray-500">
//                   Pickup
//                 </ThemedText>
//               </View>
//               <ThemedText className="mt-2 font-semibold">
//                 {job.pickup}
//               </ThemedText>
//             </View>

//             <View className="items-end">
//               <ThemedText className="text-xs text-gray-500">Time</ThemedText>
//               <ThemedText className="font-semibold mt-1">{job.time}</ThemedText>
//               <ThemedText className="text-xs text-gray-400 mt-1">
//                 {job.distance} • {job.duration}
//               </ThemedText>
//             </View>
//           </View>

//           <View className="mt-4">
//             <View className="flex-row items-center">
//               <Ionicons name="flag-outline" size={16} color="#666" />
//               <ThemedText className="ml-2 text-xs text-gray-500">
//                 Drop
//               </ThemedText>
//             </View>
//             <ThemedText className="mt-2">{job.drop}</ThemedText>
//           </View>
//         </ThemedView>

//         {/* Rider */}
//         <ThemedView className="mt-4 p-4 rounded-2xl border flex-row justify-between">
//           <View className="flex-row items-center">
//             <Ionicons name="person-circle-outline" size={40} color="#222" />
//             <View className="ml-3">
//               <ThemedText className="font-semibold">{maskedRider}</ThemedText>
//               <View className="flex-row items-center mt-1">
//                 <Ionicons name="star" size={14} color="#fbbf24" />
//                 <ThemedText className="ml-1 text-xs text-gray-500">
//                   {job.rider.rating} • {job.vehicle}
//                 </ThemedText>
//               </View>
//             </View>
//           </View>
//         </ThemedView>

//         {/* Price & Payment */}
//         <ThemedView className="mt-4 p-4 rounded-2xl border">
//           <ThemedText className="text-sm text-gray-500">
//             Estimated Payment
//           </ThemedText>
//           <ThemedText className="text-xl font-extrabold text-yellow-600 mt-1">
//             ₹{job.estPay}
//             {job.bonus ? ` + ₹${job.bonus} bonus` : ""}
//           </ThemedText>
//         </ThemedView>

//         {/* Special instructions */}
//         {job.special && (
//           <ThemedView className="mt-4 p-4 rounded-2xl border">
//             <ThemedText className="text-sm font-semibold">
//               Special Instructions
//             </ThemedText>
//             <ThemedText className="text-sm text-gray-600 mt-2">
//               {job.special}
//             </ThemedText>
//           </ThemedView>
//         )}

//         {/* Action Buttons */}
//         <View className="mt-6 flex-row justify-between">
//           <TouchableOpacity
//             onPress={onShare}
//             className="flex-1 mr-2 p-3 rounded-2xl border items-center flex-row justify-center"
//           >
//             <Entypo name="share" size={18} color="#444" />
//             <ThemedText className="ml-2 font-semibold">Share</ThemedText>
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={onSchedule}
//             className="flex-1 mx-2 p-3 rounded-2xl border items-center"
//           >
//             <MaterialIcons name="schedule" size={18} color="#444" />
//             <ThemedText className="ml-2 font-semibold">Schedule</ThemedText>
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={onAcceptJob}
//             disabled={loadingAccept}
//             className={`flex-1 ml-2 p-3 rounded-2xl ${
//               loadingAccept ? "bg-gray-300" : "bg-emerald-600"
//             } items-center`}
//           >
//             {loadingAccept ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <ThemedText className="text-white font-semibold">Accept</ThemedText>
//             )}
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </ThemedView>
//   );
// }
import React from "react";
import { View, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ThemedText, ThemedView } from "../components/Themed";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

// Driver Job Details
// Route: /driver/job-details?jobId=...

export default function DriverJobDetails() {
  const router = useRouter();
  const { jobId } = useLocalSearchParams<{ jobId?: string }>();

  return (
    <ThemedView className="flex-1 px-4 py-10">
      <ThemedText className="text-3xl font-extrabold">Job Details</ThemedText>
      <ThemedText className="text-gray-500 mt-1">ID: {String(jobId || "job-001")}</ThemedText>

      <ThemedView className="mt-4 p-5 rounded-3xl shadow border" style={{ elevation: 4 }}>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Ionicons name="briefcase-outline" size={22} color="#d97706" />
            <ThemedText className="ml-2 font-semibold">Long Trip</ThemedText>
          </View>
          <View className="px-2 py-1 rounded-full bg-yellow-100 border border-yellow-300">
            <ThemedText className="text-xs text-yellow-700">High Demand</ThemedText>
          </View>
        </View>

        <ThemedText className="text-xl font-bold mt-2">Airport → City Center</ThemedText>
        <View className="flex-row items-center mt-1">
          <MaterialIcons name="schedule" size={16} color="#666" />
          <ThemedText className="ml-2 text-gray-500">Today 6:30–7:00 AM</ThemedText>
        </View>
        <ThemedText className="text-gray-700 mt-1">35 km / 50 min</ThemedText>

        <View className="flex-row mt-3">
          <View className="px-3 py-1 mr-2 rounded-full bg-gray-100 border border-gray-300">
            <ThemedText className="text-xs text-gray-700">Sedan</ThemedText>
          </View>
          <View className="px-3 py-1 mr-2 rounded-full bg-gray-100 border border-gray-300">
            <ThemedText className="text-xs text-gray-700">Nearby</ThemedText>
          </View>
        </View>

        <View className="flex-row items-center justify-between mt-4">
          <View>
            <ThemedText className="text-gray-500">Est. Pay</ThemedText>
            <ThemedText className="text-xl font-extrabold text-yellow-600">₹1,250 + bonus</ThemedText>
          </View>
          <View className="flex-row">
            <TouchableOpacity onPress={() => router.push("/driver/assigned")} className="px-4 py-2 rounded-2xl bg-yellow-500 mr-2">
              <ThemedText className="text-white font-semibold">Accept</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/driver/availability-schedule")} className="px-4 py-2 rounded-2xl bg-white border border-gray-300">
              <ThemedText className="font-semibold">Schedule</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ThemedView>
    </ThemedView>
  );
}

