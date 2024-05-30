import { Dimensions } from "react-native";

export const httpStatus = {
  ok: 200,
  unauthorized: 401,
};

export const primaryColor = "#7B55E0";

export const baseURL = "https://36e9-187-111-4-76.ngrok-free.app/";

export const screenHeight = Dimensions.get("window").height;
export const screenWidth = Dimensions.get("window").width;

export const routes = {
  home: "home",
  event: "event",
  login: "login",
};
