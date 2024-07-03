import ButtonLoading from "@/components/ButtonLoading";
import {
  backgroundColor,
  primaryColor,
  screenHeight,
} from "@/constants/Default";
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
import Input from "@/components/Input";
import { GuestAPI } from "@/services/GuestAPI";

function NewGuest({ route, navigation }) {
  const [loading, setLoading] = useState(false);
  const [guest, setGuest] = useState({ event: route.params.eventId });
  const [errors, setErrors] = React.useState({
    name: undefined,
  });
  const { addGuest } = route.params;

  const save = async () => {
    if (!loading) {
      if (!guest.name) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          name: !guest.name ? "Nome é obrigatório" : undefined,
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
      setGuest({
        ...guest,
        photo: `data:image/png;base64,${result.assets[0].base64}`,
      });
    }
  };

  const setName = (value) => {
    if (value) {
      setErrors({ ...errors, name: undefined });
      setGuest({ ...guest, name: value });
    } else {
      setErrors({ ...errors, name: "Nome inválido" });
      setGuest({ ...guest, name: "" });
    }
  };

  return (
    <Fragment>
      <Header route={route} navigation={navigation} />
      <View style={styles.container}>
        <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
          <View style={styles.card}>
            <Pressable style={styles.preview} onPress={pickImage}>
              {guest.photo ? (
                <Image
                  style={styles.preview}
                  source={{
                    uri: guest.photo,
                  }}
                />
              ) : (
                <View>
                  <Ionicons name="image-outline" size={48} />
                </View>
              )}
            </Pressable>

            <Text style={styles.name}>{guest.name}</Text>
            {guest.checkin && (
              <Text style={styles.checkin}>Checkin: {guest.checkin}</Text>
            )}
            <Input
              value={guest.name}
              onChangeText={(text) => setName(text)}
              placeholder="Nome"
              error={errors.name}
            ></Input>
            <ButtonLoading
              loading={loading}
              onPress={save}
              style={[styles.button]}
            >
              Salvar
            </ButtonLoading>
          </View>
        </ScrollView>
      </View>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: backgroundColor,
    height: screenHeight,
  },
  card: {
    backgroundColor: "#FFF",
    margin: 10,
    borderRadius: 20,
    padding: 30,
    display: "flex",
    alignItems: "center",
    gap: 50,
  },
  name: {
    fontSize: 28,
    fontFamily: "PoppinsRegular",
    fontWeight: "bold",
  },
  photo: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  preview: {
    width: 150,
    height: 150,
    borderRadius: 75,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00000030",
  },
  qrCode: {
    borderWidth: 3,
    borderColor: backgroundColor,
    padding: 10,
    borderRadius: 20,
  },
  checkin: {
    fontSize: 14,
    fontFamily: "PoppinsRegular",
    backgroundColor: primaryColor,
    padding: 10,
    borderRadius: 10,
    color: "#FFF",
  },
  button: {
    width: 200,
  },
});

export default NewGuest;
