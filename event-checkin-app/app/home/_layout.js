import { Stack, Tabs } from "expo-router";
import React from "react";

export default function HomeLayout() {
  return (
    <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
      <Stack.Screen options={{ title: "Home" }} name="index" />
      <Stack.Screen options={{ title: "Guests" }} name="guests" />
    </Stack>
  );
}
