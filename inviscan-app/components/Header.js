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
      <View style={styles.innerContainer}>
        {navigation.canGoBack() && (
          <Pressable style={styles.goBackButton} onPress={goBack}>
            <MaterialCommunityIcons
              name="chevron-left"
              size={26}
              color={"#FFF"}
            />
          </Pressable>
        )}
        <Text style={styles.title}>{title ?? route.name}</Text>
        <Pressable style={styles.signOutButton} onPress={logout}>
          <MaterialCommunityIcons
            name="power-standby"
            size={26}
            color={"#FFF"}
          />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: primaryColor,
    height: 50,
  },
  innerContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 20,
  },
  title: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "PoppinsRegular",
    flex: 1,
    alignItems: "center",
  },
  signOutButton: {
    padding: 15,
    flex: 1,
    alignItems: "flex-end",
  },
  goBackButton: {
    padding: 15,
    flex: 1,
    alignItems: "flex-start",
  },
});

export default Header;
