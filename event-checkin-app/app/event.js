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
import EventInfoTab from "./eventTab";
import EventGuestsTab from "./guestsTab";
import EventScannerTab from "./eventScanner";
import { Ionicons } from "@expo/vector-icons";
import { EventAPI } from "@/services/EventAPI";
import { getCurrentDateFormatted } from "@/helper/date";

const Tab = createBottomTabNavigator();

export default function EventScreen({ route, navigation }) {
  const { eventId } = route.params;
  const [info, setInfo] = useState();
  const [guests, setGuests] = useState();

  useEffect(() => {
    const getData = async () => {
      const { data } = await EventAPI.get(eventId);
      console.log(data);
      setInfo(data);
      setGuests(data.guests);
    };
    getData();
  }, []);

  const checkin = async (id) => {
    const newGuests = guests.map((guest) =>
      guest.id === id ? { ...guest, checkin: getCurrentDateFormatted() } : guest
    );
    setGuests(newGuests);
  };

  const updateUncheckin = async (id) => {
    const newGuests = guests.map((guest) =>
      guest.id === id ? { ...guest, checkin: null } : guest
    );
    setGuests(newGuests);
  };

  useEffect(() => {
    if (guests) {
      setInfo({
        ...info,
        checkinCount: guests.filter((x) => x.checkin).length,
        dropCount: guests.filter((x) => !x.checkin).length,
      });
    }
  }, [guests]);

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
      >
        {(props) => <EventInfoTab {...props} info={info} />}
      </Tab.Screen>
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
        component={EventScannerTab}
      />
      <Tab.Screen
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
        {(props) => (
          <EventGuestsTab
            {...props}
            guests={guests}
            updateUncheckin={updateUncheckin}
            updateCheckin={checkin}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
