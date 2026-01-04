import { View, TouchableOpacity, ScrollView, Switch, Text, ActivityIndicator, Alert, TextInput, Modal } from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import BottomNav from "./components/BottomNav";
import { ThemedScreen, ThemedView, ThemedText, ThemedTextSecondary } from "./components/Themed";
import { useThemeStyles } from "./context/themeStyles";
import { ThemeContext } from "./context/ThemeContext";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useUser, useClerk } from "@clerk/clerk-expo";
import { Image } from "react-native";
import { useApi, User, SavedPlace } from "./services/api";

export default function Profile() {
  const router = useRouter();
  const { isDark } = useThemeStyles();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user: clerkUser } = useUser();
  const { signOut } = useClerk();
  const api = useApi();

  const [user, setUser] = useState<User | null>(null);
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const [userData, places] = await Promise.all([
        api.getMe(),
        api.getSavedPlaces(),
      ]);
      setUser(userData);
      setSavedPlaces(places);
      setEditName(`${userData.firstName || ""} ${userData.lastName || ""}`.trim());
      setEditPhone(userData.phone || "");
    } catch (error) {
      console.error("Failed to fetch user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setSaving(true);
    try {
      const nameParts = editName.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      const updated = await api.updateMe({
        firstName,
        lastName,
        phone: editPhone || undefined,
      });
      setUser(updated);
      setEditModalVisible(false);
      Alert.alert("Success", "Profile updated successfully");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePlace = async (id: string) => {
    Alert.alert(
      "Delete Place",
      "Are you sure you want to delete this saved place?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await api.deleteSavedPlace(id);
              setSavedPlaces(prev => prev.filter(p => p.id !== id));
            } catch (error: any) {
              Alert.alert("Error", error.message || "Failed to delete");
            }
          },
        },
      ]
    );
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace("/(public)/welcome");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const displayName = user?.firstName 
    ? `${user.firstName} ${user.lastName || ""}`.trim()
    : clerkUser?.fullName || clerkUser?.firstName || "User";

  const displayContact = user?.email || user?.phone 
    || clerkUser?.primaryEmailAddress?.emailAddress 
    || clerkUser?.primaryPhoneNumber?.phoneNumber 
    || "No contact info";

  return (
    <ThemedScreen>
      <View className="absolute top-0 left-0 right-0">
        <Svg height="250" width="100%">
          <Path
            d="M0 0 H400 V140 Q200 240 0 140 Z"
            fill={isDark ? "#1F2937" : "#FACC15"}
          />
        </Svg>
      </View>

      <View className="mt-20 px-6 mb-6">
        <ThemedText className="text-3xl font-extrabold">Profile</ThemedText>
        <ThemedTextSecondary>Manage your preferences</ThemedTextSecondary>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FACC15" />
        </View>
      ) : (
        <ScrollView
          className="px-6"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 140 }}
        >
          <ThemedView className="p-6 rounded-3xl shadow border mb-6">
            <View className="flex-row items-center">
              {clerkUser?.imageUrl ? (
                <Image
                  source={{ uri: clerkUser.imageUrl }}
                  className="w-20 h-20 rounded-full"
                />
              ) : (
                <Ionicons
                  name="person-circle-outline"
                  size={80}
                  color={isDark ? "#fff" : "#555"}
                />
              )}

              <View className="ml-4 flex-1">
                <ThemedText className="text-2xl font-extrabold">
                  {displayName}
                </ThemedText>
                <ThemedTextSecondary numberOfLines={1}>
                  {displayContact}
                </ThemedTextSecondary>
                {user?.role === "DRIVER" && (
                  <View className="flex-row items-center mt-1">
                    <View className="bg-yellow-500 px-2 py-1 rounded-full">
                      <Text className="text-white text-xs font-bold">DRIVER</Text>
                    </View>
                  </View>
                )}
              </View>

              <TouchableOpacity
                onPress={() => setEditModalVisible(true)}
                className={`p-2 rounded-full ${isDark ? "bg-gray-700" : "bg-gray-100"}`}
              >
                <Ionicons name="pencil" size={20} color="#FACC15" />
              </TouchableOpacity>
            </View>
          </ThemedView>

          {savedPlaces.length > 0 && (
            <ThemedView className="p-4 rounded-3xl shadow border mb-6">
              <ThemedText className="font-semibold mb-3">Saved Places</ThemedText>
              {savedPlaces.map((place, i) => (
                <View
                  key={place.id}
                  className={`flex-row items-center justify-between py-3 ${
                    i < savedPlaces.length - 1 ? `border-b ${isDark ? "border-gray-700" : "border-gray-200"}` : ""
                  }`}
                >
                  <View className="flex-row items-center flex-1">
                    <Ionicons
                      name={place.name.toLowerCase() === "home" ? "home" : place.name.toLowerCase() === "work" ? "briefcase" : "location"}
                      size={22}
                      color="#FACC15"
                    />
                    <View className="ml-3 flex-1">
                      <ThemedText className="font-semibold">{place.name}</ThemedText>
                      <ThemedTextSecondary className="text-sm" numberOfLines={1}>
                        {place.address}
                      </ThemedTextSecondary>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => handleDeletePlace(place.id)}>
                    <Ionicons name="trash-outline" size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </ThemedView>
          )}

          <ThemedView className="p-6 rounded-3xl shadow border mb-6">
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

            {[
              { label: "Payments & Wallet", icon: "wallet-outline" as const, route: "/payments" as const },
              { label: "Ride History", icon: "time-outline" as const, route: "/bookings" as const },
              { label: "Support", icon: "help-circle-outline" as const, route: "/support" as const },
              { label: "Privacy & Security", icon: "shield-checkmark-outline" as const, route: "/privacy" as const },
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

          {user?.role !== "DRIVER" && (
            <TouchableOpacity
              className="bg-yellow-50 p-5 rounded-2xl border border-yellow-300 flex-row items-center mb-4"
              onPress={() => router.push("/driver/onboarding/welcome")}
            >
              <Ionicons name="car-sport-outline" size={28} color="#d97706" />
              <Text className="ml-4 text-yellow-700 text-lg font-bold">
                Become a Driver
              </Text>
            </TouchableOpacity>
          )}

          {user?.role === "DRIVER" && (
            <TouchableOpacity
              className="bg-green-50 p-5 rounded-2xl border border-green-300 flex-row items-center mb-4"
              onPress={() => router.push("/driver/dashboard")}
            >
              <Ionicons name="car-sport-outline" size={28} color="#16a34a" />
              <Text className="ml-4 text-green-700 text-lg font-bold">
                Driver Dashboard
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-500 p-5 rounded-2xl items-center shadow"
          >
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className={`rounded-t-3xl p-6 ${isDark ? "bg-gray-900" : "bg-white"}`}>
            <View className="flex-row justify-between items-center mb-6">
              <ThemedText className="text-xl font-bold">Edit Profile</ThemedText>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={28} color={isDark ? "#fff" : "#333"} />
              </TouchableOpacity>
            </View>

            <View className="mb-4">
              <ThemedTextSecondary className="mb-2">Full Name</ThemedTextSecondary>
              <TextInput
                value={editName}
                onChangeText={setEditName}
                placeholder="Enter your name"
                placeholderTextColor="#999"
                className={`p-4 rounded-2xl border text-lg ${
                  isDark 
                    ? "bg-gray-800 border-gray-700 text-white" 
                    : "bg-gray-50 border-gray-200 text-gray-900"
                }`}
              />
            </View>

            <View className="mb-6">
              <ThemedTextSecondary className="mb-2">Phone Number</ThemedTextSecondary>
              <TextInput
                value={editPhone}
                onChangeText={setEditPhone}
                placeholder="Enter phone number"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                className={`p-4 rounded-2xl border text-lg ${
                  isDark 
                    ? "bg-gray-800 border-gray-700 text-white" 
                    : "bg-gray-50 border-gray-200 text-gray-900"
                }`}
              />
            </View>

            <TouchableOpacity
              onPress={handleUpdateProfile}
              disabled={saving}
              className="bg-yellow-500 p-4 rounded-2xl items-center"
              style={{ opacity: saving ? 0.7 : 1 }}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-bold text-lg">Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <BottomNav />
    </ThemedScreen>
  );
}
