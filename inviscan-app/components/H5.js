import { Text, StyleSheet } from "react-native";

const H5 = ({ children, style = {} }) => {
  return <Text style={{ ...styles.h5, ...style }}>{children}</Text>;
};

export default H5;

const styles = StyleSheet.create({
  h5: {
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "PoppinsRegular",
  },
});
