// app/_layout.tsx
import { Stack } from "expo-router";
import { useEffect } from "react";
import { registerForPushNotifications } from "./utils/notifications";
import { ThemeProvider } from "./context/ThemeContext";
import { UserTypeProvider } from "./context/UserTypeContext";
import { ApiProvider } from "./context/ApiContext";
import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";
import { tokenCache } from "./utils/tokenCache";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
  );
}

export default function RootLayout() {

  useEffect(() => {
    registerForPushNotifications();
  }, []);

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <ApiProvider>
          <UserTypeProvider>
            <ThemeProvider>
              <Stack screenOptions={{ headerShown: false }} />
            </ThemeProvider>
          </UserTypeProvider>
        </ApiProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}

