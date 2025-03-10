import {
  primaryColor,
  redColor,
  routes,
  screenWidth,
} from "@/constants/Default";
import React, { Fragment, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { EventAPI } from "@/services/EventAPI";
import Loading from "@/components/common/Loading";
import Header from "@/components/common/Header";
import Separator from "@/components/common/Separator";
import CustomText from "@/components/common/CustomText";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faAdd,
  faChevronRight,
  faRefresh,
} from "@fortawesome/free-solid-svg-icons/";
import { format } from "date-fns";
import { Container } from "@/components/common/CustomElements";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import { Swipeable } from "react-native-gesture-handler";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import ConfirmAlert from "@/components/common/ConfirmAlert";
import NoData from "@/components/common/NoData";
import NoFilterData from "@/components/common/NoFilterData";

export default function HomeScreen({ navigation, route }) {
  const [events, setEvents] = useState(null);
  const [filteredEvents, setFilteredEvents] = useState(null);
  const [confirmAlert, setConfirmAlert] = useState({});
  const [selectedSegment, setSelectedSegment] = useState({
    label: "Todos",
    value: 0,
  });
  const [options] = useState([
    { label: "Todos", value: 0 },
    { label: "Criado", value: 1 },
    { label: "Ativo", value: 2 },
    { label: "Finalizado", value: 3 },
  ]);

  const getEvents = async () => {
    setFilteredEvents(null);
    const response = await EventAPI.getAll(true);
    setEvents(response.data);
  };

  useEffect(() => {
    getEvents();
  }, []);

  const addEvent = (event) => {
    setEvents([...events, event]);
  };

  const deleteEvent = async (id) => {
    try {
      if (confirmAlert.loading) return;

      setConfirmAlert((prevState) => ({
        ...prevState,
        loading: true,
      }));
      await EventAPI.delete(id);

      setEvents(events.filter((x) => x.id !== id));
    } finally {
      setConfirmAlert((prevState) => ({
        ...prevState,
        loading: false,
      }));
    }
  };

  useEffect(() => {
    setSelectedSegment({
      label: "Todos",
      value: 0,
    });
  }, [events]);

  useEffect(() => {
    if (events) {
      if (selectedSegment.value == 0) {
        setFilteredEvents([...events]);
      } else {
        const newEvents = events.filter(
          (x) => x.eventStatus == selectedSegment.value
        );
        setFilteredEvents([...newEvents]);
      }
    }
  }, [selectedSegment]);

  const renderEvent = ({ item: event }) => {
    const rightSwipeActions = () => {
      return (
        <TouchableOpacity
          onPress={() =>
            setConfirmAlert({
              open: true,
              title: "Tem certeza disto?",
              message: `Confirmar deleção do evento ${event.name}?`,
              onConfirm: () => deleteEvent(event.id),
            })
          }
          style={{
            backgroundColor: "transparent",
            justifyContent: "center",
            alignItems: "center",
            width: "20%",
          }}
        >
          <View
            style={{
              backgroundColor: redColor,
              ...styles.swipeItem,
            }}
          >
            <FontAwesomeIcon icon={faTrashCan} size={22} color="#FFF" />
          </View>
        </TouchableOpacity>
      );
    };
    return (
      <>
        <Swipeable
          childrenContainerStyle={{ backgroundColor: "#FFF" }}
          renderLeftActions={rightSwipeActions}
        >
          <TouchableOpacity
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
                    uri: event.photoFullUrl,
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
        </Swipeable>
      </>
    );
  };

  return (
    <Fragment>
      <Header
        route={route}
        navigation={navigation}
        rightButtonComponent={
          <FontAwesomeIcon icon={faRefresh} color="#FFF" size={18} />
        }
        rightButtonAction={getEvents}
      />

      <Container style={styles.container}>
        {filteredEvents == null ? (
          <Loading color={primaryColor} size={24} />
        ) : events && events.length > 0 ? (
          <>
            <View
              style={{
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <SegmentedControl
                width={screenWidth - 20}
                borderRadius={10}
                onPress={setSelectedSegment}
                options={options}
                selectedOption={selectedSegment}
                containerBackgroundColor="#F5F5F5"
              />
            </View>

            {filteredEvents && filteredEvents.length > 0 ? (
              <FlatList
                data={filteredEvents}
                initialNumToRender={filteredEvents.length}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderEvent}
                contentContainerStyle={{ paddingBottom: 50 }}
              />
            ) : (
              <NoFilterData />
            )}
          </>
        ) : (
          <NoData />
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
      </Container>
      <ConfirmAlert
        open={confirmAlert.open}
        toggle={() =>
          setConfirmAlert({ ...confirmAlert, open: !confirmAlert.open })
        }
        title={confirmAlert.title}
        message={confirmAlert.message}
        onConfirm={confirmAlert.onConfirm}
        loading={confirmAlert.loading}
      />
    </Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    position: "relative",
  },
  card: {
    backgroundColor: "transparent",
    margin: 10,
  },
  event: {
    padding: 5,
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

  swipeItem: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
  },
});
