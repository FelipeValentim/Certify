import { primaryColor, routes } from "@/constants/Default";
import { signOut } from "@/redux/token";
import { removeToken } from "@/storage/SecurityStorage";
import { faChevronLeft, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";

const Header = ({
  navigation,
  title,
  route,
  component,
  rightButtonAction,
  rightButtonComponent,
}) => {
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
          <TouchableOpacity style={styles.btn} onPress={goBack}>
            <FontAwesomeIcon icon={faChevronLeft} size={18} color={"#FFF"} />
          </TouchableOpacity>
        ) : (
          // PLACEHOLDER - SIDEBAR
          <TouchableOpacity style={styles.btn} onPress={logout}>
            <FontAwesomeIcon icon={faPowerOff} size={18} color={"#FFF"} />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>{title ?? route.name}</Text>
        <TouchableOpacity
          style={{
            ...styles.btn,
            backgroundColor: rightButtonComponent && "#FFFFFF30",
          }}
          onPress={rightButtonAction}
        >
          {rightButtonComponent}
        </TouchableOpacity>
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
    flex: 4,
  },

  btn: {
    height: 40,
    width: 40,
    justifyContent: "center",
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFFFFF30",
  },
});

export default Header;
