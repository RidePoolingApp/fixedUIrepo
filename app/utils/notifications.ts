import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";

export async function registerForPushNotifications() {
  let token;

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert("Enable notifications to receive ride updates!");
      return null;
    }

    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    if (projectId) {
      token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      console.log("Expo Push Token:", token);
    } else {
      console.warn("No projectId found, skipping push token registration");
    }
  }

  // Android-specific settings
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "Waylink Alerts",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FFAA00",
    });
  }

  return token;
}
