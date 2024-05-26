import { Stack, Tabs } from "expo-router";
import React from "react";
import Login from "./index";

export default function AuthLayout() {
  return (
    <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
      <Stack.Screen options={{ title: "Login" }} name="index" />
      <Stack.Screen options={{ title: "Register" }} name="register" />
    </Stack>
  );
}
