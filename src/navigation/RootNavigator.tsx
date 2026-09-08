import React from "react";
import { Pressable } from "react-native";
import { createBottomTabNavigator, BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
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

// 1. Extract the custom button component outside of the navigator
function CustomTabBarButton(props: BottomTabBarButtonProps) {
  return (
    <Pressable
      {...props}
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      style={({ pressed }) => [
        // @ts-ignore - props.style is a valid style object/array from React Navigation
        props.style,
        { opacity: 1 },
      ]}
    />
  );
}

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
        tabBarButton: CustomTabBarButton,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarIcon: HomeIcon }}
      />

      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{ tabBarIcon: ChatIcon }}
      />

      <Tab.Screen
        name="Voice"
        component={VoiceScreen}
        options={{ tabBarIcon: VoiceIcon }}
      />

      <Tab.Screen
        name="Network"
        component={NetworkScreen}
        options={{ tabBarIcon: NetworkIcon }}
      />

      <Tab.Screen
        name="Emergency"
        component={EmergencyScreen}
        options={{ tabBarIcon: EmergencyIcon }}
      />
    </Tab.Navigator>
  );
}