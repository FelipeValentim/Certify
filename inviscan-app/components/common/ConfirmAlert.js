import React, { useRef, useEffect } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import ButtonLoading from "./ButtonLoading";
import Zone from "@/assets/images/undraw_zone.svg";
import { CustomScrollView, H3, MutedText } from "./CustomElements";
import { redColor, screenHeight, screenWidth } from "@/constants/Default";
import ModalContainer from "./ModalContainer";
import { TouchableOpacity } from "react-native-gesture-handler";

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

  if (!open) return null;

  return (
    <ModalContainer
      visible={open}
      toggle={toggle}
      overlayStyle={{ bottom: 10 }}
    >
      <CustomScrollView style={styles.rounded}>
        <View style={[styles.innerContainer, styles.rounded]}>
          <View style={styles.imageContainer}>
            <Zone height={screenHeight / 6} />
          </View>

          <View>
            <H3 style={styles.title}>{title}</H3>
            <MutedText style={styles.message}>{message}</MutedText>
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
            style={{ ...styles.btn }}
          >
            Cancelar
          </ButtonLoading>
        </View>
      </CustomScrollView>
    </ModalContainer>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    height: screenHeight / 1.8,
    padding: 20,
    gap: 20,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  title: {
    textAlign: "center",
  },
  btn: {
    borderWidth: 2,
  },
  rounded: {
    borderRadius: 20,
  },
});

export default ConfirmAlert;
