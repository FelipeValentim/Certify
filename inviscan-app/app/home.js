import { primaryColor, routes } from "@/constants/Default";
import React, { Fragment, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { EventAPI } from "@/services/EventAPI";
import Loading from "@/components/Loading";
import Header from "@/components/Header";
import Separator from "@/components/Separator";
import CustomText from "@/components/CustomText";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faAdd, faChevronRight } from "@fortawesome/free-solid-svg-icons/";
import { format } from "date-fns";

export default function HomeScreen({ navigation, route }) {
  const [events, setEvents] = useState();

  useEffect(() => {
    const getEvents = async () => {
      const response = await EventAPI.getAll(true);
      setEvents(response.data);
    };
    getEvents();
  }, []);

  const addEvent = (event) => {
    setEvents([...events, event]);
  };

  const renderEvent = ({ item: event }) => (
    <>
      <TouchableOpacity
        key={event.id}
        onPress={() => navigation.navigate(routes.event, { eventId: event.id })}
      >
        <View style={styles.card}>
          <View style={styles.event}>
            <Image
              style={styles.photo}
              source={{
                uri: event.photo,
              }}
            />
            <View style={styles.info}>
              <CustomText style={styles.name}>{event.name}</CustomText>
              <CustomText style={styles.eventType}>
                {event.eventType.name} - {format(event.date, "dd/MM/yyyy")}
              </CustomText>
            </View>
            <View style={styles.arrow}>
              <FontAwesomeIcon
                icon={faChevronRight}
                color={"#606060"}
                size={15}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <Separator />
    </>
  );

  return (
    <Fragment>
      <Header route={route} navigation={navigation} />

      <View style={styles.container}>
        {!events ? (
          <Loading color={primaryColor} size={24} />
        ) : (
          <FlatList
            data={events}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderEvent}
            contentContainerStyle={{ paddingBottom: 50 }}
          />
        )}
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() =>
            navigation.navigate(routes.newEvent, {
              addEvent: addEvent,
            })
          }
        >
          <FontAwesomeIcon icon={faAdd} color={"#FFF"} size={26} />
        </TouchableOpacity>
        <View></View>
      </View>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    fontFamily: "PoppinsRegular",
    position: "relative",
    flex: 1,
  },
  card: {
    backgroundColor: "transparent",
    margin: 10,
  },
  event: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  eventType: {
    fontSize: 12,
    borderRadius: 10,
    color: "#555",
  },
  photo: {
    width: 50,
    height: 50,
    borderRadius: 15,
  },
  info: {
    flex: 1,
  },
  arrow: {
    width: 15,
  },
  floatingButton: {
    backgroundColor: primaryColor,
    width: 60,
    height: 60,
    borderRadius: 20,
    position: "absolute",
    right: 20,
    bottom: 20,
    justifyContent: "center",
    alignItems: "center",

    // Sombra para iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    // Sombra para Android
    elevation: 5,
  },
});
