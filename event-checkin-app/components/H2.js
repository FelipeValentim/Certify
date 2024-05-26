import { Text, StyleSheet } from "react-native";

const H2 = ({ children, style = {} }) => {
  return <Text style={{ ...styles.h2, ...style }}>{children}</Text>;
};

export default H2;

const styles = StyleSheet.create({
  h2: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
