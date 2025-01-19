import ButtonLoading from "@/components/common/ButtonLoading";
import {
  Container,
  CustomScrollView,
  H1,
  H3,
} from "@/components/common/CustomElements";

import { Input, InputPassword } from "@/components/common/CustomInput";
import { primaryColor, screenHeight, screenWidth } from "@/constants/Default";
import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ImageBackground,
} from "react-native";

export default function RegisterScreen() {
  const [user, setUser] = React.useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  return (
    <ImageBackground
      source={require("@/assets/images/background-login.png")}
      style={styles.backgroundImage}
    >
      <CustomScrollView
        style={{ backgroundColor: "transparent" }}
        contentContainerStyle={{
          flex: 1,
        }}
      >
        <Container style={styles.container}>
          <View>
            <H1 style={styles.h1}>Olá</H1>
            <H3 style={styles.h2}>Faça o registro</H3>
          </View>

          <View>
            <Input
              value={user.name}
              onChangeText={(text) => setUser({ ...user, name: text })}
              placeholder="Nome"
            ></Input>
            <Input
              value={user.email}
              onChangeText={(text) => setUser({ ...user, name: text })}
              placeholder="Email"
            ></Input>
            <InputPassword
              value={user.password}
              onChangeText={(text) => setUser({ ...user, password: text })}
              placeholder="Senha"
            ></InputPassword>
            <InputPassword
              value={user.password}
              onChangeText={(text) => setUser({ ...user, password: text })}
              placeholder="Senha"
            ></InputPassword>
          </View>

          <ButtonLoading>Cadastrar</ButtonLoading>
        </Container>
      </CustomScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    padding: 16,
    display: "flex",
    gap: 32,
    justifyContent: "center",
  },
  h1: {
    alignSelf: "center",
  },
  h2: {
    alignSelf: "center",
    fontWeight: "normal",
  },
  backgroundImage: {
    width: screenWidth,
    height: screenHeight,
  },
});
