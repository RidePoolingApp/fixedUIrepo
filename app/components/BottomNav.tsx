// components/BottomNav.tsx
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useEffect, useRef } from "react";

export default function BottomNav() {
  const router = useRouter();
  const path = usePathname();

  const activeColor = "#FACC15";     // Yellow
  const inactiveColor = "#9CA3AF";   // Gray

  // Floating animation for center button
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.08,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const tabs = [
    {
      label: "Home",
      route: "/home",
      icon: (c) => <Ionicons name="home-outline" size={26} color={c} />,
      activeIcon: (c) => <Ionicons name="home" size={26} color={c} />,
    },
    {
      label: "Alerts",
      route: "/notifications",
      icon: (c) => <Ionicons name="notifications-outline" size={26} color={c} />,
      activeIcon: (c) => <Ionicons name="notifications" size={26} color={c} />,
    },
    {
      label: "Bookings",
      route: "/bookings",
      icon: (c) => <MaterialIcons name="event-note" size={26} color={c} />,
      activeIcon: (c) => <MaterialIcons name="event" size={26} color={c} />,
    },
    {
      label: "Profile",
      route: "/profile",
      icon: (c) => <FontAwesome5 name="user" size={22} color={c} />,
      activeIcon: (c) => <FontAwesome5 name="user-alt" size={22} color={c} />,
    },
  ];

  return (
    <View className="absolute bottom-4 left-0 right-0 items-center">

      {/* Solid Premium Navbar */}
      <View
        className="
          flex-row 
          bg-white 
          rounded-full 
          px-8 py-4 
          shadow-lg 
          w-[92%]
          justify-between
          items-center
        "
        style={{ elevation: 12 }}
      >
        {/* Left 2 tabs */}
        {tabs.slice(0, 2).map((tab) => {
          const active = path === tab.route;
          const color = active ? activeColor : inactiveColor;

          return (
            <TouchableOpacity
              key={tab.route}
              onPress={() => router.push(tab.route)}
              className="items-center w-14"
            >
              {active ? tab.activeIcon(color) : tab.icon(color)}

              <Text
                className={`text-[10px] mt-1 ${
                  active ? "text-yellow-500 font-semibold" : "text-gray-400"
                }`}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Floating Book Button */}
        <Animated.View style={{ transform: [{ scale: pulse }] }}>
          <TouchableOpacity
            onPress={() => router.push("/book")}
            className="
              w-16 h-16 
              bg-yellow-500 
              rounded-full 
              items-center justify-center 
              shadow-2xl 
              -mt-10
            "
            style={{ elevation: 20 }}
          >
            <Ionicons name="car-sport" size={30} color="white" />
          </TouchableOpacity>
        </Animated.View>

        {/* Right 2 tabs */}
        {tabs.slice(2).map((tab) => {
          const active = path === tab.route;
          const color = active ? activeColor : inactiveColor;

          return (
            <TouchableOpacity
              key={tab.route}
              onPress={() => router.push(tab.route)}
              className="items-center w-14"
            >
              {active ? tab.activeIcon(color) : tab.icon(color)}

              <Text
                className={`text-[10px] mt-1 ${
                  active ? "text-yellow-500 font-semibold" : "text-gray-400"
                }`}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

