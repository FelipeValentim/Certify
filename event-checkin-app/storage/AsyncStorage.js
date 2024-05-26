import AsyncStorage from "@react-native-async-storage/async-storage";

export const setToken = async (token) => {
  await AsyncStorage.setItem("accessToken", token);
};

export const removeToken = async (token) => {
  await AsyncStorage.removeItem("accessToken");
};

export const getToken = async () => {
  return await AsyncStorage.getItem("accessToken");
};
