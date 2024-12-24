import ButtonLoading from "@/components/ButtonLoading";

import React, { Fragment, useState } from "react";
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
} from "@/components/CustomInput";
import { Container } from "@/components/CustomElements";

function NewEvent({ route, navigation }) {
  const [event, setEvent] = useState({
    date: null,
    startTime: null,
    endTime: null,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = React.useState({
    name: undefined,
  });

  const save = async () => {
    if (!loading) {
      if (!event.name) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          name: !event.name ? "Nome é obrigatório" : undefined,
        }));
      } else {
        try {
          setLoading(true);

          const response = await GuestAPI.newGuest(guest);

          const { data } = response;
          addGuest(data);
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

  const setName = (value) => {
    if (value) {
      setErrors({ ...errors, name: undefined });
      setEvent({ ...event, name: value });
    } else {
      setErrors({ ...errors, name: "Nome inválido" });
      setEvent({ ...event, name: "" });
    }
  };

  const setPax = (value) => {
    if (value) {
      setErrors({ ...errors, pax: undefined });
      setEvent({ ...event, pax: value });
    } else {
      setErrors({ ...errors, pax: "Número de convidados inválido" });
      setEvent({ ...event, pax: "" });
    }
  };

  return (
    <Fragment>
      <Header route={route} navigation={navigation} />
      <Container>
        <ScrollView>
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
                <Ionicons name="image-outline" size={48} />
              )}
            </Pressable>

            {/* <Text style={styles.name}>{event.name}</Text> */}
            <View style={styles.inputs}>
              <Input
                value={event.name}
                onChangeText={(text) => setName(text)}
                placeholder="Nome"
                error={errors.name}
              ></Input>
              <InputNumber
                onChangeText={(text) => setPax(text)}
                placeholder="Convidados"
                value={event.pax}
                maxLength={10}
              />
              <InputDate
                onChange={(value) => {
                  setEvent({ ...event, date: new Date(value) });
                }}
                placeholder="Data"
                value={event.date}
              />
              <InputTime
                onChange={(value) => {
                  setEvent({ ...event, startTime: new Date(value) });
                }}
                placeholder="Horário inicial"
                value={event.startTime}
              />
              <InputTime
                onChange={(value) => {
                  setEvent({ ...event, endTime: new Date(value) });
                }}
                placeholder="Horário final"
                value={event.endTime}
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
        </ScrollView>
      </Container>
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
