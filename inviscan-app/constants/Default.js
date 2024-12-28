import { Dimensions } from "react-native";

export const httpStatus = {
  ok: 200,
  unauthorized: 401,
  conflict: 409,
};

export const primaryColor = "#7B55E0";
export const backgroundColor = "#F5F0FF";
export const redColor = "#dd2150";

export const remote = {
  active: true,
  url: "https://simply-novel-shiner.ngrok-free.app",
};
export const baseURL = remote.active ? remote.url : "https://localhost:7093";

export const screenHeight = Dimensions.get("window").height;
export const screenWidth = Dimensions.get("window").width;

export const routes = {
  home: "Início",
  event: "Evento",
  guest: "Convidado",
  newGuest: "Novo Convidado",
  newEvent: "Novo Evento",
  login: "Login",
};
