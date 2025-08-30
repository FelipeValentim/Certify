import FloatingButton from "@/components/common/FloatingButton";
import Loading from "@/components/common/Loading";
import {
  primaryColor,
  FieldType,
  routes,
  TranslateFieldType,
  redColor,
  swipeIconSize,
} from "@/constants/Default";
import {
  faAdd,
  faCircleExclamation,
  faExclamationCircle,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import Header from "@/components/common/Header";
import { Container, MutedText } from "@/components/common/CustomElements";
import { EventAPI } from "@/services/EventAPI";
import { EventFieldAPI } from "@/services/EventFieldAPI";

import DraggableFlatList from "react-native-draggable-flatlist";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faGripLines } from "@fortawesome/free-solid-svg-icons";
import NoData from "@/components/common/NoData";
import Separator from "@/components/common/Separator";
import { Swipeable } from "react-native-gesture-handler";
import ConfirmAlert from "@/components/common/ConfirmAlert";

function EventFieldsTab({ navigation, route, eventId, dataLoading, title }) {
  const [loading, setLoading] = useState(false);
  const [eventFields, setEventFields] = useState(null);
  const [confirmAlert, setConfirmAlert] = useState({});

  const getData = async () => {
    setLoading(true);
    try {
      const { data } = await EventAPI.getFields(eventId);
      setEventFields([...data]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleDragEnd = async (data) => {
    setEventFields(data);

    await EventAPI.reorderFields(
      data.map((x) => x.id),
      eventId,
      true
    );
  };

  const addEventField = (data) => {
    setEventFields([...eventFields, data]);
  };

  const deleteEventField = async (id) => {
    try {
      if (confirmAlert.loading) return;

      setConfirmAlert((prevState) => ({
        ...prevState,
        loading: true,
      }));
      await EventFieldAPI.delete(id);

      setEventFields(eventFields.filter((x) => x.id !== id));
    } finally {
      setConfirmAlert((prevState) => ({
        ...prevState,
        loading: false,
      }));
    }
  };

  const renderItem = ({ item, drag }) => {
    const rightSwipeActions = () => {
      return (
        <TouchableOpacity
          onPress={() =>
            setConfirmAlert({
              open: true,
              title: "Tem certeza disto?",
              message: `Confirmar deleção do campo '${item.name}'?`,
              onConfirm: () => deleteEventField(item.id),
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
            <FontAwesomeIcon
              icon={faTrashCan}
              size={swipeIconSize}
              color="#FFF"
            />
          </View>
        </TouchableOpacity>
      );
    };

    return (
      <Swipeable
        childrenContainerStyle={{ backgroundColor: "#FFF" }}
        renderLeftActions={rightSwipeActions}
      >
        <View style={[styles.item]}>
          <View style={styles.itemText}>
            <Text
              style={styles.itemName}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.name}
            </Text>
            <MutedText style={styles.itemType}>
              ({TranslateFieldType(item.type)})
            </MutedText>
            {item.isRequired && (
              <View style={styles.requiredContainer}>
                <FontAwesomeIcon
                  icon={faCircleExclamation}
                  size={10}
                  color="#f39c12"
                />
                <Text style={styles.requiredLabel}>Obrigatório</Text>
              </View>
            )}
          </View>

          <TouchableOpacity onPressIn={drag} style={styles.dragHandle}>
            <FontAwesomeIcon icon={faGripLines} size={20} color="#888" />
          </TouchableOpacity>
        </View>
        <Separator />
      </Swipeable>
    );
  };

  return (
    <React.Fragment>
      <Header title={title} navigation={navigation} route={route} />
      <Container style={styles.container}>
        {dataLoading || eventFields == null ? (
          <Loading color={primaryColor} size={24} />
        ) : (
          <>
            {eventFields.length > 0 ? (
              <View style={styles.content}>
                <DraggableFlatList
                  data={eventFields}
                  onDragEnd={({ data }) => handleDragEnd(data)}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={renderItem}
                  contentContainerStyle={styles.listContent}
                />
              </View>
            ) : (
              <NoData />
            )}
          </>
        )}

        <FloatingButton
          icon={faAdd}
          onPress={() =>
            navigation.navigate(routes.newField, {
              eventId: eventId,
              addEventField: addEventField,
            })
          }
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
        loading={confirmAlert.loading}
      />
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    position: "relative",
  },
  content: {
    flex: 1,
    gap: 10,
    // padding: 10,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
    margin: 10,
    backgroundColor: "#FFF",
  },
  itemName: {
    fontSize: 13,
    fontWeight: "400",
    flexShrink: 1,
    maxWidth: "70%",
  },
  itemText: {
    flexDirection: "row",
    flex: 1,
    gap: 10,
    alignItems: "center",
  },
  itemType: {
    fontSize: 12,
  },
  dragHandle: {
    padding: 8,
  },
  requiredContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  requiredLabel: {
    fontSize: 10,
    fontWeight: "500", // Peso de fonte mais suave
    color: "#f39c12", // Cor de laranja suave
    marginLeft: 5,
  },
  swipeItem: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
  },
});

export default EventFieldsTab;
