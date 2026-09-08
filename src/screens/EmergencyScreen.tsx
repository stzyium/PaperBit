import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@react-native-vector-icons/ionicons/static";
import { colors, radii, spacing, typography } from "../theme/theme";
import { useMesh } from "../state/MeshContext";
import { SOSConfirmSheet } from "../components/SOSConfirmSheet";

const TEMPLATES = ["FIRE", "MEDICAL", "EVACUATE", "NEED HELP"];

export function EmergencyScreen() {
  const { logActivity } = useMesh();
  const [sosVisible, setSOSVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Emergency</Text>
        <Text style={styles.subtitle}>
          These packets get priority handling across every node in the mesh.
        </Text>

        <Pressable style={styles.sosButton} onPress={() => setSOSVisible(true)}>
          <Ionicons name="warning" size={22} color={colors.ink} />
          <Text style={styles.sosLabel}>Send SOS</Text>
        </Pressable>

        <Text style={styles.heading}>Quick templates</Text>
        <View style={styles.templateGrid}>
          {TEMPLATES.map((template) => (
            <Pressable
              key={template}
              style={styles.templateTile}
              onPress={() => logActivity("sos", `Sent emergency template: ${template}`)}
            >
              <Text style={styles.templateLabel}>{template}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

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
  title: {
    color: colors.ink,
    fontSize: typography.size.xl,
    fontWeight: "600",
  },
  subtitle: {
    color: colors.inkMuted,
    fontSize: typography.size.sm,
    marginTop: 2,
    marginBottom: spacing.lg,
  },
  sosButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.danger,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
  },
  sosLabel: {
    color: colors.ink,
    fontWeight: "700",
    fontSize: typography.size.lg,
  },
  heading: {
    color: colors.inkMuted,
    fontSize: typography.size.sm,
    marginBottom: spacing.sm,
  },
  templateGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  templateTile: {
    flexBasis: "48%",
    flexGrow: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.dangerMuted,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  templateLabel: {
    color: colors.danger,
    fontFamily: typography.mono,
    fontSize: typography.size.sm,
    letterSpacing: 0.5,
  },
});
