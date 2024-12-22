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
import { Snackbar } from "react-native-paper";

function EventScanner({ navigation, updateCheckin, updateUncheckin, guests }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [visible, setVisible] = React.useState(false);

  const onDismissSnackBar = () => setVisible(false);
  const scannerAnim = useRef(new Animated.Value(0)).current;

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
    if (guest) {
      // Se o guest existir, navega para a tela de detalhes do guest
      navigation.navigate(routes.guest, {
        guest,
        updateCheckin,
        updateUncheckin,
      });
    } else {
      setVisible(true);
    }
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
      <Snackbar
        style={{ bottom: screenHeight / 8 }}
        visible={visible}
        duration={5000}
        onDismiss={onDismissSnackBar}
      >
        QRCode inválido para este evento
      </Snackbar>
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
    fontSize: 18,
    alignSelf: "center",
    backgroundColor: primaryColor,
    padding: 14,
    borderRadius: 6,
    color: "#FFF",
    margin: 20,
  },
});

export default EventScanner;
