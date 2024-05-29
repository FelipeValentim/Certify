import { primaryColor, screenHeight, screenWidth } from "@/constants/Default";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
import api from "@/services/configs/AxiosConfig";
import { useSelector } from "react-redux";

export default function EventScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
        <Text>dsadjksa</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F0FF",
    height: screenHeight,
  },
});
