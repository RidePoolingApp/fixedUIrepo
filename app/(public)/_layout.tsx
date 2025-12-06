import { Stack } from "expo-router";
import { SignedOut } from "@clerk/clerk-expo";

export default function PublicLayout() {
  return (
    <SignedOut>
      <Stack screenOptions={{ headerShown: false }} />
    </SignedOut>
  );
}
