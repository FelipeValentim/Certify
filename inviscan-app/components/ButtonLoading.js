import { primaryColor } from "@/constants/Default";
import React, { useEffect, useRef } from "react";
import { TouchableOpacity, Text, StyleSheet, Animated } from "react-native";

function ButtonLoading({
  children,
  onPress,
  loading,
  borderRadius = 10,
  height = 50,
  padding = 8,
  color = "#FFF",
  backgroundColor = primaryColor,
  loadingColor = "#FFF",
  style = [],
}) {
  const bounce1 = useRef(new Animated.Value(15)).current;
  const bounce2 = useRef(new Animated.Value(15)).current;
  const bounce3 = useRef(new Animated.Value(15)).current;

  // Configurando a sequência de animações
  const sequence = Animated.sequence([
    Animated.timing(bounce1, {
      toValue: 25,
      duration: 150,
      useNativeDriver: false,
    }),
    Animated.timing(bounce1, {
      toValue: 15,
      duration: 150,
      useNativeDriver: false,
    }),
    Animated.timing(bounce2, {
      toValue: 25,
      duration: 150,
      useNativeDriver: false,
    }),
    Animated.timing(bounce2, {
      toValue: 15,
      duration: 150,
      useNativeDriver: false,
    }),
    Animated.timing(bounce3, {
      toValue: 25,
      duration: 150,
      useNativeDriver: false,
    }),
    Animated.timing(bounce3, {
      toValue: 15,
      duration: 150,
      useNativeDriver: false,
    }),
  ]);

  // Configurando o loop das animações
  const loop = Animated.loop(sequence);

  useEffect(() => {
    loop.start();
  }, []);

  const styles = StyleSheet.create({
    button: {
      backgroundColor: backgroundColor,
      borderRadius: borderRadius,
      padding: padding,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      height: height,
    },
    textButton: {
      color: color,
      fontSize: 16,
      fontFamily: "PoppinsBold",
    },
    loading: {
      position: "absolute",
      backgroundColor: loadingColor,
      width: 10,
      height: 10,
      borderRadius: 5,
    },
  });

  return (
    <TouchableOpacity style={[styles.button, ...style]} onPress={onPress}>
      {loading ? (
        <>
          <Animated.View
            style={[styles.loading, { bottom: bounce1 }]}
          ></Animated.View>
          <Animated.View
            style={[
              styles.loading,
              { transform: [{ translateX: 20 }], bottom: bounce2 },
            ]}
          ></Animated.View>
          <Animated.View
            style={[
              styles.loading,
              {
                transform: [{ translateX: -20 }],
                bottom: bounce3,
              },
            ]}
          ></Animated.View>
        </>
      ) : (
        <Text style={styles.textButton}>{children}</Text>
      )}
    </TouchableOpacity>
  );
}

export default ButtonLoading;
