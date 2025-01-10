import React from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";

interface TextProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

interface ViewProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

interface ScrollViewProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export const H1: React.FC<TextProps> = ({ children, style = {} }) => {
  return <Text style={[styles.h1, style]}>{children}</Text>;
};

export const H2: React.FC<TextProps> = ({ children, style = {} }) => {
  return <Text style={[styles.h2, style]}>{children}</Text>;
};

export const H3: React.FC<TextProps> = ({ children, style = {} }) => {
  return <Text style={[styles.h3, style]}>{children}</Text>;
};

export const H4: React.FC<TextProps> = ({ children, style = {} }) => {
  return <Text style={[styles.h4, style]}>{children}</Text>;
};

export const H5: React.FC<TextProps> = ({ children, style = {} }) => {
  return <Text style={[styles.h5, style]}>{children}</Text>;
};

export const MutedText: React.FC<TextProps> = ({ children, style = {} }) => {
  return <Text style={[styles.muted, style]}>{children}</Text>;
};

export const Container: React.FC<ViewProps> = ({ children, style = {} }) => {
  return <View style={[styles.container, style]}>{children}</View>;
};

export const CustomScrollView: React.FC<ScrollViewProps> = ({
  children,
  contentContainerStyle,
  style = {},
}) => {
  return (
    <ScrollView
      style={[styles.scrollView, style]}
      contentContainerStyle={contentContainerStyle}
    >
      {children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#FFF",
  },
  container: {
    backgroundColor: "#FFF",
    flex: 1,
  },
  h1: {
    fontWeight: "bold",
    fontSize: 34,
    fontFamily: "PoppinsBold",
  },
  h2: {
    fontSize: 24,
    fontWeight: "bold",
  },
  h3: {
    fontSize: 18,
    fontFamily: "PoppinsBold",
  },
  h4: {
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "PoppinsRegular",
  },
  h5: {
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "PoppinsRegular",
  },
  muted: {
    fontSize: 15,
    color: "#aaa",
    textAlign: "center",
  },
});
