import { Text, StyleSheet } from "react-native";

const H1 = ({ children, style = {} }) => {
  return <Text style={{ ...styles.h1, ...style }}>{children}</Text>;
};

export default H1;

const styles = StyleSheet.create({
  h1: {
    fontWeight: "bold",
    fontSize: 34,
    fontFamily: "PoppinsBold",
  },
});
