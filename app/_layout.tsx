// app/_layout.tsx
import { Stack } from "expo-router";
import { useEffect } from "react";
import { registerForPushNotifications } from "./utils/notifications";
import { ThemeProvider } from "./context/ThemeContext";

export default function RootLayout() {

  useEffect(() => {
    registerForPushNotifications();
  }, []);

  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}
