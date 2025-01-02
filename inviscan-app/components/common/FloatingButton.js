import { primaryColor } from "@/constants/Default";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { StyleSheet, TouchableOpacity } from "react-native";

const FloatingButton = ({ icon, color = "#FFF", size = 26, onPress }) => {
  const styles = StyleSheet.create({
    floatingButton: {
      backgroundColor: primaryColor,
      width: 60,
      height: 60,
      borderRadius: 20,
      position: "absolute",
      right: 20,
      bottom: 20,
      justifyContent: "center",
      alignItems: "center",

      // Sombra para iOS
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      // Sombra para Android
      elevation: 5,
    },
  });

  return (
    <TouchableOpacity style={styles.floatingButton} onPress={onPress}>
      <FontAwesomeIcon icon={icon} color={color} size={size} />
    </TouchableOpacity>
  );
};

export default FloatingButton;
