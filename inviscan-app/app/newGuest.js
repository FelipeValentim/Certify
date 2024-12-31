import ButtonLoading from "@/components/ButtonLoading";
import {
  backgroundColor,
  primaryColor,
  screenHeight,
} from "@/constants/Default";
import React, { Fragment, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import Header from "@/components/Header";
import {
  InputNumber,
  Input,
  InputDate,
  InputTime,
  SelectPicker,
  ImagePicker,
  SelectInput,
} from "@/components/CustomInput";
import { GuestAPI } from "@/services/GuestAPI";
import { GuestTypeAPI } from "@/services/GuestTypeAPI";
import Loading from "@/components/Loading";
import { Container, CustomScrollView } from "@/components/CustomElements";

function NewGuest({ route, navigation }) {
  const [loading, setLoading] = useState(false);
  const [guestTypes, setGuestTypes] = useState();
  const [guest, setGuest] = useState({
    eventId: route.params.eventId,
    photo:
      "https://www.pngitem.com/pimgs/m/421-4212266_transparent-default-avatar-png-default-avatar-images-png.png",
  });
  const [errors, setErrors] = React.useState({
    name: undefined,
    email: undefined,
  });
  const { addGuest } = route.params;

  useEffect(() => {
    const getEventTypes = async () => {
      const { data } = await GuestTypeAPI.getAll();
      setGuestTypes(data);
    };
    getEventTypes();
  }, []);

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

  const setField = (field, value, errorMessage, required = true) => {
    if (required) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: value ? undefined : errorMessage,
      }));
    }

    setEvent((prevEvent) => ({
      ...prevEvent,
      [field]: value || "",
    }));
  };

  return (
    <Fragment>
      <Header route={route} navigation={navigation} />
      {!guestTypes ? (
        <Loading color={primaryColor} size={24} />
      ) : (
        <CustomScrollView>
          <Container style={styles.container}>
            <View style={styles.content}>
              <ImagePicker
                photo={guest.photo}
                onPicker={(base64) => setGuest({ ...guest, photo: base64 })}
              />

              {/* <Text style={styles.name}>{guest.name}</Text> */}
              {guest.checkin && (
                <Text style={styles.checkin}>Checkin: {guest.checkin}</Text>
              )}

              <View style={styles.inputs}>
                <Input
                  value={guest.name}
                  onChangeText={(text) =>
                    setField("name", text, "Nome é obrigatório")
                  }
                  placeholder="Nome"
                  error={errors.name}
                />
                <Input
                  value={guest.email}
                  onChangeText={(text) =>
                    setField("email", text, "Email é obrigatório")
                  }
                  placeholder="Email"
                  error={errors.email}
                />
                <SelectInput
                  items={guestTypes}
                  placeholder={"Tipo de convidado"}
                  selected={guest.guestTypeId}
                  onSelected={(itemSelected) =>
                    setGuest({ ...guest, guestTypeId: itemSelected.id })
                  }
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
          </Container>
        </CustomScrollView>
      )}
    </Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  content: {
    alignItems: "center",
    flex: 1,
    gap: 10,
  },
  inputs: {
    width: "100%",
    gap: 10,
  },
  button: {
    width: 200,
    marginTop: 40,
  },
});

export default NewGuest;
