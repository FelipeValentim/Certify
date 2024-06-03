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
  checkin: async function (id, cancel = false) {
    return api.request({
      url: `/Guest/Checkin/${id}`,
      method: "PUT",
      signal: cancel
        ? cancelApiObject[this.checkin.name].handleRequestCancellation().signal
        : undefined,
    });
  },
  uncheckin: async function (id, cancel = false) {
    return api.request({
      url: `/Guest/Uncheckin/${id}`,
      method: "PUT",
      signal: cancel
        ? cancelApiObject[this.uncheckin.name].handleRequestCancellation()
            .signal
        : undefined,
    });
  },
  checkins: async function (ids, cancel = false) {
    return api.request({
      url: `/Guest/Checkin`,
      method: "PUT",
      data: ids,
      signal: cancel
        ? cancelApiObject[this.checkins.name].handleRequestCancellation().signal
        : undefined,
    });
  },
  uncheckins: async function (ids, cancel = false) {
    return api.request({
      url: `/Guest/Uncheckin`,
      method: "PUT",
      data: ids,
      signal: cancel
        ? cancelApiObject[this.uncheckin.name].handleRequestCancellation()
            .signal
        : undefined,
    });
  },
};

// defining the cancel API object for ProductAPI
const cancelApiObject = defineCancelApiObject(GuestAPI);
