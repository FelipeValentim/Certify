import { primaryColor, screenHeight, screenWidth } from "@/constants/Default";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import React, { useEffect, useRef, useState } from "react";
import EventInfoTab from "./eventTab";
import EventGuestsTab from "./guestsTab";
import EventTemplateTab from "./templateTab";
import EventScannerTab from "./eventScanner";
import { Ionicons } from "@expo/vector-icons";
import { EventAPI } from "@/services/EventAPI";
import { getCurrentDateFormatted } from "@/helper/date";
import { View, Animated } from "react-native";

const Tab = createBottomTabNavigator();

export default function EventScreen({ route, navigation }) {
  const { eventId } = route.params;
  const [info, setInfo] = useState();
  const [paddingHorizontal] = useState(20);
  const [guests, setGuests] = useState();
  const tabOffsetValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const getData = async () => {
      const { data } = await EventAPI.get(eventId);
      setInfo(data);
      setGuests(data.guests);
    };
    getData();
  }, []);

  const checkin = async (ids) => {
    const newGuests = guests.map((guest) =>
      ids.includes(guest.id)
        ? { ...guest, checkin: getCurrentDateFormatted() }
        : guest
    );
    setGuests(newGuests);
  };

  const updateUncheckin = async (ids) => {
    const newGuests = guests.map((guest) =>
      ids.includes(guest.id) ? { ...guest, checkin: null } : guest
    );

    setGuests(newGuests);
  };

  const updateDeleted = async (ids) => {
    const newGuests = guests.filter((guest) => !ids.includes(guest.id));
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
            // Onpress Update....
            tabPress: (e) => {
              Animated.spring(tabOffsetValue, {
                toValue: 0,
                useNativeDriver: true,
              }).start();
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
          listeners={({ navigation, route }) => ({
            // Onpress Update....
            tabPress: () => {
              Animated.spring(tabOffsetValue, {
                toValue: getWidth(),
                useNativeDriver: true,
              }).start();
            },
          })}
        >
          {(props) => (
            <EventScannerTab
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
          listeners={({ navigation, route }) => ({
            // Onpress Update....
            tabPress: (e) => {
              Animated.spring(tabOffsetValue, {
                toValue: getWidth() * 2,
                useNativeDriver: true,
              }).start();
            },
          })}
        >
          {(props) => (
            <EventGuestsTab
              {...props}
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
            // Onpress Update....
            tabPress: (e) => {
              Animated.spring(tabOffsetValue, {
                toValue: getWidth() * 3,
                useNativeDriver: true,
              }).start();
            },
          })}
        >
          {(props) => <EventTemplateTab {...props} />}
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
