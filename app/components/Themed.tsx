// app/components/Themed.tsx
import { View, Text } from "react-native";
import { useThemeStyles } from "../context/themeStyles";

export function ThemedView({ className = "", children, ...props }) {
  const { colors } = useThemeStyles();
  return (
    <View className={`${colors.card} ${colors.border} ${className}`} {...props}>
      {children}
    </View>
  );
}

export function ThemedScreen({ className = "", children, ...props }) {
  const { colors } = useThemeStyles();
  return (
    <View className={`${colors.bg} flex-1 ${className}`} {...props}>
      {children}
    </View>
  );
}

export function ThemedText({ className = "", children, ...props }) {
  const { colors } = useThemeStyles();
  return (
    <Text className={`${colors.text} ${className}`} {...props}>
      {children}
    </Text>
  );
}

export function ThemedTextSecondary({ className = "", children, ...props }) {
  const { colors } = useThemeStyles();
  return (
    <Text className={`${colors.textSecondary} ${className}`} {...props}>
      {children}
    </Text>
  );
}
