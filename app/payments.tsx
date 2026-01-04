import { View, TouchableOpacity, Alert, ScrollView, ActivityIndicator, RefreshControl, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ThemedScreen, ThemedView, ThemedText, ThemedTextSecondary } from "./components/Themed";
import { useThemeStyles } from "./context/themeStyles";
import { useEffect, useState, useCallback } from "react";
import { useApi, Payment, PaymentStatus, PaymentMethod } from "./services/api";

export default function Payments() {
  const router = useRouter();
  const { isDark } = useThemeStyles();
  const api = useApi();

  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const walletBalance = "₹350";

  const fetchPayments = useCallback(async (pageNum = 1, refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else if (pageNum === 1) setLoading(true);

      const response = await api.getPaymentHistory(pageNum, 10);
      
      if (refresh || pageNum === 1) {
        setPayments(response.payments || []);
      } else {
        setPayments(prev => [...prev, ...(response.payments || [])]);
      }
      
      setHasMore((response.payments?.length || 0) === 10);
      setPage(pageNum);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [api]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const onRefresh = () => fetchPayments(1, true);

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.COMPLETED:
        return "#22c55e";
      case PaymentStatus.FAILED:
        return "#ef4444";
      case PaymentStatus.REFUNDED:
        return "#3b82f6";
      default:
        return "#f59e0b";
    }
  };

  const getMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case PaymentMethod.UPI:
        return "phone-portrait-outline";
      case PaymentMethod.CARD:
        return "card-outline";
      case PaymentMethod.WALLET:
        return "wallet-outline";
      default:
        return "cash-outline";
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString() + " • " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <ThemedScreen>
      <ScrollView
        className="flex-1 px-6 pt-16"
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FACC15" />
        }
      >
        <View className="flex-row justify-between items-center mb-6">
          <ThemedText className="text-3xl font-extrabold">Payments & Wallet</ThemedText>
          <TouchableOpacity onPress={() => router.back()} className={`p-3 rounded-full ${isDark ? "bg-gray-700" : "bg-gray-200"}`}>
            <Ionicons name="arrow-back" size={20} color={isDark ? "#fff" : "#333"} />
          </TouchableOpacity>
        </View>

        <ThemedView className="rounded-3xl p-6 shadow mb-6 flex-row justify-between items-center">
          <View>
            <ThemedText className="text-lg font-bold">Wallet Balance</ThemedText>
            <Text className="text-2xl font-extrabold text-yellow-500 mt-1">{walletBalance}</Text>
          </View>

          <TouchableOpacity
            onPress={() => Alert.alert("Top-up", "Top-up flow coming soon")}
            className="bg-yellow-500 px-4 py-3 rounded-2xl"
          >
            <Text className="text-white font-semibold">Add Money</Text>
          </TouchableOpacity>
        </ThemedView>

        <ThemedView className="rounded-3xl p-4 shadow mb-4">
          <ThemedText className="font-semibold mb-2">Payment Methods</ThemedText>
          
          {[
            { icon: "phone-portrait-outline", label: "UPI", desc: "Google Pay, PhonePe" },
            { icon: "card-outline", label: "Card", desc: "•••• 4242" },
            { icon: "cash-outline", label: "Cash", desc: "Pay after ride" },
          ].map((method, i) => (
            <TouchableOpacity 
              key={i}
              className={`flex-row items-center justify-between py-3 ${i < 2 ? `border-b ${isDark ? "border-gray-700" : "border-gray-200"}` : ""}`}
            >
              <View className="flex-row items-center">
                <Ionicons name={method.icon as any} size={22} color="#FACC15" />
                <View className="ml-3">
                  <ThemedText>{method.label}</ThemedText>
                  <ThemedTextSecondary className="text-sm">{method.desc}</ThemedTextSecondary>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={isDark ? "#888" : "#666"} />
            </TouchableOpacity>
          ))}
        </ThemedView>

        <ThemedView className="rounded-3xl p-4 shadow">
          <View className="flex-row justify-between items-center mb-3">
            <ThemedText className="font-semibold">Transaction History</ThemedText>
            {payments.length > 0 && (
              <TouchableOpacity onPress={onRefresh}>
                <ThemedTextSecondary>Refresh</ThemedTextSecondary>
              </TouchableOpacity>
            )}
          </View>

          {loading && payments.length === 0 ? (
            <ActivityIndicator size="small" color="#FACC15" className="py-4" />
          ) : payments.length === 0 ? (
            <View className="items-center py-6">
              <Ionicons name="receipt-outline" size={40} color={isDark ? "#666" : "#ccc"} />
              <ThemedTextSecondary className="mt-2">No transactions yet</ThemedTextSecondary>
            </View>
          ) : (
            payments.map((payment, i) => (
              <View 
                key={payment.id}
                className={`flex-row items-center justify-between py-3 ${i < payments.length - 1 ? `border-b ${isDark ? "border-gray-700" : "border-gray-200"}` : ""}`}
              >
                <View className="flex-row items-center flex-1">
                  <View className={`w-10 h-10 rounded-full items-center justify-center ${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
                    <Ionicons 
                      name={getMethodIcon(payment.method)} 
                      size={20} 
                      color="#FACC15" 
                    />
                  </View>
                  <View className="ml-3 flex-1">
                    <ThemedText numberOfLines={1}>
                      {payment.ride ? `Ride Payment` : "Payment"}
                    </ThemedText>
                    <ThemedTextSecondary className="text-xs">
                      {formatDate(payment.createdAt)} • {payment.method}
                    </ThemedTextSecondary>
                  </View>
                </View>
                
                <View className="items-end">
                  <Text className="font-bold" style={{ color: getStatusColor(payment.status) }}>
                    {payment.status === PaymentStatus.REFUNDED ? "+" : "-"}₹{payment.amount}
                  </Text>
                  <Text className="text-xs" style={{ color: getStatusColor(payment.status) }}>
                    {payment.status}
                  </Text>
                </View>
              </View>
            ))
          )}

          {hasMore && payments.length > 0 && (
            <TouchableOpacity 
              onPress={() => fetchPayments(page + 1)}
              className="items-center py-3"
            >
              <ThemedTextSecondary>Load more</ThemedTextSecondary>
            </TouchableOpacity>
          )}
        </ThemedView>
      </ScrollView>
    </ThemedScreen>
  );
}
