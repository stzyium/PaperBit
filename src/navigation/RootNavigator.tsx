import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@react-native-vector-icons/ionicons/static";
import { colors } from "../theme/theme";
import { HomeScreen } from "../screens/HomeScreen";
import { ChatScreen } from "../screens/ChatScreen";
import { VoiceScreen } from "../screens/VoiceScreen";
import { NetworkScreen } from "../screens/NetworkScreen";
import { EmergencyScreen } from "../screens/EmergencyScreen";

export type RootTabParamList = {
  Home: undefined;
  Chat: undefined;
  Voice: undefined;
  Network: undefined;
  Emergency: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

type IconName = React.ComponentProps<typeof Ionicons>["name"];
type TabBarIconProps = { color: string; size: number };

// Created once at module scope -- stable identity across every render of
// RootNavigator, so React Navigation never sees a "new" component type.
function makeTabBarIcon(name: IconName) {
  return function TabBarIcon({ color, size }: TabBarIconProps) {
    return <Ionicons name={name} size={size} color={color} />;
  };
}

const HomeIcon = makeTabBarIcon("home-outline");
const ChatIcon = makeTabBarIcon("chatbubble-outline");
const VoiceIcon = makeTabBarIcon("mic-outline");
const NetworkIcon = makeTabBarIcon("git-network-outline");
const EmergencyIcon = makeTabBarIcon("warning-outline");

export function RootNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.inkMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: HomeIcon }} />
      <Tab.Screen name="Chat" component={ChatScreen} options={{ tabBarIcon: ChatIcon }} />
      <Tab.Screen name="Voice" component={VoiceScreen} options={{ tabBarIcon: VoiceIcon }} />
      <Tab.Screen name="Network" component={NetworkScreen} options={{ tabBarIcon: NetworkIcon }} />
      <Tab.Screen name="Emergency" component={EmergencyScreen} options={{ tabBarIcon: EmergencyIcon }} />
    </Tab.Navigator>
  );
}