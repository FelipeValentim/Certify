import React from "react";
import LoginScreen from "./login";
import RegisterScreen from "./register";
import HomeScreen from "./home";
import EventScreen from "./event";
import GuestScreen from "./guest";
import NewGuestScreen from "./newGuest";
import NewEventScreen from "./newEvent";
import NewFieldScreen from "./newField";

import * as Font from "expo-font";
import { getToken } from "@/storage/SecurityStorage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "@/redux/token";
import { close } from "@/redux/snackBar";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { routes } from "@/constants/Default";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CustomSnackBar from "@/components/common/CustomSnackBar";
import { Image, StatusBar, View, StyleSheet } from "react-native";
import BackgroundSplash from "../assets/images/splash-background.svg";
// SplashScreen.preventAutoHideAsync();
const Stack = createNativeStackNavigator();

const Main = () => {
  const isSignedIn = useSelector((state) => state.token);
  const [appIsReady, setAppIsReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState();
  const dispatch = useDispatch();
  const snackBar = useSelector((state) => state.snackBar);

  const onDismiss = () => {
    dispatch(close());
  };

  useEffect(() => {
    setInitialRoute(isSignedIn ? routes.home : routes.login);
  }, [isSignedIn]);

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

  if (!appIsReady) {
    return (
      <View style={styles.container}>
        <BackgroundSplash style={styles.background} />
        <Image
          style={styles.image}
          source={require("../assets/images/splash-icon.png")}
        />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName={initialRoute}
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
                  <Stack.Screen
                    name={routes.newField}
                    options={{
                      title: routes.newField,
                    }}
                    component={NewFieldScreen}
                  />
                  <Stack.Screen
                    name={routes.newEvent}
                    options={{
                      title: routes.newEvent,
                    }}
                    component={NewEventScreen}
                  />
                </>
              ) : (
                <>
                  <Stack.Screen
                    name={routes.login}
                    options={{ title: routes.login }}
                    component={LoginScreen}
                  />
                  <Stack.Screen
                    name={routes.register}
                    options={{ title: routes.register }}
                    component={RegisterScreen}
                  />
                </>
              )}
            </Stack.Navigator>
          </NavigationContainer>
          <CustomSnackBar
            visible={snackBar.visible}
            duration={5000}
            type={snackBar.type}
            onDismiss={onDismiss}
            message={snackBar.text}
          />
        </GestureHandlerRootView>
        <StatusBar translucent backgroundColor={"#000"} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    position: "absolute",
    height: "100%",
    width: "100%",
  },
  image: {
    width: 200,
    objectFit: "contain",
    position: "absolute",
  },
});

export default Main;
