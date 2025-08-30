import { H1, H3, H4 } from "@/components/common/CustomElements";
import { Input, InputPassword } from "@/components/common/CustomInput";
import {
  backgroundColor,
  primaryColor,
  routes,
  screenHeight,
  screenWidth,
} from "@/constants/Default";
import React from "react";
import {
  StyleSheet,
  View,
  ImageBackground,
  TouchableOpacity,
  Pressable,
  Text,
} from "react-native";
import { AccountAPI } from "@/services/AccountAPI";
import { setToken } from "@/storage/SecurityStorage";

import { useDispatch } from "react-redux";
import ButtonLoading from "@/components/common/ButtonLoading";
import { signIn } from "@/redux/token";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faQrcode } from "@fortawesome/free-solid-svg-icons";

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();

  const [user, setUser] = React.useState({ email: "", password: "" });
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState({
    email: undefined,
    password: undefined,
    invalidCredentials: undefined,
  });

  const setEmail = (value) => {
    if (value) {
      setErrors({ ...errors, email: undefined });
      setUser({ ...user, email: value });
    } else {
      setErrors({ ...errors, email: "E-mail inválido" });
      setUser({ ...user, email: "" });
    }
  };

  const setPassword = (value) => {
    if (value) {
      setErrors({ ...errors, password: undefined });
      setUser({ ...user, password: value });
    } else {
      setErrors({ ...errors, password: "Senha inválido" });
      setUser({ ...user, password: "" });
    }
  };

  const login = async () => {
    if (!loading) {
      setLoading(true);

      if (!user.email || !user.password) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: !user.email ? "E-mail é obrigatório" : undefined,
          password: !user.password ? "Senha é obrigatória" : undefined,
        }));
      } else {
        try {
          const response = await AccountAPI.login(user);

          await setToken(response.data);
          dispatch(signIn(response.data));
        } catch (error) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            invalidCredentials: error.response?.data,
          }));
        } finally {
          setLoading(false);
        }
      }
    }
  };

  const loginDemo = async () => {
    if (!loading) {
      setLoading(true);

      try {
        const response = await AccountAPI.loginDemo();

        await setToken(response.data);
        dispatch(signIn(response.data));
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    // <DismissKeyboard>
    <View>
      <ImageBackground
        source={require("@/assets/images/background-login.png")}
        style={styles.backgroundImage}
      >
        <View style={styles.container}>
          <FontAwesomeIcon
            icon={faQrcode}
            style={styles.qrCode}
            size={90}
            color={"#000"}
          />
          <View style={{ alignItems: "center" }}>
            <H1>Bem-vindo</H1>
            <H3 style={{ fontFamily: "PoppinsRegular" }}>Entre na sua conta</H3>
          </View>

          <View>
            <Input
              value={user.email}
              onChangeText={(text) => setEmail(text)}
              placeholder="Email"
              error={errors.email}
            ></Input>
            <InputPassword
              value={user.password}
              onChangeText={(text) => setPassword(text)}
              placeholder="Senha"
              error={errors.password}
            ></InputPassword>
          </View>
          <ButtonLoading loading={loading} onPress={login}>
            Login
          </ButtonLoading>
          {/* <ButtonLoading loading={loading} onPress={loginDemo}>
            Demo
          </ButtonLoading> */}
          {/* <H4 style={{ textAlign: "center", ...styles.shadowText }}>
            Não tem conta?{" "}
            <H4
              onPress={() => navigation.navigate(routes.register)}
              style={{ color: primaryColor }}
            >
              Cadastre-se
            </H4>
          </H4> */}
        </View>
      </ImageBackground>
    </View>
    // </DismissKeyboard>
  );
}

const styles = StyleSheet.create({
  container: {
    height: screenHeight,
    padding: 16,
    gap: 32,
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: "transparent",
  },
  backgroundImage: {
    width: screenWidth,
    height: screenHeight,
    backgroundColor: "#FFF",
  },
  register: {
    color: primaryColor,
  },
  qrCode: {
    alignSelf: "center",
  },
  shadowText: {
    textShadowColor: "#fff", // Cor da sombra mais clara
    textShadowOffset: { width: 1, height: 1 }, // Deslocamento menor
    textShadowRadius: 2, // Raio de desfoque menor
  },
});
