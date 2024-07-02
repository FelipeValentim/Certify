import { Text, StyleSheet } from "react-native";

const H3 = ({ children, style = {} }) => {
  return <Text style={{ ...styles.h3, ...style }}>{children}</Text>;
};

export default H3;

const styles = StyleSheet.create({
  h3: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "PoppinsRegular",
  },
});
