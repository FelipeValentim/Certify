import React, { useEffect, useRef } from "react";
import { StyleSheet, View, Animated, Easing } from "react-native";

const startRotationAnimation = (durationMs, rotationDegree) => {
  Animated.loop(
    Animated.timing(rotationDegree, {
      toValue: 360,
      duration: durationMs,
      easing: Easing.linear,
      useNativeDriver: false,
    })
  ).start();
};

const LoadingSpinner = ({ color, durationMs = 1000 }) => {
  const rotationDegree = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startRotationAnimation(durationMs, rotationDegree);
  }, [durationMs, rotationDegree]);

  return (
    <View style={styles.container} accessibilityRole="progressbar">
      <Animated.View
        style={[
          styles.progress,
          { borderTopColor: color },
          {
            transform: [
              {
                rotateZ: rotationDegree.interpolate({
                  inputRange: [0, 360],
                  outputRange: ["0deg", "360deg"],
                }),
              },
            ],
          },
        ]}
      />
    </View>
  );
};

const height = 24;

const styles = StyleSheet.create({
  container: {
    width: height,
    height: height,
    justifyContent: "center",
    alignItems: "center",
  },

  progress: {
    width: "100%",
    height: "100%",
    borderRadius: height / 2,
    borderLeftColor: "#7B55E030",
    borderRightColor: "#7B55E030",
    borderBottomColor: "#7B55E030",
    borderWidth: height / 8,
    position: "absolute",
  },
});

export default LoadingSpinner;
