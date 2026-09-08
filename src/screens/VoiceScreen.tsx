import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@react-native-vector-icons/ionicons/static";
import { colors, radii, spacing, typography } from "../theme/theme";
import { useMesh } from "../state/MeshContext";

export function VoiceScreen() {
  const { logActivity } = useMesh();
  const [recording, setRecording] = useState(false);

  const handlePressIn = () => setRecording(true);
  const handlePressOut = () => {
    if (recording) {
      logActivity("voice", "Voice message sent over mesh");
    }
    setRecording(false);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Voice</Text>
        <Text style={styles.subtitle}>
          Speech is compressed to text and mesh-relayed when bandwidth is tight.
        </Text>
      </View>

      <View style={styles.center}>
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={[styles.talkButton, recording && styles.talkButtonActive]}
        >
          <Ionicons name="mic" size={36} color={recording ? colors.bg : colors.accent} />
        </Pressable>
        <Text style={styles.hint}>
          {recording ? "Release to send" : "Hold to talk"}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  title: {
    color: colors.ink,
    fontSize: typography.size.xl,
    fontWeight: "600",
  },
  subtitle: {
    color: colors.inkMuted,
    fontSize: typography.size.sm,
    marginTop: 2,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
  },
  talkButton: {
    width: 120,
    height: 120,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.accentMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  talkButtonActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  hint: {
    color: colors.inkMuted,
    fontFamily: typography.mono,
    fontSize: typography.size.xs,
  },
});
