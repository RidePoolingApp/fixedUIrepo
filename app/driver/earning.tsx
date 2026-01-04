import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useState, useEffect, useCallback } from "react";
import { useRouter } from "expo-router";
import { useApi, DriverEarning, EarningType } from "../services/api";

export default function DriverEarnings() {
  const router = useRouter();
  const api = useApi();

  const tabs = ["Today", "Week", "Month"];
  const [active, setActive] = useState("Today");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [earnings, setEarnings] = useState<DriverEarning[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);

  const graphAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const getDateRange = (period: string) => {
    const now = new Date();
    let from: string;
    
    switch (period) {
      case "Week":
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        from = weekAgo.toISOString().split('T')[0];
        break;
      case "Month":
        const monthAgo = new Date(now);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        from = monthAgo.toISOString().split('T')[0];
        break;
      case "Today":
      default:
        from = now.toISOString().split('T')[0];
        break;
    }
    
    return { from, to: now.toISOString().split('T')[0] };
  };

  const fetchEarnings = useCallback(async () => {
    try {
      const { from, to } = getDateRange(active);
      const data = await api.getDriverEarnings(from, to);
      setEarnings(data.earnings);
      setTotalEarnings(data.total);
    } catch (error) {
      console.error("Error fetching earnings:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [api, active]);

  useEffect(() => {
    setLoading(true);
    fetchEarnings();
  }, [active, fetchEarnings]);

  useEffect(() => {
    Animated.timing(graphAnim, {
      toValue: 1,
      duration: 900,
      useNativeDriver: true,
    }).start();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [active]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchEarnings();
  };

  const getRideCount = () => earnings.filter(e => e.type === EarningType.RIDE).length;

  const getEarningTypeLabel = (type: EarningType) => {
    switch (type) {
      case EarningType.RIDE: return "Ride Earning";
      case EarningType.BONUS: return "Bonus";
      case EarningType.TIP: return "Tip";
      case EarningType.REFERRAL: return "Referral Bonus";
      default: return type;
    }
  };

  const generateGraphBars = () => {
    if (earnings.length === 0) return [20, 20, 20, 20, 20, 20, 20];
    
    const dailyTotals: { [key: string]: number } = {};
    earnings.forEach(e => {
      const day = new Date(e.date).toDateString();
      dailyTotals[day] = (dailyTotals[day] || 0) + e.amount;
    });
    
    const values = Object.values(dailyTotals).slice(-7);
    const max = Math.max(...values, 1);
    return values.map(v => Math.max(20, (v / max) * 140));
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* PREMIUM HEADER */}
      <View className="absolute top-0 left-0 right-0">
        <Svg height="240" width="100%">
          <Path d="M0 0 H400 V140 Q200 240 0 140 Z" fill="#FACC15" />
          <Path d="M0 30 H400 V150 Q200 250 0 150 Z" fill="#FDE047" opacity={0.4} />
        </Svg>
      </View>

      {/* BACK BUTTON */}
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-14 left-6 bg-white p-3 rounded-full shadow"
        style={{ elevation: 4 }}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      {/* TITLE */}
      <View className="mt-28 px-6">
        <Text className="text-3xl font-extrabold text-gray-900">Earnings</Text>
        <Text className="text-gray-700 mt-1">Track your driving income</Text>
      </View>

      {/* FILTER TABS */}
      <View
        className="px-5 mt-5 flex-row items-center justify-between bg-white rounded-3xl py-3 shadow border border-gray-200"
        style={{ elevation: 4 }}
      >
        {tabs.map((tab) => {
          const activeTab = tab === active;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setActive(tab)}
              className={`px-4 py-2 rounded-2xl ${activeTab ? "bg-yellow-500" : "bg-gray-100"}`}
            >
              <Text className={`text-sm font-semibold ${activeTab ? "text-white" : "text-gray-600"}`}>
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView 
        className="px-6 mt-6" 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 180 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#FACC15"]} />}
      >
        {loading ? (
          <View className="items-center py-10">
            <ActivityIndicator size="large" color="#FACC15" />
          </View>
        ) : (
          <>
            {/* EARNINGS CARD */}
            <Animated.View style={{ opacity: fadeAnim }} className="bg-white p-6 rounded-3xl shadow border border-gray-200">
              <Text className="text-gray-500">Total Earnings</Text>
              <Text className="text-4xl font-extrabold text-gray-900 mt-2">₹{totalEarnings.toLocaleString()}</Text>

              <View className="flex-row justify-between mt-4">
                <View>
                  <Text className="text-gray-500">Rides</Text>
                  <Text className="text-xl font-bold text-gray-800">{getRideCount()}</Text>
                </View>
                <View>
                  <Text className="text-gray-500">Total Transactions</Text>
                  <Text className="text-xl font-bold text-gray-800">{earnings.length}</Text>
                </View>
              </View>
            </Animated.View>

            {/* GRAPH PLACEHOLDER (Animated Bars) */}
            <Text className="text-lg font-bold text-gray-900 mt-8">Earnings Overview</Text>

            <Animated.View
              style={{
                opacity: graphAnim,
                transform: [
                  {
                    translateY: graphAnim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }),
                  },
                ],
              }}
              className="bg-white rounded-3xl p-6 mt-3 shadow border border-gray-200"
            >
              {/* GRAPH BARS */}
              <View className="flex-row justify-between items-end h-40">
                {generateGraphBars().map((h, i) => (
                  <View key={i} style={{ height: h }} className="w-6 bg-yellow-400 rounded-xl" />
                ))}
              </View>
            </Animated.View>

            {/* RECENT PAYMENTS */}
            <Text className="text-lg font-bold mt-10 text-gray-900">Recent Payments</Text>

            {earnings.length === 0 ? (
              <View className="bg-white p-5 rounded-2xl shadow mt-3 border border-gray-200 items-center">
                <Ionicons name="wallet-outline" size={40} color="#ccc" />
                <Text className="text-gray-500 mt-2">No earnings yet</Text>
              </View>
            ) : (
              earnings.slice(0, 10).map((item) => (
                <View
                  key={item.id}
                  className="bg-white p-5 rounded-2xl shadow mt-3 border border-gray-200 flex-row justify-between"
                  style={{ elevation: 4 }}
                >
                  <View>
                    <Text className="text-gray-800 font-semibold">{getEarningTypeLabel(item.type)}</Text>
                    <Text className="text-gray-500 text-sm">
                      {new Date(item.date).toLocaleDateString()} • {item.description || "Completed"}
                    </Text>
                  </View>

                  <Text className="text-yellow-600 font-bold text-lg">₹{item.amount}</Text>
                </View>
              ))
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

