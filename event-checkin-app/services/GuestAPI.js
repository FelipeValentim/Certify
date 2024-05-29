import api from "./configs/AxiosConfig";
import { defineCancelApiObject } from "./configs/AxiosUtils";

export const GuestAPI = {
  getAll: async function (eventoId, cancel = false) {
    return api.request({
      url: `/Guest/GetGuests/${eventoId}`,
      method: "GET",
      signal: cancel
        ? cancelApiObject[this.getAll.name].handleRequestCancellation().signal
        : undefined,
    });
  },
};

// defining the cancel API object for ProductAPI
const cancelApiObject = defineCancelApiObject(GuestAPI);
