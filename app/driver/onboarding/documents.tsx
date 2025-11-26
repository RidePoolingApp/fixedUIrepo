import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function DocumentsUpload() {
  const router = useRouter();

  const [dl, setDl] = useState(false);
  const [rc, setRc] = useState(false);
  const [insurance, setInsurance] = useState(false);

  const allDone = dl && rc && insurance;

  return (
    <View className="flex-1 bg-gray-50">

      {/* HEADER */}
      <View className="absolute top-0 left-0 right-0">
        <Svg height="260" width="100%">
          <Path d="M0 0 H400 V140 Q200 260 0 140 Z" fill="#FACC15" />
          <Path
            d="M0 40 H400 V180 Q200 320 0 180 Z"
            fill="#FDE047"
            opacity={0.4}
          />
        </Svg>
      </View>

      {/* BACK BUTTON */}
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-14 left-6 bg-white p-3 rounded-full shadow"
        style={{ elevation: 5 }}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      {/* TITLE */}
      <View className="mt-28 px-6">
        <Text className="text-3xl font-extrabold text-gray-900">
          Upload Documents
        </Text>
        <Text className="text-gray-700 mt-1">
          Required documents for verification
        </Text>
      </View>

      <ScrollView
        className="px-6 mt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 150 }}
      >

        {/* DOCUMENT ITEM FUNCTION */}
        {/* Reusable Upload Card */}
        {(itemProps => (
          <View className="space-y-5">
            {[
              {
                key: "dl",
                label: "Driving License",
                value: dl,
                setValue: setDl,
                icon: "id-card-outline",
              },
              {
                key: "rc",
                label: "Vehicle RC",
                value: rc,
                setValue: setRc,
                icon: "document-text-outline",
              },
              {
                key: "insurance",
                label: "Insurance",
                value: insurance,
                setValue: setInsurance,
                icon: "shield-checkmark-outline",
              },
            ].map(({ key, label, value, setValue, icon }) => (
              <TouchableOpacity
                key={key}
                onPress={() => setValue(true)}
                className="bg-white p-5 rounded-3xl shadow border border-gray-200 flex-row items-center justify-between"
                style={{ elevation: 4 }}
              >
                {/* Left Side */}
                <View className="flex-row items-center">
                  <Ionicons name={icon} size={32} color="#d97706" />
                  <Text className="ml-4 text-gray-900 text-lg font-semibold">
                    {label}
                  </Text>
                </View>

                {/* Upload Status */}
                {value ? (
                  <View className="flex-row items-center">
                    <Ionicons
                      name="checkmark-circle"
                      size={28}
                      color="#22c55e"
                    />
                    <Text className="ml-1 text-green-600 font-semibold">
                      Uploaded
                    </Text>
                  </View>
                ) : (
                  <Text className="text-gray-500">Tap to Upload</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))()}

        {/* NEXT BUTTON */}
        <TouchableOpacity
          onPress={() => router.push("/driver/onboarding/review")}
          disabled={!allDone}
          className={`p-5 rounded-3xl items-center mt-10 ${
            allDone ? "bg-yellow-500" : "bg-gray-300"
          }`}
          style={{ elevation: 5 }}
        >
          <Text className="text-white text-lg font-bold">Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
