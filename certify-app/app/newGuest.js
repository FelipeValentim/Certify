import ButtonLoading from "@/components/common/ButtonLoading";
import { baseURL, primaryColor } from "@/constants/Default";
import React, { Fragment, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Header from "@/components/common/Header";
import {
  Input,
  ImagePicker,
  SelectInput,
} from "@/components/common/CustomInput";
import { GuestAPI } from "@/services/GuestAPI";
import { GuestTypeAPI } from "@/services/GuestTypeAPI";
import Loading from "@/components/common/Loading";
import {
  Container,
  CustomScrollView,
} from "@/components/common/CustomElements";
import { useDispatch } from "react-redux";
import { toast } from "@/redux/snackBar";

function NewGuest({ route, navigation }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [guestTypes, setGuestTypes] = useState();
  const [guest, setGuest] = useState({
    eventId: route.params.eventId,
    photoFullUrl: `${baseURL}/default/avatar.png`,
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
      if (!guest.name || !guest.email || !guest.guestTypeId) {
        const newErrors = {
          name: !guest.email ? "Nome é obrigatório" : undefined,
          email: !guest.email ? "Email é obrigatório" : undefined,
          guestTypeId: !guest.guestTypeId
            ? "Tipo de Convidado é obrigatório"
            : undefined,
        };
        setErrors(newErrors);
        dispatch(
          toast({
            text: Object.values(newErrors).find((error) => error),
            type: "warning",
          })
        );
      } else {
        try {
          setLoading(true);

          const response = await GuestAPI.newGuest(guest);

          const { data } = response;
          guest.id = data.id;
          guest.photoFullUrl = data.photoFullUrl;
          addGuest(guest);
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

  const setField = (field, value, errorMessage, required = true) => {
    if (required) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: value ? undefined : errorMessage,
      }));
    }

    setGuest((prevGuest) => ({
      ...prevGuest,
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
                photo={
                  guest.photoFile ? guest.photoFile.base64 : guest.photoFullUrl
                }
                onPicker={(file) => setGuest({ ...guest, photoFile: file })}
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
                    setGuest({
                      ...guest,
                      guestTypeId: itemSelected.id,
                      guestType: itemSelected,
                    })
                  }
                  error={errors.guestTypeId}
                />
              </View>

              <ButtonLoading
                loading={loading}
                onPress={save}
                style={styles.button}
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
    width: "100%",
    marginTop: 40,
  },
});

export default NewGuest;
