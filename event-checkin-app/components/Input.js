import React from "react";
import {
  Animated,
  StyleSheet,
  View,
  TextInput,
  Text,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function Input({ value, onChangeText, placeholder, error }) {
  const { width } = Dimensions.get("window");
  const [focus, setFocus] = React.useState(false);
  const placeholderAnim = React.useRef(new Animated.Value(15)).current;
  const lineAnim = React.useRef(new Animated.Value(width)).current;

  const handleFocus = () => {
    setFocus(true);
  };

  const handleBlur = () => {
    setFocus(false);
  };

  React.useEffect(() => {
    if (focus || value) {
      Animated.timing(lineAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();

      Animated.timing(placeholderAnim, {
        toValue: 40,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(lineAnim, {
        toValue: width,
        duration: 300,
        useNativeDriver: false,
      }).start();
      Animated.timing(placeholderAnim, {
        toValue: 15,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [focus]);

  const styles = StyleSheet.create({
    inputGroup: {
      backgroundColor: "#FFF",
      display: "flex",
      flexDirection: "column",
      gap: 32,
      width: "100%",
      marginTop: 22,
    },
    formControl: {
      position: "relative",
    },
    field: {
      position: "relative",
      overflow: "hidden",
    },
    placeholder: {
      position: "absolute",
      left: 15,
      color: error ? "#92000A" : "#999",
      bottom: placeholderAnim,
      pointerEvents: "none",
      fontFamily: "PoppinsRegular",
    },
    textInput: {
      padding: 16,
      paddingBottom: 12,
      fontSize: 16,
      width: "100%",
      outlineStyle: "none",
      color: "#000",
      fontFamily: "PoppinsRegular",
    },
    line: {
      position: "absolute",
      width: "100%",
      height: 2,
      backgroundColor: error ? "#92000A" : "#adadad",
      bottom: 0,
    },
    focusLine: {
      position: "absolute",
      width: "100%",
      height: 2,
      backgroundColor: "#000",
      bottom: 0,
      right: lineAnim,
    },
  });

  return (
    <View style={styles.inputGroup}>
      <View style={styles.formControl}>
        <View style={styles.field}>
          <View style={styles.line} />
          <Animated.View style={styles.focusLine}>
            <LinearGradient
              colors={["#7B55E0", "#000"]}
              style={{ flex: 1 }}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </Animated.View>
          <TextInput
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={styles.textInput}
            onChangeText={(text) => onChangeText(text)}
            keyboardType={"default"}
            value={value}
          />
        </View>
        <Animated.Text style={styles.placeholder}>{placeholder}</Animated.Text>
      </View>
    </View>
  );
}
