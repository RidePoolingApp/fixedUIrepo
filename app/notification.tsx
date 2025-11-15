// app/notifications.tsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Pressable,
  Animated,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import Svg, { Path } from "react-native-svg";

type NotificationItem = {
  id: string;
  title: string;
  body: string;
  time: string; // human readable
  read: boolean;
  icon?: string;
};

const initialNotifications: NotificationItem[] = [
  {
    id: "1",
    title: "Ride Completed",
    body: "Your ride with driver Ravi is completed. Rate your experience.",
    time: "2h ago",
    read: false,
    icon: "🚗",
  },
  {
    id: "2",
    title: "Payment Successful",
    body: "You were charged ₹258 for your ride on 14 Nov.",
    time: "1d ago",
    read: true,
    icon: "💳",
  },
  {
    id: "3",
    title: "Driver Arriving",
    body: "Driver Ajay is 2 mins away. Get ready!",
    time: "3d ago",
    read: false,
    icon: "📍",
  },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    initialNotifications
  );
  const [refreshing, setRefreshing] = useState(false);

  // Animated values per item
  const animRefs = useRef<Record<string, Animated.Value>>({});
  notifications.forEach((n) => {
    if (!animRefs.current[n.id]) {
      animRefs.current[n.id] = new Animated.Value(1);
    }
  });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // simulate network call
    setTimeout(() => {
      // optionally append a new notification
      setNotifications((prev) => [
        {
          id: String(Date.now()),
          title: "New Offer",
          body: "Flat 20% off on your next 3 rides. Limited time!",
          time: "just now",
          read: false,
          icon: "🎁",
        },
        ...prev,
      ]);
      setRefreshing(false);
    }, 900);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const clearAll = () => {
    Animated.stagger(
      50,
      notifications.map((n) =>
        Animated.timing(animRefs.current[n.id], {
          toValue: 0,
          useNativeDriver: true,
          duration: 220,
        })
      )
    ).start(() => {
      setNotifications([]);
    });
  };

  const renderItem = ({ item }: { item: NotificationItem }) => {
    const anim = animRefs.current[item.id] ?? new Animated.Value(1);

    return (
      <Animated.View
        style={{
          transform: [
            {
              scale: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.95, 1],
              }),
            },
          ],
          opacity: anim,
        }}
      >
        <Pressable
          onPress={() => {
            // mark read when tapped and navigate to a route (example)
            markAsRead(item.id);
            // navigate to a details page if needed:
            // router.push(`/ride/${item.id}`);
          }}
          className="bg-white px-4 py-4 rounded-2xl mb-3 flex-row items-start shadow"
        >
          {/* Icon */}
          <View className="w-12 h-12 rounded-xl bg-yellow-100 items-center justify-center mr-3">
            <Text className="text-2xl">{item.icon ?? "🔔"}</Text>
          </View>

          {/* Content */}
          <View className="flex-1">
            <View className="flex-row justify-between items-start">
              <Text
                className={`text-base font-semibold ${
                  item.read ? "text-gray-700" : "text-gray-900"
                }`}
              >
                {item.title}
              </Text>

              <Text className="text-xs text-gray-400 ml-2">{item.time}</Text>
            </View>

            <Text className={`text-sm mt-1 ${item.read ? "text-gray-500" : "text-gray-600"}`}>
              {item.body}
            </Text>

            <View className="flex-row mt-3 space-x-3 items-center">
              <TouchableOpacity
                onPress={() => toggleRead(item.id)}
                className={`px-3 py-1 rounded-full border ${
                  item.read ? "border-gray-300 bg-gray-100" : "border-yellow-500 bg-yellow-50"
                }`}
              >
                <Text className={`${item.read ? "text-gray-700" : "text-yellow-700"} text-sm`}>
                  {item.read ? "Mark Unread" : "Mark Read"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  // animate removal
                  Animated.timing(anim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                  }).start(() => {
                    setNotifications((prev) => prev.filter((p) => p.id !== item.id));
                  });
                }}
                className="px-3 py-1 rounded-full border border-gray-200"
              >
                <Text className="text-sm text-gray-600">Dismiss</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Animated.View>
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />

      {/* Curved Yellow Background header (consistent) */}
      <View className="absolute top-0 left-0 right-0">
        <Svg height="200" width="100%">
          <Path
            d="
              M0 0 
              H400 
              V140 
              Q200 260 0 140 
              Z
            "
            fill="#FACC15"
          />
        </Svg>
      </View>

      {/* Header */}
      <View className="pt-16 px-6 pb-4 flex-row justify-between items-center">
        <View>
          <Text className="text-2xl font-bold text-gray-900">Notifications</Text>
          <Text className="text-sm text-gray-700 mt-1">
            {unreadCount} unread
          </Text>
        </View>

        <View className="flex-row items-center space-x-3">
          <TouchableOpacity
            onPress={() => {
              // mark all read
              setNotifications((prev) => prev.map((p) => ({ ...p, read: true })));
            }}
            className="px-3 py-2 rounded-xl bg-white shadow"
          >
            <Text className="text-sm text-gray-800">Mark all read</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={clearAll}
            className="px-3 py-2 rounded-xl bg-white shadow"
          >
            <Text className="text-sm text-gray-800">Clear all</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* List */}
      <View className="flex-1 px-6 pt-2 pb-6">
        <FlatList
          data={notifications}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View className="items-center mt-12">
              <Text className="text-gray-600 text-lg">You're all caught up 🎉</Text>
              <Text className="text-sm text-gray-500 mt-2">No new notifications</Text>
            </View>
          }
        />
      </View>
    </View>
  );
}
