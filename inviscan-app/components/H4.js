import { Text, StyleSheet } from "react-native";

const H4 = ({ children, style = {} }) => {
  return <Text style={{ ...styles.h4, ...style }}>{children}</Text>;
};

export default H4;

const styles = StyleSheet.create({
  h4: {
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "PoppinsRegular",
  },
});
