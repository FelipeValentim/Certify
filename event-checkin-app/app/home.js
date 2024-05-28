import H1 from "@/components/H1";
import H2 from "@/components/H2";
import H3 from "@/components/H3";
import Input from "@/components/Input";
import InputPassword from "@/components/InputPassword";
import { primaryColor, screenHeight, screenWidth } from "@/constants/Default";
import React, { useEffect, useState } from "react";
import {
  Animated,
  StyleSheet,
  View,
  TextInput,
  Text,
  Dimensions,
  Button,
  Pressable,
  ImageBackground,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { EventAPI } from "@/services/EventAPI";
import { removeToken } from "@/storage/AsyncStorage";
import { useDispatch, useSelector } from "react-redux";
import api from "@/services/configs/AxiosConfig";
import { signOut } from "@/redux/token";

export default function HomeScreen() {
  const [events, setEvents] = useState();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);

  const logout = async () => {
    await removeToken();
    dispatch(signOut());
  };

  useEffect(() => {
    const getEvents = async () => {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      const response = await api.get("/event/getevents");
      console.log(response);
      setEvents(response.data);
    };
    getEvents();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Guests</Text>
      <Pressable onPress={() => logout()}>
        <MaterialCommunityIcons name="light-switch" size={100} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: screenHeight,
    padding: 16,
    display: "flex",
    gap: 32,
    justifyContent: "center",
    alignContent: "center",
  },
});
