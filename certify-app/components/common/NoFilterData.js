import React from "react";
import NoFilterDataSVG from "@/assets/images/undraw_no-filter-data.svg";
import { StyleSheet, View } from "react-native";
import { screenHeight } from "@/constants/Default";
import { MutedText } from "./CustomElements";

const NoFilterData = ({
  filter = "este filtro",
  text = `Não encontramos dados disponíveis para ${filter}. Tente aplicar outro filtro.`,
}) => {
  return (
    <View style={styles.imageContainer}>
      <MutedText>{text}</MutedText>
      <NoFilterDataSVG height={screenHeight / 4} />
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
    flex: 1,
  },
});

export default NoFilterData;
