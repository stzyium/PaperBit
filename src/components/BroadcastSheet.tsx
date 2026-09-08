import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { colors, radii, spacing, typography } from "../theme/theme";
import { useMesh } from "../state/MeshContext";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function BroadcastSheet({ visible, onClose }: Props) {
  const { state, sendBroadcast } = useMesh();
  const [message, setMessage] = useState("");
  const onlineCount = state.nodes.filter((n) => n.online).length;

  const handleSend = () => {
    if (!message.trim()) return;
    sendBroadcast(message.trim());
    setMessage("");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Broadcast</Text>
          <Text style={styles.subtitle}>Sends one message to every connected node.</Text>

          <View style={styles.audience}>
            <Text style={styles.audienceText}>All connected nodes ({onlineCount})</Text>
          </View>

          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Write a message for the whole mesh"
            placeholderTextColor={colors.inkFaint}
            style={styles.input}
            multiline
          />

          <Pressable
            style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!message.trim()}
          >
            <Text style={styles.sendButtonLabel}>Send broadcast</Text>
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
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomWidth: 0,
  },
  title: {
    color: colors.ink,
    fontSize: typography.size.xl,
    fontWeight: "600",
  },
  subtitle: {
    color: colors.inkMuted,
    fontSize: typography.size.sm,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  audience: {
    backgroundColor: colors.bg,
    borderRadius: radii.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  audienceText: {
    color: colors.inkMuted,
    fontFamily: typography.mono,
    fontSize: typography.size.xs,
  },
  input: {
    backgroundColor: colors.bg,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.ink,
    padding: spacing.md,
    minHeight: 80,
    textAlignVertical: "top",
    marginBottom: spacing.md,
  },
  sendButton: {
    backgroundColor: colors.accent,
    borderRadius: radii.sm,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
  sendButtonLabel: {
    color: colors.bg,
    fontWeight: "600",
    fontSize: typography.size.md,
  },
  cancelButton: {
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  cancelLabel: {
    color: colors.inkMuted,
    fontSize: typography.size.md,
  },
});
