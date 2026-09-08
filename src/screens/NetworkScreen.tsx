import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, radii, spacing, typography } from "../theme/theme";
import { useMesh } from "../state/MeshContext";
import { LinkConditionControl } from "../components/LinkConditionControl";

export function NetworkScreen() {
  const { state } = useMesh();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Network</Text>
        <Text style={styles.subtitle}>{state.nodes.length} nodes in range</Text>

        <View style={styles.nodeList}>
          {state.nodes.map((node) => (
            <View key={node.id} style={styles.nodeRow}>
              <View style={[styles.statusDot, node.online ? styles.dotOnline : styles.dotOffline]} />
              <Text style={styles.nodeLabel}>{node.label}</Text>
              <Text style={styles.nodeHops}>{node.hops} hop{node.hops === 1 ? "" : "s"}</Text>
            </View>
          ))}
        </View>

        <View style={styles.spacer} />

        <LinkConditionControl />
      </ScrollView>
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
  title: {
    color: colors.ink,
    fontSize: typography.size.xl,
    fontWeight: "600",
  },
  subtitle: {
    color: colors.inkMuted,
    fontSize: typography.size.sm,
    marginTop: 2,
    marginBottom: spacing.md,
  },
  nodeList: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  nodeRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: spacing.sm,
  },
  dotOnline: {
    backgroundColor: colors.signalGood,
  },
  dotOffline: {
    backgroundColor: colors.inkFaint,
  },
  nodeLabel: {
    flex: 1,
    color: colors.ink,
    fontSize: typography.size.md,
  },
  nodeHops: {
    color: colors.inkMuted,
    fontFamily: typography.mono,
    fontSize: typography.size.xs,
  },
  spacer: {
    height: spacing.lg,
  },
});
