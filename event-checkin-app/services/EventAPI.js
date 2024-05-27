import api from "./configs/AxiosConfig";
import { defineCancelApiObject } from "./configs/AxiosUtils";

export const EventAPI = {
  getAll: async function (cancel = false) {
    console.log(api.defaults.headers);
    return api.request({
      url: `/Event/GetEvents`,
      method: "GET",
      signal: cancel
        ? cancelApiObject[this.getAll.name].handleRequestCancellation().signal
        : undefined,
    });
  },
};

// defining the cancel API object for ProductAPI
const cancelApiObject = defineCancelApiObject(EventAPI);
