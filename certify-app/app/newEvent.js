import ButtonLoading from "@/components/common/ButtonLoading";
import React, { Fragment, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Header from "@/components/common/Header";
import {
  InputNumber,
  Input,
  InputDate,
  InputTime,
  SelectInput,
  ImagePicker,
} from "@/components/common/CustomInput";
import {
  Container,
  CustomScrollView,
} from "@/components/common/CustomElements";
import { EventTypeAPI } from "@/services/EventTypeAPI";
import Loading from "@/components/common/Loading";
import { baseURL, primaryColor } from "@/constants/Default";
import { toast } from "@/redux/snackBar";
import { useDispatch } from "react-redux";
import { EventAPI } from "@/services/EventAPI";
import HideOnKeyboard from "@/components/common/HideOnKeyboard";

function NewEvent({ route, navigation }) {
  const dispatch = useDispatch();
  const [event, setEvent] = useState({
    fullPhotoUrl: `${baseURL}/default/lecture.png`,
    date: null,
    startTime: null,
    endTime: null,
    eventTypeId: null,
    eventStatus: 1,
  });
  const [eventTypes, setEventTypes] = useState();
  const { addEvent } = route.params;
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ name: undefined });

  useEffect(() => {
    const getEventTypes = async () => {
      const { data } = await EventTypeAPI.getAll();
      setEventTypes(data);
    };
    getEventTypes();
  }, []);

  const save = async () => {
    if (!loading) {
      if (
        !event.name ||
        !event.date ||
        !event.startTime ||
        !event.endTime ||
        !event.eventTypeId
      ) {
        const newErrors = {
          name: !event.name ? "Nome é obrigatório" : undefined,
          date: !event.date ? "Data é obrigatório" : undefined,
          startTime: !event.startTime
            ? "Horário inicial é obrigatório"
            : undefined,
          endTime: !event.endTime ? "Horário final é obrigatório" : undefined,
          eventTypeId: !event.eventTypeId
            ? "Tipo de evento é obrigatório"
            : undefined,
        };
        setErrors(newErrors);
        dispatch(
          toast({
            text: Object.values(newErrors).find((error) => error),
            type: "warning",
          })
        );
        return;
      }

      try {
        setLoading(true);
        const { data } = await EventAPI.newEvent(event);
        event.id = data.id;
        event.photoFullUrl = data.photoFullUrl;
        event.eventType = {
          name: eventTypes.find((x) => x.id === event.eventTypeId).name,
        };
        addEvent(event);
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

    setEvent((prevEvent) => ({
      ...prevEvent,
      [field]: value || "",
    }));
  };

  return (
    <Fragment>
      <Header route={route} navigation={navigation} />
      {!eventTypes ? (
        <Loading color={primaryColor} size={24} />
      ) : (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={{ flex: 1 }}>
            <CustomScrollView contentContainerStyle={{ paddingBottom: 100 }}>
              <Container style={styles.container}>
                <View style={styles.content}>
                  <ImagePicker
                    photo={
                      event.photoFile
                        ? event.photoFile.base64
                        : event.fullPhotoUrl
                    }
                    onPicker={(file) => setEvent({ ...event, photoFile: file })}
                  />
                  <View style={styles.inputs}>
                    <Input
                      value={event.name}
                      onChangeText={(text) =>
                        setField("name", text, "Nome é obrigatório")
                      }
                      placeholder="Nome"
                      error={errors.name}
                    />
                    <InputNumber
                      onChangeText={(text) =>
                        setField("pax", text, "Convidados é obrigatório", false)
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
                      minimumDate={new Date()}
                      value={event.date}
                      error={errors.date}
                    />
                    <InputTime
                      onChange={(value) => {
                        setEvent({ ...event, startTime: value });
                      }}
                      placeholder="Horário inicial"
                      value={event.startTime}
                      error={errors.startTime}
                    />
                    <InputTime
                      onChange={(value) => {
                        setEvent({ ...event, endTime: value });
                      }}
                      placeholder="Horário final"
                      value={event.endTime}
                      error={errors.endTime}
                    />
                    <SelectInput
                      placeholder={"Tipo de evento"}
                      selected={event.eventTypeId}
                      items={eventTypes}
                      onSelected={(selected) =>
                        setEvent({ ...event, eventTypeId: selected.id })
                      }
                      error={errors.eventTypeId}
                    />
                  </View>
                </View>
              </Container>
            </CustomScrollView>

            {/* BOTÃO FIXO NO FOOTER */}
            <HideOnKeyboard style={styles.footer}>
              <ButtonLoading
                loading={loading}
                onPress={save}
                style={{ width: "100%" }}
              >
                Salvar
              </ButtonLoading>
            </HideOnKeyboard>
          </View>
        </KeyboardAvoidingView>
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

export default NewEvent;
