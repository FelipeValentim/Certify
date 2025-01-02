import { StyleSheet, View } from "react-native";
import BounceLoading from "@/components/common/BounceLoading";

function Loading({ color, size = 10 }) {
  return (
    <View style={styles.container}>
      <BounceLoading color={color} size={size} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Loading;
