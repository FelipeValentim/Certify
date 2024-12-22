import Header from "@/components/Header";
import Loading from "@/components/Loading";
import {
  primaryColor,
  screenHeight,
  backgroundColor,
} from "@/constants/Default";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import H3 from "@/components/H3";
import H4 from "@/components/H4";
import H2 from "@/components/H2";

const TemplateTab = ({ navigation, route, title }) => {
  return (
    <React.Fragment>
      <Header route={route} navigation={navigation} />
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
