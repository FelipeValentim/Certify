import { View, StyleSheet } from "react-native";

const Separator = ({ backgroundColor = "#f5f5f5" }) => {
  const styles = StyleSheet.create({
    separator: {
      height: 2, // Altura da linha
      width: "100%", // Largura da linha
      backgroundColor: backgroundColor, // Cor da linha
    },
  });

  return <View style={styles.separator} />;
};

export default Separator;
