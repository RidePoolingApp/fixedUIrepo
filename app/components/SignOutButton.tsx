import { useClerk } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

interface SignOutButtonProps extends TouchableOpacityProps {
  variant?: "default" | "danger";
}

export const SignOutButton = ({ variant = "default", style, ...props }: SignOutButtonProps) => {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/(onboarding)/welcome");
    } catch (err) {
      console.error("Error signing out:", JSON.stringify(err, null, 2));
    }
  };

  const buttonStyle = variant === "danger" 
    ? "bg-red-500 p-4 rounded-2xl items-center shadow"
    : "bg-yellow-500 p-4 rounded-2xl items-center shadow";

  const textStyle = "text-white font-semibold text-lg";

  return (
    <TouchableOpacity
      onPress={handleSignOut}
      className={buttonStyle}
      style={style}
      {...props}
    >
      <Text className={textStyle}>Sign Out</Text>
    </TouchableOpacity>
  );
};
