import React, { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@react-native-vector-icons/ionicons/static";
import { colors, radii, spacing, typography } from "../theme/theme";
import { useMesh } from "../state/MeshContext";

interface ChatMessage {
  id: string;
  text: string;
  outgoing: boolean;
  timestamp: number;
}

export function ChatScreen() {
  const { logActivity } = useMesh();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "m1", text: "Reached the north relay point.", outgoing: false, timestamp: Date.now() - 1000 * 60 * 20 },
    { id: "m2", text: "Copy that, heading your way.", outgoing: true, timestamp: Date.now() - 1000 * 60 * 18 },
  ]);
  const [draft, setDraft] = useState("");

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}`, text, outgoing: true, timestamp: Date.now() },
    ]);
    logActivity("message", `Sent: "${text}"`);
    setDraft("");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Chat</Text>
        <Text style={styles.subtitle}>Store-and-forward over the mesh</Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.outgoing ? styles.bubbleOut : styles.bubbleIn]}>
            <Text style={styles.bubbleText}>{item.text}</Text>
          </View>
        )}
      />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.composer}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Message"
            placeholderTextColor={colors.inkFaint}
            style={styles.input}
          />
          <Pressable style={styles.sendButton} onPress={handleSend}>
            <Ionicons name="arrow-up" size={18} color={colors.bg} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
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
    paddingBottom: spacing.sm,
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
  list: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  bubble: {
    maxWidth: "80%",
    borderRadius: radii.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  bubbleIn: {
    backgroundColor: colors.surface,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: colors.border,
  },
  bubbleOut: {
    backgroundColor: colors.accentMuted,
    alignSelf: "flex-end",
  },
  bubbleText: {
    color: colors.ink,
    fontSize: typography.size.md,
  },
  composer: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    gap: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.ink,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: radii.pill,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
});
