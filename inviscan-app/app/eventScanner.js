import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, Pressable } from "react-native";
import { Camera, CameraView } from "expo-camera";
import {
  primaryColor,
  routes,
  screenHeight,
  screenWidth,
} from "@/constants/Default";
import { Snackbar } from "react-native-paper";
import { Container, H2, H3, H4, MutedText } from "@/components/CustomElements";
import AccessDenied from "@/assets/images/undraw_access-denied.svg";
import { TouchableOpacity } from "react-native-gesture-handler";

const borderThickness = 7;

function EventScanner({ navigation, updateCheckin, updateUncheckin, guests }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [visible, setVisible] = React.useState(false);
  const [scannerBounds, setScannerBounds] = useState(null);

  const onDismissSnackBar = () => setVisible(false);

  const lineAnim = useRef(new Animated.Value(screenWidth / 10)).current;

  const requestPermission = async () => {
    const { status } = await Camera.getCameraPermissionsAsync();
    setHasPermission(status === "granted");
  };

  useEffect(() => {
    (async () => {
      await requestPermission();
    })();

    // Animar as linhas expandindo e voltando
    Animated.loop(
      Animated.sequence([
        Animated.timing(lineAnim, {
          toValue: screenWidth / 7,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(lineAnim, {
          toValue: screenWidth / 10,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const handleBarCodeScanned = ({ boundingBox, data }) => {
    const { origin, size } = boundingBox;
    const codeX = origin.x;
    const codeY = origin.y;
    const codeWidth = size.width;
    const codeHeight = size.height;

    if (scannerBounds) {
      const isWithinScannerArea =
        codeX >= scannerBounds.x &&
        codeY <= scannerBounds.y &&
        codeX + codeWidth >= scannerBounds.x + scannerBounds.width &&
        codeY + codeHeight <= scannerBounds.y + scannerBounds.height;

      if (isWithinScannerArea) {
        const guest = guests.find((x) => x.id == data);
        if (guest) {
          navigation.navigate(routes.guest, {
            guest,
            updateCheckin,
            updateUncheckin,
          });
        } else {
          setVisible(true);
        }
      }
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return (
      <Container style={styles.noPermissionContainer}>
        <AccessDenied height={screenHeight / 4} />
        <H3>Permissão Necessária</H3>
        <MutedText>
          Para usar o leitor de QR Code, o aplicativo precisa de acesso à
          câmera.
        </MutedText>
        <MutedText>
          Acesse as configurações do seu dispositivo e permita o acesso à câmera
          para continuar.
        </MutedText>
      </Container>
    );
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
            <View
              style={styles.scanner}
              onLayout={(event) => {
                const { layout } = event.nativeEvent;
                setScannerBounds({
                  x: layout.x,
                  y: layout.y,
                  width: layout.width,
                  height: layout.height,
                });
              }}
            >
              {/* Linha superior esquerda */}
              <Animated.View
                style={[styles.line, styles.topLeftRight, { width: lineAnim }]}
              />
              <Animated.View
                style={[
                  styles.line,
                  styles.topLeftBottom,
                  { height: lineAnim },
                ]}
              />
              {/* Linha superior direita */}
              <Animated.View
                style={[styles.line, styles.topRightLeft, { width: lineAnim }]}
              />
              <Animated.View
                style={[
                  styles.line,
                  styles.topRightBottom,
                  { height: lineAnim },
                ]}
              />

              {/* Linha inferior Esquerda */}
              <Animated.View
                style={[
                  styles.line,
                  styles.bottomLeftRight,
                  { width: lineAnim },
                ]}
              />
              <Animated.View
                style={[
                  styles.line,
                  styles.bottomLeftTop,
                  { height: lineAnim },
                ]}
              />
              {/* Linha inferior Direita */}
              <Animated.View
                style={[
                  styles.line,
                  styles.bottomRightLeft,
                  { width: lineAnim },
                ]}
              />
              <Animated.View
                style={[
                  styles.line,
                  styles.bottomRightTop,
                  { height: lineAnim },
                ]}
              />
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
    width: screenWidth / 1.5,
    height: screenWidth / 1.5,
    position: "relative",
    alignSelf: "center",
  },
  line: {
    position: "absolute",
    backgroundColor: primaryColor,
    borderRadius: 100, // Aumente para valores maiores para deixar bem curvado
  },
  topLeftRight: {
    top: 0,
    height: borderThickness,
    left: 0,
  },
  topLeftBottom: {
    left: 0,
    width: borderThickness,
    top: 0,
  },
  topRightLeft: {
    right: 0,
    height: borderThickness,
    top: 0,
  },
  topRightBottom: {
    right: 0,
    width: borderThickness,
    top: 0,
  },
  bottomLeftRight: {
    bottom: 0,
    height: borderThickness,
    left: 0,
  },
  bottomLeftTop: {
    bottom: 0,
    width: borderThickness,
    left: 0,
  },
  bottomRightLeft: {
    bottom: 0,
    height: borderThickness,
    right: 0,
  },
  bottomRightTop: {
    bottom: 0,
    width: borderThickness,
    right: 0,
  },
  noPermissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    gap: 20,
  },
});

export default EventScanner;
