import React, { useRef, useEffect, useState, useImperativeHandle } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Image,
  TouchableOpacity,
} from "react-native";
import ButtonLoading from "@/components/common/ButtonLoading";
import {
  CustomScrollView,
  H3,
  ImageLoading,
  MutedText,
} from "@/components/common/CustomElements";
import { screenHeight } from "@/constants/Default";
import { generateUniqueFileName } from "@/helper/Generator";
import ModalContainer from "@/components/common/ModalContainer";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

const EventQRCode = ({ visible, toggle, qrCode }) => {
  const [performFunction, setPerformFunction] = useState({});

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
