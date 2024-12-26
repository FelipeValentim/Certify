import { Container } from "@/components/CustomElements";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { primaryColor } from "@/constants/Default";
import { format, parse } from "date-fns";
import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { BarChart } from "react-native-gifted-charts";

const EventTab = ({ navigation, route, info, title }) => {
  const barData = [
    {
      value: info?.guestsCount || 0,
      label: "Convidados",
      frontColor: "#187498",
    },
    {
      value: info?.checkinCount || 0,
      label: "Checkin",
      frontColor: "#36AE7C",
    },
    {
      value: info?.dropCount || 0,
      label: "Quebra",
      frontColor: "#EB5353",
    },
  ];

  return (
    <React.Fragment>
      <Header route={route} navigation={navigation} />
      {!info ? (
        <Loading color={primaryColor} size={24} />
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
          <Container style={styles.container}>
            <View style={styles.event}>
              <Image
                style={styles.photo}
                source={{
                  uri: info.photo,
                }}
              />
              <Text style={styles.name}>{info.name}</Text>
              <Text>{format(info.date, "dd/MM/yyyy")}</Text>
              <Text>
                {format(parse(info.startTime, "HH:mm:ss", new Date()), "HH:mm")}{" "}
                até{" "}
                {format(parse(info.endTime, "HH:mm:ss", new Date()), "HH:mm")}
              </Text>
              <BarChart
                data={barData}
                barWidth={55}
                noOfSections={4}
                isAnimated
                barBorderTopLeftRadius={4}
                barBorderTopRightRadius={4}
                yAxisThickness={0}
                xAxisThickness={0}
                showValuesOnTopOfBars
                showValuesAsTopLabel
              />
            </View>
          </Container>
        </ScrollView>
      )}
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {},
  event: {
    display: "flex",
    gap: 20,
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 20,
    margin: 20,
    borderRadius: 20,
  },
  photo: { width: 150, height: 150, borderRadius: 45 },
  name: {
    fontFamily: "PoppinsRegular",
    fontSize: 32,
    fontWeight: "bold",
  },
  date: {
    fontFamily: "PoppinsRegular",
    fontSize: 16,
    color: "#fff",
    backgroundColor: primaryColor,
    padding: 12,
    borderRadius: 6,
  },
});

export default EventTab;
