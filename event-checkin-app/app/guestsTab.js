import Loading from "@/components/Loading";
import { primaryColor, routes } from "@/constants/Default";
import { GuestAPI } from "@/services/GuestAPI";
import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Image,
} from "react-native";

function GuestsTab({ updateUncheckin, updateCheckin, guests, navigation }) {
  return !guests ? (
    <Loading color={primaryColor} size={36} />
  ) : (
    <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
      {guests.map((guest) => (
        <Pressable
          key={guest.id}
          onPress={() => {
            navigation.navigate(routes.guest, {
              guest,
              updateCheckin,
              updateUncheckin,
            });
          }}
        >
          <View style={styles.card}>
            <View style={styles.guest}>
              <Image
                style={styles.photo}
                source={{
                  uri: guest.photo,
                }}
              />
              <Text style={styles.name}>{guest.name}</Text>
              {guest.checkin ? (
                <Text style={styles.checkin}>checkin</Text>
              ) : (
                <Text style={styles.notCheckin}>checkin</Text>
              )}
            </View>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    margin: 10,
    borderRadius: 20,
  },
  guest: {
    padding: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  name: {
    fontSize: 16,
    fontFamily: "PoppinsRegular",
    fontWeight: "bold",
    flex: 1,
  },
  photo: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  checkin: {
    fontSize: 12,
    fontFamily: "PoppinsRegular",
    backgroundColor: primaryColor,
    padding: 5,
    borderRadius: 10,
    color: "#FFF",
  },
  notCheckin: {
    fontSize: 12,
    fontFamily: "PoppinsRegular",
    backgroundColor: "#ccc",
    padding: 5,
    borderRadius: 10,
    color: "#FFF",
  },
});

export default GuestsTab;
