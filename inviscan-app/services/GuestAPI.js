import api from "./configs/AxiosConfig";
import { defineCancelApiObject } from "./configs/AxiosUtils";

export const GuestAPI = {
  newGuest: async function (guest, cancel = false) {
    return api.request({
      url: `/Guest/NewGuest`,
      method: "POST",
      data: { ...guest },
      signal: cancel
        ? cancelApiObject[this.post.name].handleRequestCancellation().signal
        : undefined,
    });
  },
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
  uncheckins: async function (ids, cancel = false) {
    return api.request({
      url: `/Guest/Uncheckin`,
      method: "PUT",
      data: ids,
      signal: cancel
        ? cancelApiObject[this.uncheckins.name].handleRequestCancellation()
            .signal
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
  deleteGuests: async function (ids, cancel = false) {
    return api.request({
      url: `/Guest/Delete`,
      method: "DELETE",
      data: ids,
      signal: cancel
        ? cancelApiObject[this.deleteGuests.name].handleRequestCancellation()
            .signal
        : undefined,
    });
  },
  deleteGuest: async function (id, cancel = false) {
    return api.request({
      url: `/Guest/Delete/${id}`,
      method: "DELETE",
      signal: cancel
        ? cancelApiObject[this.deleteGuest.name].handleRequestCancellation()
            .signal
        : undefined,
    });
  },
};

// defining the cancel API object for ProductAPI
const cancelApiObject = defineCancelApiObject(GuestAPI);
