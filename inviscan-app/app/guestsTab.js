import BounceLoading from "@/components/BounceLoading";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import {
  backgroundColor,
  primaryColor,
  redColor,
  routes,
} from "@/constants/Default";
import { GuestAPI } from "@/services/GuestAPI";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import ConfirmAlert from "../components/ConfirmAlert";
import NewGuestButton from "../components/NewGuestButton";

const SelectionHeader = ({
  selectedItems,
  setSelectedItems,
  checkins,
  uncheckins,
  loading,
  setConfirmAlert,
}) => {
  const styles = StyleSheet.create({
    container: {
      backgroundColor: primaryColor,
      height: 60,
    },
    innerContainer: {
      flex: 1,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
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
      padding: 15,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Ionicons
          onPress={() => setSelectedItems([])}
          style={styles.option}
          name="close"
          color={"#FFF"}
          size={30}
        />

        <View style={styles.options}>
          {/* {loading && <BounceLoading color={"#FFF"} size={12} />} */}

          {selectedItems.filter((x) => x.checkin).length > 0 && (
            <Ionicons
              onPress={() =>
                setConfirmAlert({
                  open: true,
                  title: "Tem certeza?",
                  message: `Confirmar uncheckin de ${selectedItems.length} convidados?`,
                  onConfirm: () => uncheckins(),
                })
              }
              style={styles.option}
              name="arrow-undo"
              color={"#FFF"}
              size={30}
            />
          )}
          {selectedItems.filter((x) => !x.checkin).length > 0 && (
            <Ionicons
              onPress={() =>
                setConfirmAlert({
                  open: true,
                  title: "Tem certeza?",
                  message: `Confirmar checkin de ${selectedItems.length} convidados?`,
                  onConfirm: () => checkins(),
                })
              }
              style={styles.option}
              name="checkmark-done"
              color={"#FFF"}
              size={30}
            />
          )}
        </View>
      </View>
    </View>
  );
};

function GuestsTab({
  updateUncheckin,
  updateCheckin,
  guests,
  addGuest,
  navigation,
  route,
}) {
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [confirmAlert, setConfirmAlert] = useState({});

  const selectItem = (item) => {
    if (selectedItems.some((x) => x.id == item.id)) {
      setSelectedItems(selectedItems.filter((x) => x.id !== item.id));
    } else {
      setSelectedItems([
        ...selectedItems,
        { id: item.id, checkin: item.checkin },
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
              loading={loading}
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
              setConfirmAlert={setConfirmAlert}
            />
          )
        }
      />
      {!guests ? (
        <Loading color={primaryColor} size={24} />
      ) : (
        <View style={styles.container}>
          <NewGuestButton
            onPress={() =>
              navigation.navigate(routes.newGuest, {
                eventId: route.params.eventId,
                addGuest: addGuest,
              })
            }
          />

          <SwipeListView
            contentContainerStyle={{ paddingBottom: 150 }}
            data={guests}
            renderItem={({ item }, rowMap) => (
              <Pressable
                key={item.id}
                onLongPress={() => selectItem(item)}
                onPress={() => {
                  if (selectedItems.length > 0) {
                    selectItem(item);
                  } else {
                    navigation.navigate(routes.guest, {
                      guest: item,
                      updateCheckin,
                      updateUncheckin,
                    });
                  }
                }}
              >
                <View
                  style={[
                    styles.card,
                    selectedItems.some((x) => x.id == item.id)
                      ? styles.selectedItem
                      : null,
                  ]}
                >
                  <View style={styles.guest}>
                    <Image
                      style={styles.photo}
                      source={{
                        uri: item.photo,
                      }}
                    />
                    <Text style={styles.name}>{item.name}</Text>
                    {item.checkin ? (
                      <Text style={styles.checkin}>checkin</Text>
                    ) : (
                      <Text style={styles.notCheckin}>checkin</Text>
                    )}
                  </View>
                </View>
              </Pressable>
            )}
            renderHiddenItem={({ item }, rowMap) =>
              item.checkin &&
              selectedItems.length === 0 && (
                <Pressable
                  onPress={() =>
                    setConfirmAlert({
                      open: true,
                      title: "Tem certeza?",
                      message: `Confirmar uncheckin de ${item.name}?`,
                      onConfirm: () => uncheckin(item.id),
                    })
                  }
                  style={styles.swipeHiddenContainer}
                >
                  <View style={styles.swipeHiddenItem}>
                    <Ionicons name="arrow-undo" size={30} color={redColor} />
                    <Text>Uncheckin</Text>
                  </View>
                </Pressable>
              )
            }
            leftOpenValue={100}
          />
        </View>
      )}
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
  container: { backgroundColor: backgroundColor },
  card: {
    backgroundColor: "#FFF",
    margin: 10,
    borderRadius: 20,
    position: "relative",
  },
  selectedItem: {
    backgroundColor: "#C3B1E1",
  },
  guest: {
    padding: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  swipeHiddenContainer: {
    margin: 10,
    borderRadius: 20,
    // backgroundColor: "red",
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  swipeHiddenItem: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 10,
    display: "flex",
    alignItems: "center",
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
  checkin: {
    fontSize: 12,
    fontFamily: "PoppinsRegular",
    backgroundColor: primaryColor,
    padding: 5,
    borderRadius: 10,
    color: "#FFF",
  },
  notCheckin: {
    fontSize: 12,
    fontFamily: "PoppinsRegular",
    backgroundColor: "#ccc",
    padding: 5,
    borderRadius: 10,
    color: "#FFF",
  },
});

export default GuestsTab;
