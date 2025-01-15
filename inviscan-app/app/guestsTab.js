import Header from "@/components/common/Header";
import Loading from "@/components/common/Loading";
import {
  primaryColor,
  redColor,
  routes,
  screenWidth,
} from "@/constants/Default";
import { GuestAPI } from "@/services/GuestAPI";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Image,
  BackHandler,
} from "react-native";
import ConfirmAlert from "../components/common/ConfirmAlert";
import {
  Container,
  CustomScrollView,
  H1,
  MutedText,
} from "@/components/common/CustomElements";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import { Swipeable, TouchableOpacity } from "react-native-gesture-handler";
import {
  faAdd,
  faCheck,
  faCheckToSlot,
  faChevronRight,
  faClockRotateLeft,
  faRefresh,
  faTrashCan,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import Separator from "@/components/common/Separator";
import FloatingButton from "@/components/common/FloatingButton";
import CustomText from "@/components/common/CustomText";
import { format } from "date-fns";
import CustomSnackBar from "@/components/common/CustomSnackBar";

const SelectionHeader = ({
  selectedItems,
  setSelectedItems,
  checkins,
  uncheckins,
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

  function handleBackButtonClick() {
    if (selectedItems.length > 0) {
      setSelectedItems([]);
    }
    return true;
  }

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        handleBackButtonClick
      );
    };
  }, []);

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
              <FontAwesomeIcon
                icon={faClockRotateLeft}
                color={"#FFF"}
                size={18}
              />
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
              <FontAwesomeIcon icon={faCheckToSlot} color={"#FFF"} size={18} />
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
  dataLoading,
  getData,
}) {
  const [filteredGuests, setFilteredGuests] = useState([]);
  const [snackBar, setSnackBar] = useState({});
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
    { label: "Pendente", value: 1 },
    { label: "Checkin", value: 2 },
  ]);

  const [optionsType] = useState([
    { label: "Todos", value: 0 },
    { label: "Aluno", value: 1 },
    { label: "Professor", value: 2 },
  ]);
  let rowRefs = new Map();
  const onDismissSnackBar = () => setSnackBar({ ...snackBar, visible: false });
  const onOpenSnackBar = (message) =>
    setSnackBar({ ...snackBar, message: message, visible: true });

  useEffect(() => {
    const defaultValues = {
      label: "Todos",
      value: 0,
    };
    setSelectedStatus(defaultValues);
    setSelectedType(defaultValues);
  }, [guests]);

  useEffect(() => {
    let newGuests = guests;
    if (selectedStatus.value == 0 && selectedType.value == 0) {
      setFilteredGuests([...newGuests]);
    } else {
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
        onOpenSnackBar(
          `Checkin dos ${selectedItems.length} convidados realizado com sucesso`
        );
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

  const checkin = async (id, name) => {
    if (!loading) {
      try {
        setLoading(true);
        await GuestAPI.checkin(id);
        updateCheckin([id]);
        onCloseSwipeable(id);
        onOpenSnackBar(`Checkin do convidado ${name} realizado com sucesso`);
      } catch (error) {
        if (error.response) {
          if (error.response.status == httpStatus.conflict) {
            updateCheckin([id]);
          } else {
            console.log(response.data);
          }
        }
      } finally {
        setLoading(false);
      }
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
        onOpenSnackBar(
          `Uncheckin dos ${selectedItems.length} convidados realizado com sucesso`
        );
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
    if (!loading) {
      try {
        setLoading(true);
        await GuestAPI.deleteGuests(ids);
        setSelectedItems([]);
        updateDeleted(ids);
        onOpenSnackBar(
          `${selectedItems.length} convidados deletados com sucesso`
        );
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
    }
  };

  const deleteGuest = async (id, name) => {
    if (!loading) {
      try {
        setLoading(true);
        await GuestAPI.deleteGuest(id);
        updateDeleted([id]);
        onOpenSnackBar(`${name} deletado com sucesso`);
      } catch (error) {
        if (error.response) {
          if (error.response.status == httpStatus.conflict) {
            updateDeleted([id]);
          } else {
            console.log(response.data);
          }
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const uncheckin = async (id, name) => {
    if (!loading) {
      try {
        setLoading(true);
        await GuestAPI.uncheckin(id);
        updateUncheckin([id]);
        onCloseSwipeable(id);
        onOpenSnackBar(`Uncheckin do convidado ${name} realizado com sucesso`);
      } catch (error) {
        if (error.response) {
          if (error.response.status == httpStatus.conflict) {
            updateUncheckin([id]);
          } else {
            console.log(response.data);
          }
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const onCloseOtherSwipeables = (id) => {
    [...rowRefs.entries()].forEach(([key, ref]) => {
      if (key !== id && ref) ref.close();
    });
  };

  const onCloseSwipeable = (id) => {
    const ref = rowRefs.get(id); // Obtém a referência associada ao id
    if (ref) {
      ref.close(); // Fecha o item
    }
  };

  const RenderGuest = ({ item }) => {
    const leftSwipeActions = () => {
      return (
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            padding: 15,
          }}
        >
          <TouchableOpacity
            onPress={() =>
              setConfirmAlert({
                open: true,
                title: "Tem certeza disto?",
                message: `Confirmar deleção do convidado ${item.name}?`,
                onConfirm: () => deleteGuest(item.id, item.name),
              })
            }
            style={{ ...styles.swipeItem, backgroundColor: redColor }}
          >
            <FontAwesomeIcon icon={faTrashCan} size={22} color="#FFF" />
          </TouchableOpacity>
          {item.checkinDate ? (
            <TouchableOpacity
              onPress={() =>
                setConfirmAlert({
                  open: true,
                  title: "Tem certeza disto?",
                  message: `Confirmar uncheckin do convidado ${item.name}?`,
                  onConfirm: () => uncheckin(item.id, item.name),
                })
              }
              style={{ ...styles.swipeItem, backgroundColor: "#FFC145" }}
            >
              <FontAwesomeIcon
                icon={faClockRotateLeft}
                size={22}
                color="#FFF"
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() =>
                setConfirmAlert({
                  open: true,
                  title: "Tem certeza disto?",
                  message: `Confirmar checkin do convidado ${item.name}?`,
                  onConfirm: () => checkin(item.id, item.name),
                })
              }
              style={{ ...styles.swipeItem, backgroundColor: "#36AE7C" }}
            >
              <FontAwesomeIcon icon={faCheckToSlot} size={22} color="#FFF" />
            </TouchableOpacity>
          )}
        </View>
      );
    };

    return (
      <Swipeable
        ref={(ref) => {
          if (ref && !rowRefs.get(item.id)) {
            rowRefs.set(item.id, ref);
          }
        }}
        onSwipeableWillOpen={() => onCloseOtherSwipeables(item.id)}
        renderLeftActions={leftSwipeActions}
        childrenContainerStyle={{ backgroundColor: "#FFF" }}
      >
        <TouchableOpacity
          style={[
            selectedItems.some((x) => x.id == item.id)
              ? styles.selectedItem
              : null,
          ]}
          key={item.id}
          onLongPress={() => selectItem(item)}
          delayLongPress={400}
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
          <View style={styles.card}>
            <View style={styles.guest}>
              {selectedItems.some((x) => x.id == item.id) ? (
                <View style={styles.photo}>
                  <FontAwesomeIcon icon={faCheck} size={30} color="#aaa" />
                </View>
              ) : (
                <Image
                  style={styles.photo}
                  source={{
                    uri: item.photoFullUrl,
                  }}
                />
              )}

              <View style={styles.info}>
                <CustomText style={styles.name}>{item.name}</CustomText>
                <CustomText style={styles.guestType}>
                  {item.guestType.name} -{" "}
                  {item.checkinDate
                    ? format(item.checkinDate, "dd/MM/yyyy")
                    : "Pendente"}
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
        rightButtonComponent={
          <FontAwesomeIcon icon={faRefresh} color="#FFF" size={18} />
        }
        rightButtonAction={getData}
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
        {dataLoading ? (
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
                width={screenWidth - 100}
                borderRadius={10}
                onPress={setSelectedType}
                options={optionsType}
                selectedOption={selectedType}
                containerBackgroundColor="#F5F5F5"
                height={38}
              />
            </View>
            <FlatList
              initialNumToRender={filteredGuests.length}
              maxToRenderPerBatch={filteredGuests.length}
              removeClippedSubviews={false}
              data={filteredGuests}
              keyExtractor={(item) => item.id.toString()} // Corrigir keyExtractor para evitar warnings
              renderItem={RenderGuest}
              contentContainerStyle={{ paddingBottom: 50 }}
            />
          </>
        )}

        <FloatingButton
          onPress={() =>
            navigation.navigate(routes.newGuest, {
              addGuest: addGuest,
              eventId: route.params.eventId,
            })
          }
          icon={faAdd}
        />
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
      <CustomSnackBar
        visible={snackBar.visible}
        duration={5000}
        onDismiss={onDismissSnackBar}
        type="success"
        message={snackBar.message}
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
