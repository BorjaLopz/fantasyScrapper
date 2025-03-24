import { Redirect, Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { IconSymbol } from "@/components/ui/IconSymbol";
import { useAuthSession } from "@/providers/AuthProvider";

export default function TabLayout() {
  const { token, isLoading } = useAuthSession();

  if (isLoading) {
    return <span className="loading loading-spinner loading-md"></span>;
  }

  if (token?.current === "") {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "bg-base-300",
        headerShown: false,
        // tabBarButton: HapticTab,
        // tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <div className="bg-gray-700">
        <Tabs.Screen
          name="index"
          options={{
            title: "Inicio",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="house.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="my-team"
          options={{
            title: "Mi equipo",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="people.fill" color={color} />
            ),
          }}
        />
      </div>
    </Tabs>
  );
}
