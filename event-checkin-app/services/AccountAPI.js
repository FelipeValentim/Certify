import api from "./configs/AxiosConfig";

export const AccountAPI = {
  login: async function (user, cancel = false) {
    return api.request({
      url: `/Account/Login`,
      method: "POST",
      data: user,
      signal: cancel
        ? cancelApiObject[this.login.name].handleRequestCancellation().signal
        : undefined,
    });
  },
};

// defining the cancel API object for ProductAPI
