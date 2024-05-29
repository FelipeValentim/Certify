import {
  primaryColor,
  routes,
  screenHeight,
  screenWidth,
} from "@/constants/Default";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
import api from "@/services/configs/AxiosConfig";
import { useSelector } from "react-redux";

export default function HomeScreen({ navigation }) {
  const [events, setEvents] = useState();
  const token = useSelector((state) => state.token);

  useEffect(() => {
    const getEvents = async () => {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      const response = await api.get("/event/getevents");
      console.log(response);
      setEvents(response.data);
    };
    getEvents();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
        {events &&
          events.map((event) => (
            <Pressable
              key={event.id}
              onPress={() => navigation.navigate(routes.event)}
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
    </View>
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
