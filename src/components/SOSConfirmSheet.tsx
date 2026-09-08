import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@react-native-vector-icons/ionicons/static";
import { colors, radii, spacing, typography } from "../theme/theme";
import { useMesh } from "../state/MeshContext";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function SOSConfirmSheet({ visible, onClose }: Props) {
  const { sendSOS } = useMesh();

  const handleConfirm = () => {
    sendSOS();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.iconWrap}>
            <Ionicons name="warning" size={28} color={colors.danger} />
          </View>
          <Text style={styles.title}>Send SOS?</Text>
          <Text style={styles.subtitle}>This alerts every reachable node immediately.</Text>

          <Pressable style={styles.sendButton} onPress={handleConfirm}>
            <Text style={styles.sendLabel}>Send alert</Text>
          </Pressable>

          <Pressable style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelLabel}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: spacing.lg,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.dangerMuted,
    padding: spacing.lg,
    alignItems: "center",
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: radii.pill,
    backgroundColor: colors.dangerMuted,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  title: {
    color: colors.ink,
    fontSize: typography.size.xl,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.inkMuted,
    fontSize: typography.size.sm,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  sendButton: {
    backgroundColor: colors.danger,
    borderRadius: radii.sm,
    paddingVertical: spacing.md,
    alignItems: "center",
    width: "100%",
  },
  sendLabel: {
    color: colors.ink,
    fontWeight: "600",
    fontSize: typography.size.md,
  },
  cancelButton: {
    paddingVertical: spacing.md,
    alignItems: "center",
    width: "100%",
  },
  cancelLabel: {
    color: colors.inkMuted,
    fontSize: typography.size.md,
  },
});
