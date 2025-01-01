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
import {
  Container,
  CustomScrollView,
  H1,
  H3,
  MutedText,
} from "@/components/CustomElements";
import CustomText from "@/components/CustomText";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { format } from "date-fns";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { toast } from "@/redux/snackBar";

function Guest({ route, navigation }) {
  const dispatch = useDispatch();
  const [guest] = useState(route.params?.guest);
  const { updateCheckin } = route.params;
  const [loading, setLoading] = useState(false);
  const checkin = async (id) => {
    try {
      if (!loading) {
        setLoading(true);
        await GuestAPI.checkin(id);
        dispatch(
          toast({ text: "Checkin realizado com sucesso", type: "sucess" })
        );
        updateCheckin([id]);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status == httpStatus.conflict) {
          dispatch(
            toast({
              text: "Já foi realizado checkin para este convidado",
              type: "warning",
            })
          );
          updateCheckin([id]);
        } else {
          console.log(response.data);
        }
      }
    } finally {
      navigation.goBack();
      setLoading(false);
    }
  };
  return (
    <Fragment>
      <Header route={route} navigation={navigation} />
      {!guest ? (
        <Loading color={primaryColor} size={24} />
      ) : (
        <CustomScrollView>
          <Container>
            <View style={styles.content}>
              <Image
                style={styles.photo}
                source={{
                  uri: guest.fullPhotoUrl,
                }}
              />
              <View style={{ alignItems: "center" }}>
                <H1>{guest.name}</H1>
                <MutedText style={styles.guestType}>
                  {guest.guestType.name}
                </MutedText>
                <MutedText>{guest.email}</MutedText>
              </View>
              {guest.checkinDate ? (
                <View
                  style={{
                    flexDirection: "row",
                    gap: 5,
                    alignItems: "center",
                  }}
                >
                  <FontAwesomeIcon icon={faClock} />
                  <Text>{format(guest.checkinDate, "dd/MM/yyyy HH:mm")}</Text>
                </View>
              ) : (
                <View
                  style={{
                    flexDirection: "row",
                    gap: 5,
                    alignItems: "center",
                  }}
                >
                  <FontAwesomeIcon icon={faSpinner} />
                  <Text>Pendente</Text>
                </View>
              )}
              <View style={styles.qrCode}>
                <QRCode
                  value={guest.id}
                  size={200}
                  logo={require("@/assets/images/icon.png")}
                />
              </View>

              {!guest.checkinDate && (
                <ButtonLoading
                  onPress={() => checkin(guest.id)}
                  loading={loading}
                  style={[styles.button]}
                >
                  Checkin
                </ButtonLoading>
              )}
            </View>
          </Container>
        </CustomScrollView>
      )}
    </Fragment>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: "center",
    flex: 1,
    gap: 10,
  },
  guestType: {
    fontSize: 20,
  },
  photo: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  qrCode: {
    padding: 20,
  },
  button: {
    width: 200,
  },
});

export default Guest;
