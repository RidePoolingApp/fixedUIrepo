import React from "react";
import { View, Text } from "react-native";

type FareItem = {
  label: string;
  amount: number | string;
  note?: string;
};

type FareBreakdownProps = {
  title?: string;
  items: FareItem[];
  total: number | string;
  totalLabel?: string;
  currency?: string; // e.g., "₹"
  accentColor?: string; // e.g., theme yellow
};

const formatAmount = (amount: number | string, currency?: string) => {
  if (typeof amount === "string") return amount;
  return `${currency ?? ""}${amount}`;
};

export default function FareBreakdown({
  title = "Fare Breakdown",
  items,
  total,
  totalLabel = "TOTAL",
  currency = "₹",
  accentColor = "#F59E0B", // amber-500 fallback; header uses #FACC15 but text looks better a tad darker
}: FareBreakdownProps) {
  return (
    <View className="border-t border-gray-200 pt-5">
      <Text className="text-lg font-bold text-gray-900">{title}</Text>

      {items.map((it, idx) => (
        <View key={`${it.label}-${idx}`} className={`flex-row justify-between ${idx === 0 ? "mt-3" : "mt-2"}`}>
          <View>
            <Text className="text-gray-700">{it.label}</Text>
            {it.note ? (
              <Text className="text-gray-500 text-xs">{it.note}</Text>
            ) : null}
          </View>
          <Text className="text-gray-900 font-semibold">{formatAmount(it.amount, currency)}</Text>
        </View>
      ))}

      <View className="flex-row justify-between mt-3 border-t border-gray-200 pt-3">
        <Text className="text-gray-900 font-bold">{totalLabel}</Text>
        <Text className="font-extrabold text-xl" style={{ color: accentColor }}>
          {formatAmount(total, currency)}
        </Text>
      </View>
    </View>
  );
}
