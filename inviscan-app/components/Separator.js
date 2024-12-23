import { View, StyleSheet } from "react-native";

const Separator = ({ style = {} }) => {
  return <View style={{ ...styles.separator, ...style }} />;
};
const styles = StyleSheet.create({
  separator: {
    height: 2, // Altura da linha
    width: "100%", // Largura da linha
    backgroundColor: "#f5f5f5", // Cor da linha
  },
});

export default Separator;
