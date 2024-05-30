import Loading from "@/components/Loading";
import { primaryColor, screenHeight } from "@/constants/Default";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { GuestAPI } from "@/services/GuestAPI";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
import EventInfoScreen from "./eventInfo";
import EventGuestsScreen from "./eventGuests";
import EventScannerScreen from "./eventScanner";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function EventScreen({ route, navigation }) {
  const { eventId } = route.params;
  const [guests, setGuests] = useState();

  useEffect(() => {
    const getGuests = async () => {
      console.log(eventId);
      const response = await GuestAPI.getAll(eventId);
      setGuests(response.data);
    };
    getGuests();
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: primaryColor,
        tabBarStyle: {
          position: "absolute",
          bottom: 14,
          left: 14,
          right: 14,
          backgroundColor: "#000",
          elevation: 0,
          borderRadius: 10,
          height: 60,
        },
      }}
    >
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => {
            return focused ? (
              <Ionicons name="home" size={size} color={color} />
            ) : (
              <Ionicons name="home-outline" size={size} color={color} />
            );
          },
        }}
        name="Início"
        component={EventInfoScreen}
      />
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => {
            return focused ? (
              <Ionicons name="qr-code" size={size} color={color} />
            ) : (
              <Ionicons name="qr-code-outline" size={size} color={color} />
            );
          },
        }}
        name="Scanner"
        component={EventScannerScreen}
      />
      <Tab.Screen
        initialParams={{ guests: guests }}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => {
            return focused ? (
              <Ionicons name="people" size={size} color={color} />
            ) : (
              <Ionicons name="people-outline" size={size} color={color} />
            );
          },
        }}
        name="Convidados"
      >
        {(props) => <EventGuestsScreen {...props} guests={guests} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
