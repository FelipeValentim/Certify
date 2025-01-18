import api from "./configs/AxiosConfig";
import { defineCancelApiObject } from "./configs/AxiosUtils";

export const GuestTypeAPI = {
  getAll: async function (cancel = false) {
    return api.request({
      url: `/GuestType/GetGuestTypes`,
      method: "GET",
      signal: cancel
        ? cancelApiObject[this.getAll.name].handleRequestCancellation().signal
        : undefined,
    });
  },
};

// defining the cancel API object for ProductAPI
const cancelApiObject = defineCancelApiObject(GuestTypeAPI);
