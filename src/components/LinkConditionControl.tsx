import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radii, spacing, typography } from "../theme/theme";
import { LinkCondition } from "../types/mesh";
import { useMesh } from "../state/MeshContext";

const OPTIONS: { key: LinkCondition; label: string }[] = [
  { key: "clear", label: "Clear" },
  { key: "degraded", label: "Degraded" },
  { key: "constrained", label: "Constrained" },
];

export function LinkConditionControl() {
  const { state, setLinkCondition, logActivity } = useMesh();

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Simulate link condition</Text>
      <Text style={styles.subtitle}>For demonstration — changes how messages travel.</Text>

      <View style={styles.segments}>
        {OPTIONS.map((option) => {
          const active = state.linkCondition === option.key;
          return (
            <Pressable
              key={option.key}
              onPress={() => {
                setLinkCondition(option.key);
                logActivity("system", `Link condition set to ${option.label.toLowerCase()}`);
              }}
              style={[styles.segment, active && styles.segmentActive]}
            >
              <Text style={[styles.segmentLabel, active && styles.segmentLabelActive]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  title: {
    color: colors.ink,
    fontSize: typography.size.md,
    fontWeight: "600",
    marginBottom: spacing.xs / 2,
  },
  subtitle: {
    color: colors.inkMuted,
    fontSize: typography.size.sm,
    marginBottom: spacing.md,
  },
  segments: {
    flexDirection: "row",
    backgroundColor: colors.bg,
    borderRadius: radii.sm,
    padding: 3,
  },
  segment: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: "center",
    borderRadius: radii.sm - 2,
  },
  segmentActive: {
    backgroundColor: colors.accentMuted,
  },
  segmentLabel: {
    color: colors.inkMuted,
    fontFamily: typography.mono,
    fontSize: typography.size.xs,
  },
  segmentLabelActive: {
    color: colors.accent,
  },
});
