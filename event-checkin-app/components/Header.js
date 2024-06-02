import { primaryColor } from "@/constants/Default";
import { signOut } from "@/redux/token";
import { removeToken } from "@/storage/AsyncStorage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useDispatch } from "react-redux";

const Header = ({ navigation, title, route, component }) => {
  const dispatch = useDispatch();
  const logout = async () => {
    await removeToken();
    dispatch(signOut());
  };

  const goBack = async () => {
    navigation.goBack();
  };

  return component ? (
    component
  ) : (
    <View style={styles.container}>
      {navigation.canGoBack() && (
        <Pressable style={styles.goBackButton} onPress={goBack}>
          <MaterialCommunityIcons
            name="chevron-left"
            size={30}
            color={"#FFF"}
          />
        </Pressable>
      )}
      <Text style={styles.title}>{title ?? route.name}</Text>
      <Pressable style={styles.signOutButton} onPress={logout}>
        <MaterialCommunityIcons name="power-standby" size={30} color={"#FFF"} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: primaryColor,
    height: 60,
    position: "relative",
  },
  title: {
    color: "#FFF",
    fontSize: 20,
    fontFamily: "PoppinsRegular",
    fontWeight: "bold",
    alignSelf: "center",
    position: "absolute",
    top: 15,
  },
  signOutButton: {
    padding: 10,
    right: 10,
    position: "absolute",
    top: 5,
  },
  goBackButton: {
    padding: 10,
    left: 10,
    position: "absolute",
    top: 5,
  },
});

export default Header;
