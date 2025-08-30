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
import { useDispatch } from "react-redux";
import { toast } from "@/redux/snackBar";
import HideOnKeyboard from "@/components/common/HideOnKeyboard";

const NewField = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { addEventField } = route.params;

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
    try {
      if (!eventField.name || !eventField.type) {
        const newErrors = {
          name: !eventField.name ? "Nome é obrigatório" : undefined,
          type: !eventField.type ? "Tipo é obrigatório" : undefined,
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

      if (!loading) {
        setLoading(true);
        const { data } = await EventAPI.saveField(eventField);
        addEventField(data);

        navigation.goBack();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <Header route={route} navigation={navigation} />

      <View style={styles.wrapper}>
        <CustomScrollView contentContainerStyle={styles.scrollContent}>
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
            </View>
          </Container>
        </CustomScrollView>

        <HideOnKeyboard style={styles.footer}>
          <ButtonLoading loading={loading} onPress={save} style={styles.button}>
            Salvar
          </ButtonLoading>
        </HideOnKeyboard>
      </View>
    </Fragment>
  );
};
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "space-between",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  container: {
    padding: 20,
  },
  content: {
    alignItems: "center",
    gap: 10,
  },
  inputs: {
    width: "100%",
    gap: 10,
  },
  button: {
    width: "100%",
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  segmentedState: {
    marginTop: 40,
    gap: 10,
    alignItems: "center",
  },
});

export default NewField;
