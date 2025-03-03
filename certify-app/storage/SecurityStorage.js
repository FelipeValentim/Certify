import * as SecureStore from "expo-secure-store";

const accessToken = "accessToken";

export const setToken = async (token) => {
  try {
    await SecureStore.setItemAsync(accessToken, token);
  } catch (error) {
    console.error("Erro ao salvar o token:", error);
  }
};

export const removeToken = async () => {
  try {
    await SecureStore.deleteItemAsync(accessToken);
  } catch (error) {
    console.error("Erro ao remover o token:", error);
  }
};

export const getToken = async () => {
  try {
    return await SecureStore.getItemAsync(accessToken);
  } catch (error) {
    console.error("Erro ao recuperar o token:", error);
    return null;
  }
};
