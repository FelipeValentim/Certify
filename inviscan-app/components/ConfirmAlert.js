import React, { useRef, useEffect } from "react";
import { View, StyleSheet, Pressable, Animated, Easing } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import ButtonLoading from "./ButtonLoading";
import Zone from "@/assets/images/undraw_zone.svg";
import { H3, MutedText } from "./CustomElements";
import { redColor, screenHeight, screenWidth } from "@/constants/Default";

const ConfirmAlert = ({
  onConfirm,
  open,
  toggle,
  loading,
  message,
  title = "Confirmar?",
}) => {
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;

  useEffect(() => {
    if (open) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  }, [open]);

  const toClose = () => {
    Animated.timing(slideAnim, {
      toValue: screenHeight,
      duration: 200,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(toggle);
  };

  const handleConfirm = async () => {
    await onConfirm();
    toggle();
  };

  if (!open) return null;

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.innerContainer,
          {
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
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
          onPress={toClose}
          loadingColor="#000"
          color="#000"
          backgroundColor="transparent"
          style={[styles.btn, styles.cancelBtn]}
        >
          Cancelar
        </ButtonLoading>
        <Pressable style={styles.close} onPress={toClose}>
          <FontAwesomeIcon icon={faX} size={14} color="#555" />
        </Pressable>
      </Animated.View>
    </View>
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
