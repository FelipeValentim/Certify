import Header from "@/components/Header";
import Loading from "@/components/Loading";
import {
  primaryColor,
  screenHeight,
  screenWidth,
  backgroundColor,
} from "@/constants/Default";
import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";

import { BarChart } from "react-native-chart-kit";

const chartConfig = {
  // backgroundColor: "#e26a00",
  decimalPlaces: 0, // optional, defaults to 2dp
  backgroundGradientFromOpacity: 0,
  backgroundGradientToOpacity: 0,
  color: (opacity = 1) => `rgba(123, 85, 224, ${opacity})`, //123, 85, 224
};

const EventTab = ({ navigation, route, info, title }) => {
  return (
    <React.Fragment>
      <Header route={route} navigation={navigation} />
      <View style={styles.container}>
        {!info ? (
          <Loading color={primaryColor} size={24} />
        ) : (
          <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
            <View style={styles.event}>
              <Image
                style={styles.photo}
                source={{
                  uri: info.photo,
                }}
              />
              <Text style={styles.name}>{info.name}</Text>
              <Text style={styles.date}>{info.date}</Text>

              <BarChart
                withInnerLines={false}
                data={{
                  labels: ["Convidados", "Checkin", "Quebra"],
                  datasets: [
                    {
                      data: [
                        info.guestsCount,
                        info.checkinCount,
                        info.dropCount,
                      ],
                    },
                  ],
                }}
                width={screenWidth}
                height={280}
                chartConfig={chartConfig}
                verticalLabelRotation={0}
                fromZero
                showValuesOnTopOfBars
              />
            </View>
          </ScrollView>
        )}
      </View>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: backgroundColor,
    height: screenHeight,
  },
  event: {
    display: "flex",
    gap: 20,
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 20,
    margin: 20,
    borderRadius: 20,
  },
  photo: { width: 150, height: 150, borderRadius: 75 },
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
