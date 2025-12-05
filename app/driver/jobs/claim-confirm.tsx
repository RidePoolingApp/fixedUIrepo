// app/driver/jobs/claim-confirm.tsx
import React, { useState, useContext } from "react";
import {
  View,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ThemedText, ThemedView } from "../../components/Themed";
import { ThemeContext } from "../../context/ThemeContext";

/**
 * ClaimConfirm
 * - POST /api/driver/jobs/{jobId}/claim
 * - optimistic UI + error handling
 *
 * Usage:
 * router.push(`/driver/jobs/claim-confirm?jobId=${job.id}`)
 */

type Params = { jobId?: string };

export default function ClaimConfirm() {
  const router = useRouter();
  const params = useLocalSearchParams() as Params;
  const jobId = params.jobId ?? "unknown";

  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);

  // Replace base URL with your server URL or use environment config
  const API_BASE = "https://your.api.server";

  const claimJob = async () => {
    if (!jobId || jobId === "unknown") {
      Alert.alert("Invalid job", "Job ID missing");
      return;
    }

    setLoading(true);
    setAttempts((a) => a + 1);

    try {
      // timeout helper
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(`${API_BASE}/api/driver/jobs/${encodeURIComponent(jobId)}/claim`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // include auth header if required, e.g. Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ acceptTerms: true }), // adapt payload if required
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (res.status === 200) {
        const json = await res.json();
        // expected: { success: true, bookingId: "BKG_..." }
        const bookingId = json?.bookingId ?? null;
        setLoading(false);
        Alert.alert("Claimed", "Job assigned to you.", [
          {
            text: "Open booking",
            onPress: () => {
              // navigate to assigned booking screen and pass bookingId
              router.replace(`/driver/assigned?bookingId=${encodeURIComponent(bookingId ?? "")}`);
            },
          },
        ]);
        return;
      }

      if (res.status === 409) {
        // job already taken
        setLoading(false);
        const json = await res.json().catch(() => ({}));
        const msg = json?.message ?? "This job has already been taken.";
        Alert.alert("Too late", msg, [
          { text: "OK", onPress: () => router.replace("/driver/jobs") },
        ]);
        return;
      }

      // other client/server errors
      const errJson = await res.json().catch(() => ({}));
      const errMsg =
        errJson?.message ||
        `Server returned status ${res.status}. Please try again later.`;

      setLoading(false);
      Alert.alert("Claim failed", errMsg, [
        { text: "Retry", onPress: claimJob },
        { text: "Back to jobs", style: "cancel", onPress: () => router.replace("/driver/jobs") },
      ]);
      return;
    } catch (err: any) {
      setLoading(false);

      // fetch aborted or network error
      const isAbort = err?.name === "AbortError";
      const friendly = isAbort ? "Request timed out" : "Network error";

      // small backoff: if attempts < 3 show retry option
      if (attempts < 3) {
        Alert.alert(friendly, "Please check your connection and try again.", [
          { text: "Retry", onPress: claimJob },
          { text: "Back", style: "cancel", onPress: () => router.replace("/driver/jobs") },
        ]);
      } else {
        Alert.alert(friendly, "Multiple attempts failed. Try again later.", [
          { text: "Back to jobs", onPress: () => router.replace("/driver/jobs") },
        ]);
      }
      return;
    }
  };

  const cancel = () => {
    router.back();
  };

  return (
    <ThemedView className="flex-1 items-center justify-center p-6" style={{ backgroundColor: isDark ? "#0b1220" : "#f8fafc" }}>
      <ThemedView
        className="w-full p-6 rounded-2xl"
        style={{
          backgroundColor: isDark ? "#0f1724" : "#ffffff",
          elevation: 4,
          borderWidth: Platform.OS === "android" ? 0 : 0,
        }}
      >
        <ThemedText className="text-xl font-semibold">Confirm Claim</ThemedText>
        <ThemedText className="text-sm text-gray-400 mt-2">
          Are you sure you want to claim job{" "}
          <ThemedText className="font-semibold">{jobId}</ThemedText>?
        </ThemedText>

        <ThemedText className="text-xs text-gray-400 mt-3">
          Note: Cancelling after claiming may affect your driver score. Check cancellation penalties on the job details.
        </ThemedText>

        <View className="flex-row mt-6 justify-between">
          <TouchableOpacity
            onPress={cancel}
            disabled={loading}
            className="flex-1 mr-2 px-4 py-3 rounded-2xl border items-center"
            accessibilityLabel="Cancel claim"
          >
            <ThemedText className="font-semibold">Cancel</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={claimJob}
            disabled={loading}
            className={`flex-1 ml-2 px-4 py-3 rounded-2xl items-center ${loading ? "bg-gray-400" : "bg-emerald-600"}`}
            accessibilityLabel="Confirm claim"
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText className="text-white font-semibold">Claim</ThemedText>
            )}
          </TouchableOpacity>
        </View>
      </ThemedView>
    </ThemedView>
  );
}
