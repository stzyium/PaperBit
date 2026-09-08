import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@react-native-vector-icons/ionicons/static";
import { colors, radii, spacing, typography } from "../theme/theme";

interface QuickAction {
  key: string;
  label: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  danger?: boolean;
  onPress: () => void;
}

interface Props {
  onMessage: () => void;
  onVoice: () => void;
  onBroadcast: () => void;
  onSOS: () => void;
}

export function QuickActionGrid({ onMessage, onVoice, onBroadcast, onSOS }: Props) {
  const actions: QuickAction[] = [
    { key: "message", label: "Message", icon: "chatbubble-outline", onPress: onMessage },
    { key: "voice", label: "Voice", icon: "mic-outline", onPress: onVoice },
    { key: "broadcast", label: "Broadcast", icon: "radio-outline", onPress: onBroadcast },
    { key: "sos", label: "SOS", icon: "warning-outline", danger: true, onPress: onSOS },
  ];

  return (
    <View style={styles.section}>
      <Text style={styles.heading}>Quick actions</Text>
      <View style={styles.grid}>
        {actions.map((action) => (
          <Pressable
            key={action.key}
            onPress={action.onPress}
            style={({ pressed }) => [
              styles.tile,
              action.danger && styles.tileDanger,
              pressed && styles.tilePressed,
            ]}
          >
            <Ionicons
              name={action.icon}
              size={22}
              color={action.danger ? colors.danger : colors.accent}
            />
            <Text style={[styles.tileLabel, action.danger && styles.tileLabelDanger]}>
              {action.label}
            </Text>
          </Pressable>
        ))}
      </View>
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  tile: {
    flexBasis: "48%",
    flexGrow: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  tilePressed: {
    backgroundColor: colors.surfaceRaised,
  },
  tileDanger: {
    borderColor: colors.dangerMuted,
  },
  tileLabel: {
    color: colors.ink,
    fontSize: typography.size.md,
    fontWeight: "500",
  },
  tileLabelDanger: {
    color: colors.danger,
  },
});
