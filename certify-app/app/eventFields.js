import FloatingButton from "@/components/common/FloatingButton";
import Loading from "@/components/common/Loading";
import { primaryColor, FieldType, routes } from "@/constants/Default";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import Header from "@/components/common/Header";
import { Container } from "@/components/common/CustomElements";
import { EventAPI } from "@/services/EventAPI";

function EventFieldsTab({ navigation, route, eventId, dataLoading, title }) {
  const [loading, setLoading] = useState(false);
  const [eventFields, setEventFields] = useState();

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

  return (
    <React.Fragment>
      <Header title={title} navigation={navigation} route={route} />
      <Container style={styles.container}>
        {dataLoading ? (
          <Loading color={primaryColor} size={24} />
        ) : (
          <View style={styles.content}></View>
        )}

        <FloatingButton
          icon={faAdd}
          onPress={() =>
            navigation.navigate(routes.newField, {
              eventId: eventId,
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
    alignItems: "center",
    flex: 1,
    gap: 10,
  },
});

export default EventFieldsTab;
