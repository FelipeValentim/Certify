import Header from "@/components/common/Header";
import {
  backgroundColor,
  baseURL,
  primaryColor,
  screenHeight,
  screenWidth,
} from "@/constants/Default";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Button,
} from "react-native";
import {
  Container,
  CustomScrollView,
  H1,
  H2,
  H3,
  H4,
  MutedText,
} from "@/components/common/CustomElements";
import TemplateInfo from "@/components/TemplateInfo";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faAdd,
  faCloudArrowUp,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
import UploadImage from "@/assets/images/undraw_upload.svg";
import ButtonLoading from "@/components/common/ButtonLoading";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { EventAPI } from "@/services/EventAPI";
import api from "@/services/configs/AxiosConfig";
import { SvgUri } from "react-native-svg";
import PdfViewer from "@/components/PdfViewer";
import WebView from "react-native-webview";

const TemplateTab = ({ navigation, route, title, template }) => {
  const [visibleInfo, setVisibleInfo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [templateFile, setTemplateFile] = useState(null);
  const previewUrl = baseURL + template.previewPath;
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
        console.log(asset.size);
        const file = {
          base64: base64,
          mimeType: asset.mimeType,
          size: asset.size,
          name: asset.name,
        };
        saveTemplate(file);
      }
    } catch (error) {
      console.error("Erro ao selecionar arquivo:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveTemplate = async (file) => {
    console.log(route.params);
    try {
      const response = await EventAPI.uploadTemplate(
        file,
        route.params.eventId
      );
    } catch (error) {
      console.error(error.message, error.code);
    }
  };
  console.log(previewUrl);
  return (
    <React.Fragment>
      <Header
        route={route}
        navigation={navigation}
        rightButtonComponent={
          <FontAwesomeIcon icon={faQuestionCircle} color="#FFF" size={18} />
        }
        rightButtonAction={toggleInfo}
      />
      <Container style={styles.container}>
        {template ? (
          <View style={{ flex: 1 }}>
            <PdfViewer
              style={{
                maxHeight: 260,
                width: "100%",
              }}
              source={{ uri: previewUrl }}
              useGoogleDriveViewer
            />
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={{
              gap: 40,
              flex: 1,
              justifyContent: "center",
            }}
          >
            <View style={styles.imageContainer}>
              <UploadImage height={screenHeight / 4} />
            </View>

            <View style={{ alignItems: "center" }}>
              <H2 style={{ color: primaryColor }}>Sem templates!</H2>
              <MutedText>
                Aqui é onde você poderá enviar seu template que será usado para
                gerar os certificados. Os formatos permitidos são{" "}
                <MutedText style={{ color: primaryColor }}>doc/docx</MutedText>.
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
          </ScrollView>
        )}
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
});

export default TemplateTab;
