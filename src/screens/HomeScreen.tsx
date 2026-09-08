import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { colors, spacing, typography } from "../theme/theme";
import { StatusBanner } from "../components/StatusBanner";
import { QuickActionGrid } from "../components/QuickActionGrid";
import { ActivityFeed } from "../components/ActivityFeed";
import { BroadcastSheet } from "../components/BroadcastSheet";
import { SOSConfirmSheet } from "../components/SOSConfirmSheet";

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const [broadcastVisible, setBroadcastVisible] = useState(false);
  const [sosVisible, setSOSVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.appName}>Paperbit</Text>
        </View>

        <StatusBanner />

        <QuickActionGrid
          onMessage={() => navigation.navigate("Chat")}
          onVoice={() => navigation.navigate("Voice")}
          onBroadcast={() => setBroadcastVisible(true)}
          onSOS={() => setSOSVisible(true)}
        />

        <ActivityFeed />
      </ScrollView>

      <BroadcastSheet visible={broadcastVisible} onClose={() => setBroadcastVisible(false)} />
      <SOSConfirmSheet visible={sosVisible} onClose={() => setSOSVisible(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    marginBottom: spacing.lg,
  },
  appName: {
    color: colors.ink,
    fontSize: typography.size.lg,
    fontFamily: typography.mono,
    letterSpacing: 0.5,
  },
});
