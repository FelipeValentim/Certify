import React, { useEffect, useRef } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { primaryColor } from "@/constants/Default";

interface ButtonLoadingProps {
  children?: React.ReactNode;
  onPress?: () => void;
  loading?: boolean;
  borderRadius?: number;
  height?: number;
  padding?: number;
  color?: string;
  backgroundColor?: string;
  loadingColor?: string;
  style?: StyleProp<ViewStyle>;
  innerComponent?: React.ReactNode;
}

const ButtonLoading: React.FC<ButtonLoadingProps> = ({
  children,
  onPress,
  loading = false,
  borderRadius = 10,
  height = 50,
  padding = 8,
  color = "#FFF",
  backgroundColor = primaryColor,
  loadingColor = "#FFF",
  style = {},
  innerComponent,
}) => {
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
    if (loading) {
      loop.start();
    } else {
      loop.stop();
    }
    return () => loop.stop(); // Limpeza no desmontar
  }, [loading]);

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
    } as TextStyle,
    loading: {
      position: "absolute",
      backgroundColor: loadingColor,
      width: 10,
      height: 10,
      borderRadius: 5,
    },
  });

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      disabled={loading} // Evita múltiplos cliques durante o loading
    >
      {loading ? (
        <>
          <Animated.View style={[styles.loading, { bottom: bounce1 }]} />
          <Animated.View
            style={[
              styles.loading,
              { transform: [{ translateX: 20 }], bottom: bounce2 },
            ]}
          />
          <Animated.View
            style={[
              styles.loading,
              {
                transform: [{ translateX: -20 }],
                bottom: bounce3,
              },
            ]}
          />
        </>
      ) : innerComponent ? (
        innerComponent
      ) : (
        <Text style={styles.textButton}>{children}</Text>
      )}
    </TouchableOpacity>
  );
};

export default ButtonLoading;
