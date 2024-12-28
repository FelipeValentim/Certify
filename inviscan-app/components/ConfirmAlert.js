import { redColor, screenHeight, screenWidth } from "@/constants/Default";
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import ButtonLoading from "./ButtonLoading";
import Zone from "@/assets/images/undraw_zone.svg";
import CustomText from "./CustomText";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

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
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
            }}
          >
            <Zone height={screenHeight / 6} />
          </View>

          <View>
            <CustomText style={styles.title}>{title}</CustomText>
            <Text style={styles.message}>{message}</Text>
          </View>

          <ButtonLoading
            loading={loading}
            onPress={handleConfirm}
            style={[styles.btn]}
          >
            Confirmar
          </ButtonLoading>
          <ButtonLoading
            onPress={toggle}
            loadingColor="#000"
            color="#000"
            backgroundColor="transparent"
            style={[styles.btn, styles.cancelBtn]}
          >
            Cancelar
          </ButtonLoading>
          <Pressable style={styles.close} onPress={toggle}>
            <FontAwesomeIcon icon={faX} size={14} color="#555" />
          </Pressable>
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
    justifyContent: "flex-end",
    paddingBottom: 10,
  },
  innerContainer: {
    height: screenHeight / 1.8,
    width: screenWidth / 1.1,
    backgroundColor: "#FFF",
    borderRadius: 20,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    padding: 20,
    gap: 20,
  },
  title: {
    fontFamily: "PoppinsBold",
    fontSize: 18,
    textAlign: "center",
  },
  message: {
    fontSize: 15,
    color: "#aaa",
    textAlign: "center",
  },
  btn: {
    borderWidth: 2,
    // borderColor: "#555",
  },
  close: {
    backgroundColor: "#FFF",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    right: 0,
    top: -50,
    width: 40,
    height: 40,
    borderRadius: 20,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
});

export default ConfirmAlert;
