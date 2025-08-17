import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import ButtonLoading from "@/components/common/ButtonLoading";
import {
  CustomScrollView,
  H3,
  H4,
  ImageLoading,
  MutedText,
} from "@/components/common/CustomElements";
import { screenHeight, screenWidth } from "@/constants/Default";
import { generateUniqueFileName } from "@/helper/Generator";
import ModalContainer from "@/components/common/ModalContainer";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { SegmentedControl } from "./common/SegmentedControl";
import { EventAPI } from "@/services/EventAPI";
import CustomText from "./common/CustomText";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { toast } from "@/redux/snackBar";
import * as Clipboard from "expo-clipboard";

const EventQRCode = ({
  visible,
  toggle,
  qrCode,
  formCheckinURL,
  id,
  checkinEnabled,
}) => {
  const dispatch = useDispatch();

  const [performFunction, setPerformFunction] = useState({});
  const [eventId] = useState(id);
  const [checkinEnabledMode, setCheckinEnabledMode] = useState({
    value: checkinEnabled,
  });

  const [eventCheckinStates] = useState([
    { label: "Desativado", value: false },
    { label: "Automático", value: null },
    { label: "Ativado", value: true },
  ]); // Estado inicial é 'Desativado'

  const styles = StyleSheet.create({
    innerContainer: {
      height: screenHeight / 1.4,
      gap: 20,
    },
    imageContainer: {
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
    },
    message: {
      textAlign: "start",
    },
    btn: {
      borderWidth: 2,
      marginHorizontal: 20,
      marginBottom: 20,
      marginTop: 0,
    },
    title: {
      textAlign: "center",
    },
    rounded: {
      borderRadius: 20,
    },
    contentContainerStyle: {
      gap: 20,
      padding: 20,
    },
    example: {
      width: "100%",
      heigh: undefined,
      resizeMode: "contain",
      aspectRatio: 1,
    },
    checkinState: {
      gap: 10,
      alignItems: "center",
    },
  });
  const downloadQRCode = async () => {
    const imageUrl = qrCode;
    const downloadPath = `${
      FileSystem.documentDirectory
    }/${generateUniqueFileName()}`; // Caminho temporário

    const downloadResult = await FileSystem.downloadAsync(
      imageUrl,
      downloadPath
    );

    const { status } = await MediaLibrary.requestPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permissão negada",
        "Você precisa conceder permissão para salvar a imagem."
      );
      return;
    }
    const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
    await MediaLibrary.createAlbumAsync("Download", asset, false); // Salvar na pasta "Download"
  };

  const setCheckinEnabled = async (state) => {
    setCheckinEnabledMode(state);

    await EventAPI.checkinEnabledMode(
      { id: eventId, checkinEnabled: state.value },
      true
    );
  };

  if (!visible) return null;

  return (
    <ModalContainer
      visible={visible}
      toggle={toggle}
      overlayStyle={{ bottom: 10 }}
      toPerformFunction={setPerformFunction}
    >
      <View style={{ ...styles.innerContainer }}>
        <CustomScrollView
          contentContainerStyle={{
            ...styles.contentContainerStyle,
          }}
          style={styles.rounded}
        >
          <H3 style={styles.title}>Evento - QRCode</H3>
          <View style={{ alignItems: "center", gap: 20 }}>
            <MutedText style={styles.message}>
              Para que os convidados possam realizar o checkin por conta
              própria, compartilhe o QRCode do evento.
            </MutedText>
            <View style={styles.checkinState}>
              <H4>Controle de Acesso de Checkin</H4>
              <SegmentedControl
                width={screenWidth - 60}
                borderRadius={10}
                onPress={setCheckinEnabled}
                options={eventCheckinStates}
                selectedOption={checkinEnabledMode}
                containerBackgroundColor="#F5F5F5"
              />
            </View>

            <TouchableOpacity
              style={{
                flexDirection: "row",
              }}
              onPress={async () => {
                await Clipboard.setStringAsync(formCheckinURL);
                dispatch(
                  toast({
                    text: "Link copiado com sucesso",
                    type: "success",
                  })
                );
              }}
            >
              <CustomText numberOfLines={1}>{formCheckinURL}</CustomText>
              <Ionicons name="clipboard-outline" color={"#000"} size={20} />
            </TouchableOpacity>

            <TouchableOpacity onPress={downloadQRCode}>
              <ImageLoading
                style={styles.example}
                source={{
                  uri: qrCode,
                }}
              />
            </TouchableOpacity>
          </View>
        </CustomScrollView>

        <ButtonLoading
          onPress={() => performFunction.close()}
          loadingColor="#000"
          color="#000"
          backgroundColor="transparent"
          style={{ ...styles.btn }}
        >
          Entendido
        </ButtonLoading>
      </View>
    </ModalContainer>
  );
};

export default EventQRCode;
