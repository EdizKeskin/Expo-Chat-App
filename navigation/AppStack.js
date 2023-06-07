import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { ChatRoom, Settings } from "../screens";
import { ChatList } from "../screens/ChatList";
import { Ionicons, AntDesign } from "@expo/vector-icons";

const Tabs = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabsNavigator = () => {
  return (
    <Tabs.Navigator
      screenOptions={{
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="ChatList"
        component={ChatList}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="setting" size={size} color={color} />
          ),
        }}
      />
    </Tabs.Navigator>
  );
};

export const AppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={TabsNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="ChatRoom" component={ChatRoom} />
    </Stack.Navigator>
  );
};
