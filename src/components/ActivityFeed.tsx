import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@react-native-vector-icons/ionicons/static";
import { colors, radii, spacing, typography } from "../theme/theme";
import { ActivityEntry, ActivityKind } from "../types/mesh";
import { useMesh } from "../state/MeshContext";

const ICONS: Record<ActivityKind, React.ComponentProps<typeof Ionicons>["name"]> = {
  message: "chatbubble-outline",
  voice: "mic-outline",
  broadcast: "radio-outline",
  sos: "warning-outline",
  system: "hardware-chip-outline",
};

function timeAgo(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

function Row({ entry }: { entry: ActivityEntry }) {
  const isDanger = entry.kind === "sos";
  return (
    <View style={styles.row}>
      <View style={[styles.iconWrap, isDanger && styles.iconWrapDanger]}>
        <Ionicons
          name={ICONS[entry.kind]}
          size={16}
          color={isDanger ? colors.danger : colors.accent}
        />
      </View>
      <View style={styles.rowText}>
        <Text style={styles.summary}>{entry.summary}</Text>
        <Text style={styles.time}>{timeAgo(entry.timestamp)}</Text>
      </View>
    </View>
  );
}

export function ActivityFeed() {
  const { state } = useMesh();

  return (
    <View style={styles.section}>
      <Text style={styles.heading}>Recent activity</Text>
      {state.activity.length === 0 ? (
        <Text style={styles.empty}>Nothing yet — actions you take will show up here.</Text>
      ) : (
        <View style={styles.list}>
          {state.activity.map((entry) => (
            <Row key={entry.id} entry={entry} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: spacing.lg,
  },
  heading: {
    color: colors.inkMuted,
    fontSize: typography.size.sm,
    marginBottom: spacing.sm,
  },
  empty: {
    color: colors.inkFaint,
    fontSize: typography.size.sm,
  },
  list: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: radii.sm,
    backgroundColor: colors.accentMuted,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
  iconWrapDanger: {
    backgroundColor: colors.dangerMuted,
  },
  rowText: {
    flex: 1,
  },
  summary: {
    color: colors.ink,
    fontSize: typography.size.sm,
  },
  time: {
    color: colors.inkFaint,
    fontFamily: typography.mono,
    fontSize: 11,
    marginTop: 2,
  },
});
