import { Dimensions } from "react-native";

export const httpStatus = {
  ok: 200,
  unauthorized: 401,
  conflict: 409,
};

export const primaryColor = "#7B55E0";
export const backgroundColor = "#F5F0FF";
export const redColor = "#EE4E4E";

export const baseURL = "https://6f6d-187-111-4-76.ngrok-free.app";

export const screenHeight = Dimensions.get("window").height;
export const screenWidth = Dimensions.get("window").width;

export const routes = {
  home: "Início",
  event: "Evento",
  guest: "Convidado",
  login: "Login",
};
