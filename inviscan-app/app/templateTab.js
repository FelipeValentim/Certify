import Header from "@/components/common/Header";
import { primaryColor, screenHeight } from "@/constants/Default";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { H2, H3, H4 } from "@/components/common/CustomElements";
import TemplateInfo from "@/components/TemplateInfo";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";

const TemplateTab = ({ navigation, route, title }) => {
  const [visibleInfo, setVisibleInfo] = useState(false);

  const toggleInfo = () => {
    setVisibleInfo(!visibleInfo);
  };

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
      <View style={styles.container}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.main}>
            <View style={styles.informations}>
              <Ionicons name="cloud-upload" size={200} color={"#FFF"} />
              <View>
                <H3 style={styles.textWhite}>
                  Você precisa fazer o upload de um
                </H3>
                <H2 style={styles.textWhite}>Template</H2>
                <H4 style={styles.textWhite}>
                  Clique aqui para saber o formato
                </H4>
              </View>
            </View>
            <View style={styles.upload}>
              <Ionicons name="image" size={40} color={"#000"} />
              <View>
                <H3>Selecione uma imagem da galeria</H3>
                <H4>Os formatos aceitos são docx e doc.</H4>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
      <TemplateInfo toggle={toggleInfo} visible={visibleInfo} />
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: primaryColor,
    height: screenHeight,
    flex: 1,
  },
  main: {
    flexDirection: "column",
    flex: 1,
  },
  informations: {
    height: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  upload: {
    backgroundColor: "#FFF",
    height: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  textWhite: {
    color: "#FFF",
  },
});

export default TemplateTab;
