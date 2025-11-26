// // app/profile.tsx
// import { View, Text, TouchableOpacity, ScrollView } from "react-native";
// import Svg, { Path } from "react-native-svg";
// import { Ionicons, MaterialIcons } from "@expo/vector-icons";
// import BottomNav from "./components/BottomNav";

// export default function Profile() {
//   return (
//     <View className="flex-1 bg-gray-50">

//       {/* HEADER */}
//       <View className="absolute top-0 left-0 right-0">
//         <Svg height="240" width="100%">
//           <Path d="M0 0 H400 V140 Q200 240 0 140 Z" fill="#FACC15" />
//         </Svg>
//       </View>

//       {/* TITLE */}
//       <View className="mt-20 px-6 mb-6">
//         <Text className="text-3xl font-extrabold text-gray-900">Profile</Text>
//         <Text className="text-gray-700 mt-1">Manage your preferences</Text>
//       </View>

//       <ScrollView
//         className="px-6"
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingBottom: 140 }}
//       >
//         {/* USER CARD */}
//         <View className="bg-white p-6 rounded-3xl shadow border border-gray-200">
//           <View className="flex-row items-center">
//             <Ionicons name="person-circle-outline" size={80} color="#555" />
//             <View className="ml-4">
//               <Text className="text-2xl font-extrabold text-gray-900">John Doe</Text>
//               <Text className="text-gray-600">+91 98765 43210</Text>
//             </View>
//           </View>
//         </View>

//         {/* MENU OPTIONS */}
//         <View className="mt-6 space-y-4">
//           {[
//             { label: "Saved Places", icon: "location-outline" },
//             { label: "Payments & Wallet", icon: "wallet-outline" },
//             { label: "Ride History", icon: "time-outline" },
//             { label: "Support", icon: "help-circle-outline" },
//             { label: "Privacy & Security", icon: "shield-checkmark-outline" },
//           ].map((item, i) => (
//             <TouchableOpacity
//               key={i}
//               className="bg-white p-5 rounded-2xl shadow border border-gray-200 flex-row items-center"
//             >
//               <Ionicons name={item.icon} size={28} color="#444" />
//               <Text className="ml-4 text-gray-900 text-lg">{item.label}</Text>
//             </TouchableOpacity>
//           ))}

//           {/* LOGOUT */}
//           <TouchableOpacity className="bg-red-50 p-5 rounded-2xl border border-red-200 flex-row items-center">
//             <MaterialIcons name="logout" size={28} color="#dc2626" />
//             <Text className="ml-4 text-red-600 text-lg font-semibold">Logout</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>

//       <BottomNav />
//     </View>
//   );
// }

// app/profile.tsx
import { View, TouchableOpacity, ScrollView, Switch, Text } from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import BottomNav from "./components/BottomNav";
import { ThemedScreen, ThemedView, ThemedText, ThemedTextSecondary } from "./components/Themed";
import { useThemeStyles } from "./context/themeStyles";
import { ThemeContext } from "./context/ThemeContext";
import { useContext } from "react";
import { useRouter } from "expo-router";

export default function Profile() {
  const router = useRouter();
  const { isDark, colors } = useThemeStyles();
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <ThemedScreen>
      {/* TOP CURVED HEADER */}
      <View className="absolute top-0 left-0 right-0">
        <Svg height="250" width="100%">
          <Path
            d="M0 0 H400 V140 Q200 240 0 140 Z"
            fill={isDark ? "#1F2937" : "#FACC15"}
          />
        </Svg>
      </View>

      {/* PAGE TITLE */}
      <View className="mt-20 px-6 mb-6">
        <ThemedText className="text-3xl font-extrabold">Profile</ThemedText>
        <ThemedTextSecondary>Manage your preferences</ThemedTextSecondary>
      </View>

      <ScrollView
        className="px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        {/* USER CARD */}
        <ThemedView className="p-6 rounded-3xl shadow border mb-6">
          <View className="flex-row items-center">
            <Ionicons
              name="person-circle-outline"
              size={80}
              color={isDark ? "#fff" : "#555"}
            />

            <View className="ml-4">
              <ThemedText className="text-2xl font-extrabold">John Doe</ThemedText>
              <ThemedTextSecondary>+91 98765 43210</ThemedTextSecondary>
            </View>
          </View>
        </ThemedView>

        {/* MENU SECTION */}
        <ThemedView className="p-6 rounded-3xl shadow border mb-6">

          {/* DARK MODE TOGGLE */}
          <View className="flex-row items-center justify-between mb-5">
            <View className="flex-row items-center">
              <Ionicons
                name={isDark ? "moon" : "sunny"}
                size={28}
                color="#FACC15"
              />
              <ThemedText className="ml-3 text-lg font-semibold">Dark Mode</ThemedText>
            </View>

            <Switch
              value={theme === "dark"}
              onChange={toggleTheme}
              thumbColor={theme === "dark" ? "#FACC15" : "#fff"}
              trackColor={{ false: "#bbb", true: "#FACC15" }}
            />
          </View>

          {/* Options */}
          {[
            { label: "Saved Places", icon: "location-outline", route: "/saved-locations" },
            { label: "Payments & Wallet", icon: "wallet-outline", route: "/payments" },
            { label: "Ride History", icon: "time-outline", route: "/bookings" },
            { label: "Support", icon: "help-circle-outline", route: "/support" },
            { label: "Privacy & Security", icon: "shield-checkmark-outline", route: "/privacy" },
          ].map((item, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => router.push(item.route)}
              className="flex-row items-center justify-between py-4"
            >
              <View className="flex-row items-center">
                <Ionicons name={item.icon} size={26} color="#FACC15" />
                <ThemedText className="ml-4 text-lg">{item.label}</ThemedText>
              </View>

              <Ionicons
                name="chevron-forward"
                size={20}
                color={isDark ? "#bbb" : "#777"}
              />
            </TouchableOpacity>
          ))}
        </ThemedView>
        <TouchableOpacity
  className="bg-yellow-50 p-5 rounded-2xl border border-yellow-300 flex-row items-center mt-4"
  onPress={() => router.push("/driver/onboarding/welcome")}
>
  <Ionicons name="car-sport-outline" size={28} color="#d97706" />
  <Text className="ml-4 text-yellow-700 text-lg font-bold">
    Become a Driver
  </Text>
</TouchableOpacity>
        


        {/* LOGOUT BUTTON */}
        <TouchableOpacity
          onPress={() => router.replace("/welcome")}
          className="bg-red-500 p-5 rounded-2xl items-center shadow"
        >
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNav />
    </ThemedScreen>
  );
}
