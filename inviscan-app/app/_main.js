import React from "react";
import LoginScreen from "./login";
import HomeScreen from "./home";
import EventScreen from "./event";
import GuestScreen from "./guest";
import NewGuestScreen from "./newGuest";

import * as Font from "expo-font";
import { getToken } from "@/storage/AsyncStorage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "@/redux/token";
import { close } from "@/redux/snackBar";
import { SafeAreaView } from "react-native-safe-area-context";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { routes } from "@/constants/Default";
import api from "@/services/configs/AxiosConfig";
import { Snackbar } from "react-native-paper";

SplashScreen.preventAutoHideAsync();
const Stack = createNativeStackNavigator();

const Main = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  const dispatch = useDispatch();
  const isSignedIn = useSelector((state) => state.token);
  const snackBar = useSelector((state) => state.snackBar);

  const onDismiss = () => {
    dispatch(close());
  };

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
              headerShown: false,
            }}
          >
            {isSignedIn ? (
              <>
                <Stack.Screen
                  name={routes.home}
                  options={{
                    title: routes.home,
                  }}
                  component={HomeScreen}
                />
                <Stack.Screen
                  name={routes.event}
                  options={{
                    title: routes.event,
                  }}
                  component={EventScreen}
                />
                <Stack.Screen
                  name={routes.guest}
                  options={{
                    title: routes.guest,
                  }}
                  component={GuestScreen}
                />
                <Stack.Screen
                  name={routes.newGuest}
                  options={{
                    title: routes.newGuest,
                  }}
                  component={NewGuestScreen}
                />
              </>
            ) : (
              <Stack.Screen
                name={routes.login}
                options={{ title: routes.login }}
                component={LoginScreen}
              />
            )}
          </Stack.Navigator>
        </NavigationContainer>
        <Snackbar
          visible={snackBar.visible}
          duration={5000}
          onDismiss={onDismiss}
        >
          {snackBar.text}
        </Snackbar>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Main;
