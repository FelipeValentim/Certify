import { Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
export const useAdjustedScreenDimensions = () => {
  const insets = useSafeAreaInsets();

  const adjustedHeight = screenHeight - insets.top - insets.bottom;
  const adjustedWidth = screenWidth - insets.left - insets.right;

  return {
    adjustedHeight,
    adjustedWidth,
  };
};

export const httpStatus = {
  ok: 200,
  unauthorized: 401,
  conflict: 409,
};

export const primaryColor = "#7B55E0";
export const backgroundColor = "#F5F0FF";
export const redColor = "#dd2150";

const remote = {
  active: true,
  url: "https://certify-1wqq.onrender.com",
};
export const baseURL = remote.active
  ? remote.url
  : "https://simply-novel-shiner.ngrok-free.app";

export const screenHeight = Dimensions.get("window").height;
export const screenWidth = Dimensions.get("window").width;

export const routes = {
  home: "Início",
  event: "Evento",
  guest: "Convidado",
  newGuest: "Novo Convidado",
  newEvent: "Novo Evento",
  login: "Login",
  register: "Cadastrar",
};
