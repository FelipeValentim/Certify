import { primaryColor, routes } from "@/constants/Default";
import { signOut } from "@/redux/token";
import { removeToken } from "@/storage/AsyncStorage";
import { faChevronLeft, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
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
        {navigation.canGoBack() ? (
          <TouchableOpacity style={styles.goBackButton} onPress={goBack}>
            <FontAwesomeIcon icon={faChevronLeft} size={18} color={"#FFF"} />
          </TouchableOpacity>
        ) : (
          // PLACEHOLDER - SIDEBAR
          <View style={styles.goBackButton}></View>
        )}
        <Text style={styles.title}>{title ?? route.name}</Text>
        {route.name == routes.home ? (
          <TouchableOpacity style={styles.signOutButton} onPress={logout}>
            <FontAwesomeIcon icon={faPowerOff} size={18} color={"#FFF"} />
          </TouchableOpacity>
        ) : (
          <View style={styles.signOutButton}></View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: primaryColor,
    height: 60,
  },
  innerContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
  },
  title: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "PoppinsRegular",
    textAlign: "center",
    flex: 1,
  },
  signOutButton: {
    padding: 30,
    alignItems: "center",
    width: 18,
  },
  goBackButton: {
    padding: 30,
    alignItems: "center",
    width: 18,
  },
});

export default Header;
