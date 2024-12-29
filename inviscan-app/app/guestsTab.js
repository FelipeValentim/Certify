import Header from "@/components/Header";
import Loading from "@/components/Loading";
import {
  backgroundColor,
  primaryColor,
  redColor,
  routes,
  screenWidth,
} from "@/constants/Default";
import { GuestAPI } from "@/services/GuestAPI";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Text, Pressable } from "react-native";
import ConfirmAlert from "../components/ConfirmAlert";
import { Container, H1, MutedText } from "@/components/CustomElements";
import { SegmentedControl } from "@/components/SegmentedControl";
import { Swipeable, TouchableOpacity } from "react-native-gesture-handler";
import {
  faCheck,
  faChevronRight,
  faRotateLeft,
  faTrashCan,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import Separator from "@/components/Separator";
import CustomText from "@/components/CustomText";
import { format } from "date-fns";

const SelectionHeader = ({
  selectedItems,
  setSelectedItems,
  checkins,
  uncheckins,
  loading,
  deleteGuests,
  setConfirmAlert,
}) => {
  const styles = StyleSheet.create({
    container: {
      backgroundColor: primaryColor,
      height: 60,
    },
    innerContainer: {
      flex: 1,
      flexDirection: "row",
      marginHorizontal: 20,
    },
    options: {
      display: "flex",
      flexDirection: "row",
      gap: 15,
      flex: 1,
      justifyContent: "flex-end",
    },
    option: {
      flex: 1,
      padding: 10,
      justifyContent: "center",
    },
    countContainer: {
      justifyContent: "center",
    },
    count: {
      color: "#FFF",
      fontSize: 22,
      lineHeight: 26,
      letterSpacing: 10,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View
          style={{
            flexDirection: "row",
            gap: 20,
          }}
        >
          <TouchableOpacity
            style={styles.option}
            onPress={() => setSelectedItems([])}
          >
            <FontAwesomeIcon icon={faX} color={"#FFF"} size={18} />
          </TouchableOpacity>
          <View style={styles.countContainer}>
            <Text style={styles.count}>{selectedItems.length}</Text>
          </View>
        </View>

        <View style={styles.options}>
          {/* {loading && <BounceLoading color={"#FFF"} size={12} />} */}

          <TouchableOpacity
            onPress={() =>
              setConfirmAlert({
                open: true,
                title: "Tem certeza disto?",
                message: `Confirmar deleção de ${selectedItems.length} convidados?`,
                onConfirm: () => deleteGuests(),
              })
            }
            style={styles.option}
          >
            <FontAwesomeIcon icon={faTrashCan} color={"#FFF"} size={18} />
          </TouchableOpacity>

          {selectedItems.filter((x) => x.checkinDate).length > 0 && (
            <TouchableOpacity
              onPress={() =>
                setConfirmAlert({
                  open: true,
                  title: "Tem certeza disto?",
                  message: `Confirmar uncheckin de ${selectedItems.length} convidados?`,
                  onConfirm: () => uncheckins(),
                })
              }
              style={styles.option}
            >
              <FontAwesomeIcon icon={faRotateLeft} color={"#FFF"} size={18} />
            </TouchableOpacity>
          )}
          {selectedItems.filter((x) => !x.checkinDate).length > 0 && (
            <TouchableOpacity
              onPress={() =>
                setConfirmAlert({
                  open: true,
                  title: "Tem certeza disto?",
                  message: `Confirmar checkin de ${selectedItems.length} convidados?`,
                  onConfirm: () => checkins(),
                })
              }
              style={styles.option}
            >
              <FontAwesomeIcon icon={faCheck} color={"#FFF"} size={18} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

function GuestsTab({
  updateUncheckin,
  updateCheckin,
  updateDeleted,
  guests,
  addGuest,
  navigation,
  route,
}) {
  const [filteredGuests, setFilteredGuests] = useState();
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [confirmAlert, setConfirmAlert] = useState({});
  const [selectedStatus, setSelectedStatus] = useState({
    label: "Todos",
    value: 0,
  });
  const [selectedType, setSelectedType] = useState({
    label: "Todos",
    value: 0,
  });
  const [optionsStatus] = useState([
    { label: "Todos", value: 0 },
    { label: "Criado", value: 1 },
    { label: "Checkin", value: 2 },
    { label: "Ausente", value: 3 },
  ]);

  const [optionsType] = useState([
    { label: "Todos", value: 0 },
    { label: "Aluno", value: 1 },
    { label: "Professor", value: 2 },
  ]);

  useEffect(() => {
    const defaultValues = {
      label: "Todos",
      value: 0,
    };
    setSelectedStatus(defaultValues);
    setSelectedType(defaultValues);
  }, [guests]);

  useEffect(() => {
    if (selectedStatus.value == 0 && selectedType.value == 0) {
      setFilteredGuests([...guests]);
    } else {
      let newGuests = guests;
      if (selectedStatus.value != 0) {
        newGuests = newGuests.filter(
          (x) => x.guestStatus == selectedStatus.value
        );
      }
      if (selectedType.value != 0) {
        newGuests = newGuests.filter(
          (x) => x.guestType.name == selectedType.label
        );
      }

      setFilteredGuests([...newGuests]);
    }
  }, [selectedStatus, selectedType]);

  const selectItem = (item) => {
    if (selectedItems.some((x) => x.id == item.id)) {
      setSelectedItems(selectedItems.filter((x) => x.id !== item.id));
    } else {
      setSelectedItems([
        ...selectedItems,
        { id: item.id, checkinDate: item.checkinDate },
      ]);
    }
  };

  const checkins = async () => {
    const ids = selectedItems.map((x) => x.id);

    try {
      if (!loading) {
        setLoading(true);
        await GuestAPI.checkins(ids);
        setSelectedItems([]);
        updateCheckin(ids);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status == httpStatus.conflict) {
          updateCheckin(ids);
        } else {
          console.log(response.data);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const uncheckins = async () => {
    const ids = selectedItems.map((x) => x.id);

    try {
      if (!loading) {
        setLoading(true);
        await GuestAPI.uncheckins(ids);
        setSelectedItems([]);
        updateUncheckin(ids);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status == httpStatus.conflict) {
          updateUncheckin(ids);
        } else {
          console.log(response.data);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteGuests = async () => {
    const ids = selectedItems.map((x) => x.id);
    try {
      if (!loading) {
        setLoading(true);
        await GuestAPI.deleteGuests(ids);
        setSelectedItems([]);
        updateDeleted(ids);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status == httpStatus.conflict) {
          updateDeleted(ids);
        } else {
          console.log(response.data);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const uncheckin = async (id) => {
    try {
      if (!loading) {
        setLoading(true);
        await GuestAPI.uncheckin(id);
        updateUncheckin(id);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status == httpStatus.conflict) {
          updateUncheckin(id);
        } else {
          console.log(response.data);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const renderGuest = ({ item: guest }) => {
    const leftSwipeActions = () => {
      return (
        <View style={{ flexDirection: "row", gap: 10, padding: 15 }}>
          <TouchableOpacity
            onPress={() =>
              setConfirmAlert({
                open: true,
                title: "Tem certeza disto?",
                message: `Confirmar deleção do convidado ${guest.name}?`,
                onConfirm: () => deleteGuests([guest.id]),
              })
            }
            style={{ ...styles.swipeItem, backgroundColor: redColor }}
          >
            <FontAwesomeIcon icon={faTrashCan} size={22} color="#FFF" />
          </TouchableOpacity>
          {guest.checkinDate ? (
            <TouchableOpacity
              onPress={() =>
                setConfirmAlert({
                  open: true,
                  title: "Tem certeza disto?",
                  message: `Confirmar uncheckin do convidado ${guest.name}?`,
                  onConfirm: () => deleteEvent(guest.id),
                })
              }
              style={{ ...styles.swipeItem, backgroundColor: "#FFC145" }}
            >
              <FontAwesomeIcon icon={faRotateLeft} size={22} color="#FFF" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() =>
                setConfirmAlert({
                  open: true,
                  title: "Tem certeza disto?",
                  message: `Confirmar checkin do convidado ${guest.name}?`,
                  onConfirm: () => deleteEvent(guest.id),
                })
              }
              style={{ ...styles.swipeItem, backgroundColor: "#36AE7C" }}
            >
              <FontAwesomeIcon icon={faCheck} size={22} color="#FFF" />
            </TouchableOpacity>
          )}
        </View>
      );
    };

    return (
      <Swipeable
        renderLeftActions={leftSwipeActions}
        childrenContainerStyle={{ backgroundColor: "#FFF" }}
      >
        <TouchableOpacity
          style={[
            selectedItems.some((x) => x.id == guest.id)
              ? styles.selectedItem
              : null,
          ]}
          key={guest.id}
          onLongPress={() => selectItem(guest)}
          onPress={() => {
            if (selectedItems.length > 0) {
              selectItem(guest);
            } else {
              navigation.navigate(routes.guest, {
                guest: guest,
                updateCheckin,
                updateUncheckin,
              });
            }
          }}
          // onPress={() =>
          //   navigation.navigate(routes.event, { eventId: event.id })
          // }
        >
          <View style={styles.card}>
            <View style={styles.guest}>
              {selectedItems.some((x) => x.id == guest.id) ? (
                <View style={styles.photo}>
                  <FontAwesomeIcon icon={faCheck} size={30} color="#aaa" />
                </View>
              ) : (
                <MutedText style={styles.photo}>
                  {guest.name[0].toUpperCase()}
                </MutedText>
              )}

              <View style={styles.info}>
                <CustomText style={styles.name}>{guest.name}</CustomText>
                <CustomText style={styles.guestType}>
                  {guest.guestType.name} -{" "}
                  {guest.guestStatus == 1 && "Aguardando"}
                  {guest.guestStatus == 2 &&
                    format(guest.checkinDate, "dd/MM/yyyy")}
                  {guest.guestStatus == 3 && "Ausente"}
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
    );
  };

  return (
    <React.Fragment>
      <Header
        navigation={navigation}
        route={route}
        component={
          selectedItems.length > 0 && (
            <SelectionHeader
              checkins={checkins}
              uncheckins={uncheckins}
              deleteGuests={deleteGuests}
              loading={loading}
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
              setConfirmAlert={setConfirmAlert}
            />
          )
        }
      />
      <Container style={styles.container}>
        {!guests ? (
          <Loading color={primaryColor} size={24} />
        ) : (
          <>
            <View style={{ alignItems: "center", marginVertical: 10, gap: 10 }}>
              <SegmentedControl
                width={screenWidth - 20}
                borderRadius={10}
                onPress={setSelectedStatus}
                options={optionsStatus}
                selectedOption={selectedStatus}
                containerBackgroundColor="#F5F5F5"
              />
              <SegmentedControl
                width={screenWidth - 20}
                borderRadius={10}
                onPress={setSelectedType}
                options={optionsType}
                selectedOption={selectedType}
                containerBackgroundColor="#F5F5F5"
                height={38}
              />
            </View>
            <FlatList
              data={filteredGuests}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderGuest}
              contentContainerStyle={{ paddingBottom: 50 }}
            />
          </>
        )}
      </Container>

      <ConfirmAlert
        open={confirmAlert.open}
        toggle={() =>
          setConfirmAlert({ ...confirmAlert, open: !confirmAlert.open })
        }
        title={confirmAlert.title}
        message={confirmAlert.message}
        onConfirm={confirmAlert.onConfirm}
        loading={loading}
      />
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    position: "relative",
  },
  card: {
    backgroundColor: "transparent",
    margin: 15,
  },
  guest: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  guestType: {
    fontSize: 12,
    borderRadius: 10,
    color: "#555",
  },
  photo: {
    width: 50,
    height: 50,
    borderRadius: 15,
    textAlign: "center",
    verticalAlign: "middle",
    fontSize: 22,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  info: {
    flex: 1,
  },
  arrow: {
    width: 15,
  },
  selectedItem: {
    backgroundColor: "#f5f5f5",
  },
  swipeItem: {
    flex: 1,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
  },
});

export default GuestsTab;
