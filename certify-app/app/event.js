import { primaryColor, screenHeight, screenWidth } from "@/constants/Default";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import React, { useCallback, useEffect, useRef, useState } from "react";
import EventInfoTab from "./eventTab";
import EventGuestsTab from "./guestsTab";
import EventTemplateTab from "./templateTab";
import EventScannerTab from "./eventScanner";
import { Ionicons } from "@expo/vector-icons";
import { EventAPI } from "@/services/EventAPI";
import { View, Animated } from "react-native";
import { useFocusEffect } from "expo-router";

const Tab = createBottomTabNavigator();

export default function EventScreen({ route, navigation }) {
  const { eventId } = route.params;
  const [info, setInfo] = useState(null);
  const [guests, setGuests] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paddingHorizontal] = useState(20);
  const tabOffsetValue = useRef(new Animated.Value(0)).current;

  const getData = async () => {
    setLoading(true);
    try {
      const { data } = await EventAPI.get(eventId);
      setInfo(data);
      setGuests([...data.guests]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleTabFocus = (index) => {
    Animated.spring(tabOffsetValue, {
      toValue: getWidth() * index,
      useNativeDriver: true,
    }).start();
  };

  const checkin = async (ids) => {
    const newGuests = guests.map((guest) =>
      ids.includes(guest.id)
        ? { ...guest, checkinDate: new Date(), guestStatus: 2 }
        : guest
    );
    setGuests(newGuests);
  };

  const updateUncheckin = async (ids) => {
    const newGuests = guests.map((guest) =>
      ids.includes(guest.id)
        ? { ...guest, checkinDate: null, guestStatus: 1 }
        : guest
    );

    setGuests(newGuests);
  };

  const updateDeleted = async (ids) => {
    const newGuests = guests.filter((guest) => !ids.includes(guest.id));
    setGuests(newGuests);
  };

  useEffect(() => {
    if (guests && info) {
      setInfo({
        ...info,
        guestsCount: guests.length,
        checkinCount: guests.filter((x) => x.checkinDate).length,
        pendingCount: guests.filter((x) => !x.checkinDate).length,
      });
    }
  }, [guests]);

  const addGuest = (guest) => {
    setGuests([...guests, { ...guest }]);
  };

  const getWidth = () => {
    width = screenWidth - paddingHorizontal * 2;

    // Total five Tabs...
    return width / 4;
  };

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: primaryColor,
          tabBarStyle: {
            backgroundColor: "#FAFAFA",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 0.1,
            elevation: 3,
            height: 70,
            paddingHorizontal: paddingHorizontal,
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
          name="Informações"
          listeners={() => ({
            focus: () => {
              handleTabFocus(0);
            },
          })}
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
          listeners={() => ({
            focus: () => {
              handleTabFocus(1);
            },
          })}
        >
          {(props) => (
            <EventScannerTab
              dataLoading={loading}
              guests={guests}
              updateUncheckin={updateUncheckin}
              updateCheckin={checkin}
              {...props}
            />
          )}
        </Tab.Screen>
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
          initialParams={{ eventId }}
          listeners={() => ({
            focus: () => {
              handleTabFocus(2);
            },
          })}
        >
          {(props) => (
            <EventGuestsTab
              {...props}
              dataLoading={loading}
              getData={getData}
              guests={guests}
              updateUncheckin={updateUncheckin}
              updateCheckin={checkin}
              updateDeleted={updateDeleted}
              addGuest={addGuest}
            />
          )}
        </Tab.Screen>
        <Tab.Screen
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size, focused }) => {
              return focused ? (
                <Ionicons name="book" size={size} color={color} />
              ) : (
                <Ionicons name="book-outline" size={size} color={color} />
              );
            },
          }}
          name="Template"
          initialParams={{ eventId }}
          listeners={() => ({
            focus: () => {
              handleTabFocus(3);
            },
          })}
        >
          {(props) => (
            <EventTemplateTab
              template={info?.eventTemplate}
              dataLoading={loading}
              {...props}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
      <Animated.View
        style={{
          width: getWidth() - paddingHorizontal,
          height: 2,
          borderRadius: 20,
          position: "absolute",
          backgroundColor: primaryColor,
          bottom: 68,
          left: paddingHorizontal + 10,
          transform: [{ translateX: tabOffsetValue }],
        }}
      ></Animated.View>
    </>
  );
}
