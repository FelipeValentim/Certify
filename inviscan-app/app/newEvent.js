import ButtonLoading from "@/components/ButtonLoading";

import React, { Fragment, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import Header from "@/components/Header";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { GuestAPI } from "@/services/GuestAPI";
import {
  InputNumber,
  Input,
  InputDate,
  InputTime,
  SelectPicker,
} from "@/components/CustomInput";
import { Container } from "@/components/CustomElements";
import { EventTypeAPI } from "@/services/EventTypeAPI";
import Loading from "@/components/Loading";
import { primaryColor } from "@/constants/Default";
import { Picker } from "@react-native-picker/picker";
import { toast } from "@/redux/snackBar";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faImages } from "@fortawesome/free-regular-svg-icons";

function NewEvent({ route, navigation }) {
  const dispatch = useDispatch();
  const [event, setEvent] = useState({
    date: null,
    startTime: null,
    endTime: null,
    eventTypeId: null,
  });
  const [eventTypes, setEventTypes] = useState();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = React.useState({
    name: undefined,
  });

  useEffect(() => {
    const getEventTypes = async () => {
      const { data } = await EventTypeAPI.getAll();
      setEventTypes(
        data.map((item) => ({
          value: item.id,
          label: item.name,
        }))
      );
    };
    getEventTypes();
  }, []);

  const save = async () => {
    if (!loading) {
      if (
        !event.name ||
        !event.pax ||
        !event.date ||
        !event.startTime ||
        !event.endTime ||
        !event.eventTypeId
      ) {
        const newErrors = {
          name: !event.name ? "Nome é obrigatório" : undefined,
          pax: !event.pax ? "Convidados é obrigatório" : undefined,
          date: !event.date ? "Data é obrigatório" : undefined,
          startTime: !event.startTime
            ? "Horário final é obrigatório"
            : undefined,
          endTime: !event.endTime ? "Horário inicial é obrigatório" : undefined,
          eventTypeId: !event.eventTypeId
            ? "Tipo de evento é obrigatório"
            : undefined,
        };
        setErrors(newErrors);
        dispatch(toast(Object.values(newErrors).find((error) => error)));
      } else {
        try {
          setLoading(true);
          navigation.goBack();
        } catch (error) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            invalidCredentials: error.response?.data,
          }));
        } finally {
          setLoading(false);
        }
      }
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
    }
  };

  const setField = (field, value, errorMessage) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: value ? undefined : errorMessage,
    }));
    setEvent((prevEvent) => ({
      ...prevEvent,
      [field]: value || "",
    }));
  };

  return (
    <Fragment>
      <Header route={route} navigation={navigation} />
      <ScrollView>
        <Container>
          {!eventTypes ? (
            <Loading color={primaryColor} size={24} />
          ) : (
            <View style={styles.content}>
              <Pressable style={styles.preview} onPress={pickImage}>
                {event.photo ? (
                  <Image
                    style={styles.preview}
                    source={{
                      uri: event.photo,
                    }}
                  />
                ) : (
                  <FontAwesomeIcon icon={faImages} size={48} />
                )}
              </Pressable>

              {/* <Text style={styles.name}>{event.name}</Text> */}
              <View style={styles.inputs}>
                <Input
                  value={event.name}
                  onChangeText={(text) =>
                    setField("name", text, "Nome é obrigatório")
                  }
                  placeholder="Nome"
                  error={errors.name}
                ></Input>
                <InputNumber
                  onChangeText={(text) =>
                    setField("pax", text, "Convidados é obrigatório")
                  }
                  placeholder="Convidados"
                  value={event.pax}
                  maxLength={10}
                  error={errors.pax}
                />
                <InputDate
                  onChange={(value) => {
                    setEvent({ ...event, date: new Date(value) });
                  }}
                  placeholder="Data"
                  value={event.date}
                  error={errors.date}
                />
                <InputTime
                  onChange={(value) => {
                    setEvent({ ...event, startTime: new Date(value) });
                  }}
                  placeholder="Horário inicial"
                  value={event.startTime}
                  error={errors.startTime}
                />
                <InputTime
                  onChange={(value) => {
                    setEvent({ ...event, endTime: new Date(value) });
                  }}
                  placeholder="Horário final"
                  value={event.endTime}
                  error={errors.endTime}
                />
                <SelectPicker
                  placeholder={"Tipo de evento"}
                  selectedValue={event.eventTypeId}
                  items={eventTypes}
                  onChange={(selectedValue) =>
                    setEvent({ ...event, eventTypeId: selectedValue })
                  }
                  error={errors.eventTypeId}
                />
              </View>
              <ButtonLoading
                loading={loading}
                onPress={save}
                style={[styles.button]}
              >
                Salvar
              </ButtonLoading>
            </View>
          )}
        </Container>
      </ScrollView>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: "center",
    flex: 1,
    gap: 10,
  },
  name: {
    fontSize: 28,
    fontFamily: "PoppinsRegular",
    fontWeight: "bold",
  },

  inputs: {
    width: "100%",
    gap: 10,
  },
  preview: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00000010",
  },

  button: {
    width: 200,
  },
});

export default NewEvent;
