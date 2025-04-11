import FloatingButton from "@/components/common/FloatingButton";
import Loading from "@/components/common/Loading";
import {
  primaryColor,
  FieldType,
  routes,
  TranslateFieldType,
} from "@/constants/Default";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import Header from "@/components/common/Header";
import { Container, MutedText } from "@/components/common/CustomElements";
import { EventAPI } from "@/services/EventAPI";
import DraggableFlatList from "react-native-draggable-flatlist";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faGripLines } from "@fortawesome/free-solid-svg-icons";
function EventFieldsTab({ navigation, route, eventId, dataLoading, title }) {
  const [loading, setLoading] = useState(false);
  const [eventFields, setEventFields] = useState(null);

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

  const renderItem = ({ item, drag, isActive }) => (
    <View
      style={[
        styles.item,
        { backgroundColor: isActive ? "#f5f5f5" : "#ffffff" },
      ]}
    >
      <View style={styles.itemText}>
        <Text style={styles.itemName}>{item.name}</Text>
        <MutedText style={styles.itemType}>
          ({TranslateFieldType(item.type)})
        </MutedText>
      </View>

      <TouchableOpacity onPressIn={drag} style={styles.dragHandle}>
        <FontAwesomeIcon icon={faGripLines} size={20} color="#888" />
      </TouchableOpacity>
    </View>
  );

  return (
    <React.Fragment>
      <Header title={title} navigation={navigation} route={route} />
      <Container style={styles.container}>
        {dataLoading || eventFields == null ? (
          <Loading color={primaryColor} size={24} />
        ) : (
          <View style={styles.content}>
            <DraggableFlatList
              data={eventFields}
              onDragEnd={({ data }) => handleDragEnd(data)}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
              contentContainerStyle={styles.listContent}
            />
          </View>
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
    padding: 16,
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
});

export default EventFieldsTab;
