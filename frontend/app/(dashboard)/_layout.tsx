import { Redirect, Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { useAuthSession } from "@/providers/AuthProvider";
import { Icon } from "@/components/ui/icon";
import { Home } from "lucide-react-native";

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
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarActiveTintColor: "bg-primary-500",
          tabBarIcon: () => (
            <Icon as={Home} className="size-12" />
          ),
        }}
      />
      <Tabs.Screen
        name="my-team"
        options={{
          title: "Mi equipo",
          tabBarIcon: () => (
            <Icon as={Home} className="size-12" />
          ),
        }}
      />
    </Tabs>
  );
}
