import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, Pressable } from "react-native";
import { Camera, CameraView } from "expo-camera";
import {
  primaryColor,
  routes,
  screenHeight,
  screenWidth,
} from "@/constants/Default";
import { LinearGradient } from "expo-linear-gradient";

const FLASH_MODE = {
  on: 2,
  off: 1,
};

function EventScanner({ navigation, updateCheckin, updateUncheckin, guests }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [flashMode, setFlashMode] = useState(FLASH_MODE.off);

  const scannerAnim = useRef(new Animated.Value(0)).current;

  const toggleFlashMode = () => {
    setFlashMode(flashMode === FLASH_MODE.on ? FLASH_MODE.off : FLASH_MODE.on);
  };

  const sequence = Animated.sequence([
    Animated.timing(scannerAnim, {
      toValue: screenWidth / 2 - 80,
      duration: 1000,
      useNativeDriver: false,
    }),
    Animated.timing(scannerAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: false,
    }),
  ]);

  const loop = Animated.loop(sequence);

  const askPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === "granted");
  };

  useEffect(() => {
    (async () => {
      await askPermission();
    })();
    loop.start();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    const guest = guests.find((x) => x.id == data);
    navigation.navigate(routes.guest, {
      guest,
      updateCheckin,
      updateUncheckin,
    });
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text style={styles.noPermission}>Sem acesso a camera</Text>;
  }

  return (
    <View style={styles.cameraContainer}>
      {hasPermission ? (
        <>
          <CameraView
            onBarcodeScanned={handleBarCodeScanned}
            style={styles.camera}
            barCodeScannerSettings={{
              barCodeTypes: ["qr"],
            }}
          />

          <View style={styles.scannerContainer}>
            <View style={styles.scanner}>
              <Animated.View
                style={[
                  {
                    top: scannerAnim,
                  },
                ]}
              >
                <LinearGradient
                  style={styles.slider}
                  colors={["#7B55E077", "transparent"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                />
              </Animated.View>
            </View>
          </View>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  cameraContainer: {
    height: screenHeight,
    position: "relative",
  },
  camera: {
    flex: 1,
  },
  scannerContainer: {
    position: "absolute",
    height: screenHeight,
    width: screenWidth,
    flex: 1,
    display: "flex",
    justifyContent: "center",
  },
  scanner: {
    width: screenWidth / 2,
    height: screenWidth / 2,
    backgroundColor: "transparent",
    borderWidth: 3,
    borderColor: primaryColor,
    alignSelf: "center",
    borderRadius: 20,
  },
  slider: {
    width: screenWidth / 2,
    height: 80,
    borderRadius: 20,
  },
  noPermission: {
    fontFamily: "PoppinsRegular",
    fontSize: 24,
    fontWeight: "bold",
    alignSelf: "center",
    backgroundColor: primaryColor,
    padding: 10,
    borderRadius: 20,
    color: "#FFF",
    margin: 20,
  },
});

export default EventScanner;
