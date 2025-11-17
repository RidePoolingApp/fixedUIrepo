// app/context/themeStyles.ts
import { useContext } from "react";
import { ThemeContext } from "./ThemeContext";

export function useThemeStyles() {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  return {
    isDark,

    colors: {
      bg: isDark ? "bg-gray-900" : "bg-gray-50",
      card: isDark ? "bg-gray-800" : "bg-white",
      border: isDark ? "border-gray-700" : "border-gray-200",
      text: isDark ? "text-white" : "text-gray-900",
      textSecondary: isDark ? "text-gray-300" : "text-gray-600",
      inputText: isDark ? "text-white" : "text-gray-900",
      placeholder: isDark ? "#ccc" : "#888",
    },
  };
}
