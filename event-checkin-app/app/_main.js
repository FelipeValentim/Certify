import React from "react";
import LoginScreen from "./login";
import HomeScreen from "./home";
import EventScreen from "./event";
import RegisterScreen from "./register";
import NotFoundScreen from "./+not-found";
import { View, StyleSheet, Text } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import * as Font from "expo-font";
import { getToken } from "@/storage/AsyncStorage";
import { NavigationContainer } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  TransitionPresets,
} from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "@/redux/token";
import { SafeAreaView } from "react-native-safe-area-context";
import { SafeAreaProvider } from "react-native-safe-area-context";
import DismissKeyboard from "@/components/DismissKeyboard";
import Header from "@/components/Header";
import { routes } from "@/constants/Default";

SplashScreen.preventAutoHideAsync();
const Stack = createNativeStackNavigator();

const Main = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  const dispatch = useDispatch();
  const isSignedIn = useSelector((state) => state.token);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync({
          PoppinsRegular: require("../assets/fonts/Poppins-Regular.ttf"),
          PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
          PoppinsBlack: require("../assets/fonts/Poppins-Black.ttf"),
          PoppinsExtraBold: require("../assets/fonts/Poppins-ExtraBold.ttf"),
        });
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!

        // GET TOKEN
        const token = await getToken();
        if (token) {
          dispatch(signIn(token));
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    const hideSplashScreen = async () => {
      if (appIsReady) {
        await SplashScreen.hideAsync();
      }
    };

    hideSplashScreen();
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="home"
            screenOptions={{
              header: (props) => <Header {...props} />,
              headerStyle: {
                backgroundColor: "#7b55e0",
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontWeight: "bold",
              },
            }}
          >
            {isSignedIn ? (
              <>
                <Stack.Screen
                  name={routes.home}
                  options={{
                    title: "Início",
                  }}
                  component={HomeScreen}
                />
                <Stack.Screen
                  name={routes.event}
                  options={{
                    title: "Evento",
                  }}
                  component={EventScreen}
                />
              </>
            ) : (
              <Stack.Screen
                name={routes.login}
                options={{ headerShown: false, title: "login" }}
                component={LoginScreen}
              />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Main;
