import React from "react";
import NoDataSVG from "@/assets/images/undraw_no-data.svg";
import { StyleSheet, View } from "react-native";
import { screenHeight } from "@/constants/Default";
import { MutedText } from "./CustomElements";

const NoData = ({
  text = "Não encontramos dados disponíveis no momento. Tente recarregar a página ou adicionar um novo item.",
}) => {
  return (
    <View style={styles.imageContainer}>
      <MutedText>{text}</MutedText>
      <NoDataSVG height={screenHeight / 4} />
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    marginTop: screenHeight / 8,
    padding: 20,
    gap: 30,
    alignItems: "center",
    justifyContent: "start",
    height: "100%",
  },
});

export default NoData;
