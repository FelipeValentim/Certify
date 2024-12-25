import ButtonLoading from "@/components/ButtonLoading";

import React, { Fragment, useEffect, useRef, useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import Header from "@/components/Header";
import {
  InputNumber,
  Input,
  InputDate,
  InputTime,
  SelectPicker,
  ImagePicker,
} from "@/components/CustomInput";
import { Container } from "@/components/CustomElements";
import { EventTypeAPI } from "@/services/EventTypeAPI";
import Loading from "@/components/Loading";
import { primaryColor } from "@/constants/Default";
import { toast } from "@/redux/snackBar";
import { useDispatch } from "react-redux";
import { EventAPI } from "@/services/EventAPI";
import { format } from "date-fns";

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
        !event.date ||
        !event.startTime ||
        !event.endTime ||
        !event.eventTypeId
      ) {
        const newErrors = {
          name: !event.name ? "Nome é obrigatório" : undefined,
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
          console.log(event);
          await EventAPI.newEvent(event);

          navigation.goBack();
        } catch (error) {
          console.log(error.response);
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
        <ScrollView>
          <Container>
            <View style={styles.content}>
              <ImagePicker
                photo={event.photo}
                onPicker={(base64) => setEvent({ ...event, photo: base64 })}
              />

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
          </Container>
        </ScrollView>
      )}
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
    marginTop: 40,
  },
});

export default NewEvent;
