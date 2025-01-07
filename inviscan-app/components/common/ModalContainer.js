import React, { useEffect, useRef } from "react";
import {
  Modal,
  Pressable,
  StatusBar,
  StyleSheet,
  View,
  Animated,
  Easing,
} from "react-native";
import { screenHeight } from "@/constants/Default";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

const ModalContainer = ({
  visible,
  toggle,
  children,
  maxHeight = screenHeight,
  overlayStyle = {},
  toPerformFunction = () => {},
}) => {
  const styles = StyleSheet.create({
    container: { flex: 1, position: "relative" },
    modalContainer: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      backgroundColor: "#00000080",
    },
    overlay: {
      position: "absolute",
      width: "90%",
      maxHeight: maxHeight,
      backgroundColor: "#FFF",
      borderRadius: 20,
      shadowColor: "#171717",
      shadowOffset: { width: -2, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 5,
      ...overlayStyle,
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
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const toClose = () => {
    Animated.timing(slideAnim, {
      toValue: screenHeight,
      duration: 200,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(toggle);
  };

  useEffect(() => {
    toPerformFunction({ close: () => toClose() });
  }, [toPerformFunction]);

  return (
    <Modal transparent visible={visible} onRequestClose={toClose}>
      <StatusBar backgroundColor="rgba(0, 0, 0, 1)" />

      <View style={styles.modalContainer}>
        <Animated.View
          style={[
            styles.overlay,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {children}

          <Pressable style={styles.close} onPress={toClose}>
            <FontAwesomeIcon icon={faX} size={14} color="#555" />
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default ModalContainer;
