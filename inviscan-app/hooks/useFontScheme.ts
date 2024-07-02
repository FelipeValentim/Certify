import * as Font from "expo-font";

const useFontScheme = async () => {
  await Font.loadAsync({
    limelight: require("../assets/fonts/Ubuntu-Regular.ttf"),
    indie: require("../assets/fonts/Ubuntu-BoldItalic.ttf"),
  });
};

export default useFontScheme;
