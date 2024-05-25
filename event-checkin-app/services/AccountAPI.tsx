import { AxiosResponse } from "axios";
import api from "./configs/AxiosConfig";

export const AccountAPI = {
  login: async function (user, cancel = false): Promise<AxiosResponse> {
    return api.request({
      url: `/Account/Login`,
      method: "POST",
      data: user,
    });
  },
};

// defining the cancel API object for ProductAPI
