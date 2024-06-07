import { redColor, screenHeight, screenWidth } from "@/constants/Default";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ButtonLoading from "./ButtonLoading";

const ConfirmAlert = ({
  onConfirm,
  open,
  toggle,
  loading,
  message,
  title = "Confirmar?",
}) => {
  const handleConfirm = async () => {
    await onConfirm();
    toggle();
  };

  return (
    open && (
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.btnGroup}>
            <ButtonLoading
              loading={loading}
              onPress={handleConfirm}
              style={[styles.btn]}
            >
              Confirmar
            </ButtonLoading>
            <ButtonLoading
              onPress={toggle}
              style={[styles.btn, styles.cancelBtn]}
            >
              Cancelar
            </ButtonLoading>
          </View>
        </View>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    backgroundColor: "#00000080",
    height: "100%",
    width: "100%",
    zIndex: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  innerContainer: {
    height: screenHeight / 3,
    width: screenWidth / 1.4,
    backgroundColor: "#FFF",
    borderRadius: 20,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  title: {
    fontFamily: "PoppinsRegular",
    fontSize: 20,
    textAlign: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#17171730",
  },
  message: {
    fontSize: 18,
    padding: 15,
  },
  btnGroup: {
    display: "flex",
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    padding: 15,
    gap: 10,
  },
  btn: {
    flex: 1,
  },
  cancelBtn: {
    backgroundColor: redColor,
  },
});

export default ConfirmAlert;
