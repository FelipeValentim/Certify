import { primaryColor } from "@/constants/Default";
import { signOut } from "@/redux/token";
import { removeToken } from "@/storage/AsyncStorage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useDispatch } from "react-redux";

const Header = (props) => {
  const dispatch = useDispatch();

  const logout = async () => {
    await removeToken();
    dispatch(signOut());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{props.options.title}</Text>
      <Pressable style={styles.signOutButton} onPress={logout}>
        <MaterialCommunityIcons name="logout" size={30} color={"#FFF"} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: primaryColor,
    height: 50,
    position: "relative",
  },
  title: {
    color: "#FFF",
    fontSize: 20,
    fontFamily: "PoppinsRegular",
    fontWeight: "bold",
    alignSelf: "center",
    position: "absolute",
    top: 10,
  },
  signOutButton: {
    padding: 10,
    right: 10,
    position: "absolute",
    top: 0,
    bottom: 0,
  },
});

export default Header;
