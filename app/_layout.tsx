import { Stack } from "expo-router";
import { useEffect } from "react";
import { registerForPushNotifications } from "./utils/notifications";

export default function RootLayout() {
 useEffect(() => {
    registerForPushNotifications();
  }, []);
  return <Stack screenOptions={{ headerShown: false }} />;
}
