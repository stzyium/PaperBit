import React from "react";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import { MeshProvider } from "./src/state/MeshContext";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { colors } from "./src/theme/theme";

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.bg,
    card: colors.surface,
    border: colors.border,
    primary: colors.accent,
    text: colors.ink,
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <MeshProvider>
        <NavigationContainer theme={navTheme}>
          <StatusBar />
          <RootNavigator />
        </NavigationContainer>
      </MeshProvider>
    </SafeAreaProvider>
  );
}
