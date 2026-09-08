import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, radii, spacing, typography } from "../theme/theme";
import { useMesh } from "../state/MeshContext";

export function StatusBanner() {
  const { state } = useMesh();

  return (
    <View style={styles.card}>
      <View style={styles.pillRow}>
        <View style={styles.pill}>
          <View style={styles.dot} />
          <Text style={styles.pillText}>MESH ACTIVE</Text>
        </View>
      </View>

      <Text style={styles.headline}>
        {state.internetAvailable ? "Internet available" : "Internet unavailable"}
      </Text>
      <Text style={styles.subline}>Communication operational</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  pillRow: {
    flexDirection: "row",
    marginBottom: spacing.md,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.signalGoodMuted,
    borderRadius: radii.pill,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.signalGood,
    marginRight: 6,
  },
  pillText: {
    color: colors.signalGood,
    fontFamily: typography.mono,
    fontSize: typography.size.xs,
    letterSpacing: 1,
  },
  headline: {
    color: colors.ink,
    fontSize: typography.size.xxl,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  subline: {
    color: colors.inkMuted,
    fontSize: typography.size.md,
  },
});
