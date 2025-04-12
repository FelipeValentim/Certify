import React, { useEffect, useState, ReactNode } from "react";
import { Keyboard, View, ViewStyle, StyleProp } from "react-native";

type HideOnKeyboardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

const HideOnKeyboard: React.FC<HideOnKeyboardProps> = ({ children, style }) => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardVisible(true)
    );
    const hideSub = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardVisible(false)
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  if (keyboardVisible) return null;

  return <View style={style}>{children}</View>;
};

export default HideOnKeyboard;
