import React, { useState, useRef, useEffect } from "react";
import { 
  Pressable, 
  StyleSheet, 
  Text, 
  View, 
  Animated, 
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@react-native-vector-icons/ionicons/static";
import { colors, spacing, typography } from "../theme/theme";
import { useMesh } from "../state/MeshContext";

export function VoiceScreen() {
  const { logActivity } = useMesh();
  const [recording, setRecording] = useState(false);
  
  // Animation Values
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  // Handle the radar-pulse animation loop
  useEffect(() => {
    if (recording) {
      pulseAnim.setValue(0);
      Animated.loop(
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        })
      ).start();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(0);
    }
  }, [recording, pulseAnim]);

  const handlePressIn = () => {
    setRecording(true);
    // Spring animation for a satisfying button press down
    Animated.spring(scaleAnim, {
      toValue: 0.85,
      speed: 20,
      bounciness: 10,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    if (recording) {
      logActivity("voice", "Voice message sent over mesh");
    }
    setRecording(false);
    // Bounce back up when released
    Animated.spring(scaleAnim, {
      toValue: 1,
      speed: 20,
      bounciness: 10,
      useNativeDriver: true,
    }).start();
  };

  // Interpolate pulse values for scale and opacity
  const pulseScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2.2], // Ripples outward
  });
  
  const pulseOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0], // Fades out as it expands
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.headerIconContainer}>
          <Ionicons name="radio-outline" size={24} color={colors.accent} />
        </View>
        <Text style={styles.title}>Mesh Voice</Text>
        <Text style={styles.subtitle}>
          Speech is compressed to text and mesh-relayed when bandwidth is tight.
        </Text>
      </View>

      <View style={styles.center}>
        <View style={styles.buttonWrapper}>
          {/* Animated Background Ripple */}
          <Animated.View
            style={[
              styles.pulseRing,
              {
                transform: [{ scale: pulseScale }],
                opacity: pulseOpacity,
                // Fallback to a hardcoded color if colors.accent doesn't support opacity overlays well
                backgroundColor: colors.accent, 
              },
            ]}
          />
          
          {/* Main Interactive Button */}
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Pressable
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              style={[styles.talkButton, recording && styles.talkButtonActive]}
            >
              <Ionicons 
                name={recording ? "mic" : "mic-outline"} 
                size={44} 
                color={recording ? colors.bg : colors.accent} 
              />
            </Pressable>
          </Animated.View>
        </View>
        
        <Text style={[styles.hint, recording && styles.hintActive]}>
          {recording ? "Release to send..." : "Hold to talk"}
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
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    alignItems: "center", // Centered for a cleaner, modern look
  },
  headerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    color: colors.ink,
    fontSize: typography.size.xl,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  subtitle: {
    color: colors.inkMuted,
    fontSize: typography.size.sm,
    marginTop: spacing.sm,
    textAlign: "center",
    lineHeight: 20,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xl,
  },
  buttonWrapper: {
    width: 140,
    height: 140,
    alignItems: "center",
    justifyContent: "center",
  },
  pulseRing: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  talkButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    // Premium soft shadow
    shadowColor: colors.ink,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)', // Subtle edge definition
  },
  talkButtonActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
    // Intense shadow when active
    shadowColor: colors.accent,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 15,
  },
  hint: {
    color: colors.inkMuted,
    fontFamily: typography.mono,
    fontSize: typography.size.sm, // Slightly larger for readability
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginTop: spacing.md,
  },
  hintActive: {
    color: colors.accent,
    fontWeight: "600",
  },
});