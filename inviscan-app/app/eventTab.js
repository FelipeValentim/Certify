import {
  Container,
  CustomScrollView,
} from "@/components/common/CustomElements";
import CustomText from "@/components/common/CustomText";
import Header from "@/components/common/Header";
import Loading from "@/components/common/Loading";
import { primaryColor, redColor } from "@/constants/Default";
import { faCalendar, faClock } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { format, parse } from "date-fns";
import React, { useState } from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import * as Clipboard from "expo-clipboard";
import { Ionicons } from "@expo/vector-icons";
import EventQRCode from "@/components/EventQRCode";
import { faQrcode } from "@fortawesome/free-solid-svg-icons";

const EventTab = ({ navigation, route, info, title }) => {
  const [visibleQRCode, setVisibleQRCode] = useState(false);

  const toggleInfo = () => {
    setVisibleQRCode(!visibleQRCode);
  };

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
      value: info?.pendingCount || 0,
      label: "Pendente",
      frontColor: redColor,
    },
  ];

  return (
    <React.Fragment>
      <Header
        route={route}
        navigation={navigation}
        rightButtonComponent={
          <FontAwesomeIcon icon={faQrcode} color="#FFF" size={18} />
        }
        rightButtonAction={toggleInfo}
      />
      {!info ? (
        <Loading color={primaryColor} size={24} />
      ) : (
        <>
          <EventQRCode
            toggle={toggleInfo}
            visible={visibleQRCode}
            qrCode={info.QRCode}
          />
          <CustomScrollView>
            <Container>
              <View style={styles.event}>
                <Image
                  style={styles.photo}
                  source={{
                    uri: info.photoFullUrl,
                  }}
                />
                <CustomText style={styles.name}>{info.name}</CustomText>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <FontAwesomeIcon icon={faCalendar} />
                  <CustomText>{format(info.date, "dd/MM/yyyy")}</CustomText>
                </View>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <FontAwesomeIcon icon={faClock} />
                  <CustomText>
                    {format(
                      parse(info.startTime, "HH:mm:ss", new Date()),
                      "HH:mm"
                    )}{" "}
                    até{" "}
                    {format(
                      parse(info.endTime, "HH:mm:ss", new Date()),
                      "HH:mm"
                    )}
                  </CustomText>
                </View>
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                  }}
                  onPress={async () =>
                    await Clipboard.setStringAsync(info.formURL)
                  }
                >
                  <CustomText numberOfLines={1}>{info.formURL}</CustomText>
                  <Ionicons name="clipboard-outline" color={"#000"} size={20} />
                </TouchableOpacity>

                <BarChart
                  data={barData}
                  barWidth={55}
                  noOfSections={4}
                  // isAnimated
                  barBorderTopLeftRadius={4}
                  barBorderTopRightRadius={4}
                  yAxisThickness={0}
                  xAxisThickness={0}
                  showValuesOnTopOfBars
                  showValuesAsTopLabel
                />
              </View>
            </Container>
          </CustomScrollView>
        </>
      )}
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  event: {
    display: "flex",
    gap: 20,
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 20,
  },
  photo: { width: 150, height: 150, borderRadius: 45 },
  name: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  date: {
    fontSize: 16,
    color: "#fff",
    backgroundColor: primaryColor,
    padding: 12,
    borderRadius: 6,
  },
});

export default EventTab;
