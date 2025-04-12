import ButtonLoading from "@/components/common/ButtonLoading";
import { baseURL, FieldType, primaryColor } from "@/constants/Default";
import React, { Fragment, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Header from "@/components/common/Header";
import {
  Input,
  ImagePicker,
  SelectInput,
  InputDate,
  InputNumber,
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
import { EventAPI } from "@/services/EventAPI";
import HideOnKeyboard from "@/components/common/HideOnKeyboard";

function NewGuest({ route, navigation }) {
  const dispatch = useDispatch();
  const { eventId } = route.params;

  const [loading, setLoading] = useState(false);
  const [guestTypes, setGuestTypes] = useState(null);
  const [eventFields, setEventFields] = useState(null);
  const [guest, setGuest] = useState({
    eventId: eventId,
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
    const getEventFields = async () => {
      const { data } = await EventAPI.getFields(eventId);
      setEventFields(data);
      setGuest((prevGuest) => ({
        ...prevGuest,
        fieldsValues: data.map((field) => ({
          eventFieldId: field.id,
          value: null,
        })),
      }));
    };
    getEventTypes();
    getEventFields();
  }, []);

  const setFieldValue = (eventFieldId, value) => {
    setGuest((prevGuest) => ({
      ...prevGuest,
      fieldsValues: prevGuest.fieldsValues.map((fieldValue) =>
        fieldValue.eventFieldId === eventFieldId
          ? { ...fieldValue, value }
          : fieldValue
      ),
    }));
  };

  const save = async () => {
    if (!loading) {
      const newErrors = {
        name: !guest.name ? "Nome é obrigatório" : undefined,
        email: !guest.email ? "Email é obrigatório" : undefined,
        guestTypeId: !guest.guestTypeId
          ? "Tipo de Convidado é obrigatório"
          : undefined,
      };

      // Validação dos campos dinâmicos
      eventFields?.forEach((field) => {
        const fieldValue = guest.fieldsValues?.find(
          (fv) => fv.eventFieldId === field.id
        );
        if (field.isRequired && (!fieldValue || !fieldValue.value)) {
          newErrors[field.name] = `${field.name} é obrigatório`;
        }
      });

      const hasErrors = Object.values(newErrors).some((error) => error);

      if (hasErrors) {
        setErrors(newErrors);
        dispatch(
          toast({
            text: Object.values(newErrors).find((error) => error),
            type: "warning",
          })
        );
        return;
      }

      // prossegue com o envio
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
      {guestTypes == null || eventFields == null ? (
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
                {eventFields.map((field) => {
                  const fieldValue =
                    guest.fieldsValues?.find((f) => f.eventFieldId === field.id)
                      ?.value || null;

                  if (field.type == FieldType[FieldType.Date]) {
                    return (
                      <InputDate
                        onChange={(value) =>
                          setFieldValue(field.id, new Date(value))
                        }
                        key={field.id}
                        placeholder={field.name}
                        value={fieldValue}
                        error={errors[field.name]}
                      />
                    );
                  }

                  if (field.type == FieldType[FieldType.Number]) {
                    return (
                      <InputNumber
                        onChangeText={(text) =>
                          setFieldValue(field.id, new Date(text))
                        }
                        key={field.id}
                        placeholder={field.name}
                        value={fieldValue}
                        error={errors[field.name]}
                      />
                    );
                  }

                  return (
                    <Input
                      key={field.id}
                      value={fieldValue}
                      onChangeText={(text) => setFieldValue(field.id, text)}
                      placeholder={field.name}
                      error={errors[field.name]}
                    />
                  );
                })}
              </View>
            </View>
          </Container>
        </CustomScrollView>
      )}
      <HideOnKeyboard style={styles.footer}>
        <ButtonLoading
          loading={loading}
          onPress={save}
          style={{ width: "100%" }}
        >
          Salvar
        </ButtonLoading>
      </HideOnKeyboard>
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
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
});

export default NewGuest;
