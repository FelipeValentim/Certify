import { primaryColor } from "@/constants/Default";
import React, { useEffect, useRef } from "react";
import { Pressable, Text, StyleSheet, Animated } from "react-native";

function ButtonLoading({ children, onPress, loading }) {
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

  return (
    <Pressable style={styles.button} onPress={onPress}>
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
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: primaryColor,
    borderRadius: 32,
    padding: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    height: 40,
  },
  textButton: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  loading: {
    position: "absolute",
    backgroundColor: "#FFF",
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

export default ButtonLoading;
