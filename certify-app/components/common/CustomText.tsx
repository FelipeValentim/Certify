import { Text, TextProps, StyleSheet, TextStyle } from "react-native";

interface CustomTextProps extends TextProps {
  style?: TextStyle;
}

const CustomText: React.FC<CustomTextProps> = ({
  children,
  style = {},
  ...props
}) => {
  return (
    <Text style={{ ...styles.text, ...style }} {...props}>
      {children}
    </Text>
  );
};

export default CustomText;

const styles = StyleSheet.create({
  text: {
    fontFamily: "PoppinsRegular",
  },
});
