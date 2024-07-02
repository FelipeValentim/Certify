import { primaryColor, screenHeight, screenWidth } from "@/constants/Default";
import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet, Pressable } from "react-native";

const NewGuestButton = ({ onPress }) => {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Ionicons name="add" size={40} color={"#FFF"} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    bottom: screenHeight / 5,
    right: 20,
    position: "absolute",
    backgroundColor: primaryColor,
    width: 60,
    height: 60,
    borderRadius: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
});

export default NewGuestButton;
