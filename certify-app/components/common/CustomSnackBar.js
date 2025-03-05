import { redColor, screenHeight } from "@/constants/Default";
import {
  faCheck,
  faCircleExclamation,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React, { useState } from "react";
import { View, Text } from "react-native";
import { Snackbar } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CustomSnackBar = ({
  duration = 5000,
  visible,
  type,
  style = {},
  onDismiss,
  message,
  children,
}) => {
  const [height, setHeight] = useState(0);
  const handleLayout = (event) => {
    const { height } = event.nativeEvent.layout; // Obtém a altura
    setHeight(height);
  };
  let backgroundColor = "#36AE7C";
  if (type == "warning") {
    backgroundColor = "#FFC145";
  } else if (type == "error") {
    backgroundColor = redColor;
  }
  const { top } = useSafeAreaInsets();

  const position = screenHeight - top - 60 - height;
  return (
    <Snackbar
      onLayout={handleLayout}
      style={{
        ...style,
        bottom: position,
        backgroundColor: backgroundColor,
      }}
      visible={visible}
      duration={duration}
      onDismiss={onDismiss}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 5,
        }}
      >
        {type == "success" && <FontAwesomeIcon icon={faCheck} color="#FFF" />}
        {type == "warning" && (
          <FontAwesomeIcon icon={faTriangleExclamation} color="#FFF" />
        )}
        {type == "error" && (
          <FontAwesomeIcon icon={faCircleExclamation} color="#FFF" />
        )}
        {message ? <Text style={{ color: "#FFF" }}>{message}</Text> : children}
      </View>
    </Snackbar>
  );
};

export default CustomSnackBar;
