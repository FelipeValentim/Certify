import ButtonLoading from "@/components/common/ButtonLoading";
import {
  FieldType,
  primaryColor,
  screenWidth,
  TranslateFieldType,
} from "@/constants/Default";
import React, { Fragment, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Header from "@/components/common/Header";
import { Input, SelectInput } from "@/components/common/CustomInput";
import {
  Container,
  CustomScrollView,
  H4,
} from "@/components/common/CustomElements";
import { EventAPI } from "@/services/EventAPI";
import { SegmentedControl } from "@/components/common/SegmentedControl";

const NewField = ({ route, navigation }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [eventField, setEventField] = useState({
    eventId: route.params.eventId,
  });
  const [fieldRequired, setFieldRequired] = useState({
    label: "Opcional",
    value: false,
  });

  const [eventFieldStates] = useState([
    { label: "Opcional", value: false },
    { label: "Obrigatório", value: true },
  ]);

  const [fieldTypes] = useState(
    Object.entries(FieldType)
      .filter(([key, value]) => typeof value === "number")
      .map(([key, value]) => ({
        id: value,
        name: TranslateFieldType(key),
      }))
  );

  const setField = (field, value, errorMessage, required = true) => {
    if (required) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: value ? undefined : errorMessage,
      }));
    }

    setEventField((prevEventField) => ({
      ...prevEventField,
      [field]: value || "",
    }));
  };

  useEffect(() => {
    setEventField({ ...eventField, isRequired: fieldRequired.value });
  }, [fieldRequired]);

  const save = async () => {
    console.log(eventField);

    await EventAPI.saveField(eventField);
  };

  return (
    <Fragment>
      <Header route={route} navigation={navigation} />

      <CustomScrollView>
        <Container style={styles.container}>
          <View style={styles.content}>
            <View style={styles.inputs}>
              <Input
                value={eventField.name}
                onChangeText={(text) =>
                  setField("name", text, "Nome é obrigatório")
                }
                placeholder="Nome"
                error={errors.name}
              />
              <SelectInput
                items={fieldTypes}
                placeholder={"Tipo do campo"}
                selected={eventField.type}
                onSelected={(itemSelected) =>
                  setField(
                    "type",
                    itemSelected.id,
                    "Tipo do campo é obrigatório"
                  )
                }
                error={errors.type}
              />
            </View>
            <View style={styles.segmentedState}>
              <H4>Obrigatoriedade</H4>
              <SegmentedControl
                width={screenWidth - 60}
                borderRadius={10}
                onPress={(state) => setFieldRequired(state)}
                options={eventFieldStates}
                selectedOption={fieldRequired}
                containerBackgroundColor="#F5F5F5"
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
    </Fragment>
  );
};

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
  segmentedState: {
    marginTop: 40,
    gap: 10,
    alignItems: "center",
  },
});

export default NewField;
