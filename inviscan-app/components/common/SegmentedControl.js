import React, { memo } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import CustomText from "./CustomText";

const SegmentedControl = ({
  options,
  selectedOption,
  onPress,
  height = 50,
  containerBorderRadius = 10,
  boxBorderRadius = 10,
  containerBackgroundColor = "#eee",
  boxBackgroundColor = "#fff",
  shadowColor = "black",
  width,
  innerComponent,
}) => {
  const { width: windowWidth } = useWindowDimensions();

  const internalPadding = 10;
  const segmentedControlWidth = width ?? windowWidth;

  const itemWidth = (segmentedControlWidth - internalPadding) / options.length;

  const rStyle = useAnimatedStyle(() => {
    return {
      left: withTiming(
        itemWidth * options.findIndex((x) => x.value === selectedOption.value) +
          internalPadding / 2
      ),
    };
  }, [selectedOption, options, itemWidth]);

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      height: height,
      backgroundColor: containerBackgroundColor,
      borderRadius: containerBorderRadius,
    },
    activeBox: {
      position: "absolute",
      borderRadius: boxBorderRadius,
      shadowColor: shadowColor,
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.1,
      elevation: 3,
      height: "80%",
      top: "10%",
      backgroundColor: boxBackgroundColor,
    },
    labelContainer: { justifyContent: "center", alignItems: "center" },
    label: {
      fontSize: 13,
    },
  });

  return (
    <View
      style={[
        styles.container,
        {
          width: segmentedControlWidth,
          paddingLeft: internalPadding / 2,
        },
      ]}
    >
      <Animated.View
        style={[
          {
            width: itemWidth,
          },
          rStyle,
          styles.activeBox,
        ]}
      />
      {options.map((option, index) => {
        return (
          <TouchableOpacity
            onPress={() => {
              onPress(option);
            }}
            key={option.value}
            style={[
              {
                width: itemWidth,
              },
              styles.labelContainer,
            ]}
          >
            {innerComponent ? (
              innerComponent(
                option,
                option.value == selectedOption.value,
                index
              )
            ) : (
              <CustomText style={styles.label}>{option.label}</CustomText>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export { SegmentedControl };
