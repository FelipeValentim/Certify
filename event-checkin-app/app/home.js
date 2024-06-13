import {
  primaryColor,
  routes,
  screenHeight,
  screenWidth,
} from "@/constants/Default";
import React, { Fragment, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
import { EventAPI } from "@/services/EventAPI";
import Loading from "@/components/Loading";
import Header from "@/components/Header";

export default function HomeScreen({ navigation, route }) {
  const [events, setEvents] = useState();

  useEffect(() => {
    const getEvents = async () => {
      const response = await EventAPI.getAll("/event/getevents");
      setEvents(response.data);
    };
    getEvents();
  }, []);

  return (
    <Fragment>
      <Header route={route} navigation={navigation} />

      <View style={styles.container}>
        {!events ? (
          <Loading color={primaryColor} size={24} />
        ) : (
          <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
            {events.map((event) => (
              <Pressable
                key={event.id}
                onPress={() =>
                  navigation.navigate(routes.event, { eventId: event.id })
                }
              >
                <View style={styles.card}>
                  <View style={styles.event}>
                    <Image
                      style={styles.photo}
                      source={{
                        uri: event.photo,
                      }}
                    />
                    <Text style={styles.name}>{event.name}</Text>
                    <Text style={styles.date}>{event.dateEvent}</Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </View>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F0FF",
    height: screenHeight,
  },
  card: {
    backgroundColor: "#FFF",
    margin: 10,
    borderRadius: 20,
  },
  event: {
    padding: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  name: {
    fontSize: 16,
    fontFamily: "PoppinsRegular",
    fontWeight: "bold",
    flex: 1,
  },
  photo: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  date: {
    fontSize: 12,
    fontFamily: "PoppinsRegular",
    backgroundColor: primaryColor,
    padding: 5,
    borderRadius: 10,
    color: "#FFF",
  },
});
