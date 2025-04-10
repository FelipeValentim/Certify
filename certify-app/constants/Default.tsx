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

export const environment = process.env.NODE_ENV;

export const baseURL =
  environment == "development"
    ? "https://simply-novel-shiner.ngrok-free.app"
    : "https://certify-1wqq.onrender.com";

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
  newField: "Novo campo",
};

export enum FieldType {
  Text = 1,
  Number = 2,
  Date = 3,
  // Select = 4,
  // Radio = 5,
  // Checkbox = 6
}

export function TranslateFieldType(key: string): string {
  switch (key) {
    case "Text":
      return "Texto";
    case "Number":
      return "Número";
    case "Date":
      return "Data";
    // Adicione mais traduções conforme necessário
    default:
      return key;
  }
}
