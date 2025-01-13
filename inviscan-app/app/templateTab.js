import Header from "@/components/common/Header";
import { baseURL, primaryColor, screenHeight } from "@/constants/Default";
import React, { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import {
  Container,
  H2,
  H3,
  MutedText,
  Section,
} from "@/components/common/CustomElements";
import TemplateInfo from "@/components/TemplateInfo";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faCloudArrowUp,
  faQuestion,
  faTrash,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import UploadImage from "@/assets/images/undraw_upload.svg";
import ButtonLoading from "@/components/common/ButtonLoading";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { EventTemplateAPI } from "@/services/EventTemplateAPI";
import PdfViewer from "@/components/PdfViewer";
import ConfirmAlert from "@/components/common/ConfirmAlert";
import { EventAPI } from "@/services/EventAPI";
import CustomText from "@/components/common/CustomText";
import { Ionicons } from "@expo/vector-icons";

const TemplateTab = ({ navigation, route, title, template }) => {
  const [eventId] = useState(route.params.eventId);
  const [eventTemplate, setEventTemplate] = useState(template);
  const [visibleInfo, setVisibleInfo] = useState(false);
  const [confirmAlert, setConfirmAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const toggleInfo = () => {
    setVisibleInfo(!visibleInfo);
  };

  const pickTemplate = async () => {
    try {
      setLoading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ], // DOC e DOCX
        copyToCacheDirectory: true,
        multiple: false,
      });
      if (result.canceled === false) {
        // Exibindo informações do arquivo
        const asset = result.assets[0];
        const base64 = await FileSystem.readAsStringAsync(asset.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        const file = {
          base64: base64,
          mimeType: asset.mimeType,
          size: asset.size,
          name: asset.name,
        };

        const { data } = await EventTemplateAPI.uploadTemplate(file, eventId);

        setEventTemplate({ fullPreviewPath: data });
      }
    } finally {
      setLoading(false);
    }
  };

  const removeTemplate = async () => {
    try {
      await EventTemplateAPI.removeTemplate(eventId);

      setEventTemplate(null);
    } catch (error) {
      console.error(error.message, error.code);
    }
  };

  const downloadCertificates = async () => {
    const { data } = await EventAPI.downloadCertificates(eventId);
    savefile(data);
  };

  const sendCertificates = async () => {
    const { data } = await EventAPI.sendCertificates(eventId);
  };

  const savefile = async (file) => {
    const permissions =
      await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (!permissions.granted) {
      return;
    }

    const uri = await FileSystem.StorageAccessFramework.createFileAsync(
      permissions.directoryUri,
      file.name,
      file.mimeType
    );

    await FileSystem.writeAsStringAsync(uri, file.base64, {
      encoding: FileSystem.EncodingType.Base64,
    });
  };

  return (
    <React.Fragment>
      <Header
        route={route}
        navigation={navigation}
        rightButtonComponent={
          <FontAwesomeIcon icon={faQuestion} color="#FFF" size={18} />
        }
        rightButtonAction={toggleInfo}
      />
      <Container style={styles.container}>
        <ScrollView
          contentContainerStyle={{
            gap: 30,
            flex: 1,
            justifyContent: "center",
          }}
        >
          {eventTemplate ? (
            <>
              <View
                style={{
                  // borderWidth: 1,
                  borderColor: primaryColor,
                  borderStyle: "dashed",
                  gap: 10,
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    setConfirmAlert({
                      open: true,
                      title: "Tem certeza disto?",
                      message: `Deseja realmente remover este template?`,
                      onConfirm: () => removeTemplate(),
                    })
                  }
                  style={{
                    ...styles.actionIcon,
                    alignSelf: "flex-end",
                    backgroundColor: primaryColor,
                  }}
                >
                  <FontAwesomeIcon icon={faX} color="#FFF" size={18} />
                </TouchableOpacity>
                <View style={{ height: 260 }}>
                  <PdfViewer
                    source={{ uri: eventTemplate.fullPreviewPath }}
                    useGoogleDriveViewer
                  />
                </View>
              </View>

              <Section>Certificados</Section>
              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                }}
              >
                <TouchableOpacity
                  style={styles.action}
                  onPress={() =>
                    setConfirmAlert({
                      open: true,
                      title: "Tem certeza disto?",
                      message: `Deseja realmente enviar o certificado para os participantes com checkin?`,
                      onConfirm: () => sendCertificates(),
                    })
                  }
                >
                  <CustomText style={styles.actionText}>Enviar</CustomText>

                  <View style={styles.actionIcon}>
                    {/* <FontAwesomeIcon
                      icon={faEnvelope}
                      color={primaryColor}
                      size={22}
                    /> */}
                    <Ionicons
                      name="mail-outline"
                      color={primaryColor}
                      size={26}
                    />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.action}
                  onPress={() =>
                    setConfirmAlert({
                      open: true,
                      title: "Tem certeza disto?",
                      message: `Deseja realmente baixar os certificado para os participantes com checkin?`,
                      onConfirm: () => downloadCertificates(),
                    })
                  }
                >
                  <CustomText style={styles.actionText}>Baixar</CustomText>
                  <View style={styles.actionIcon}>
                    {/* <FontAwesomeIcon
                      icon={faDownload}
                      color={primaryColor}
                      size={22}
                    /> */}
                    <Ionicons
                      name="download-outline"
                      color={primaryColor}
                      size={26}
                    />
                  </View>
                </TouchableOpacity>

                {/* <TouchableOpacity
                  style={styles.action}
                  onPress={() =>
                    setConfirmAlert({
                      open: true,
                      title: "Tem certeza disto?",
                      message: `Deseja realmente remover este template?`,
                      onConfirm: () => removeTemplate(),
                    })
                  }
                >
                  <View style={styles.actionIcon}>
                    <FontAwesomeIcon icon={faTrashAlt} color="#FFF" size={32} />
                  </View>
                  <MutedText style={styles.actionText}>Remover</MutedText>
                </TouchableOpacity> */}
              </View>
              <ConfirmAlert
                open={confirmAlert.open}
                toggle={() =>
                  setConfirmAlert({ ...confirmAlert, open: !confirmAlert.open })
                }
                title={confirmAlert.title}
                message={confirmAlert.message}
                onConfirm={confirmAlert.onConfirm}
                loading={loading}
              />
            </>
          ) : (
            <>
              <View style={styles.imageContainer}>
                <UploadImage height={screenHeight / 4} />
              </View>

              <View style={{ alignItems: "center" }}>
                <H2 style={{ color: primaryColor }}>Sem templates!</H2>
                <MutedText>
                  Aqui é onde você poderá enviar seu template que será usado
                  para gerar os certificados. Os formatos permitidos são{" "}
                  <MutedText style={{ color: primaryColor }}>
                    doc/docx
                  </MutedText>
                  .
                </MutedText>
              </View>
              <ButtonLoading
                loading={loading}
                onPress={pickTemplate}
                innerComponent={
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "row",
                      gap: 10,
                      width: "100%",
                    }}
                  >
                    <H3 style={{ color: "#FFF" }}>Upload</H3>
                    <FontAwesomeIcon
                      icon={faCloudArrowUp}
                      color="#fff"
                      size={22}
                    />
                  </View>
                }
              />
            </>
          )}
        </ScrollView>
      </Container>
      <TemplateInfo toggle={toggleInfo} visible={visibleInfo} />
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  imageContainer: {
    // borderWidth: 2,
    // borderStyle: "dashed",
    // borderRadius: 20,
    // paddingVertical: 30,
    // borderColor: "#aaa",
    alignItems: "center",
  },
  contentContainerStyle: {
    flexDirection: "row",
  },
  scrollView: {
    flexGrow: 0,
    height: 300,
  },
  action: {
    flex: 1,
    height: 60,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: primaryColor,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  actionIcon: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    height: 40,
    width: 40,
    borderRadius: 10,
  },
  actionText: {
    fontSize: 20,
    flex: 1,
    color: "#FFF",
    textAlign: "center",
  },
});

export default TemplateTab;
