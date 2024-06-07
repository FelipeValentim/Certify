import ButtonLoading from "@/components/ButtonLoading";
import Loading from "@/components/Loading";
import {
  backgroundColor,
  httpStatus,
  primaryColor,
  screenHeight,
} from "@/constants/Default";
import { GuestAPI } from "@/services/GuestAPI";
import React, { Fragment, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Image } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { getCurrentDateFormatted } from "@/helper/date";
import Header from "@/components/Header";

function Guest({ route, navigation }) {
  const [guest, setGuest] = useState(route.params?.guest);
  const { updateCheckin, updateUncheckin } = route.params;
  const [loading, setLoading] = useState(false);

  const checkin = async (id) => {
    try {
      if (!loading) {
        setLoading(true);
        await GuestAPI.checkin(id);
        setGuest({ ...guest, checkin: getCurrentDateFormatted() });
        updateCheckin([id]);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status == httpStatus.conflict) {
          setGuest({ ...guest, checkin: getCurrentDateFormatted() });
          updateCheckin([id]);
        } else {
          console.log(response.data);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <Header route={route} navigation={navigation} />
      <View style={styles.container}>
        {!guest ? (
          <Loading color={primaryColor} size={24} />
        ) : (
          <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
            <View style={styles.card}>
              <Image
                style={styles.photo}
                source={{
                  uri: guest.photo,
                }}
              />
              <Text style={styles.name}>{guest.name}</Text>
              {guest.checkin && (
                <Text style={styles.checkin}>Checkin: {guest.checkin}</Text>
              )}
              <View style={styles.qrCode}>
                <QRCode
                  value={guest.id}
                  size={200}
                  logo={require("@/assets/images/icon.png")}
                />
              </View>

              {!guest.checkin && (
                <ButtonLoading
                  onPress={() => checkin(guest.id)}
                  loading={loading}
                  style={[styles.button]}
                >
                  Checkin
                </ButtonLoading>
              )}
            </View>
          </ScrollView>
        )}
      </View>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: backgroundColor,
    height: screenHeight,
  },
  card: {
    backgroundColor: "#FFF",
    margin: 10,
    borderRadius: 20,
    padding: 30,
    display: "flex",
    alignItems: "center",
    gap: 50,
  },
  name: {
    fontSize: 28,
    fontFamily: "PoppinsRegular",
    fontWeight: "bold",
  },
  photo: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  qrCode: {
    borderWidth: 3,
    borderColor: backgroundColor,
    padding: 10,
    borderRadius: 20,
  },
  checkin: {
    fontSize: 14,
    fontFamily: "PoppinsRegular",
    backgroundColor: primaryColor,
    padding: 10,
    borderRadius: 10,
    color: "#FFF",
  },
  button: {
    width: 200,
  },
});

export default Guest;
