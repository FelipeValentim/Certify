import { Text, View, StyleSheet } from "react-native";
import { ScrollView } from "react-native";

export const H1 = ({ children, style = {} }) => {
  return <Text style={{ ...styles.h1, ...style }}>{children}</Text>;
};

export const H2 = ({ children, style = {} }) => {
  return <Text style={{ ...styles.h2, ...style }}>{children}</Text>;
};

export const H3 = ({ children, style = {} }) => {
  return <Text style={{ ...styles.h3, ...style }}>{children}</Text>;
};

export const H4 = ({ children, style = {} }) => {
  return <Text style={{ ...styles.h4, ...style }}>{children}</Text>;
};

export const H5 = ({ children, style = {} }) => {
  return <Text style={{ ...styles.h5, ...style }}>{children}</Text>;
};

export const Container = ({ children, style = {} }) => {
  return <View style={{ ...styles.container, ...style }}>{children}</View>;
};

export const CustomScrollView = ({ children, style = {} }) => {
  return (
    <ScrollView style={{ ...styles.scrollView, ...style }}>
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
    fontWeight: "bold",
    fontFamily: "PoppinsRegular",
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
});
