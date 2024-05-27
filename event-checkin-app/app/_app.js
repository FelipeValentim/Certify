import React from "react";
import LoginScreen from "./login";
import HomeScreen from "./home";
import RegisterScreen from "./register";
import NotFoundScreen from "./+not-found";
import { View, StyleSheet } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import * as Font from "expo-font";
import { getToken } from "@/storage/AsyncStorage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "@/redux/isSignedIn";

SplashScreen.preventAutoHideAsync();
const Stack = createNativeStackNavigator();

const App = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  const dispatch = useDispatch();
  const isSignedIn = useSelector((state) => state.isSignedIn);

  useEffect(() => {
    const login = async () => {
      const token = await getToken();
      if (token) {
        dispatch(signIn());
      }
    };
    login();
  }, []);

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
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={styles.root} onLayout={onLayoutRootView}>
      <Stack.Navigator>
        {isSignedIn ? (
          <Stack.Screen
            name="home"
            options={{ headerShown: false, title: "home" }}
            component={HomeScreen}
          />
        ) : (
          <>
            <Stack.Screen
              name="login"
              options={{ headerShown: false, title: "login" }}
              component={LoginScreen}
            />
            <Stack.Screen
              name="register"
              options={{ headerShown: false, title: "register" }}
              component={RegisterScreen}
            />
          </>
        )}

        <Stack.Screen name="+not-found" component={NotFoundScreen} />
      </Stack.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    fontFamily: "PoppinsRegular",
    backgroundColor: "#FFF",
  },
});

export default App;
