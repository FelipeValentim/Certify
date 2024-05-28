import { primaryColor, screenHeight, screenWidth } from "@/constants/Default";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import api from "@/services/configs/AxiosConfig";
import { useSelector } from "react-redux";

export default function HomeScreen() {
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
      {events &&
        events.map((event) => (
          <View key={event.id} style={styles.event}>
            <Image
              style={styles.photo}
              source={{
                uri: event.photo,
              }}
            />
            <Text style={styles.name}>{event.name}</Text>
          </View>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    height: screenHeight,
  },
  event: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: primaryColor,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  name: {
    fontSize: 16,
    fontFamily: "PoppinsRegular",
    fontWeight: "bold",
  },
  photo: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});
