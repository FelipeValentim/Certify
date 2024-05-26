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

interface User {
  userName: string;
  password: string;
}

export default function Login() {
  const [name, setName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [user, setUser] = React.useState<User>({ userName: "", password: "" });
  return (
    <ImageBackground
      source={require("@/assets/images/background-login.svg")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View>
          <H1 style={styles.h1}>Olá</H1>
          <H3 style={styles.h2}>Entre na sua conta</H3>
        </View>

        <View>
          <Input
            value={user.userName}
            onChangeText={(text) => setUser({ ...user, userName: text })}
            placeholder="Nome"
          ></Input>
          <InputPassword
            value={user.password}
            onChangeText={(text) => setUser({ ...user, password: text })}
            placeholder="Senha"
          ></InputPassword>
        </View>

        <Pressable style={styles.button} onPress={() => console.log("clicou")}>
          <Text style={styles.textButton}>Login</Text>
        </Pressable>

        <H3 style={styles.h3}>
          Não tem conta?{" "}
          <Text
            style={styles.register}
            onPress={() => navigation.navigate("register")}
          >
            Faça uma!
          </Text>
        </H3>
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
  h1: {
    alignSelf: "center",
  },
  h2: {
    alignSelf: "center",
    fontWeight: "normal",
  },
  h3: {
    alignSelf: "center",
    fontWeight: "normal",
  },
  button: {
    backgroundColor: primaryColor,
    borderRadius: 32,
    padding: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  textButton: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  backgroundImage: {
    width: screenWidth,
    height: screenHeight,
  },
  register: {
    color: primaryColor,
  },
});
