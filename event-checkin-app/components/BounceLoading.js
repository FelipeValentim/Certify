import React, { useEffect, useRef } from "react";
import { StyleSheet, Animated, View } from "react-native";

function BounceLoading({ color, size = 10 }) {
  const bounce1 = useRef(new Animated.Value(0)).current;
  const bounce2 = useRef(new Animated.Value(0)).current;
  const bounce3 = useRef(new Animated.Value(0)).current;

  // Configurando a sequência de animações
  const sequence = Animated.sequence([
    Animated.timing(bounce1, {
      toValue: size,
      duration: 150,
      useNativeDriver: false,
    }),
    Animated.timing(bounce1, {
      toValue: 0,
      duration: 150,
      useNativeDriver: false,
    }),
    Animated.timing(bounce2, {
      toValue: size,
      duration: 150,
      useNativeDriver: false,
    }),
    Animated.timing(bounce2, {
      toValue: 0,
      duration: 100,
      useNativeDriver: false,
    }),
    Animated.timing(bounce3, {
      toValue: size,
      duration: 150,
      useNativeDriver: false,
    }),
    Animated.timing(bounce3, {
      toValue: 0,
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
    container: {
      position: "relative",
    },
    loading: {
      position: "absolute",
      backgroundColor: color,
      width: size,
      height: size,
      borderRadius: size / 2,
    },
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.loading, { bottom: bounce1 }]}
      ></Animated.View>
      <Animated.View
        style={[
          styles.loading,
          { transform: [{ translateX: size * 2 }], bottom: bounce2 },
        ]}
      ></Animated.View>
      <Animated.View
        style={[
          styles.loading,
          {
            transform: [{ translateX: size * -2 }],
            bottom: bounce3,
          },
        ]}
      ></Animated.View>
    </View>
  );
}

export default BounceLoading;
