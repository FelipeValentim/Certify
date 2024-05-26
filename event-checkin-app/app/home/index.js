import H1 from "@/components/H1";
import H2 from "@/components/H2";
import H3 from "@/components/H3";
import Input from "@/components/Input";
import InputPassword from "@/components/InputPassword";
import { primaryColor, screenHeight, screenWidth } from "@/constants/Default";
import React from "react";
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
import { AccountAPI } from "@/services/AccountAPI";
import { setToken } from "@/storage/AsyncStorage";

export default function Login() {
  const [user, setUser] = React.useState({ email: "", password: "" });
  const [errors, setErrors] = React.useState({
    email: undefined,
    password: undefined,
    invalidCredentials: undefined,
  });

  const login = async () => {
    if (!user.email || !user.password) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: !user.email ? "E-mail é obrigatório" : undefined,
        password: !user.password ? "Senha é obrigatória" : undefined,
      }));
    } else {
      try {
        const response = await AccountAPI.login(user);

        setToken(response.data);
      } catch (error) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          invalidCredentials: error.response?.data,
        }));
      }
      // console.log(response);
    }
  };

  React.useEffect(() => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      email: !user.email ? "E-mail é obrigatório" : undefined,
      password: !user.password ? "Senha é obrigatória" : undefined,
    }));
  }, [user]);

  return (
    <ImageBackground
      source={require("@/assets/images/background-login.svg")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text>Guests</Text>
      </View>
    </ImageBackground>
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
  backgroundImage: {
    width: screenWidth,
    height: screenHeight,
  },
});
