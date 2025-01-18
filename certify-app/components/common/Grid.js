import React from "react";
import { View } from "react-native";

export const Col = ({ numRows, children, style = {} }) => {
  return (
    <View style={[styles[`${numRows}col`], { ...style }]}>{children}</View>
  );
};

export const Row = ({ children, style = {} }) => (
  <View style={[styles.row, { ...style }]}>{children}</View>
);

// Styles
const styles = {
  row: {
    flexDirection: "row",
  },
  "1col": {
    flex: 1,
  },
  "2col": {
    flex: 2,
  },
  "3col": {
    flex: 3,
  },
  "4col": {
    flex: 4,
  },
};

export default { Col, Row };
