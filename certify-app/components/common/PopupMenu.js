import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { CustomScrollView } from "./CustomElements";
import { screenHeight } from "@/constants/Default";
import ModalContainer from "./ModalContainer";

const PopupMenu = ({ open, toggle, children }) => {
  return (
    <ModalContainer
      visible={open}
      toggle={toggle}
      overlayStyle={{ bottom: 10 }}
    >
      <View style={[styles.innerContainer, styles.rounded]}>{children}</View>
    </ModalContainer>
  );
};

const PopupMenuTrigger = ({ text, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.triggerButton}>
    <Text style={styles.triggerText}>{text}</Text>
  </TouchableOpacity>
);

const PopupMenuOptions = ({ children }) => (
  <CustomScrollView
    style={{ ...styles.optionsContainer, ...styles.rounded }}
    contentContainerStyle={{ paddingBottom: 50 }}
  >
    {children}
  </CustomScrollView>
);

const PopupMenuOption = ({ onSelect, text, icon, disabled, children }) => (
  <TouchableOpacity
    onPress={!disabled ? onSelect : null}
    style={[styles.option, disabled && styles.disabledOption]}
    disabled={disabled}
  >
    <>
      {icon}
      <Text style={[styles.optionText, disabled && styles.disabledText]}>
        {text}
      </Text>
    </>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  innerContainer: {
    height: screenHeight / 2,
    gap: 10,
  },
  rounded: {
    borderRadius: 20,
  },
  triggerButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  triggerText: {
    color: "white",
    fontSize: 16,
  },
  optionsContainer: {
    padding: 20,
  },
  option: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
  },
  disabledOption: {
    opacity: 0.5,
  },
  disabledText: {
    color: "gray",
  },
});

export { PopupMenu, PopupMenuTrigger, PopupMenuOptions, PopupMenuOption };
